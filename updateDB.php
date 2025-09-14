<?php

// Receive POST parameters
$id = $_POST['id'] ?? null;
$field = $_POST['field'] ?? null;
$value = $_POST['value'] ?? null;


try {
    $db = new PDO('sqlite:../Assets/StreamingAssets/GameDatabase.db');
    $sql = "UPDATE ComboStep SET $field = :value WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':value', $value);
    $stmt->bindValue(':id', $id);
    $stmt->execute();

    echo "Update successful.";
} catch (Exception $e) {
    http_response_code(500);
    echo "Database error: " . htmlspecialchars($e->getMessage());
}