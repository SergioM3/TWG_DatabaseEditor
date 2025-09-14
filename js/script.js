
let currentStepData = null;
let currentTab = 0;

function onCharacterChange() {
    const selected = document.getElementById("characterSelect").value;
    window.location = "?character=" + encodeURIComponent(selected);
}

function showComboInfo(id) {
    fetch('index.php?getStep=' + id)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentStepData = data.step;
                //currentTab = 0;
                renderComboDetails();
            }
        });
}

function showComboStepDetailsOnHit(id) {
    fetch('comboStepOnHit.php?id_combo_step=' + id)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Combo Step On Hit data:', data);
            }
        });
}

function renderComboDetails() {
    // Remove active class from all steps
    document.querySelectorAll('.combo-step').forEach(el => {
        el.classList.remove('combo-step-active');
    });
    // Add active class to the step with id = comboStep_$currentStepData.id
    // Highlight all steps with the same id (can be more than one element)
    document.querySelectorAll('#comboStep_' + currentStepData.id).forEach(el => {
        el.classList.add('combo-step-active');
    });

    if (!currentStepData) return;
    document.getElementById('comboDetails').style.display = 'block';

    // Set tab buttons and content
    const tabs = [
                    'General', 'Hit', 'SwordSlash', 'Charge', 'AfterImage','Translate', 'TranslateEnemy', 'Orbit', 'OrbitEnemy',
                    'Rotate', 'RotateEnemy', 'PlaySound', 'PlayEffect'
                    ];
    const fieldsPerTab = [
        [
            { name: 'buttons', label: 'Buttons', type: 'text', description: 'Teste' },
            { name: 'next_possible_combo_steps', label: 'Next Possible Combo Steps', type: 'text', description: '' },
            { name: 'step_count', label: 'Step Count', type: 'number', description: '' },
            { name: 'range', label: 'Range', type: 'number', description: '' },
            { name: 'on_air', label: 'On Air', type: 'text', description: '' },
            { name: 'previous_combo_steps', label: 'Previous Combo Steps', type: 'text', description: '' },
            { name: 'input', label: 'Input', type: 'text', description: '' }
        ],
        [
            { name: 'do_hit', label: 'Do Hit', type: 'boolean', description: '' },
            { name: 'hit_anim', label: 'Hit Animation', type: 'text', description: '' },
            { name: 'hit_anim_speed', label: 'Hit Animation Speed (Initial)', type: 'number', description: 'Speed at which the animation begins (Note that if the Hit is a charged hit, this speed will change after the charge is done)' },
            { name: 'hit_sound', label: 'Hit Sound', type: 'text', description: '' },
            { name: 'hit_source', label: 'Hit Source', type: 'text', description: '' },
            { name: 'hit_tlc', label: 'Hit TLC', type: 'text', description: 'MAXIMUM time a player can wait before inputing the next combo (if the time passes combo ends)' },
            { name: 'hit_base_parry_time_menor', label: 'Hit Base Parry Time Menor', type: 'number', description: '' },
            { name: 'hit_cdl', label: 'Hit CDL', type: 'number', description: 'MINIMUM time the player has to wait for the next combo input to trigger' },
            { name: 'hit_base_parry_time_maior', label: 'Hit Base Parry Time Maior', type: 'number', description: '' },
            { name: 'hit_combo_cooldown_limit', label: 'Hit Combo Cooldown Limit', type: 'number', description: 'Time that player has to wait between combos (If a combo drops or if a player stops a combo, it needs to wait this time before starting another)' },
            { name: 'hit_stamina_cost', label: 'Hit Stamina Cost', type: 'number', description: '' },
            { name: 'hit_force', label: 'Hit Force', type: 'number', description: '' },
            { name: 'hit_button', label: 'Hit Button', type: 'text', description: '' },
            { name: 'hit_crossfade', label: 'Hit Crossfade', type: 'text', description: '' },
            { name: 'hit_times_inicio', label: 'Hit Times Inicio', type: 'text', description: 'Time in the animation where the contact occurs (If multiple hits, should be seperated by ,)' },
            { name: 'hit_flags', label: 'Hit Flags', type: 'text', description: 'Auxiliary flags to detect if condition to hit was met (To be removed)' },
            { name: 'hit_base_damage', label: 'Hit Base Damage', type: 'number', description: '' },
            { name: 'hit_flinch_animation', label: 'Hit Flinch Animation', type: 'text', description: '' },
            { name: 'hit_flinch_animation_speed', label: 'Hit Flinch Animation Speed', type: 'number', description: '' }
        ],
        [
            { name: 'do_sword_slash_effect', label: 'Do Sword Slash Effect', type: 'boolean', description: '' },
            { name: 'sword_slash_anim', label: 'Sword Slash Animation', type: 'text', description: '' },
            { name: 'sword_slash_speed', label: 'Sword Slash Speed', type: 'number', description: '' },
            { name: 'sword_slash_prefab', label: 'Sword Slash Prefab', type: 'text', description: '' },
            { name: 'sword_slash_n', label: 'Sword Slash N', type: 'number', description: '' },
            { name: 'sword_slash_range', label: 'Sword Slash Range', type: 'number', description: '' },
            { name: 'sword_slash_delay', label: 'Sword Slash Delay', type: 'number', description: '' },
            { name: 'sword_slash_rot_x', label: 'Sword Slash Rot X', type: 'number', description: '' },
            { name: 'sword_slash_rot_y', label: 'Sword Slash Rot Y', type: 'number', description: '' },
            { name: 'sword_slash_rot_Z', label: 'Sword Slash Rot Z', type: 'number', description: '' },
            { name: 'sword_slash_pos_x', label: 'Sword Slash Pos X', type: 'number', description: '' },
            { name: 'sword_slash_pos_y', label: 'Sword Slash Pos Y', type: 'number', description: '' },
            { name: 'sword_slash_pos_z', label: 'Sword Slash Pos Z', type: 'number', description: '' }
        ],
        [
            { name: 'do_charge', label: 'Do Charge', type: 'boolean', description: '' },
            { name: 'charge_delay', label: 'Charge Delay', type: 'number', description: '' },
            { name: 'charge_time_limit_charging', label: 'Charge Time Limit Charging', type: 'number', description: '' },
            { name: 'charge_time_perfect_charge', label: 'Charge Time Perfect Charge', type: 'number', description: '' },
            { name: 'charge_button', label: 'Charge Button', type: 'text', description: '' },
            { name: 'charge_anim_speed', label: 'Charge Animation Speed', type: 'number', description: 'This is the speed of the animation AFTER the charge is started (it continues at this speed after the charge is done)' },
            { name: 'charge_slow', label: 'Charge Slow', type: 'number', description: 'The number of times the charge_anim_speed is divided with when executing the charge' },
            { name: 'charge_sound', label: 'Charge Sound', type: 'text', description: '' },
            { name: 'charge_type', label: 'Charge Type', type: 'text', description: '' },
            { name: 'charge_effect', label: 'Charge Effect', type: 'text', description: '' },
            { name: 'charge_effect_parent', label: 'Charge Effect Parent', type: 'text', description: '' }
        ],
        [
            { name: 'do_after_image', label: 'Do After Image', type: 'boolean', description: '' },
            { name: 'after_image_time_delay', label: 'After Image Time Delay', type: 'number', description: '' },
            { name: 'after_image_time_limit', label: 'After Image Time Limit', type: 'number', description: '' },
            { name: 'after_image_time_frequency', label: 'After Image Time Frequency', type: 'number', description: '' },
            { name: 'after_image_fade_out_delay', label: 'After Image Fade Out Delay', type: 'number', description: '' },
            { name: 'after_image_fade_out_speed', label: 'After Image Fade Out Speed', type: 'number', description: '' },
            { name: 'after_image_effect_delay', label: 'After Image Effect Delay', type: 'number', description: '' },
            { name: 'after_image_change_mesh_shader', label: 'After Image Change Mesh Shader', type: 'text', description: '' },
            { name: 'after_image_tint_color', label: 'After Image Tint Color', type: 'text', description: '' },
            { name: 'after_image_tint_color_str', label: 'After Image Tint Color Str', type: 'text', description: '' },
            { name: 'after_image_core_color', label: 'After Image Core Color', type: 'text', description: '' },
            { name: 'after_image_core_color_str', label: 'After Image Core Color Str', type: 'text', description: '' },
            { name: 'after_image_cut_out_light_core', label: 'After Image Cut Out Light Core', type: 'text', description: '' }
        ],
        [
            { name: 'do_translate', label: 'Do Translate', type: 'boolean', description: '' },
            { name: 'translate_range', label: 'Translate Range', type: 'number', description: '' },
            { name: 'translate_target', label: 'Translate Target', type: 'text', description: '' },
            { name: 'translate_axis', label: 'Translate Axis', type: 'text', description: '' },
            { name: 'translate_to_x', label: 'Translate To X', type: 'number', description: '' },
            { name: 'translate_to_y', label: 'Translate To Y', type: 'number', description: '' },
            { name: 'translate_to_z', label: 'Translate To Z', type: 'number', description: '' },
            { name: 'translate_smooth', label: 'Translate Smooth', type: 'number', description: '' },
            { name: 'translate_damp', label: 'Translate Damp', type: 'number', description: '' },
            { name: 'translate_tolerance', label: 'Translate Tolerance', type: 'number', description: '' },
            { name: 'translate_use_gravity', label: 'Translate Use Gravity', type: 'text', description: '' }
        ],
        [
            { name: 'do_translate_enemy', label: 'Do Translate Enemy', type: 'boolean', description: '' },
            { name: 'translate_enemy_target', label: 'Translate Enemy Target', type: 'text', description: '' },
            { name: 'translate_enemy_axis', label: 'Translate Enemy Axis', type: 'text', description: '' },
            { name: 'translate_enemy_to_x', label: 'Translate Enemy To X', type: 'number', description: '' },
            { name: 'translate_enemy_to_y', label: 'Translate Enemy To Y', type: 'number', description: '' },
            { name: 'translate_enemy_to_z', label: 'Translate Enemy To Z', type: 'number', description: '' },
            { name: 'translate_enemy_smooth', label: 'Translate Enemy Smooth', type: 'number', description: '' },
            { name: 'translate_enemy_damp', label: 'Translate Enemy Damp', type: 'number', description: '' },
            { name: 'translate_enemy_tolerance', label: 'Translate Enemy Tolerance', type: 'number', description: '' },
            { name: 'translate_enemy_use_gravity', label: 'Translate Enemy Use Gravity', type: 'text', description: '' }
        ],
        [
            { name: 'do_orbit', label: 'Do Orbit', type: 'boolean', description: '' },
            { name: 'orbit_center_x', label: 'Orbit Center X', type: 'number', description: '' },
            { name: 'orbit_center_y', label: 'Orbit Center Y', type: 'number', description: '' },
            { name: 'orbit_center_z', label: 'Orbit Center Z', type: 'number', description: '' },
            { name: 'orbit_smooth', label: 'Orbit Smooth', type: 'number', description: '' },
            { name: 'orbit_damp', label: 'Orbit Damp', type: 'number', description: '' },
            { name: 'orbit_tolerance', label: 'Orbit Tolerance', type: 'number', description: '' },
            { name: 'orbit_degrees', label: 'Orbit Degrees', type: 'number', description: '' },
            { name: 'orbit_speed', label: 'Orbit Speed', type: 'number', description: '' }
        ],
        [
            { name: 'do_orbit_enemy', label: 'Do Orbit Enemy', type: 'boolean', description: '' },
            { name: 'orbit_enemy_center_x', label: 'Orbit Enemy Center X', type: 'number', description: '' },
            { name: 'orbit_enemy_center_y', label: 'Orbit Enemy Center Y', type: 'number', description: '' },
            { name: 'orbit_enemy_center_z', label: 'Orbit Enemy Center Z', type: 'number', description: '' },
            { name: 'orbit_enemy_smooth', label: 'Orbit Enemy Smooth', type: 'number', description: '' },
            { name: 'orbit_enemy_damp', label: 'Orbit Enemy Damp', type: 'number', description: '' },
            { name: 'orbit_enemy_tolerance', label: 'Orbit Enemy Tolerance', type: 'number', description: '' },
            { name: 'orbit_enemy_degrees', label: 'Orbit Enemy Degrees', type: 'number', description: '' },
            { name: 'orbit_enemy_speed', label: 'Orbit Enemy Speed', type: 'number', description: '' }
        ],
        [
            { name: 'do_rotate', label: 'Do Rotate', type: 'boolean', description: '' },
            { name: 'rotate_degrees', label: 'Rotate Degrees', type: 'number', description: '' },
            { name: 'rotate_smooth', label: 'Rotate Smooth', type: 'number', description: '' },
            { name: 'rotate_damp', label: 'Rotate Damp', type: 'number', description: '' },
            { name: 'rotate_tolerance', label: 'Rotate Tolerance', type: 'number', description: '' }
        ],
        [
            { name: 'do_rotate_enemy', label: 'Do Rotate Enemy', type: 'boolean', description: '' },
            { name: 'rotate_enemy_degrees', label: 'Rotate Enemy Degrees', type: 'number', description: '' },
            { name: 'rotate_enemy_smooth', label: 'Rotate Enemy Smooth', type: 'number', description: '' },
            { name: 'rotate_enemy_damp', label: 'Rotate Enemy Damp', type: 'number', description: '' },
            { name: 'rotate_enemy_tolerance', label: 'Rotate Enemy Tolerance', type: 'number', description: '' }
        ],
        [
            { name: 'do_play_sound', label: 'Do Play Sound', type: 'boolean', description: '' },
            { name: 'play_sound_path', label: 'Play Sound Path', type: 'text', description: '' },
            { name: 'play_sound_source', label: 'Play Sound Source', type: 'text', description: '' }
        ],
        [
            { name: 'do_play_effect', label: 'Do Play Effect', type: 'boolean', description: '' },
            { name: 'play_effect_prefab', label: 'Play Effect Prefab', type: 'text', description: '' },
            { name: 'play_effect_rotX', label: 'Play Effect Rot X', type: 'number', description: '' },
            { name: 'play_effect_rotY', label: 'Play Effect Rot Y', type: 'number', description: '' },
            { name: 'play_effect_rotZ', label: 'Play Effect Rot Z', type: 'number', description: '' },
            { name: 'play_effect_posX', label: 'Play Effect Pos X', type: 'number', description: '' },
            { name: 'play_effect_posY', label: 'Play Effect Pos Y', type: 'number', description: '' },
            { name: 'play_effect_posZ', label: 'Play Effect Pos Z', type: 'number', description: '' },
            { name: 'play_effect_delay', label: 'Play Effect Delay', type: 'number', description: '' },
            { name: 'play_effect_inside', label: 'Play Effect Inside', type: 'text', description: '' },
            { name: 'play_effect_child_name', label: 'Play Effect Child Name', type: 'text', description: '' },
            { name: 'play_effect_no_delay', label: 'Play Effect No Delay', type: 'text', description: '' }
        ]
    ];

    let tabHtml = '';
    tabs.forEach((t, i) => {
        tabHtml += `<div class="tab ${i === currentTab ? 'active' : ''}" onclick="switchTab(${i})">${t}</div>`;
    });
    document.getElementById('tabs').innerHTML = tabHtml;

    let contentHtml = '';
    // Render fields in two columns per row
    const fields = fieldsPerTab[currentTab];
    for (let i = 0; i < fields.length; i += 2) {
        contentHtml += `<div class="form-row" style="display: flex; gap: 16px;">`;

        for(let j = 0; j < 2 && (i + j) < fields.length; j++) {
            const field = fields[i + j];
            const val = currentStepData[field.name] ?? '';
            const isNumber = !isNaN(val) && val !== '';
            contentHtml += `
                <div style="flex:1; display:flex; align-items:left;">
                    <label for="${field.name}" style="flex: 0 0 45%; text-align:left; margin-right:8px;" title="${field.description}">${field.label}</label>
                    <input
                        onfocus="this.select();"
                        onchange="UpdateField(${currentStepData.id}, this);"
                        onkeydown="if(event.key==='Enter'){this.blur();}"
                        type="${field.type === 'boolean' ? 'text' : (isNumber ? 'text' : 'text')}"
                        id="${field.name}"
                        name="${field.name}"
                        value="${val}"
                        style="flex:1;"
                        ${field.type === 'boolean' && val ? 'checked' : ''}>
                </div>
            `;
        }
        // First column
        /*const field1 = fields[i];
        const val1 = currentStepData[field1.name] ?? '';
        const isNumber1 = !isNaN(val1) && val1 !== '';
        contentHtml += `
            <div style="flex:1; display:flex; align-items:left;">
                <label for="${field1.name}" style="flex: 0 0 45%; text-align:left; margin-right:8px;">${field1.label}</label>
                <input onblur="UpdateField(${currentStepData.id}, this);" type="${isNumber1 ? 'number' : 'text'}" id="${field1.name}" name="${field1.name}" value="${val1}" style="flex:1;">
            </div>
        `;

        // Second column (if exists)
        if (fields[i + 1]) {
            const field2 = fields[i + 1];
            const val2 = currentStepData[field2.name] ?? '';
            const isNumber2 = !isNaN(val2) && val2 !== '';
            contentHtml += `
                <div style="flex:1; display:flex; align-items:left;">
                    <label for="${field2.name}" style="flex: 0 0 45%; text-align:left; margin-right:8px;">${field2.label}</label>
                    <input onblur="UpdateField(${currentStepData.id}, this);" type="${isNumber2 ? 'number' : 'text'}" id="${field2.name}" name="${field2.name}" value="${val2}" style="flex:1;">
                </div>
            `;
        } else {
            // Empty column for alignment if odd number of fields
            contentHtml += `<div style="flex:1;"></div>`;
        }*/

        contentHtml += `</div>`;
    }

    document.getElementById('tabContent').innerHTML = contentHtml;
    document.getElementById('statusMsg').innerText = '';
    //document.getElementById('saveBtn').disabled = false;
}



function switchTab(i) {
    currentTab = i;
    renderComboDetails();
}

function UpdateField(id, elem) {
    if (!currentStepData) return;

    const field = elem.id;
    const value = elem.value;

    fetch('updateDB.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id, field, value })
    })
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
    })
    .then(res => {
        console.log('UpdateField response:', res);
    })
    .catch((error) => {
        alert('Error a fazer update: ' + error);
        console.error('UpdateField error:', error);
    });
}

function addComboDetailsDiv() {
    // Find the parent container (the flex column div)
    const parent = document.querySelector('div[style*="flex-direction: column"]');
    if (!parent) return;

    // Count existing comboDetails divs to give unique ids
    const count = parent.querySelectorAll('[id^="comboDetails"]').length;
    const newId = 'comboDetails' + (count + 1);

    // Create new comboDetails div
    const div = document.createElement('div');
    div.id = newId;
    div.innerHTML = `
        <strong>Combo Step :</strong>
        <div class="tabs" id="tabs${count + 1}"></div>
        <div class="tab-content" id="tabContent${count + 1}"></div>
        <div id="statusMsg${count + 1}"></div>
    `;
    div.style.marginTop = "20px";
    div.style.padding = "10px";
    div.style.border = "1px dashed #444";
    div.style.background = "#f9f9f9";
    div.style.maxWidth = "95%";

    parent.appendChild(div);
}