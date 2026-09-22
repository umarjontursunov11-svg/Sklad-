import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { authenticateRequest } from '@/lib/server-auth';

// Server-side Supabase client (service role). The report RPC is not callable with the public key.
const reportClient =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

// Telegram credentials come ONLY from environment variables (never hard-code them).
const DEFAULT_BOT_TOKEN = '';
const DEFAULT_CHAT_ID = '';

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
function isAuthorizedCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error: 'TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan Vercel/Environment variable faylida.',
          isConfigMissing: true,
        },
        { status: 400 }
      );
    }

    if (!reportClient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase maʼlumotlar bazasi ulanmagan. Kunlik hisobot faqat haqiqiy bazadan olinadi.',
          isConfigMissing: true,
        },
        { status: 503 }
      );
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    let reportData: any = null;

    // Fetch exclusively from Supabase RPC get_daily_report_data
    try {
      const { data, error } = await (reportClient as any).rpc('get_daily_report_data', { p_date: dateStr });
      if (error || !data) {
        return NextResponse.json(
          {
            success: false,
            error: `Supabase RPC get_daily_report_data xatoligi: ${error?.message || 'Boʻsh natija qaytdi'}`,
          },
          { status: 502 }
        );
      }

      reportData = {
        reportDate: dateStr,
        inboundCount: data.inbound?.total_count || 0,
        inboundTotal: data.inbound?.total_quantity || 0,
        inboundWarehouses: (data.inbound?.by_warehouse || []).reduce((acc: any, item: any) => {
          acc[item.warehouse_name] = item.total_qty;
          return acc;
        }, {}),
        outboundCount: data.outbound?.total_count || 0,
        outboundTotal: data.outbound?.total_quantity || 0,
        outboundWarehouses: (data.outbound?.by_warehouse || []).reduce((acc: any, item: any) => {
          acc[item.warehouse_name] = item.total_qty;
          return acc;
        }, {}),
        lowStockItems: (data.low_stock_items || []).map((p: any) => ({
          name: p.name,
          code: p.qr_code_data,
          stock: p.current_total_stock,
          min: p.min_stock_level,
          unit: p.unit,
        })),
        topMoved: (data.top_moved_products || []).map((p: any) => ({
          name: p.product_name,
          volume: p.total_volume,
          count: p.tx_count,
          unit: p.unit,
        })),
        newProductsCount: data.new_products_count || 0,
        salesCount: data.sales?.invoices_count || 0,
        salesTotal: data.sales?.total_amount || 0,
      };
    } catch (dbErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Baza so'rovida kutilmagan xatolik: ${dbErr?.message || 'Nomaʼlum xatolik'}`,
        },
        { status: 503 }
      );
    }

    const messageText = formatTelegramReportMessage(reportData);
    const result = await sendTelegramMessage(botToken, chatId, messageText);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Telegram API call failed' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      trigger: 'cron_schedule_daily_report',
      message_id: result.message_id,
      sent_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Manual send from the Reports page: only a signed-in staff member may trigger it.
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

    // Check credentials
    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan. Iltimos, .env faylida ushbu parametrlarni to\'ldiring.',
          isConfigMissing: true,
        },
        { status: 400 }
      );
    }

    // Extract report data passed from client or database
    const reportData = body.reportData;
    if (!reportData) {
      return NextResponse.json(
        { success: false, error: 'Report data is required.' },
        { status: 400 }
      );
    }

    // Build the formatted Telegram Markdown message
    const messageText = formatTelegramReportMessage(reportData);

    // Send to Telegram with retry mechanism
    const result = await sendTelegramMessage(botToken, chatId, messageText);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Telegramga yuborishda xatolik yuz berdi.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message_id: result.message_id,
      sent_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in send-report API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; message_id?: number; error?: string }> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const send = async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    return await res.json();
  };

  try {
    // Attempt 1
    const res1 = await send();
    if (res1.ok) {
      return { success: true, message_id: res1.result?.message_id };
    }

    console.warn('Telegram attempt 1 failed:', res1.description);

    // Wait 30 seconds before retry attempt 2
    console.log('Waiting 30 seconds before retrying Telegram call...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Attempt 2
    const res2 = await send();
    if (res2.ok) {
      return { success: true, message_id: res2.result?.message_id };
    }

    return {
      success: false,
      error: res2.description || 'Telegram API failed after retry',
    };
  } catch (err: any) {
    console.error('Network failure sending Telegram message:', err);
    try {
      await new Promise((resolve) => setTimeout(resolve, 30000));
      const resRetry = await send();
      if (resRetry.ok) {
        return { success: true, message_id: resRetry.description || 'Success on retry' };
      }
      return { success: false, error: resRetry.description || err.message };
    } catch (e: any) {
      return { success: false, error: e.message || 'Fatal network failure' };
    }
  }
}

function formatTelegramReportMessage(data: any): string {
  const dateStr = data.reportDate || new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tashkent',
  });

  // Inbound breakdown
  let inboundDetails = '';
  if (data.inboundWarehouses && Object.keys(data.inboundWarehouses).length > 0) {
    inboundDetails = Object.entries(data.inboundWarehouses)
      .map(([whName, qty]: [string, any]) => `  ▫️ _${whName}_: *${qty.toLocaleString()}* birlik`)
      .join('\n');
  } else {
    inboundDetails = '  ▫️ _Bugun kirim operatsiyalari yo\'q_';
  }

  // Outbound breakdown
  let outboundDetails = '';
  if (data.outboundWarehouses && Object.keys(data.outboundWarehouses).length > 0) {
    outboundDetails = Object.entries(data.outboundWarehouses)
      .map(([whName, qty]: [string, any]) => `  ▫️ _${whName}_: *${qty.toLocaleString()}* birlik`)
      .join('\n');
  } else {
    outboundDetails = '  ▫️ _Bugun chiqim operatsiyalari yo\'q_';
  }

  // Low stock breakdown
  let lowStockDetails = '';
  if (data.lowStockItems && data.lowStockItems.length > 0) {
    lowStockDetails = data.lowStockItems
      .slice(0, 8)
      .map(
        (p: any, idx: number) =>
          `${idx + 1}. 🔴 *${p.name}* (\`${p.code}\`)\n   Qoldiq: *${p.stock}* ${p.unit} | Min: *${p.min}*`
      )
      .join('\n');
    if (data.lowStockItems.length > 8) {
      lowStockDetails += `\n   _...va yana ${data.lowStockItems.length - 8} ta mahsulot._`;
    }
  } else {
    lowStockDetails = '✅ _Barcha tovarlar xavfsizlik me\'yorida._';
  }

  // Expiring products breakdown (<= 90 days or expired)
  let expiringDetails = '';
  if (data.expiringItems && data.expiringItems.length > 0) {
    expiringDetails = data.expiringItems
      .slice(0, 8)
      .map((p: any, idx: number) => {
        const days = p.days_left ?? p.daysLeft;
        const statusIcon = days !== undefined && days < 0 ? '❌ [MUDDATI O\'TGAN]' : `⏳ [${days} KUN QOLDI]`;
        const storage = p.storage_conditions ? `\n   ❄️ _Saqlash: ${p.storage_conditions}_` : '';
        return `${idx + 1}. ${statusIcon} *${p.name}* (\`${p.code || p.qr_code_data || ''}\`)\n   Muddati: *${p.expiry_date || 'Noma\'lum'}* | Qoldiq: *${p.stock || p.current_total_stock || 0}* ${p.unit || ''}${storage}`;
      })
      .join('\n');
    if (data.expiringItems.length > 8) {
      expiringDetails += `\n   _...va yana ${data.expiringItems.length - 8} ta mahsulot._`;
    }
  } else {
    expiringDetails = '✅ _Muddati oz qolgan tovarlar yo\'q (barchasi > 3 oy)._';
  }

  // Top 3 moved products
  let topMovedDetails = '';
  const medals = ['🥇', '🥈', '🥉'];
  if (data.topMoved && data.topMoved.length > 0) {
    topMovedDetails = data.topMoved
      .slice(0, 3)
      .map(
        (p: any, idx: number) =>
          `${medals[idx] || '•'} *${p.name}* — *${p.volume.toLocaleString()}* ${p.unit} (${p.count} ta)`
      )
      .join('\n');
  } else {
    topMovedDetails = '▫️ _Bugun tovar harakati yo\'q_';
  }

  // Sales breakdown
  let salesDetails = '';
  if (data.salesCount !== undefined || data.salesTotal !== undefined) {
    salesDetails = `
🧾 *SAVDO VA HISOB-FAKTURALAR (SALES & INVOICES)*
• Chiqarilgan fakturalar: *${data.salesCount || 0} ta*
• Jami sotuv summasi: *${(data.salesTotal || 0).toLocaleString()} so'm*
`;
  }

  return `📊 *OMNISTOCK PRO — KUNLIK OMBOR HISOBOTI*
📅 *Sana:* \`${dateStr}\`
⏰ *Vaqt:* \`${timeStr}\`
────────────────────────

📥 *KIRIM OPERATSIYALARI (INBOUND)*
• Jami tranzaksiyalar: *${data.inboundCount || 0} ta*
• Jami qabul qilingan: *${(data.inboundTotal || 0).toLocaleString()} birlik*
${inboundDetails}

📤 *CHIQIM OPERATSIYALARI (OUTBOUND)*
• Jami tranzaksiyalar: *${data.outboundCount || 0} ta*
• Jami jo'natilgan: *${(data.outboundTotal || 0).toLocaleString()} birlik*
${outboundDetails}
${salesDetails}
⚠️ *XAVFSIZLIK CHEGARASIDAN TUSHGAN TOVARLAR*
${lowStockDetails}

⏳ *YAROQLILIK MUDDATI OZ QOLGAN TOVARLAR (≤3 OY)*
${expiringDetails}

🏆 *KUNNING ENG KO'P HARAKATLANGAN TOVARLARI (TOP-3)*
${topMovedDetails}

🆕 *Bugun qo'shilgan yangi tovarlar:* *${data.newProductsCount || 0} ta*
────────────────────────
🤖 _OmniStock Automation Bot orqali yuborildi._`;
}
