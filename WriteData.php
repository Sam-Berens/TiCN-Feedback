<?php
header('Content-Type: application/json');
require_once __DIR__ . '/Credentials.php';

// Helper function
function RespondWithJsonNotice($StatusCode, $Notice, $Extra = array())
{
	http_response_code($StatusCode);
	$Result = array('Notice' => $Notice);
	foreach ($Extra as $Key => $Value) {
		$Result[$Key] = $Value;
	}

	echo json_encode($Result);
	exit;
}

// Grab the input
$Input = json_decode(file_get_contents('php://input'), true);
if (!is_array($Input)) {
	RespondWithJsonNotice(400, 'WriteXIO.php invoked with bad inputs.');
}

// Connect to the database:
$Conn = new mysqli($Servername, $Username, $Password, $Dbname);
if ($Conn->connect_error) {
	die("Database connection failed: " . $Conn->connect_error);
}

// Extract the data
$data = $Input['json'];
$data = mysqli_real_escape_string($Conn, $data);

// Set DateTime
$Now = new DateTimeImmutable("now", new DateTimeZone('Europe/London'));
$DateTime = $Now->format('Y-m-d\TH:i:s');

// Save the data
$Sql = "INSERT INTO TiCN (Json, DateTime) VALUES ('$data', '$DateTime')";
if (($Conn->query($Sql)) === false) {
	$Conn->close();
	die('Query Sql failed to execute successfully.');
}

$Conn->close();
echo json_encode('Done');
