// nexus_camera.js
// 自機（P1）絶対保護 ＆ アクション・ヒット・移動動的連動カメラモジュール
window.NexusCamera = {
    // --- 状態変数（プロパティ） ---
    x: 0,
    y: 0,
    width: 1000,
    height: 420,
    zoomScale: 0.85,
    targetZoom: 0.85,
    zoomHoldTimer: 0, // 💡 新設：ズーム画角を一時維持するキープタイマー

    // --- 初期化処理 ---
    init: function(canvasWidth, canvasHeight) {
        this.width = canvasWidth / this.zoomScale;
        this.height = canvasHeight / this.zoomScale;
        this.zoomHoldTimer = 0;
    },

    // --- 毎フレームの更新処理 ---
    update: function(player, enemies, stage, canvas, hitStopTimer, matchEnded, isHRMode, hrState, currentStageKey) {
        if (!player || !stage) return;

        // 1. カメラ描画領域サイズの更新
        const cameraWidth = canvas.width / this.zoomScale;
        const cameraHeight = canvas.height / this.zoomScale;
        this.width = cameraWidth;
        this.height = cameraHeight;

        // 2. 攻撃・ヒット・移動に応じた動的ズーム倍率（targetZoom）の決定
        if (stage.cameraScroll && !isHRMode && !matchEnded) {
            const activeEnemy = enemies.find(e => e.stocks > 0) || enemies[0];

            // 💥【ヒットストップ判定】
            const isPlayerStunned = (player.hitStopTimer > 0) || (player.system && player.system.launchDelayTimer > 0);
            const isEnemyStunned = activeEnemy && ((activeEnemy.hitStopTimer > 0) || (activeEnemy.system && activeEnemy.system.launchDelayTimer > 0));
            const isHitImpactActive = isPlayerStunned || isEnemyStunned;

            // 💥【大吹っ飛び判定】
            const isPlayerFlying = player.system && player.system.isKnockedBack;
            const isEnemyFlying = activeEnemy && activeEnemy.aiState === 'HARD_KNOCKBACK';
            const pSpeed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
            const eSpeed = activeEnemy ? Math.sqrt(activeEnemy.vx * activeEnemy.vx + activeEnemy.vy * activeEnemy.vy) : 0;
            const isHighSpeedLaunch = (isPlayerFlying && pSpeed > 8.0) || (isEnemyFlying && eSpeed > 8.0);

            // 💥【移動・突進判定】
            const isDashing = player.system && player.system.isDashing;
            const isFastMoving = pSpeed > 7.0;

            // 💥【チャージ構え判定】
            const isSmashCharging = player.system && player.system.isChargingSmash;
            const isSpecialCharging = player.isCharging || false;

            let currentActionZoom = null;

            if (isHitImpactActive) {
                // ⚡ 1.【攻撃ヒット時】一瞬「1.22倍」ズーム（維持: 約0.4秒/25F）
                currentActionZoom = 1.22;
                this.zoomHoldTimer = 25;
            } else if (isHighSpeedLaunch) {
                // 💨 2.【吹っ飛び時】広角「0.65倍」（維持: 約0.5秒/30F）
                currentActionZoom = 0.65;
                this.zoomHoldTimer = 30;
            } else if (isDashing || isFastMoving) {
                // 🏃 3.【ダッシュ・移動時】「0.76倍」（維持: 約0.35秒/22F）
                currentActionZoom = 0.76;
                this.zoomHoldTimer = 22;
            } else if (isSmashCharging || isSpecialCharging) {
                // ⚔️ 4.【構え時】「0.96倍」（維持: 約0.25秒/15F）
                currentActionZoom = 0.96;
                this.zoomHoldTimer = 15;
            }

            // アクション実行中の場合は、目標ズーム率を更新＆タイマーをセット
            if (currentActionZoom !== null) {
                this.targetZoom = currentActionZoom;
            } else {
                // アクションが終了したら、まずホールドタイマーを消化して余韻を残す
                if (this.zoomHoldTimer > 0) {
                    this.zoomHoldTimer--;
                } else {
                    // タイマー消化後に初めて標準画角（0.85）へ緩やかに戻す
                    this.targetZoom = 0.85;
                }
            }
        } else {
            this.targetZoom = 0.85;
            this.zoomHoldTimer = 0;
        }

        // 💡 ズーム補間スピードの制御
        // アクション発生時の寄る/引く速度は素早く(0.08)、標準に戻る時は非常にゆったり(0.02)戻すことでバタつきを防止
        const isReturningToDefault = (this.targetZoom === 0.85 && this.zoomHoldTimer === 0);
        const zoomSpeed = isReturningToDefault ? 0.02 : 0.08;

        this.zoomScale += (this.targetZoom - this.zoomScale) * zoomSpeed;

        // 3. カメラ目標位置（targetCamX, targetCamY）の算出（★自機中心 ＋ 移動先予知）
        if (stage.cameraScroll || isHRMode) {
            const activeEnemy = enemies.find(e => e.stocks > 0) || enemies[0];
            let targetCamX = 0;
            let targetCamY = 0;

            if (isHRMode && hrState !== 'PREPARE' && activeEnemy) {
                targetCamX = activeEnemy.x + activeEnemy.width / 2 - cameraWidth / 2;
                targetCamY = activeEnemy.y + activeEnemy.height / 2 - cameraHeight * 0.55;
            } else {
                // 💥 常に自機（P1）を中心としつつ、移動・向きに合わせてカメラを進行方向へわずかに先行スライド
                const pCenterX = player.x + player.width / 2;
                const pCenterY = player.y + player.height / 2;

                const leadX = player.vx * 12.0; // 移動方向へのカメラ先行量
                const leadY = player.vy * 6.0;

                targetCamX = (pCenterX + leadX) - cameraWidth / 2;
                targetCamY = (pCenterY + leadY) - cameraHeight * 0.52;
            }

            // 4. スムーズな位置補間移動
            this.x += (targetCamX - this.x) * 0.14;
            this.y += (targetCamY - this.y) * 0.14;

            // 5.【場外ライン（ステージ境界）限界ブロックプロテクト】
if (!isHRMode && stage) {
    // 💡 左右のカメラ限界を ±50px に拡張（崖外の復帰戦を映しやすくする）
    const minCamX = -50;
    const maxCamX = Math.max(minCamX, (stage.width + 50) - cameraWidth);

    const minCamY = -100;
    const maxCamY = Math.max(minCamY, stage.height - cameraHeight);

    // 横方向の場外ラインクランプ
    if (cameraWidth <= stage.width + 100) {
        this.x = Math.max(minCamX, Math.min(maxCamX, this.x));
    } else {
        this.x = (stage.width - cameraWidth) / 2;
    }

    // 縦方向の場外ラインクランプ
    if (cameraHeight <= (stage.height - minCamY)) {
        this.y = Math.max(minCamY, Math.min(maxCamY, this.y));
    } else {
        this.y = (stage.height - cameraHeight) / 2;
    }
}

        } else {
            // 固定画面マップ
            this.x = 0;
            this.y = 0;
        }
    }
};