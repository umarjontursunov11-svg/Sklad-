import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/server-auth';

export async function POST(request: Request) {
  // Only signed-in staff may trigger alerts (prevents spam to the Telegram group).
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  try {
    // Telegram credentials come ONLY from environment variables.
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = process.env.TELEGRAM_CHAT_ID || '';

    if (!botToken || !chatId) {
      return NextResponse.json({ success: false, error: 'Telegram credentials missing' }, { status: 400 });
    }

    const payload = await request.json();
    const {
      product_name,
      qr_code_data,
      warehouse_name,
      current_stock,
      min_stock_level,
      unit,
      movement_type,
      quantity,
      user_name
    } = payload;

    const timeStr = new Date().toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tashkent',
    });

    const text = `🚨 *DIQQAT: TOVAR ME'YORDAN KAM QOLDI!*
────────────────────────
📦 *Mahsulot:* *${product_name || 'Nomaʼlum mahsulot'}*
🏷️ *QR Kod:* \`${qr_code_data || 'N/A'}\`
🏢 *Ombor:* *${warehouse_name || 'Asosiy Ombor'}*

📊 *Joriy ombor qoldig'i:* *${current_stock}* ${unit || 'dona'}
⚠️ *Xavfsizlik chegarasi:* *${min_stock_level}* ${unit || 'dona'}
📉 *So'nggi harakat:* *${(movement_type || 'OUTBOUND').toUpperCase()}* (-${quantity || 0} ${unit || 'dona'})
👤 *Mas'ul:* ${user_name || 'Xodim'}
⏰ *Vaqt:* \`${timeStr}\`
────────────────────────
👉 _Iltimos, zaxirani zudlik bilan to'ldirish (Restock) chorasini ko'ring._`;

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      return NextResponse.json({ success: false, error: tgData.description }, { status: 502 });
    }

    return NextResponse.json({ success: true, message_id: tgData.result?.message_id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
