<?php
// ============================================================
//  КОРМ Маркетинг — обработчик форм
//  Принимает заявку → отправляет в Telegram → возвращает JSON
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// CORS — только наш домен
$allowed_origins = [
    'https://korm-marketing.ru',
    'https://www.korm-marketing.ru',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 3600');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ────── Загружаем конфиг (токен и chat_id) ──────
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Config missing']);
    exit;
}
require $configFile; // должен задать $TG_BOT_TOKEN и $TG_CHAT_ID

if (empty($TG_BOT_TOKEN) || empty($TG_CHAT_ID)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Config invalid']);
    exit;
}

// ────── Rate-limit: 3 заявки в минуту с одного IP ──────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/korm_rate_' . md5($ip);
$now = time();
$attempts = [];
if (file_exists($rateFile)) {
    $attempts = json_decode(file_get_contents($rateFile), true) ?: [];
    $attempts = array_filter($attempts, fn($t) => $t > $now - 60);
}
if (count($attempts) >= 3) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Слишком часто. Подождите минуту.']);
    exit;
}
$attempts[] = $now;
file_put_contents($rateFile, json_encode($attempts));

// ────── Парсим JSON-тело ──────
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Bad request']);
    exit;
}

// ────── Honeypot (скрытое поле для ботов) ──────
if (!empty($data['website']) || !empty($data['url']) || !empty($data['email_confirm'])) {
    // Боты часто заполняют любые поля. Делаем вид что всё ОК — но не отправляем.
    echo json_encode(['ok' => true]);
    exit;
}

// ────── Валидация ──────
$source = isset($data['source']) ? substr(preg_replace('/[^a-z0-9_-]/i', '', $data['source']), 0, 50) : 'main';
$fields = $data['fields'] ?? [];
if (!is_array($fields) || empty($fields)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Заполните форму']);
    exit;
}

// Проверка длины
foreach ($fields as $k => $v) {
    if (!is_string($v) || mb_strlen($v) > 1000) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Слишком длинное поле']);
        exit;
    }
}

// Имя обязательно
$name = trim($fields['name'] ?? '');
$contact = trim($fields['contact'] ?? '');
if ($name === '' || $contact === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Имя и контакт обязательны']);
    exit;
}

// ────── Формируем сообщение (HTML-формат, безопасно экранируем) ──────
function esc($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

$titles = [
    'main'        => '🔔 <b>Новая заявка с сайта КОРМ</b>',
    'dental'      => '🦷 <b>Заявка · Стоматология</b>',
    'furniture'   => '🪑 <b>Заявка · Мебель</b>',
    'promo'       => '📣 <b>Заявка · Промо-страница</b>',
];
$header = $titles[$source] ?? '🔔 <b>Новая заявка</b>';

$labels = [
    'name'    => '👤 Имя',
    'contact' => '📱 Контакт',
    'task'    => '🎯 Задача',
    'budget'  => '💰 Бюджет',
    'message' => '💬 Сообщение',
];

$lines = [$header, ''];
foreach ($fields as $k => $v) {
    if ($v === null || $v === '') continue;
    $label = $labels[$k] ?? ucfirst($k);
    $lines[] = $label . ': ' . esc($v);
}
$lines[] = '';
$lines[] = '🌐 IP: ' . esc($ip);
$lines[] = '📄 Источник: ' . esc($source);

$text = implode("\n", $lines);

// ────── Отправляем в Telegram ──────
$url = "https://api.telegram.org/bot{$TG_BOT_TOKEN}/sendMessage";
$payload = json_encode([
    'chat_id'    => $TG_CHAT_ID,
    'text'       => $text,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_TIMEOUT        => 10,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Не удалось отправить. Напишите в Telegram: @korm_marketing']);
    exit;
}

echo json_encode(['ok' => true]);
