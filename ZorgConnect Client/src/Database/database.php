
<!-- CREATE TABLE appointment_requests (
    id VARCHAR(20) PRIMARY KEY,
    date DATE NOT NULL,
    time_of_day VARCHAR(20),
    notes TEXT,
    created_by_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL
); -->
<?php
// Laad database config
$dsn = "mysql:host=db46374.databaseasp.net;dbname=db46374;charset=utf8mb4";
$user = getenv("DB_USER") ?: "db46374";
$pass = getenv("DB_PASS") ?: "Mo5+=2Lz6t-X";

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? null;

if ($action === 'create') {
    // Verwacht: date, time_of_day, notes, created_by_name
    $id = uniqid('apt_', true);
    $date = $data['date'] ?? null;
    $time_of_day = $data['time_of_day'] ?? null;
    $notes = $data['notes'] ?? null;
    $created_by_name = $data['created_by_name'] ?? null;
    $created_at = date('Y-m-d H:i:s');
    if (!$date || !$created_by_name) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields."]);
        exit;
    }
    $stmt = $pdo->prepare("INSERT INTO appointment_requests (id, date, time_of_day, notes, created_by_name, created_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $date, $time_of_day, $notes, $created_by_name, $created_at]);
    echo json_encode(["success" => true, "id" => $id]);
    exit;
} elseif ($action === 'delete') {
    // Verwacht: id
    $id = $data['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing appointment id."]);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM appointment_requests WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}

// Optioneel: ophalen van afspraken
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM appointment_requests ORDER BY date, time_of_day");
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($appointments);
    exit;
}

echo json_encode(["error" => "No valid action."]);
exit;
//
// CREATE TABLE appointment_requests (
//     id VARCHAR(20) PRIMARY KEY,
//     date DATE NOT NULL,
//     time_of_day VARCHAR(20),
//     notes TEXT,
//     created_by_name VARCHAR(100),
//     created_at TIMESTAMP NOT NULL
// );
