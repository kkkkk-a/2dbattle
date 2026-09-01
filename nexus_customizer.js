/* ==========================================================================
   NEXUS FIGHTER - AUTOMATED CUSTOMIZER & TRANSFORMER (nexus_customizer.js)
   ========================================================================== */
   function getContrastOutlineColor(hexColor, glowColor = null) {
    if (!hexColor || hexColor.charAt(0) !== '#') return 'rgba(255, 255, 255, 0.95)'; // デフォルトは白銀

    // HEXからRGBへ分解
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // 人間の目の比感度に基づいた、正確な輝度（Y）の算出
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // 輝度120未満（暗いボス）なら背後から光るネオンエッジ、それ以外（明るいキャラ）なら引き締める暗いエッジを返す
    if (luminance < 120) {
        // 💡 強化：glowColorが渡されている場合は、そのボス固有のネオンオーラ色を投影して背景からクッキリ浮かび上がらせます
        return glowColor ? glowColor : 'rgba(255, 255, 255, 0.92)';
    }
    return 'rgba(15, 15, 15, 0.95)';
}

const CUSTOMIZER_REGISTRY = {
    main:   { label: '本体 (BODY)',      color: '#ffcc00', hasCheckbox: false },
    glow:   { label: 'オーラ (GLOW)',    color: '#ffcc00', hasCheckbox: false },
    limb:   { label: '手足 (LIMBS)',     color: '#ffcc00', hasCheckbox: false },
    eye:    { label: '目 (EYES)',        color: '#ffffff', hasCheckbox: true,  enabled: true,  x: 0, y: 0, scale: 1.0 },
    nose:   { label: '鼻 (NOSE)',        color: '#ff8800', hasCheckbox: true,  enabled: true,  x: 0, y: 0, scale: 1.0 },
    mouth:  { label: '口 (MOUTH)',       color: '#ffffff', hasCheckbox: true,  enabled: true,  x: 0, y: 0, scale: 1.0 },
    mantle: { label: 'マント (CAPE)',    color: '#880000', hasCheckbox: true,  enabled: true,  x: 0, y: 0, scale: 1.0 },
    tail:   { label: 'しっぽ (TAIL)',    color: '#ffcc00', hasCheckbox: true,  enabled: true,  x: 0, y: 0, scale: 1.0 },
    horn:   { label: '角 (HORNS)',       color: '#ffcc00', hasCheckbox: true,  enabled: false, x: 0, y: 0, scale: 1.0 },
    cheek:  { label: 'ほっぺ (CHEEKS)',  color: '#ff8888', hasCheckbox: true,  enabled: false, x: 0, y: 0, scale: 1.0 },
    shell:  { label: '甲羅 (SHELL)',     color: '#546e7a', hasCheckbox: true,  enabled: false, x: 0, y: 0, scale: 1.0 },
    wing:   { label: '羽 (WINGS)',       color: '#e0ffff', hasCheckbox: true,  enabled: false, x: 0, y: 0, scale: 1.0 },
    hat:    { label: '帽子 (HAT)',       color: '#ff1100', hasCheckbox: true,  enabled: false, x: 0, y: 0, scale: 1.0 },
    // 💡 新規カスタマイズパーツ（天使の輪、サイバーゴーグル、背面ブースター）
    halo:   { label: '天使の輪 (HALO)',  color: '#ffd700', hasCheckbox: true,  enabled: false, x: 0, y: -8,  scale: 1.0 },
    visor:  { label: 'バイザー (VISOR)', color: '#00ffcc', hasCheckbox: true,  enabled: false, x: 0, y: 0,   scale: 1.0 },
    booster:{ label: 'ブースター (BOOST)',color: '#555555', hasCheckbox: true,  enabled: false, x: 0, y: 5,   scale: 1.0 }
};

// バトル画面（index.html）から位置・サイズ設定にいつでもアクセスできるようにグローバル共有化
window.CUSTOMIZER_REGISTRY = CUSTOMIZER_REGISTRY;

function syncLegacyVariables() {
    window.selectedColor = CUSTOMIZER_REGISTRY.main.color;
    window.selectedGlowColor = CUSTOMIZER_REGISTRY.glow.color;
    window.selectedLimbColor = CUSTOMIZER_REGISTRY.limb.color;
    window.selectedEyeColor = CUSTOMIZER_REGISTRY.eye.color;
    window.selectedNoseColor = CUSTOMIZER_REGISTRY.nose.color;
    window.selectedMouthColor = CUSTOMIZER_REGISTRY.mouth.color;
    window.selectedCapeColor = CUSTOMIZER_REGISTRY.mantle.color;
    window.selectedTailColor = CUSTOMIZER_REGISTRY.tail.color;
    window.selectedHornColor = CUSTOMIZER_REGISTRY.horn.color;
    window.selectedCheekColor = CUSTOMIZER_REGISTRY.cheek.color;
    window.selectedShellColor = CUSTOMIZER_REGISTRY.shell.color;
    window.selectedWingColor = CUSTOMIZER_REGISTRY.wing.color;
    window.selectedHatColor = CUSTOMIZER_REGISTRY.hat.color; 
        window.selectedHaloColor = CUSTOMIZER_REGISTRY.halo.color;
    window.selectedVisorColor = CUSTOMIZER_REGISTRY.visor.color;
    window.selectedBoosterColor = CUSTOMIZER_REGISTRY.booster.color;

    window.customizerParts = {};
    Object.keys(CUSTOMIZER_REGISTRY).forEach(key => {
        if (CUSTOMIZER_REGISTRY[key].hasCheckbox) {
            window.customizerParts[key] = CUSTOMIZER_REGISTRY[key].enabled;
        }
    });
}

function updatePartColor(key, hexColor) {
    CUSTOMIZER_REGISTRY[key].color = hexColor;
    syncLegacyVariables();
}

function togglePartState(key, isChecked) {
    CUSTOMIZER_REGISTRY[key].enabled = isChecked;
    syncLegacyVariables();
}

// --- 💡 【位置・サイズスライダー制御ロジック】 ---
// スライダーで変更された値をデータベースに即時セーブして描画を更新
function updatePartTransform(type, value) {
    const targetKey = document.getElementById('sel-transform-target').value;
    if (!targetKey || !CUSTOMIZER_REGISTRY[targetKey]) return;

    if (type === 'x') {
        CUSTOMIZER_REGISTRY[targetKey].x = parseFloat(value);
        document.getElementById('val-transform-x').textContent = value;
    } else if (type === 'y') {
        // 💡 直感的な操作（プラス＝上、マイナス＝下）にするため、
        // 内部データ（Canvas座標系：下がプラスY）に格納する際に符号を反転します
        CUSTOMIZER_REGISTRY[targetKey].y = -parseFloat(value);
        
        // 画面の数値表示は、プレイヤーの操作した直感値（プラスなら上に上がっていること）をそのまま提示
        document.getElementById('val-transform-y').textContent = value;
    } else if (type === 'scale') {
        CUSTOMIZER_REGISTRY[targetKey].scale = parseFloat(value);
        document.getElementById('val-transform-scale').textContent = parseFloat(value).toFixed(1);
    }
    syncLegacyVariables();
}

// 調整対象のパーツプルダウンが切り替わったとき、現在のスライダー位置を選択パーツの値に自動同期
function onTransformTargetChange() {
    const targetKey = document.getElementById('sel-transform-target').value;
    if (!targetKey || !CUSTOMIZER_REGISTRY[targetKey]) return;

    const item = CUSTOMIZER_REGISTRY[targetKey];
    
    document.getElementById('slide-transform-x').value = item.x;
    document.getElementById('val-transform-x').textContent = item.x;

    // 💡 内部のCanvas座標（下がプラスY）から、プレイヤーの直感値（上がプラス）に変換してスライダーとテキストに同期させます
    document.getElementById('slide-transform-y').value = -item.y;
    document.getElementById('val-transform-y').textContent = -item.y;

    document.getElementById('slide-transform-scale').value = item.scale * 10;
    document.getElementById('val-transform-scale').textContent = item.scale.toFixed(1);
}

// --- UI全自動生成エンジン（トランスフォームプルダウン対応版） ---
function buildCustomizerUI() {
    const colorContainer = document.getElementById('dynamic-color-pickers');
    const checkboxContainer = document.getElementById('dynamic-parts-checkboxes');
    const transformSelector = document.getElementById('sel-transform-target');

    if (colorContainer) {
        colorContainer.innerHTML = '';
        Object.keys(CUSTOMIZER_REGISTRY).forEach(key => {
            const item = CUSTOMIZER_REGISTRY[key];
            colorContainer.innerHTML += `
                <div class="color-item">
                    <span>${item.label}:</span>
                    <input type="color" value="${item.color}" oninput="updatePartColor('${key}', this.value)">
                </div>
            `;
        });
    }

    if (checkboxContainer) {
        checkboxContainer.innerHTML = '<div class="grid-title">PARTS VISIBILITY</div>';
        Object.keys(CUSTOMIZER_REGISTRY).forEach(key => {
            const item = CUSTOMIZER_REGISTRY[key];
            if (item.hasCheckbox) {
                checkboxContainer.innerHTML += `
                    <label style="cursor:pointer;">
                        <input type="checkbox" id="chk-part-${key}" ${item.enabled ? 'checked' : ''} 
                               onchange="togglePartState('${key}', this.checked)"> 
                        ${item.label}
                    </label>
                `;
            }
        });
    }

    // トランスフォーム調整可能なパーツプルダウンを全自動生成
    if (transformSelector) {
        transformSelector.innerHTML = '';
        Object.keys(CUSTOMIZER_REGISTRY).forEach(key => {
            const item = CUSTOMIZER_REGISTRY[key];
            if (item.hasCheckbox) {
                transformSelector.innerHTML += `<option value="${key}">${item.label}</option>`;
            }
        });
        onTransformTargetChange(); // 初期値同期
    }

    syncLegacyVariables();
}

// --- ステータス＆コスト管理（初期値0の補正値方式に統一） ---
window.BASE_STATS = {
    'normal-dmg': 0, 'normal-kb': 0, 'smash-dmg': 0, 'smash-kb': 0,
    'speed-g': 0, 'speed-a': 0, 'jump-p': 0, 'fall-s': 0, 'weight': 0, 'jump-c': 0,
    'jump-startup': 0, 'landing-lag': 0, 'dash-m': 0
};

window.charStats = {
    'normal-dmg': 0, 'normal-kb': 0, 'smash-dmg': 0, 'smash-kb': 0,
    'speed-g': 0, 'speed-a': 0, 'jump-p': 0, 'fall-s': 0, 'weight': 0, 'jump-c': 0,
    'jump-startup': 0, 'landing-lag': 0, 'dash-m': 0
};
function updateCosts() {
    let totalCost = 0;

    // --- 攻撃関連（補正値の単純乗算） ---
    totalCost += (window.charStats['normal-dmg'] * 3);
    totalCost += (window.charStats['normal-kb'] * 3);  // コストx3
    totalCost += (window.charStats['smash-dmg'] * 4);
    totalCost += (window.charStats['smash-kb'] * 4);   // コストx4

    // --- 運動性能（0基準のため、差分計算なしの単純乗算） ---
    totalCost += (window.charStats['speed-g'] * 2);    // コストx2
    totalCost += (window.charStats['speed-a'] * 2);    // コストx2
    totalCost += (window.charStats['dash-m'] * 3);     // コストx3
    totalCost += (window.charStats['jump-p'] * 2);     // コストx2
    totalCost += (window.charStats['fall-s'] * 2);     // コストx2
    totalCost += (window.charStats['weight'] * 2);     // コストx2

    // --- 空中ジャンプ数（初期値2からの補正） ---
    totalCost += (window.charStats['jump-c'] * 10);    // コストx10

    // --- 各種隙（マイナス値＝隙短縮強化。マイナスの時にコスト加算、プラスの時にコスト返還） ---
    const jumpStartup = window.charStats['jump-startup'];
    totalCost += (jumpStartup < 0) ? (-jumpStartup * 5) : (-jumpStartup * 3);

    const landingLag = window.charStats['landing-lag'];
    totalCost += (landingLag < 0) ? (-landingLag * 5) : (-landingLag * 2);

    // --- プルダウンで選択された技（Moveset / Passive）のコスト合算 ---
    const selects = [
        'sel-atk-neutral', 'sel-atk-side', 'sel-atk-down',
        'sel-smash-neutral', 'sel-smash-side', 'sel-smash-down',
        'sel-air-normal-neutral', 'sel-air-normal-up', 'sel-air-normal-down', 'sel-air-normal-side',
        'sel-air-smash-neutral', 'sel-air-smash-side', 'sel-air-smash-up', 'sel-air-smash-down',
        'sel-sp-n', 'sel-sp-side', 'sel-sp-up', 'sel-sp-down', 'sel-passive'
    ];

    selects.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.selectedIndex === -1) return;

        const opt = el.options[el.selectedIndex];
        if (!opt) return;

        const cost = parseInt(opt.getAttribute('data-cost')) || 0;
        totalCost += cost;
    });

    // パッシブアビリティ「代償契約」の有無による上限コスト判定
    const passiveSelect = document.getElementById('sel-passive');
    const isSelfHarmEquipped = passiveSelect && passiveSelect.value === 'p_self_harm';
    const costLimit = isSelfHarmEquipped ? 120 : 100;

    const costText = document.getElementById('cost-text');
    const costBar = document.getElementById('cost-bar');

    // UIテキストの書き換え（日本語からHTML本来のデザインに合わせた英語スタイルへ変更）
    if (costText) {
        costText.textContent = `SPENT: ${totalCost} / ${costLimit} PT`;
    }

    if (costBar) {
        const pct = Math.max(0, Math.min((totalCost / costLimit) * 100, 100));
        costBar.style.width = `${pct}%`;
    }

    const saveBtn = document.getElementById('btn-save');
    const isOverCost = totalCost > costLimit;

    if (costText) {
        costText.style.color = isOverCost ? '#ff2200' : '#ffffff';
    }

    if (saveBtn) {
        saveBtn.disabled = isOverCost;
    }
}
function adjStat(statId, amount) {
    let val = window.charStats[statId];

    if (statId.includes('dmg') || statId.includes('kb')) {
        // 攻撃関連: 下限 -10 〜 上限 10
        val = Math.max(-10, Math.min(10, val + amount));
    } else if (statId === 'jump-c') {
        // 空中ジャンプ数（基準2回）: -1 〜 +1（実質 1段〜3段）
        val = Math.max(-1, Math.min(1, val + amount));
    } else if (statId === 'jump-startup') {
        // 💡 ジャンプ前隙（基準4F）: -4（実質 0F 即ジャンプ） 〜 +16（実質 20F の大きな溜め）
        val = Math.max(-4, Math.min(16, val + amount));
    } else if (statId === 'landing-lag') {
        // 💡 着地硬直隙（基準6F）: -6（実質 0F 着地硬直なし） 〜 +24（実質 30F の大きな着地隙）
        val = Math.max(-6, Math.min(24, val + amount));
    } else {
        // 地上速度、空中速度、ジャンプ力、落下速度、体重、ダッシュ倍率
        // 運動性能（基準5）: 下限 -4 〜 上限 +10（実質 1 〜 15 に制限）
        val = Math.max(-4, Math.min(10, val + amount));
    }

    window.charStats[statId] = val;

    const valDisplay = document.getElementById(`val-${statId}`);
    if (valDisplay) {
        // 補正値であることがプレイヤーにわかるよう「+」「-」の符号付きで表示
        if (val > 0) {
            valDisplay.textContent = `+${val}`;
        } else {
            valDisplay.textContent = val; // 負の値や0はそのまま
        }
    }

    updateCosts();
}
function changeCharShape() {
    const selectEl = document.getElementById('sel-char-shape');
    if (selectEl) {
        window.selectedShape = selectEl.value;
    }
}
window.selectedHornType = 1; // 💡 角の初期タイプは1

function changeHornType() {
    const selectEl = document.getElementById('sel-horn-type');
    if (selectEl) {
        window.selectedHornType = parseInt(selectEl.value) || 1;
    }
}

window.selectedLimbMode = 'none';
function changeLimbMode() {
    const selectEl = document.getElementById('sel-limb-mode');
    if (selectEl) {
        window.selectedLimbMode = selectEl.value;
    }
}

function onMoveChange() {
    updateCosts();

    const activeSelect = document.activeElement;
    if (activeSelect && activeSelect.tagName === 'SELECT') {
        const moveId = activeSelect.value;
        const item = allMovesDatabase[moveId];

        if (item) {
            const prevTitle = document.getElementById('prev-title');
            const prevDesc = document.getElementById('prev-desc');

            if (prevTitle) {
                prevTitle.textContent = item.name.toUpperCase();
            }
            if (prevDesc) {
                prevDesc.textContent = item.desc || "説明が登録されていません。";
            }
        }
    }
}

// --- 💡 【トランスフォーム対応 プレビュー描画ループ】 ---
function startCustomizerPreview() {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function render() {
        const screen = document.getElementById('screen-customizer');
        if (screen && screen.classList.contains('active')) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const breathY = Math.sin(Date.now() * 0.003) * 3;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2 + 10 + breathY);

            const weightVal = window.charStats['weight'] || 5;
            const scale = 0.6 + (weightVal / 30) * 0.8;
            ctx.scale(scale, scale);

            const pWidth = 40;
            const pHeight = 60;

            // 💡 1. 統一化した「背面パーツ」を一括描画！
            drawFighterBackgroundAccessories(ctx, pWidth, pHeight, true);

            // しっぽ
            if (typeof drawTail === 'function') {
                drawTail(ctx, pWidth, pHeight, window.selectedTailColor, 'FREE', '', 0.8);
            }

            // 肢体
            const previewVx = (window.selectedLimbMode === 'leg' || window.selectedLimbMode === 'both') ? 1.5 : 0;
            if (typeof drawLimbs === 'function') {
                drawLimbs(ctx, pWidth, pHeight, window.selectedLimbMode, window.selectedLimbColor, 'FREE', previewVx, true);
            }

            // メイン本体
            ctx.shadowBlur = 15;
            ctx.shadowColor = window.selectedGlowColor;
            ctx.fillStyle = window.selectedColor;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            if (typeof drawBaseShape === 'function') {
                drawBaseShape(ctx, -pWidth / 2, -pHeight / 2, pWidth, pHeight, window.selectedShape);
            }
            ctx.fill();
            ctx.stroke();

            ctx.shadowBlur = 0; // 発光クリア

            // 💡 2. 統一化した「前面パーツ・表情」を一括描画！
            drawFighterForegroundAccessories(ctx, pWidth, pHeight, true);

            ctx.restore();
        }

        requestAnimationFrame(render);
    }
    render();
}

function saveAndGoBack() {
    changeScreen('screen-menu');
}

function initDropdowns() {
    const selectElements = {
        'sel-atk-neutral': document.getElementById('sel-atk-neutral'),
        'sel-atk-side': document.getElementById('sel-atk-side'),
        'sel-atk-down': document.getElementById('sel-atk-down'),
        'sel-smash-neutral': document.getElementById('sel-smash-neutral'),
        'sel-smash-side': document.getElementById('sel-smash-side'),
        'sel-smash-down': document.getElementById('sel-smash-down'),
        'sel-air-normal-neutral': document.getElementById('sel-air-normal-neutral'),
        'sel-air-normal-up': document.getElementById('sel-air-normal-up'),
        'sel-air-normal-down': document.getElementById('sel-air-normal-down'),
        'sel-air-normal-side': document.getElementById('sel-air-normal-side'),
        'sel-air-smash-neutral': document.getElementById('sel-air-smash-neutral'),
        'sel-air-smash-side': document.getElementById('sel-air-smash-side'),
        'sel-air-smash-up': document.getElementById('sel-air-smash-up'),
        'sel-air-smash-down': document.getElementById('sel-air-smash-down'),
        'sel-sp-n': document.getElementById('sel-sp-n'),
        'sel-sp-side': document.getElementById('sel-sp-side'),
        'sel-sp-up': document.getElementById('sel-sp-up'),
        'sel-sp-down': document.getElementById('sel-sp-down'),
        'sel-passive': document.getElementById('sel-passive')
    };

    Object.values(selectElements).forEach(el => { if (el) el.innerHTML = ''; });

    function appendOption(selectEl, moveId, item) {
        if (!selectEl) return;
        const option = document.createElement('option');
        option.value = moveId;
        option.setAttribute('data-cost', item.cost || 0);
        option.textContent = `${item.name} (${item.cost || 0} PT)`;
        selectEl.appendChild(option);
    }

Object.keys(allMovesDatabase).forEach(moveId => {
        const item = allMovesDatabase[moveId];
        if (!item) return;

        if (moveId.startsWith('normal-')) {
            // 下強、足払い等の下方向（-d）
            if (moveId.startsWith('normal-d')) {
                appendOption(selectElements['sel-atk-down'], moveId, item);
            } else if (moveId === 'normal-none') {
                appendOption(selectElements['sel-atk-neutral'], moveId, item);
                appendOption(selectElements['sel-atk-side'], moveId, item);
                appendOption(selectElements['sel-atk-down'], moveId, item);
            } else if (moveId === 'normal-n-jab' || moveId === 'normal-n-upper') { // ★ 'normal-n' から 'normal-n-jab' に修正
                appendOption(selectElements['sel-atk-neutral'], moveId, item);
            } else {
                appendOption(selectElements['sel-atk-side'], moveId, item);
            }
        }
        else if (moveId.startsWith('smash-')) {
            // 下スマッシュ等の下方向（-d）
            if (moveId.startsWith('smash-d')) {
                appendOption(selectElements['sel-smash-down'], moveId, item);
            } else if (moveId === 'smash-none') {
                appendOption(selectElements['sel-smash-neutral'], moveId, item);
                appendOption(selectElements['sel-smash-side'], moveId, item);
                appendOption(selectElements['sel-smash-down'], moveId, item);
            } else if (moveId.startsWith('smash-n-')) {
                appendOption(selectElements['sel-smash-neutral'], moveId, item);
            } else {
                appendOption(selectElements['sel-smash-side'], moveId, item);
            }
        }
        else if (moveId.startsWith('air-normal-')) {
            if (moveId === 'air-normal-none') {
                appendOption(selectElements['sel-air-normal-neutral'], moveId, item);
                appendOption(selectElements['sel-air-normal-up'], moveId, item);
                appendOption(selectElements['sel-air-normal-down'], moveId, item);
                appendOption(selectElements['sel-air-normal-side'], moveId, item);
            } else if (moveId.includes('-up')) {
                appendOption(selectElements['sel-air-normal-up'], moveId, item);
            } else if (moveId.includes('-d')) { // 空下などの下方向（-d）
                appendOption(selectElements['sel-air-normal-down'], moveId, item);
            } else if (moveId.includes('-s')) { // 空横などの横方向（-s）
                appendOption(selectElements['sel-air-normal-side'], moveId, item);
            } else {
                appendOption(selectElements['sel-air-normal-neutral'], moveId, item);
            }
        }
        else if (moveId.startsWith('air-smash-')) {
            const isNeutral = moveId.includes('-n-') || moveId.endsWith('-n');
            const isSide = moveId.includes('-s-') || moveId.endsWith('-s');
            const isDown = moveId.includes('-d-') || moveId.endsWith('-d');

            if (moveId === 'air-smash-none') {
                appendOption(selectElements['sel-air-smash-neutral'], moveId, item);
                appendOption(selectElements['sel-air-smash-side'], moveId, item);
                appendOption(selectElements['sel-air-smash-up'], moveId, item);
                appendOption(selectElements['sel-air-smash-down'], moveId, item);
            } else if (isNeutral) {
                appendOption(selectElements['sel-air-smash-neutral'], moveId, item);
            } else if (isSide) {
                appendOption(selectElements['sel-air-smash-side'], moveId, item);
            } else if (moveId.includes('-up')) {
                appendOption(selectElements['sel-air-smash-up'], moveId, item);
            } else if (isDown) {
                appendOption(selectElements['sel-air-smash-down'], moveId, item);
            }
        }
        else if (moveId.startsWith('sp_n_') || moveId === 'sp_n_none') {
            appendOption(selectElements['sel-sp-n'], moveId, item);
        } else if (moveId.startsWith('sp_s_') || moveId === 'sp_s_none') {
            appendOption(selectElements['sel-sp-side'], moveId, item);
        } else if (moveId.startsWith('sp_up_') || moveId === 'sp_up_none') {
            appendOption(selectElements['sel-sp-up'], moveId, item);
        } else if (moveId.startsWith('sp_d_') || moveId === 'sp_d_none') {
            appendOption(selectElements['sel-sp-down'], moveId, item);
        } else if (moveId.startsWith('p_')) {
            appendOption(selectElements['sel-passive'], moveId, item);
        }
    });


    const defaultWeightLimitMap = { // initDropdowns最下部用
    'sel-atk-neutral': 'normal-n-jab',          // ★ 'normal-n-jab' に修正
    'sel-atk-side': 'normal-s-kunai',           // ★ 'normal-s-kunai' に修正
    'sel-atk-down': 'normal-d-lowkick',         // ★ 'normal-d-lowkick' に修正
    'sel-smash-neutral': 'smash-n-straight',
    'sel-smash-side': 'smash-s-bat-homerun',    // ★ 'smash-s-bat-homerun' に修正
    'sel-smash-down': 'smash-d-spin-kick',
    'sel-air-normal-neutral': 'air-normal-n',
    'sel-air-normal-up': 'air-normal-up',
    'sel-air-normal-down': 'air-normal-d',
    'sel-air-normal-side': 'air-normal-s-lightning-hip', // ★ 実在する空横通常攻撃に修正
    'sel-air-smash-neutral': 'air-smash-n-sphere',
    'sel-air-smash-side': 'air-smash-s-spin-assault',
    'sel-air-smash-up': 'air-smash-up',
    'sel-air-smash-down': 'air-smash-d',
    'sel-sp-n': 'sp_n_fire',
    'sel-sp-side': 'sp_s_dash',
    'sel-sp-up': 'sp_up_jump',
    'sel-sp-down': 'sp_d_shield',
    'sel-passive': 'p_none'
};

    Object.keys(defaultWeightLimitMap).forEach(selectId => {
        const el = selectElements[selectId];
        if (el) {
            el.value = defaultWeightLimitMap[selectId];
        }
    });
}
// ==========================================================================
// 💡 新設：ファイターカスタマイザーの「完全初期状態リセット」システム
// ==========================================================================
function resetToDefaultCustomizer() {
    // 1. 各種ステータス補正値をすべて「0（補正なし）」にクリア
    Object.keys(window.charStats).forEach(key => {
        window.charStats[key] = 0;
        const valDisplay = document.getElementById(`val-${key}`);
        if (valDisplay) {
            valDisplay.textContent = "0";
        }
    });

    // 2. 形状・肢体・ツノの選択プルダウンを標準値へリセット
    const shapeEl = document.getElementById('sel-char-shape');
    if (shapeEl) { shapeEl.value = 'square'; window.selectedShape = 'square'; }
    
    const limbEl = document.getElementById('sel-limb-mode');
    if (limbEl) { limbEl.value = 'none'; window.selectedLimbMode = 'none'; }
    
    const hornEl = document.getElementById('sel-horn-type');
    if (hornEl) { hornEl.value = '1'; window.selectedHornType = 1; }


const defaultMovesMap = { // resetToDefaultCustomizer用
    'sel-atk-neutral': 'normal-n-jab',          // ★ 修正
    'sel-atk-side': 'normal-s-kunai',           // ★ 修正
    'sel-atk-down': 'normal-d-lowkick',         // ★ 修正
    'sel-smash-neutral': 'smash-n-straight',
    'sel-smash-side': 'smash-s-bat-homerun',    // ★ 修正
    'sel-smash-down': 'smash-d-spin-kick',
    'sel-air-normal-neutral': 'air-normal-n',
    'sel-air-normal-up': 'air-normal-up',
    'sel-air-normal-down': 'air-normal-d',
    'sel-air-normal-side': 'air-normal-s-lightning-hip', // ★ 修正
    'sel-air-smash-neutral': 'air-smash-n-sphere',
    'sel-air-smash-side': 'air-smash-s-spin-assault',
    'sel-air-smash-up': 'air-smash-up',
    'sel-air-smash-down': 'air-smash-d',
    'sel-sp-n': 'sp_n_fire',
    'sel-sp-side': 'sp_s_dash',
    'sel-sp-up': 'sp_up_jump',
    'sel-sp-down': 'sp_d_shield',
    'sel-passive': 'p_none'
};

    Object.keys(defaultMovesMap).forEach(selectId => {
        const el = document.getElementById(selectId);
        if (el) {
            el.value = defaultMovesMap[selectId];
        }
    });

    // 4. カスタマイズ登録パーツの色、表示ON/OFF、トランスフォーム位置・サイズを初期仕様に復元
    const customizerDefaults = {
        main:   { color: '#ffcc00' },
        glow:   { color: '#ffcc00' },
        limb:   { color: '#ffcc00' },
        eye:    { color: '#ffffff', enabled: true,  x: 0, y: 0, scale: 1.0 },
        nose:   { color: '#ff8800', enabled: true,  x: 0, y: 0, scale: 1.0 },
        mouth:  { color: '#ffffff', enabled: true,  x: 0, y: 0, scale: 1.0 },
        mantle: { color: '#880000', enabled: true,  x: 0, y: 0, scale: 1.0 },
        tail:   { color: '#ffcc00', enabled: true,  x: 0, y: 0, scale: 1.0 },
        horn:   { color: '#ffcc00', enabled: false, x: 0, y: 0, scale: 1.0 },
        cheek:  { color: '#ff8888', enabled: false, x: 0, y: 0, scale: 1.0 },
        shell:  { color: '#546e7a', enabled: false, x: 0, y: 0, scale: 1.0 },
        wing:   { color: '#e0ffff', enabled: false, x: 0, y: 0, scale: 1.0 },
        hat:    { color: '#ff1100', enabled: false, x: 0, y: 0, scale: 1.0 },
        halo:   { color: '#ffd700', enabled: false, x: 0, y: -8,  scale: 1.0 },
        visor:  { color: '#00ffcc', enabled: false, x: 0, y: 0,   scale: 1.0 },
        booster:{ color: '#555555', enabled: false, x: 0, y: 5,   scale: 1.0 }
    };

    Object.keys(customizerDefaults).forEach(key => {
        const d = customizerDefaults[key];
        if (window.CUSTOMIZER_REGISTRY[key]) {
            const item = window.CUSTOMIZER_REGISTRY[key];
            if (d.color !== undefined) item.color = d.color;
            if (d.enabled !== undefined) item.enabled = d.enabled;
            if (d.x !== undefined) item.x = d.x;
            if (d.y !== undefined) item.y = d.y;
            if (d.scale !== undefined) item.scale = d.scale;
        }
    });

    // 5. 変更したデータをUIに再流し込み（チェックボックス、カラーピッカー、トランスフォーム位置・スライダーの再生成）
    buildCustomizerUI();

    // 6. コストの再計算を実行
    updateCosts();

    // 7. リセット完了の効果音を再生
    if (typeof playSoundSE === 'function') {
        playSoundSE('click');
    }
}
function drawFighterBackgroundAccessories(ctx, pWidth, pHeight, isActive, actor = null) {
    // 💥【ここが解決策】：変形の有無に関わらず、actor自身が parts 表示設定を持っていればそれを最優先する
    let partsVisibility = (actor && actor.parts) ? actor.parts : window.customizerParts;
    let registry = window.CUSTOMIZER_REGISTRY;

    if (actor && actor.customizerTransforms) {
        registry = JSON.parse(JSON.stringify(window.CUSTOMIZER_REGISTRY));
        Object.keys(actor.customizerTransforms).forEach(key => {
            if (registry[key]) {
                Object.assign(registry[key], actor.customizerTransforms[key]);
            }
        });
    }

    if (!registry || !partsVisibility) return;

    // 💡 羽 (WINGS)
    if (partsVisibility.wing) {
        ctx.save();
        const t = registry.wing;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? actor.glowColor : window.selectedWingColor) : '#333333';
        ctx.strokeStyle = isActive ? '#ffffff' : '#555555'; ctx.lineWidth = 2.0;

        const flapAngle = Math.sin(Date.now() * 0.015) * 0.35;
        const wRatio = pWidth / 40;
        const hRatio = pHeight / 60;

        // 左羽
        ctx.save(); ctx.translate(-pWidth / 2 + 5, -5); ctx.rotate(-0.4 - flapAngle);
        ctx.beginPath(); ctx.ellipse(-15, -5, 18 * wRatio, 8 * hRatio, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        // 右羽
        ctx.save(); ctx.translate(pWidth / 2 - 5, -5); ctx.rotate(0.4 + flapAngle);
        ctx.beginPath(); ctx.ellipse(15, -5, 18 * wRatio, 8 * hRatio, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        ctx.restore();
    }
// 💡 マント (CAPE) の描画（形状の輪郭に自動吸着）
    if (partsVisibility.mantle) {
        ctx.save();
        const t = registry.mantle;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? actor.color : window.selectedCapeColor) : '#4a1111';

        // 💥【ここが解決策】：キャラクターの基礎形状（shape）を特定する
        const shape = actor ? actor.shape : window.selectedShape;

        // 基準となるマントの接続点（四角形時の左上・左下）
        let startX = -pWidth / 2;
        let startY = -pHeight / 2 + 10;
        let endX = -pWidth / 2;
        let endY = pHeight / 2 - 5;
        let capeExpandX = -pWidth - 25; // 左方向へのマントのなびく広がり幅

        // 💡 形状ごとにマントの付け根のX座標を動的にシフトさせて体に密着させる
        if (shape === 'circle') {
            startX = -pWidth * 0.35; // 丸みに合わせて右（内側）へ
            endX = -pWidth * 0.35;
            capeExpandX = -pWidth - 15;
        } else if (shape === 'triangle') {
            startX = -pWidth * 0.15; // 三角形は上がすぼんでいるため内側へ
            endX = -pWidth * 0.5;   // 下は広がっているため外側へ
        } else if (shape === 'skull') {
            // ドクロの丸い後頭部から、絞り込まれたあごのラインに吸着させる
            startX = -pWidth * 0.32; // 後頭部（少し内側）
            endX = -pWidth * 0.22;   // あご（さらに内側）
            capeExpandX = -pWidth - 12;
        } else if (shape === 'vortex' || shape === 'fortress' || shape === 'gear') {
            startX = -pWidth * 0.32;
            endX = -pWidth * 0.32;
            capeExpandX = -pWidth - 12;
        } else if (shape === 'heart') {
            startX = -pWidth * 0.45;
            endX = -pWidth * 0.15; // ハートの下部は尖ってすぼんでいるため内側へ
        } else if (shape === 'star') {
            startX = -pWidth * 0.25;
            endX = -pWidth * 0.25;
            capeExpandX = -pWidth - 10;
        }

        ctx.beginPath();
        // 決定された吸着点（startX / endX）を基準にマントのポリゴンを描く
        ctx.moveTo(startX, startY);
        const wave = Math.sin(Date.now() * 0.01) * 8;
        ctx.quadraticCurveTo(capeExpandX + 10, -pHeight / 4 + wave, capeExpandX, pHeight / 2 + wave);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 💡 甲羅 (SHELL) の描画（ここから下はそのまま維持されます）
    if (partsVisibility.shell) {
        ctx.save();
        const t = registry.shell;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = actor && !actor.isPlayer ? actor.color : window.selectedShellColor;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.0;
        ctx.beginPath(); ctx.arc(-pWidth / 2 + 2, 0, 16 * (pWidth / 40), Math.PI * 0.5, Math.PI * 1.5); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#222222'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-pWidth / 2, -10); ctx.lineTo(-pWidth / 2 - 12, -4); ctx.moveTo(-pWidth / 2, 10); ctx.lineTo(-pWidth / 2 - 12, 4); ctx.stroke();
        ctx.restore();
    }

    // 💡 背面ツインブースター (BOOSTER)
    if (partsVisibility.booster) {
        ctx.save();
        const t = registry.booster;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = actor && !actor.isPlayer ? '#555555' : window.selectedBoosterColor;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;

        // 左スラスター
        ctx.save(); ctx.translate(-pWidth / 2 - 3, 5); ctx.rotate(-0.5);
        drawRoundedRect(ctx, -6, -16, 8, 18, 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // 右スラスター
        ctx.save(); ctx.translate(pWidth / 2 + 3, 5); ctx.rotate(0.5);
        drawRoundedRect(ctx, -2, -16, 8, 18, 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        ctx.restore();
    }
}
// 2. 体の前面に描画するパーツ（ツノ、帽子、表情、ほっぺ、鼻、口、および青ざめペナルティ）
// 💡 引数の末尾の actor からローカル設定を安全に引き継ぎます
function drawFighterForegroundAccessories(ctx, pWidth, pHeight, isActive, isTeetering = false, actor = null) {
    
    // 💥【ここが解決策】：変形の有無に関わらず、actor自身が parts 表示設定を持っていればそれを最優先する
    let partsVisibility = (actor && actor.parts) ? actor.parts : window.customizerParts;
    let registry = window.CUSTOMIZER_REGISTRY;

    if (actor && actor.customizerTransforms) {
        // グローバルのレジストリをコピーし、ボスの専用変形データで安全に上書き（マージ）する
        registry = JSON.parse(JSON.stringify(window.CUSTOMIZER_REGISTRY));
        Object.keys(actor.customizerTransforms).forEach(key => {
            if (registry[key]) {
                Object.assign(registry[key], actor.customizerTransforms[key]);
            }
        });
    }

    // 💡【新設・絶対防壁】：描画対象が「巨大手 (hand)」または「渦巻き (vortex)」の場合は、
    // いかなる設定に関わらず、顔パーツ（目、口、バイザー、ほっぺなど）の表示を強制的に100%遮断する
    const shape = actor ? actor.shape : window.selectedShape;
    if (shape === 'hand' || shape === 'vortex') {
        partsVisibility = { 
            ...partsVisibility, // 他の非顔パーツ（boosterやhornなど）の表示設定は維持
            eye: false, 
            nose: false, 
            mouth: false, 
            visor: false, 
            cheek: false, 
            hat: false 
        };
    }

    if (!registry || !partsVisibility) return;

    // 💡 角 (HORNS)
    if (partsVisibility.horn) {
        ctx.save();
        const t = registry.horn;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = actor && !actor.isPlayer ? (actor.color || '#ffcc00') : window.selectedHornColor; // ボスの場合は自身の体色
        ctx.strokeStyle = '#222222'; ctx.lineWidth = 1.5;

        const type = window.selectedHornType || 1;
        const leftX = -pWidth * 0.35;
        const rightX = pWidth * 0.35;

        if (type === 1) {
            ctx.beginPath(); ctx.moveTo(leftX, -pHeight / 2 + 2); ctx.quadraticCurveTo(leftX - 4, -pHeight / 2 - 14, leftX - 12, -pHeight / 2 - 10); ctx.quadraticCurveTo(leftX + 3, -pHeight / 2 - 6, leftX + 6, -pHeight / 2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rightX, -pHeight / 2 + 2); ctx.quadraticCurveTo(rightX + 4, -pHeight / 2 - 14, rightX + 12, -pHeight / 2 - 10); ctx.quadraticCurveTo(rightX - 3, -pHeight / 2 - 6, rightX - 6, -pHeight / 2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        } else if (type === 2) {
            ctx.beginPath(); ctx.moveTo(leftX, -pHeight / 2 + 4); ctx.lineTo(leftX - 8, -pHeight / 2 - 16); ctx.lineTo(leftX + 9, -pHeight / 2 + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rightX, -pHeight / 2 + 4); ctx.lineTo(rightX + 8, -pHeight / 2 - 16); ctx.lineTo(rightX - 9, -pHeight / 2 + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
        } else if (type === 3) {
            ctx.lineWidth = 2.5; ctx.strokeStyle = actor && !actor.isPlayer ? (actor.color || '#ffcc00') : window.selectedHornColor;
            ctx.beginPath(); ctx.moveTo(-pWidth * 0.25, -pHeight / 2 + 2); ctx.quadraticCurveTo(-pWidth * 0.375, -pHeight / 2 - 15, -pWidth * 0.55, -pHeight / 2 - 20); ctx.moveTo(-pWidth * 0.35, -pHeight / 2 - 8); ctx.lineTo(-pWidth * 0.55, -pHeight / 2 - 10); ctx.moveTo(-pWidth * 0.45, -pHeight / 2 - 14); ctx.lineTo(-pWidth * 0.65, -pHeight / 2 - 18); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pWidth * 0.25, -pHeight / 2 + 2); ctx.quadraticCurveTo(pWidth * 0.375, -pHeight / 2 - 15, pWidth * 0.55, -pHeight / 2 - 20); ctx.moveTo(pWidth * 0.35, -pHeight / 2 - 8); ctx.lineTo(pWidth * 0.55, -pHeight / 2 - 10); ctx.moveTo(pWidth * 0.45, -pHeight / 2 - 14); ctx.lineTo(pWidth * 0.65, -pHeight / 2 - 18); ctx.stroke();
        }
        ctx.restore();
    }

    // 💡 帽子 (HAT)
    if (partsVisibility.hat) {
        ctx.save();
        const t = registry.hat;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? actor.color : window.selectedHatColor) : '#333333';
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8;
        
        drawRoundedRect(ctx, -pWidth * 0.6, -pHeight / 2 + 2, pWidth * 1.2, 4, 2); ctx.fill(); ctx.stroke();
        drawRoundedRect(ctx, -pWidth * 0.325, -pHeight / 2 - 19, pWidth * 0.65, 21, 3); ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = isActive ? '#ffcc00' : '#444444'; ctx.fillRect(-pWidth * 0.325, -pHeight / 2 - 2, pWidth * 0.65, 4);
        ctx.restore();
    }

    // 💡 目 (EYES)
    if (partsVisibility.eye) {
        ctx.save();
        const t = registry.eye;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? (actor.eyeColor || '#ffffff') : window.selectedEyeColor) : '#333333';

        const eyeY = -pHeight * 0.25; 
        const eyeW = pWidth * 0.125;
        const eyeH = pHeight * 0.083;

        if (isTeetering) {
            ctx.fillRect(pWidth * 0.125, eyeY - 1, eyeW * 0.6, eyeH * 0.6);
            ctx.fillRect(pWidth * 0.375, eyeY - 1, eyeW * 0.6, eyeH * 0.6);
        } else {
            ctx.fillRect(pWidth * 0.1, eyeY, eyeW, eyeH);
            ctx.fillRect(pWidth * 0.35, eyeY, eyeW, eyeH);
        }
        ctx.restore();
    }

    // 💡 ほっぺ (CHEEKS)
    if (partsVisibility.cheek) {
        ctx.save();
        const t = registry.cheek;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? (actor.glowColor || '#ff8888') : window.selectedCheekColor) : '#333333';
        ctx.globalAlpha = isActive ? 0.75 : 0.2;

        const cheekY = -pHeight * 0.116; 
        const radius = pWidth * 0.087;

        ctx.beginPath(); ctx.arc(pWidth * 0.075, cheekY, radius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(pWidth * 0.375, cheekY, radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    // 💡 鼻 (NOSE)
    if (partsVisibility.nose) {
        ctx.save();
        const t = registry.nose;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.fillStyle = isActive ? (actor && !actor.isPlayer ? '#4d2a00' : window.selectedNoseColor) : '#4d2a00';

        const noseTopY = -pHeight * 0.183;
        const noseMidY = -pHeight * 0.15;
        const noseBotY = -pHeight * 0.116;
        const noseLeftX = pWidth * 0.275;
        const noseTipX = pWidth * 0.375;

        ctx.beginPath();
        ctx.moveTo(noseLeftX, noseTopY);
        ctx.lineTo(noseTipX, noseMidY);
        ctx.lineTo(noseLeftX, noseBotY);
        ctx.closePath(); ctx.fill();
        ctx.restore();
    }

    // 💡 口 (MOUTH)
    if (partsVisibility.mouth) {
        ctx.save();
        const t = registry.mouth;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        ctx.strokeStyle = isActive ? (actor && !actor.isPlayer ? '#ffffff' : window.selectedMouthColor) : '#333333';
        ctx.lineWidth = 2;

        const mouthY = -pHeight * 0.066; 
        const mouthLeftX = pWidth * 0.15;
        const mouthRightX = pWidth * 0.35;

        ctx.beginPath();
        if (isTeetering) {
            ctx.arc((mouthLeftX + mouthRightX) / 2, mouthY, pWidth * 0.075, 0, Math.PI * 2);
        } else {
            ctx.moveTo(mouthLeftX, mouthY);
            ctx.lineTo(mouthRightX, mouthY);
        }
        ctx.stroke();
        ctx.restore();
    }

    // 💡 天使の輪 (HALO)
    if (partsVisibility.halo) {
        ctx.save();
        const t = registry.halo;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        const haloColor = actor && !actor.isPlayer ? (actor.glowColor || '#ffd700') : window.selectedHaloColor;
        ctx.strokeStyle = haloColor;
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 15; ctx.shadowColor = haloColor;
        
        ctx.beginPath();
        ctx.ellipse(0, -pHeight / 2 - 12, pWidth * 0.45, pWidth * 0.12, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // 💡 ゴーグルバイザー (VISOR)
    if (partsVisibility.visor) {
        ctx.save();
        const t = registry.visor;
        ctx.translate(t.x, t.y); ctx.scale(t.scale, t.scale);
        const visorColor = actor && !actor.isPlayer ? (actor.eyeColor || '#00ffcc') : window.selectedVisorColor;
        ctx.fillStyle = visorColor;
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
        ctx.shadowBlur = 15; ctx.shadowColor = visorColor;

        drawRoundedRect(ctx, -pWidth * 0.45, -pHeight * 0.28, pWidth * 0.9, pHeight * 0.14, 2.5);
        ctx.fill(); ctx.stroke();
        ctx.restore();
    }
}

