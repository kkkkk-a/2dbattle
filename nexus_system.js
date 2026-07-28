/* ==========================================================================
   NEXUS FIGHTER - SCENE & OPTION MANAGER (nexus_system.js)
   ========================================================================== */

// --- システム・シーン遷移用の状態管理変数 ---
window.currentSelectedMode = ""; // 現在選択されているモード名 (PVP / PVPE / テストなど)
window.currentStageKey = "nexus_flat"; // 現在選択されているステージキー
window.isStoryModeActive = false; // ストーリーモードが進行中かどうか

// --- 会話劇（アドベンチャー）用の状態管理変数 ---
let dialogLoopId = null;
let dialogIndex = 0;
let currentDialogList = [];
let onDialogComplete = null;

// --- 💡 【新規合流】 キーボード割り当て状態の管理 ---
window.keyConfig = {
    left: 'KeyA',
    right: 'KeyD',
    jump: 'KeyW',
    guard: 'KeyS',
    attack: 'KeyJ',
    smash: 'KeyK',
    special: 'KeyI',
    dash: 'ShiftLeft' // デフォルト
};
let currentAssigningAction = null; // 現在キー変更待ちのアクション（'left' など）

// --- 💡 1. 画面（スクリーン）の切り替え処理 ---
function changeScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// --- 💡 2. モーダルダイアログの開閉制御 ---
function openModal(id) { 
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex'; 
    }
}

function closeModal(id) { 
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none'; 
    }
}

// --- 💡 3. 音量ボリュームの更新処理（UIスライダー値の監視と音響コアへの通知） ---
function updateVolume() {
    const bgmSlider = document.getElementById('vol-bgm');
    const seSlider = document.getElementById('vol-se');
    
    const bgmVol = bgmSlider ? parseFloat(bgmSlider.value) / 100 : 0.5;
    const seVol = seSlider ? parseFloat(seSlider.value) / 100 : 0.6;

    // 💡 修正：UI要素に一切触らない、nexus_audio.js 側の専用音量適用関数（applyVolumeSettings）を呼び出します
    if (typeof applyVolumeSettings === 'function') {
        applyVolumeSettings(bgmVol, seVol);
    }
}

// --- 💡 3.5. フレームレート制限（FPS LIMIT）の更新処理（システム制御のため、本ファイルへ移動配置） ---
function changeTargetFPS() {
    const selectEl = document.getElementById('sel-fps-lock');
    if (selectEl) {
        targetFPS = parseInt(selectEl.value) || 60;
        
        // 累積フレーム時間のズレを防ぐため、前回のタイムスタンプを安全に初期化
        lastFrameTime = performance.now();
        
        if (typeof playSoundSE === 'function') {
            playSoundSE('click');
        }
    }
}

// --- 💡 4. キーボードコンフィグ（割り当て）制御ロジック ---
function startAssignKey(actionKey) {
    currentAssigningAction = actionKey;
    updateKeyConfigUI();
    const btn = document.getElementById(`key-btn-${actionKey}`);
    if (btn) {
        btn.querySelector('span').textContent = "PRESS KEY...";
        btn.style.border = "2px solid #ffcc00"; // 枠線を目立たせる
    }
}

function updateKeyConfigUI() {
    Object.keys(window.keyConfig).forEach(actionKey => {
        const btn = document.getElementById(`key-btn-${actionKey}`);
        if (btn) {
            btn.querySelector('span').textContent = window.keyConfig[actionKey];
            btn.style.border = "none";
        }
    });
}

// キー設定の割り当て待機中にキーが押された際、全自動で登録してUIを更新するリスナー
window.addEventListener('keydown', (e) => {
    if (currentAssigningAction) {
        window.keyConfig[currentAssigningAction] = e.code; // キーコードを登録
        currentAssigningAction = null; // 待機クリア
        updateKeyConfigUI();
        if (typeof playSoundSE === 'function') {
            playSoundSE('click');
        }
        e.preventDefault(); // 画面スクロールなどの防止
    }
});

// --- 💡 5. 極秘アーカイブ（開閉式データ）の表示制御 ---
function toggleArchiveLogs() {
    const container = document.getElementById('archive-logs-container');
    const btnText = document.getElementById('btn-archive-text');
    if (container && btnText) {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            btnText.textContent = "CLOSE RESTRICTED DATA (アーカイブを閉じる)";
            if (typeof playSoundSE === 'function') playSoundSE('click');
        } else {
            container.style.display = 'none';
            btnText.textContent = "RESTRICTED DATA ACCESS (データアクセス制限解除)";
            if (typeof playSoundSE === 'function') playSoundSE('click');
        }
    }
}

// --- 💡 6. ストーリー（PvEミッション）管理処理 ---
function openStorySelect() {
    changeScreen('screen-story-select');
}

function retireStory() {
    if (dialogLoopId) {
        cancelAnimationFrame(dialogLoopId);
        dialogLoopId = null;
    }
    window.isStoryModeActive = false;
    changeScreen('screen-story-select');
}

function startStory(missionKey, isCoop) {
    const mission = storyMissionDatabase[missionKey];
    if (!mission) return;

    window.isStoryModeActive = true;

    const titleDisplay = document.getElementById('story-title-display');
    if (titleDisplay) {
        titleDisplay.textContent = mission.title;
    }

    currentDialogList = mission.dialogs;
    const targetStage = mission.stage;

    dialogIndex = 0;
    onDialogComplete = () => {
        onDialogComplete = null;
        if (dialogLoopId) {
            cancelAnimationFrame(dialogLoopId);
            dialogLoopId = null;
        }
        const modeName = isCoop ? "オンライン共闘" : "ソロストーリー";
        startMockBannerName = `${mission.title} [${modeName}]`;
        startMockBattle(startMockBannerName, targetStage);
    };
    changeScreen('screen-dialog');
    nextDialog();
}

function nextDialog() {
    if (dialogIndex >= currentDialogList.length) {
        if (onDialogComplete) onDialogComplete();
        return;
    }
    const current = currentDialogList[dialogIndex];
    
    const speakerEl = document.getElementById('dialog-speaker');
    const contentEl = document.getElementById('dialog-content');
    
    if (speakerEl) speakerEl.textContent = current.speaker;
    if (contentEl) contentEl.textContent = current.text;
    
    drawDialogAvatars(current.speaker);
    dialogIndex++;
}

// --- 💡 7. 会話劇アバター描画（左右対峙＆明暗フォーカス完成版） ---
function drawDialogAvatars(speaker) {
    const canvas = document.getElementById('dialog-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 240;

    if (dialogLoopId) {
        cancelAnimationFrame(dialogLoopId);
        dialogLoopId = null;
    }

    function render() {
        const dialogScreen = document.getElementById('screen-dialog');
        if (!dialogScreen || !dialogScreen.classList.contains('active')) {
            if (dialogLoopId) {
                cancelAnimationFrame(dialogLoopId);
                dialogLoopId = null;
            }
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isMirkaSpeaking = (speaker === "MIRKA" || speaker === "FIGHTER");
        const isSystemSpeaking = (speaker === "SYSTEM VOICE");

        // ==========================================
        // 1. 左側：主人公ミルカ（MIRKA）の描画
        // ==========================================
        ctx.save();
        ctx.translate(180, 130);

        // 話者フォーカス（喋っている側は明るく拡大、聞いている側は暗転）
        if (isMirkaSpeaking) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = window.selectedGlowColor || '#00ffcc';
            ctx.scale(1.2, 1.2);
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = window.selectedColor || '#ffcc00';
            ctx.strokeStyle = '#ffffff';
        } else {
            ctx.shadowBlur = 0;
            ctx.scale(0.95, 0.95);
            ctx.globalAlpha = 0.35; // 暗転
            ctx.fillStyle = '#1c1c1c';
            ctx.strokeStyle = '#444444';
        }

        const pWidth = 45;
        const pHeight = 70;

        // 共通背面アクセサリ
        if (typeof drawFighterBackgroundAccessories === 'function') {
            drawFighterBackgroundAccessories(ctx, pWidth, pHeight, isMirkaSpeaking);
        }

        ctx.lineWidth = 3.5;
        drawBaseShape(ctx, -pWidth / 2, -pHeight / 2, pWidth, pHeight, window.selectedShape || 'square');
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // 共通前面アクセサリ
        if (typeof drawFighterForegroundAccessories === 'function') {
            drawFighterForegroundAccessories(ctx, pWidth, pHeight, isMirkaSpeaking, false);
        }

        ctx.restore();

        // ==========================================
        // 2. 右側：対話相手（SYSTEM VOICE / AI監視コア）の描画
        // ==========================================
        ctx.save();
        ctx.translate(620, 130);

        if (isSystemSpeaking) {
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ff0055'; // 警告レッド発光
            ctx.scale(1.2, 1.2);
            ctx.globalAlpha = 1.0;
        } else {
            ctx.shadowBlur = 0;
            ctx.scale(0.95, 0.95);
            ctx.globalAlpha = 0.35; // 暗転
        }

        // 外枠ヘキサゴンAIコア
        drawBaseShape(ctx, -35, -35, 70, 70, 'ai_core');
        ctx.fillStyle = isSystemSpeaking ? '#0a1020' : '#111111';
        ctx.strokeStyle = isSystemSpeaking ? '#00e5ff' : '#444444';
        ctx.lineWidth = 3;
        ctx.fill(); ctx.stroke();

        // 中央の単眼赤レンズ
        ctx.fillStyle = isSystemSpeaking ? '#ff0055' : '#550022';
        if (isSystemSpeaking) {
            ctx.shadowBlur = 15; ctx.shadowColor = '#ff0055';
        }
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // 回転するホログラムデータリング
        ctx.rotate(Date.now() * 0.002);
        ctx.strokeStyle = isSystemSpeaking ? '#00e5ff' : '#333333';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        dialogLoopId = requestAnimationFrame(render);
    }

    render();
}

// --- 💡 8. ステージ・マップ選択画面の制御処理 ---
function openStageSelect(modeName) {
    let totalCost = 0;
    if (window.charStats && window.BASE_STATS) {
        // ★ 補正ステータスのコスト倍率を カスタマイザー（updateCosts）と完全に一致させます
        totalCost += (window.charStats['normal-dmg'] * 3);
        totalCost += (window.charStats['normal-kb'] * 3);
        totalCost += (window.charStats['smash-dmg'] * 4);
        totalCost += (window.charStats['smash-kb'] * 4);
        
        totalCost += (window.charStats['speed-g'] * 2);
        totalCost += (window.charStats['speed-a'] * 2);
        totalCost += (window.charStats['dash-m'] * 3);
        totalCost += (window.charStats['jump-p'] * 2);
        totalCost += (window.charStats['fall-s'] * 2);
        totalCost += (window.charStats['weight'] * 2);
        totalCost += (window.charStats['jump-c'] * 10);

        const jumpStartup = window.charStats['jump-startup'];
        totalCost += (jumpStartup < 0) ? (-jumpStartup * 5) : (-jumpStartup * 3);

        const landingLag = window.charStats['landing-lag'];
        totalCost += (landingLag < 0) ? (-landingLag * 5) : (-landingLag * 2);
    }

    // ★ 漏れていたスロット 'sel-atk-neutral', 'sel-atk-down', 'sel-smash-neutral', 'sel-air-smash-neutral' を追加
    const selects = [
        'sel-atk-neutral', 'sel-atk-side', 'sel-atk-down',
        'sel-smash-neutral', 'sel-smash-side', 'sel-smash-down',
        'sel-air-normal-neutral', 'sel-air-normal-up', 'sel-air-normal-down', 'sel-air-normal-side',
        'sel-air-smash-neutral', 'sel-air-smash-side', 'sel-air-smash-up', 'sel-air-smash-down',
        'sel-sp-n', 'sel-sp-side', 'sel-sp-up', 'sel-sp-down', 'sel-passive'
    ];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.selectedIndex !== -1) {
            const opt = el.options[el.selectedIndex];
            if (opt) totalCost += parseInt(opt.getAttribute('data-cost')) || 0;
        }
    });

    const passiveSelect = document.getElementById('sel-passive');
    const isSelfHarmEquipped = passiveSelect && passiveSelect.value === 'p_self_harm';
    const costLimit = isSelfHarmEquipped ? 120 : 100;

    if (totalCost > costLimit) {
        alert(`【コスト超過制限】\n現在の消費コスト（${totalCost} PT）が上限（${costLimit} PT）を超えています。\n\n「ファイターカスタマイズ」画面でパーツやステータスを調整してください。`);
        return;
    }

    const isOnlineMode = modeName.includes("PVP") || modeName.includes("PVPE") || modeName.includes("ONLINE");
    if (isOnlineMode && (!p2p || !p2p.active)) {
        let warningMessage = `【対戦相手と未接続です】\n\nオンライン対戦を始めるには、対戦相手との接続を確立する必要があります。`;
        if (window.location.protocol === 'file:') {
            warningMessage += `\n\n※注意※\n現在ローカル(file:///)で実行されています。P2Pシグナリング通信がブロックされる場合は簡易Webサーバーを起動してください。`;
        }
        alert(warningMessage);
        return;
    }

    window.currentSelectedMode = modeName;
    const stageHeader = document.getElementById('stage-select-header');
    if (stageHeader) {
        stageHeader.textContent = `${modeName} - STAGE SELECT`;
    }
    changeScreen('screen-stage-select');
}

function selectStageAndStart(stageKey) {
    startMockBattle(window.currentSelectedMode, stageKey);
}

// --- 💡 9. 対戦終了・リザルト移行処理 ---
function stopMatch() {
    if (typeof stopCurrentMatch === 'function') {
        stopCurrentMatch();
    }
    if (typeof stopPseudoBGM === 'function') {
        stopPseudoBGM();
    }

    if (window.isStoryModeActive) {
        changeScreen('screen-story-select');
    } else {
        changeScreen('screen-menu');
    }
}

function restartCurrentMatch() {
    document.getElementById('screen-result').style.display = 'none';
    const currentModeName = document.getElementById('match-header').textContent;
    if (typeof startMockBattle === 'function') {
        startMockBattle(currentModeName, window.currentStageKey);
    }
}

function closeResultAndExit() {
    document.getElementById('screen-result').style.display = 'none';
    if (window.isStoryModeActive) {
        changeScreen('screen-story-select');
    } else {
        changeScreen('screen-menu');
    }
}
// --- 💡 【新規合流】 取扱説明書（システムマニュアル）の開閉制御 ---
function toggleManual() {
    const container = document.getElementById('manual-container');
    const btnText = document.getElementById('btn-manual-text');
    if (container && btnText) {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            btnText.textContent = "CLOSE SYSTEM MANUAL (マニュアルを閉じる)";
            if (typeof playSoundSE === 'function') playSoundSE('click');
        } else {
            container.style.display = 'none';
            btnText.textContent = "OPEN SYSTEM MANUAL (マニュアルを開く)";
            if (typeof playSoundSE === 'function') playSoundSE('click');
        }
    }
}