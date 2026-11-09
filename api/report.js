const esc = s => String(s || ‘’).replace(/[&<>]/g, c => ({ ‘&’: ‘&amp;’, ‘<‘: ‘&lt;’, ‘>’: ‘&gt;’ }[c]));

module.exports = async (req, res) => {
  if (req.method !== ‘POST’) return res.status(405).json({ ok: false });

  const token = process.env.TG_BOT_TOKEN;
  const chats = (process.env.TG_CHAT_IDS || ‘’).split(‘,’).map(s => s.trim()).filter(Boolean);
  if (!token || !chats.length) return res.status(500).json({ ok: false, error: ‘not configured’ });

  const { name, place, text, level, photo, date } = req.body || {};
  if (!place  !text  !level) return res.status(400).json({ ok: false, error: ‘missing fields’ });

  const when = new Date(date || Date.now()).toLocaleString(‘ru-RU’, { timeZone: ‘Asia/Almaty’ });
  const caption =
    ⚠️ <b>Нарушение охраны труда</b>\n\n +
    📍 <b>Место:</b> ${esc(place).slice(0, 120)}\n +
    🔥 <b>Срочность:</b> ${esc(level)}\n +
    📝 <b>Что обнаружено:</b> ${esc(text).slice(0, 1500)}\n +
    👤 <b>От кого:</b> ${esc(name) || ‘аноним’}\n +
    🕒 ${when};

  try {
    for (const chat of chats) {
      let r;
      if (photo && /^data:image\/\w+;base64,/.test(photo)) {
        const buf = Buffer.from(photo.split(‘,’)[1], ‘base64’);
        const fd = new FormData();
        fd.append(‘chat_id’, chat);
        fd.append(‘caption’, caption.length <= 1024 ? caption : caption.slice(0, 1000) + ‘…’);
        fd.append(‘parse_mode’, ‘HTML’);
        fd.append(‘photo’, new Blob([buf], { type: ‘image/jpeg’ }), ‘photo.jpg’);
        r = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: ‘POST’, body: fd });
      } else {
        r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: ‘POST’,
          headers: { ‘Content-Type’: ‘application/json’ },
          body: JSON.stringify({ chat_id: chat, text: caption, parse_mode: ‘HTML’ })
        });
      }
      if (!r.ok) throw new Error(‘telegram ‘ + r.status);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
