import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Configuration from Environment Variables
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface ReportData {
  report_date: string;
  inbound: {
    total_count: number;
    total_quantity: number;
    by_warehouse: Array<{ warehouse_name: string; tx_count: number; total_qty: number }>;
  };
  outbound: {
    total_count: number;
    total_quantity: number;
    by_warehouse: Array<{ warehouse_name: string; tx_count: number; total_qty: number }>;
  };
  low_stock_items: Array<{
    id: string;
    name: string;
    qr_code_data: string;
    unit: string;
    min_stock_level: number;
    current_total_stock: number;
  }>;
  top_moved_products: Array<{
    product_name: string;
    qr_code_data: string;
    unit: string;
    total_volume: number;
    tx_count: number;
  }>;
  new_products_count: number;
  generated_at: string;
}

// Telegram Markdown formatting for clean mobile view
function formatTelegramReport(data: ReportData): string {
  const dateStr = data.report_date || new Date().toISOString().slice(0, 10);
  const timeStr = new Date(data.generated_at).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tashkent',
  });

  // Inbound section
  let inboundDetails = '';
  if (data.inbound.by_warehouse && data.inbound.by_warehouse.length > 0) {
    inboundDetails = data.inbound.by_warehouse
      .map((w) => `  ▫️ _${w.warehouse_name}_: *${w.total_qty.toLocaleString()}* birlik (${w.tx_count} ta)`)
      .join('\n');
  } else {
    inboundDetails = '  ▫️ _Bugun kirim harakatlari yo\'q_';
  }

  // Outbound section
  let outboundDetails = '';
  if (data.outbound.by_warehouse && data.outbound.by_warehouse.length > 0) {
    outboundDetails = data.outbound.by_warehouse
      .map((w) => `  ▫️ _${w.warehouse_name}_: *${w.total_qty.toLocaleString()}* birlik (${w.tx_count} ta)`)
      .join('\n');
  } else {
    outboundDetails = '  ▫️ _Bugun chiqim harakatlari yo\'q_';
  }

  // Low stock section
  let lowStockDetails = '';
  if (data.low_stock_items && data.low_stock_items.length > 0) {
    lowStockDetails = data.low_stock_items
      .slice(0, 8)
      .map(
        (p, idx) =>
          `${idx + 1}. 🔴 *${p.name}* (\`${p.qr_code_data}\`)\n   Qoldiq: *${p.current_total_stock}* ${p.unit} | Min chegarasi: *${p.min_stock_level}*`
      )
      .join('\n');
    if (data.low_stock_items.length > 8) {
      lowStockDetails += `\n   _...va yana ${data.low_stock_items.length - 8} ta kam qolgan tovar._`;
    }
  } else {
    lowStockDetails = '✅ _Barcha tovarlar xavfsizlik me\'yorida._';
  }

  // Top 3 moved products
  let topMovedDetails = '';
  const medals = ['🥇', '🥈', '🥉'];
  if (data.top_moved_products && data.top_moved_products.length > 0) {
    topMovedDetails = data.top_moved_products
      .map(
        (p, idx) =>
          `${medals[idx] || '•'} *${p.product_name}* — *${p.total_volume.toLocaleString()}* ${p.unit} (${p.tx_count} tranzaksiya)`
      )
      .join('\n');
  } else {
    topMovedDetails = '▫️ _Bugun tovar harakatlari qayd etilmadi._';
  }

  return `📊 *OMNISTOCK PRO — KUNLIK OMBOR HISOBOTI*
📅 *Sana:* \`${dateStr}\`
⏰ *Vaqt:* \`${timeStr}\`
────────────────────────

📥 *KIRIM OPERATSIYALARI (INBOUND)*
• Jami tranzaksiyalar: *${data.inbound.total_count} ta*
• Jami qabul qilingan: *${data.inbound.total_quantity.toLocaleString()} birlik*
${inboundDetails}

📤 *CHIQIM OPERATSIYALARI (OUTBOUND)*
• Jami tranzaksiyalar: *${data.outbound.total_count} ta*
• Jami jo'natilgan: *${data.outbound.total_quantity.toLocaleString()} birlik*
${outboundDetails}

⚠️ *XAVFSIZLIK CHEGARASIDAN TUSHGAN TOVARLAR*
${lowStockDetails}

🏆 *KUNNING ENG KO'P HARAKATLANGAN TOVARLARI (TOP-3)*
${topMovedDetails}

🆕 *Bugun qo'shilgan yangi tovarlar:* *${data.new_products_count} ta*
────────────────────────
🤖 _OmniStock Automation Bot tomonidan avtomatlashtirilgan hisobot._`;
}

// Helper to post message to Telegram with retry logic
async function sendTelegramMessageWithRetry(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; message_id?: number; error?: string }> {
  const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  };

  const attemptSend = async () => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return { ok: res.ok, status: res.status, result };
  };

  try {
    // Attempt 1
    const res1 = await attemptSend();
    if (res1.ok && res1.result?.ok) {
      return { success: true, message_id: res1.result.result?.message_id };
    }

    console.warn('Telegram attempt 1 failed:', res1.result?.description || 'Unknown error');

    // Wait 30 seconds before retrying
    console.log('Waiting 30 seconds before retry attempt 2...');
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Attempt 2
    const res2 = await attemptSend();
    if (res2.ok && res2.result?.ok) {
      return { success: true, message_id: res2.result.result?.message_id };
    }

    return {
      success: false,
      error: res2.result?.description || 'Telegram API error after retry',
    };
  } catch (err: any) {
    console.error('Network exception during Telegram send:', err);
    try {
      // Retry on network exception after 30s
      await new Promise((resolve) => setTimeout(resolve, 30000));
      const resRetry = await attemptSend();
      if (resRetry.ok && resRetry.result?.ok) {
        return { success: true, message_id: resRetry.result.result?.message_id };
      }
      return { success: false, error: resRetry.result?.description || err.message };
    } catch (e: any) {
      return { success: false, error: e.message || 'Fatal network failure' };
    }
  }
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let body: any = {};
  if (req.method === 'POST') {
    try {
      body = await req.json();
    } catch (_) {
      // Empty or non-json body allowed
    }
  }

  const triggeredBy = body.triggered_by || 'manual_trigger';
  const customDate = body.date || new Date().toISOString().slice(0, 10);

  // Initialize Supabase Client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let reportData: ReportData;

  try {
    // 1. Fetch aggregated data via PostgreSQL stored procedure
    const { data, error: rpcError } = await supabase.rpc('get_daily_report_data', {
      p_date: customDate,
    });

    if (rpcError) {
      console.error('RPC Error fetching report data:', rpcError);
      throw new Error(`RPC get_daily_report_data failed: ${rpcError.message}`);
    }

    reportData = data as ReportData;
  } catch (dbErr: any) {
    console.error('DB query error:', dbErr);
    // Log failure in report_logs
    await supabase.from('report_logs').insert({
      report_type: triggeredBy === 'pg_cron_2000' ? 'daily_summary' : 'manual_trigger',
      status: 'failed',
      payload: { date: customDate, triggered_by: triggeredBy },
      error_message: dbErr.message,
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: false, error: dbErr.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 2. Format Message
  const messageText = formatTelegramReport(reportData);

  // Verify Telegram Credentials
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    const errorMsg =
      'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables.';
    console.warn(errorMsg);

    await supabase.from('report_logs').insert({
      report_type: triggeredBy === 'pg_cron_2000' ? 'daily_summary' : 'manual_trigger',
      status: 'failed',
      payload: reportData,
      error_message: errorMsg,
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
        preview_text: messageText,
        report_data: reportData,
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 3. Send Telegram Message with automatic 30s retry
  const sendResult = await sendTelegramMessageWithRetry(
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    messageText
  );

  // 4. Audit Log in report_logs Table
  const logRecord = {
    report_type: triggeredBy === 'pg_cron_2000' ? 'daily_summary' : 'manual_trigger',
    status: sendResult.success ? 'success' : 'failed',
    payload: reportData,
    telegram_message_id: sendResult.message_id || null,
    error_message: sendResult.error || null,
    sent_at: sendResult.success ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
  };

  const { error: logError } = await supabase.from('report_logs').insert(logRecord);
  if (logError) {
    console.error('Failed to write report_logs:', logError);
  }

  return new Response(
    JSON.stringify({
      success: sendResult.success,
      telegram_message_id: sendResult.message_id,
      error: sendResult.error,
      report_data: reportData,
    }),
    {
      status: sendResult.success ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
