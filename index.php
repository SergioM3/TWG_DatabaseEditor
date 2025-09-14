<?php

// Ajax handler to get step data JSON
if (isset($_GET['getStep'])) {
    $stepId = (int)$_GET['getStep'];
    $db2 = new SQLite3('../Assets/StreamingAssets/GameDatabase.db');
    $stmt2 = $db2->prepare("SELECT * FROM ComboStep WHERE id = :id");
    $stmt2->bindValue(":id", $stepId, SQLITE3_INTEGER);
    $stepData = $stmt2->execute()->fetchArray(SQLITE3_ASSOC);
    $db2->close();

    if ($stepData) {
        echo json_encode(['status' => 'success', 'step' => $stepData]);
    } else {
        echo json_encode(['status' => 'fail']);
    }
    exit;
}


$db = new SQLite3('../Assets/StreamingAssets/GameDatabase.db');

// Get all characters
$query = "SELECT id, name FROM Character";
$result = $db->query($query);

$characters = [];
while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $characters[] = $row;
}

$selectedName = $_GET['character'] ?? $characters[0]['name'] ?? null;
$selectedCombos = [];

if ($selectedName) {
    $charStmt = $db->prepare("SELECT id FROM Character WHERE name = :name");
    $charStmt->bindValue(":name", $selectedName, SQLITE3_TEXT);
    $charRow = $charStmt->execute()->fetchArray(SQLITE3_ASSOC);
    if ($charRow) {
        //$charId = 0; // For testing
        $charId = (int)$charRow['id'];

        $stepStmt = $db->prepare("SELECT id, buttons, next_possible_combo_steps, step_count FROM ComboStep WHERE character_id = :cid");
        $stepStmt->bindValue(":cid", $charId, SQLITE3_INTEGER);
        $stepResult = $stepStmt->execute();

        $steps = [];
        while ($row = $stepResult->fetchArray(SQLITE3_ASSOC)) {
            $row['next_ids'] = array_filter(array_map('trim', explode(',', $row['next_possible_combo_steps'] ?? '')));
            $steps[$row['id']] = $row;
        }

        function buildCombos($steps, $currentStep, $combo = [], &$results = [], $chain = []) {
            $combo[] = $currentStep['buttons'];
            $chain[] = $currentStep['id'];
            if (empty($currentStep['next_ids'])) {
                $results[] = ['buttons' => $combo, 'ids' => $chain];
                return;
            }
            foreach ($currentStep['next_ids'] as $nextId) {
                if (isset($steps[$nextId])) {
                    buildCombos($steps, $steps[$nextId], $combo, $results, $chain);
                }
            }
        }

        foreach ($steps as $step) {
            if ((int)$step['step_count'] === 0) {
                buildCombos($steps, $step, [], $selectedCombos, []);
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['updateStep'])) {
    // Basic update handler for the ComboStep row
    $id = (int)($_POST['id'] ?? 0);
    if ($id && isset($steps[$id])) {
        // For demo, update only these 7 example fields (text or int)
        $fields = [
            'step_count', 'range', 'on_air', 'previous_combo_steps',
            'next_possible_combo_steps', 'buttons', 'input', 'do_sword_slash_effect',
            'sword_slash_anim', 'sword_slash_speed', 'sword_slash_prefab', 'sword_slash_n',
            'sword_slash_range', 'sword_slash_delay', 'sword_slash_rot_x', 'sword_slash_rot_y',
            'sword_slash_rot_z', 'sword_slash_pos_x', 'sword_slash_pos_y', 'sword_slash_pos_z',
            'do_translate', 'translate_range', 'translate_target', 'translate_axis',
            'translate_to_x', 'translate_to_y', 'translate_to_z', 'translate_smooth',
            'translate_damp', 'translate_tolerance', 'translate_use_gravity', 'do_translate_enemy',
            'translate_enemy_to_x', 'translate_enemy_to_y', 'translate_enemy_to_z', 'translate_enemy_smooth',
            'translate_enemy_damp', 'translate_enemy_tolerance', 'translate_enemy_use_gravity', 'do_orbit',
            'orbit_center_x', 'orbit_center_y', 'orbit_center_z', 'orbit_smooth',
            'orbit_damp', 'orbit_tolerance', 'orbit_degrees', 'orbit_speed',
            'do_orbit_enemy', 'orbit_enemy_center_x', 'orbit_enemy_center_y', 'orbit_enemy_center_z',
            'orbit_enemy_smooth', 'orbit_enemy_damp', 'orbit_enemy_tolerance', 'orbit_enemy_degrees',
            'orbit_enemy_speed', 'do_rotate', 'rotate_degrees', 'rotate_smooth',
            'rotate_damp', 'rotate_tolerance', 'do_rotate_enemy', 'rotate_enemy_degrees',
            'rotate_enemy_smooth', 'rotate_enemy_damp', 'rotate_enemy_tolerance', 'do_play_sound',
            'play_sound_path', 'play_sound_source', 'do_hit', 'hit_anim',
            'hit_anim_speed', 'hit_sound', 'hit_source', 'hit_tlc',
            'hit_base_parry_time_menor', 'hit_base_parry_time_maior', 'hit_cdl', 'hit_combo_cooldown_limit',
            'hit_stamina_cost', 'hit_force', 'hit_button', 'hit_crossfade','hit_times_inicio','hit_flags','hit_base_damage',
            'hit_flinch_animation','hit_flinch_animation_speed',
            'do_play_effect', 'play_effect_prefab', 'play_effect_rotX', 'play_effect_rotY',
            'play_effect_rotZ', 'play_effect_posX', 'play_effect_posY', 'play_effect_posZ',
            'play_effect_delay', 'play_effect_inside', 'play_effect_child_name', 'play_effect_no_delay',
            'do_charge', 'charge_delay', 'charge_time_limit_charging', 'charge_time_perfect_charge',
            'charge_button', 'charge_anim_speed', 'charge_slow', 'charge_sound',
            'charge_type', 'charge_effect', 'charge_effect_parent', 'do_after_image',
            'after_image_time_delay', 'after_image_time_limit', 'after_image_time_frequency', 'after_image_fade_out_delay',
            'after_image_fade_out_speed', 'after_image_effect_delay', 'after_image_change_mesh_shader', 'after_image_tint_color',
            'after_image_tint_color_str', 'after_image_core_color', 'after_image_core_color_str', 'after_image_cut_out_light_core'
        ];
        $setParts = [];
        $params = [];
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $setParts[] = "$field = :$field";
                $params[$field] = $_POST[$field];
            }
        }
        if ($setParts) {
            $sql = "UPDATE ComboStep SET " . implode(', ', $setParts) . " WHERE id = :id";
            $stmt = $db->prepare($sql);
            foreach ($params as $k => $v) {
                $stmt->bindValue(":$k", $v, is_numeric($v) ? SQLITE3_INTEGER : SQLITE3_TEXT);
            }
            $stmt->bindValue(":id", $id, SQLITE3_INTEGER);
            $stmt->execute();
            echo json_encode(['status' => 'success']);
            exit;
        }
    }
    echo json_encode(['status' => 'fail']);
    exit;
}

$db->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Character Combos Editor</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js"></script>
</head>
<body>
    <label for="characterSelect">Choose a character:</label>
    <select id="characterSelect" onchange="onCharacterChange()">
        <?php foreach ($characters as $char): ?>
            <option value="<?= htmlspecialchars($char['name']) ?>" <?= $char['name'] === $selectedName ? 'selected' : '' ?>>
                <?= htmlspecialchars($char['name']) ?>
            </option>
        <?php endforeach; ?>
    </select>


    <div style="display: flex; gap: 20px; align-items: flex-start;">
        <!-- Left: Character Container -->
        <div id="characterContainer" style="margin-top:20px; padding:10px; border:1px solid #000; width: 25%;">
            <strong>Combos for <?= htmlspecialchars($selectedName) ?>:</strong><br><br>
            <?php if (!empty($selectedCombos)): ?>
                <?php foreach ($selectedCombos as $comboData): ?>
                    <div class="combo-line">
                        <?php foreach ($comboData['buttons'] as $i => $button): ?>
                            <?php
                                $id = $comboData['ids'][$i];
                                $lower = strtolower($button);
                                echo '<div class="combo-step" id="comboStep_' . $id . '" onclick="showComboInfo(' . $id . ')">';
                                if ($lower === 'triangle') {
                                    echo '<img src="../img/ps4Triangle.png" alt="triangle" title="ID: ' . $id . '">';
                                } elseif ($lower === 'square') {
                                    echo '<img src="../img/ps4Square.png" alt="square" title="ID: ' . $id . '">';
                                } elseif ($lower === 'cross') {
                                    echo '<img src="../img/ps4Cross.png" alt="cross" title="ID: ' . $id . '">';
                                }  else {
                                    echo "<span>" . htmlspecialchars($button) . "</span>";
                                }
                                echo '</div>';
                                if ($i < count($comboData['buttons']) - 1) {
                                    if($i > 3) {
                                        echo '<span style="margin: -5px 6px;">* BREAK * →</span>';
                                    }
                                    else {
                                        echo '<span style="margin: -5px 6px;">→</span>';
                                    }
                                }
                            ?>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                No combos found.
            <?php endif; ?>
        </div>
        <!-- Right: Combo Details stacked vertically -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
            <div id="comboDetails">
                <strong>Combo Step On Trigger :</strong>
                <div class="tabs" id="tabs"></div>
                <div class="tab-content" id="tabContent"></div>
                <div id="statusMsg"></div>
            </div>

            <button
                id="addComboStepOnHit"
                onclick="addComboDetailsDiv();showComboStepDetailsOnHit(0);"
            >
                Add Combo On Hit
            </button>
        </div>
    </div>


</body>
</html>
