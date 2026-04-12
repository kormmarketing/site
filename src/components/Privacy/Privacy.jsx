export default function Privacy() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#FFFFFF' }}>
      <style>{`* { cursor: auto !important; } a { cursor: pointer !important; }`}</style>

      {/* Nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5,5,5,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1E1E1E',
        padding: '0 6%',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
            КОРМ
          </span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'radial-gradient(circle, #6366F1, #06B6D4)', flexShrink: 0 }} />
        </a>
        <a
          href="/"
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '14px',
            color: '#A0A0A0', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#FFFFFF'}
          onMouseLeave={e => e.target.style.color = '#A0A0A0'}
        >
          ← Вернуться на сайт
        </a>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 120px' }}>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px', color: '#6366F1',
          letterSpacing: '0.1em', marginBottom: '16px',
        }}>
          // политика
        </p>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 700, color: '#FFFFFF',
          letterSpacing: '-0.02em', lineHeight: 1.1,
          marginBottom: '12px',
        }}>
          Политика конфиденциальности
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#A0A0A0', marginBottom: '56px' }}>
          Последнее обновление: апрель 2026
        </p>

        {[
          {
            title: '1. Общие положения',
            text: `Настоящая политика конфиденциальности регулирует порядок обработки и защиты персональных данных пользователей сайта korm-marketing.ru (далее — Сайт).\n\nОператор персональных данных: Самозанятый, Корм Маркетинг, г. Серпухов, Московская область.\n\nИспользуя Сайт и заполняя формы обратной связи, вы соглашаетесь с условиями настоящей политики.`,
          },
          {
            title: '2. Какие данные я собираю',
            text: `При заполнении формы заявки на Сайте я собираю следующие персональные данные:\n\n• Имя\n• Номер телефона или Telegram-аккаунт\n• Тип задачи и бюджет (по желанию)\n• Сообщение с описанием проекта (по желанию)\n\nТакже Сайт может автоматически собирать технические данные: IP-адрес, тип браузера, страницы посещений — через сервис Яндекс.Метрика.`,
          },
          {
            title: '3. Цели обработки данных',
            text: `Персональные данные обрабатываются исключительно в следующих целях:\n\n• Ответ на заявку и консультация по проекту\n• Связь с потенциальным клиентом удобным для него способом\n• Улучшение качества работы Сайта (анонимная аналитика)\n\nЯ не использую ваши данные для рекламных рассылок без вашего явного согласия.`,
          },
          {
            title: '4. Хранение и передача данных',
            text: `Заявки, отправленные через форму на Сайте, поступают напрямую оператору через защищённый канал (Telegram Bot API) и не сохраняются на сторонних серверах.\n\nЯ не передаю, не продаём и не раскрываем ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.\n\nДанные хранятся только на устройствах оператора и удаляются по запросу пользователя.`,
          },
          {
            title: '5. Яндекс.Метрика и cookies',
            text: `Сайт использует Яндекс.Метрику для анализа посещаемости. Сервис может собирать следующие данные:\n\n• Страницы и разделы, которые вы посещаете\n• Время, проведённое на Сайте\n• Технические характеристики устройства и браузера\n\nЭти данные являются анонимными и не позволяют идентифицировать конкретного пользователя. Подробнее: yandex.ru/legal/confidential\n\nВы можете отключить сбор данных Метрикой, установив расширение «Яндекс.Метрика — отключить» для браузера.`,
          },
          {
            title: '6. Права пользователя',
            text: `В соответствии с Федеральным законом №152-ФЗ «О персональных данных» вы имеете право:\n\n• Получить информацию об обработке ваших персональных данных\n• Потребовать исправления неточных данных\n• Отозвать согласие на обработку данных\n• Потребовать удаления ваших данных\n\nДля реализации любого из этих прав свяжитесь с нами через Telegram: @korm_marketing`,
          },
          {
            title: '7. Защита данных',
            text: `Я принимаю необходимые организационные и технические меры для защиты ваших персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения:\n\n• Передача данных осуществляется по зашифрованным каналам (HTTPS)\n• Доступ к данным имеет только оператор\n• Данные не хранятся в открытых базах данных`,
          },
          {
            title: '8. Согласие',
            text: `Отправляя форму заявки на Сайте, вы подтверждаете, что:\n\n• Ознакомились с настоящей политикой конфиденциальности\n• Даёте согласие на обработку ваших персональных данных в целях, описанных в разделе 3\n• Достигли возраста 18 лет или действуете с согласия законного представителя`,
          },
          {
            title: '9. Изменения политики',
            text: `Оставляю за собой право вносить изменения в настоящую политику. Актуальная версия всегда доступна на сайте korm-marketing.ru/privacy\n\nПродолжение использования сайта после публикации изменений означает согласие с обновлённой политикой.`,
          },
          {
            title: '10. Контакты',
            text: `По всем вопросам, связанным с обработкой персональных данных, обращайтесь:\n\nTelegram: @korm_marketing\nГород: Серпухов, Московская область`,
          },
        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '20px', fontWeight: 600,
              color: '#FFFFFF', letterSpacing: '-0.01em',
              marginBottom: '16px',
            }}>
              {title}
            </h2>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px', color: '#A0A0A0',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {text}
            </div>
            <div style={{ height: '1px', background: '#1E1E1E', marginTop: '48px' }} />
          </div>
        ))}

        <a
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Вернуться на главную
        </a>
      </div>
    </div>
  )
}
