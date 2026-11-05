ЗАПУСК (около 15 минут)

1. Telegram-бот
   - В Telegram откройте @BotFather → /newbot → скопируйте токен.
   - Инспектор (и все, кто должен получать сообщения) пишет боту /start.
   - Свой chat id узнайте у бота @userinfobot. Для группы: добавьте бота в группу,
     id группы начинается с минуса (например -100123...).

2. Логотипы
   Положите рядом с index.html файлы:
   logo-technopark.png и logo-ohrana-truda.png

3. Vercel
   - Зарегистрируйтесь на vercel.com (можно через GitHub).
   - Загрузите папку на GitHub и импортируйте её в Vercel (Add New → Project)
     либо используйте Vercel CLI: команда "vercel" в этой папке.
   - Settings → Environment Variables добавьте:
       TG_BOT_TOKEN = токен бота
       TG_CHAT_IDS  = id1,id2   (через запятую)
   - Redeploy.

4. QR-код
   Создайте QR-код на адрес вашего сайта (например, в qr-code-generator.com)
   и распечатайте на листе «Мы за безопасный труд».

ВАЖНО: не публикуйте токен бота в открытом виде (только в переменных Vercel).
