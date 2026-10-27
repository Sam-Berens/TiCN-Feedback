<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function RespondWithJsonNotice($StatusCode, $Notice, $Extra = array())
{
    http_response_code($StatusCode);
    echo json_encode(array_merge(array('Notice' => $Notice), $Extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    RespondWithJsonNotice(405, 'Please submit feedback using POST.');
}

// The TEXT column holds at most 65,535 bytes. Leave room for question metadata.
// Limit the outer JSON too, since escaping can make it larger than its contents.
$RawInput = file_get_contents('php://input', false, null, 0, 262145);
if (strlen($RawInput) > 262144) {
    RespondWithJsonNotice(413, 'The feedback is too large to save.');
}
$Input = json_decode($RawInput, true);
if (!is_array($Input) || !isset($Input['json']) || !is_string($Input['json'])) {
    RespondWithJsonNotice(400, 'Please provide feedback as a JSON string.');
}
$Data = $Input['json'];
if (strlen($Data) > 60000) {
    RespondWithJsonNotice(413, 'The feedback is too large to save.');
}
$Decoded = json_decode($Data, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($Decoded) || count($Decoded) === 0) {
    RespondWithJsonNotice(400, 'The feedback contains invalid JSON.');
}

require_once __DIR__ . '/Credentials.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $Conn = new mysqli($Servername, $Username, $Password, $Dbname);
    $Conn->set_charset('utf8mb4');
    $Now = new DateTimeImmutable('now', new DateTimeZone('Europe/London'));
    $DateTime = $Now->format('Y-m-d H:i:s');

    $Statement = $Conn->prepare('INSERT INTO TiCN (Json, DateTime) VALUES (?, ?)');
    $Statement->bind_param('ss', $Data, $DateTime);
    $Statement->execute();
    $Statement->close();
    $Conn->close();
} catch (mysqli_sql_exception $Error) {
    // Keep database details and student feedback out of the response and logs.
    error_log('TiCN feedback: database save failed (code ' . $Error->getCode() . ').');
    RespondWithJsonNotice(503, 'We could not save your feedback. Please try again.');
}

RespondWithJsonNotice(200, 'Your feedback has been saved.', array('saved' => true));
