import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface LowStockAlertPayload {
  product_id: string;
  product_name: string;
  qr_code_data: string;
  unit: string;
  warehouse_name: string;
  current_stock: number;
  min_stock_level: number;
  movement_type: string;
  quantity: number;
  user_name?: string;
  notes?: string;
}

function formatLowStockAlert(p: LowStockAlertPayload): string {
  const timeStr = new Date().toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tashkent',
  });

  return `🚨 *DIQQAT: TOVAR ME'YORDAN KAM QOLDI!*
────────────────────────
📦 *Mahsulot:* *${p.product_name}*
🏷️ *QR Kod:* \`${p.qr_code_data}\`
🏢 *Ombor:* *${p.warehouse_name}*

📊 *Joriy ombor qoldig'i:* *${p.current_stock}* ${p.unit}
⚠️ *Xavfsizlik chegarasi:* *${p.min_stock_level}* ${p.unit}
📉 *So'nggi harakat:* *${p.movement_type.toUpperCase()}* (-${p.quantity} ${p.unit})
👤 *Mas'ul:* ${p.user_name || 'Xodim'}
⏰ *Vaqt:* \`${timeStr}\`
${p.notes ? `📝 *Izoh:* _${p.notes}_\n` : ''}────────────────────────
👉 _Iltimos, zaxirani zudlik bilan to'ldirish (Restock) chorasini ko'ring._`;
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: LowStockAlertPayload = await req.json();

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram Bot token or Chat ID not configured');
      return new Response(JSON.stringify({ success: false, error: 'Telegram credentials missing' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const text = formatLowStockAlert(payload);
    const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const result = await res.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    await supabase.from('report_logs').insert({
      report_type: 'low_stock_alert',
      status: result.ok ? 'success' : 'failed',
      payload: payload,
      telegram_message_id: result.result?.message_id || null,
      error_message: result.ok ? null : result.description,
      sent_at: result.ok ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: result.ok, result }), {
      status: result.ok ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
