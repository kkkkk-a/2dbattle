// nexus_stage_renderer.js
// ステージのテーマごとの背景・地形の美麗描画を担当するモジュール
window.NexusStageRenderer = {
    
    // 💡 1. 生成した電子回路の設計データを一時保存するキャッシュ配列
    cyberCircuitCache: null,

    // 💡 2. 【プログラムによる全自動・密集衝突回避型オートルーター回路生成】
    generateCyberCircuit: function(width, height) {
        let seed = 12345;
        function localRandom() {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        const circuit = {
            width: width,
            height: height,
            chips: [],         // ICチップ（大・中・小）
            components: [],    // 2端子・3端子電子部品
            edgeConnectors: [],// 基板端の金メッキ端子
            lines: [],         // 表層・内層配線
            vias: [],          // ビア
            silks: []          // シルク印刷レイヤー
        };

        // 1. 基板端のゴールドフィンガー
        const fingerCount = 32;
        const startX = 40;
        const fingerSpacing = 10;
        for (let i = 0; i < fingerCount; i++) {
            circuit.edgeConnectors.push({
                x: startX + i * fingerSpacing,
                y: height - 15,
                w: 6,
                h: 15
            });
        }

        // 2. ICチップの自動配置
        const chipCount = 12 + Math.floor(localRandom() * 4);
        for (let i = 0; i < chipCount; i++) {
            const w = 45 + Math.floor(localRandom() * 45);
            const h = 40 + Math.floor(localRandom() * 20);
            const cx = 80 + localRandom() * (width - 160);
            const cy = 40 + localRandom() * (height - 150);

            const isOverlapping = circuit.chips.some(chip => {
                return cx < chip.x + chip.w + 60 && cx + w > chip.x - 60 &&
                       cy < chip.y + chip.h + 60 && cy + h > chip.y - 60;
            });

            if (!isOverlapping) {
                const partNo = localRandom() < 0.4 ? `CPU-${80 + Math.floor(localRandom() * 20)}` : `LSP-${500 + Math.floor(localRandom() * 400)}`;
                const refDes = `U${circuit.chips.length + 1}`;
                
                const pins = [];
                const hasHorizontalPins = localRandom() < 0.5;

                if (hasHorizontalPins) {
                    for (let py = cy + 6; py < cy + h - 4; py += 8) {
                        pins.push({ x: cx, y: py, side: 'left' });
                        pins.push({ x: cx + w, y: py, side: 'right' });
                    }
                } else {
                    for (let px = cx + 6; px < cx + w - 4; px += 8) {
                        pins.push({ x: px, y: cy, side: 'top' });
                        pins.push({ x: px, y: cy + h, side: 'bottom' });
                    }
                }

                circuit.chips.push({
                    x: cx, y: cy, w: w, h: h,
                    partNo: partNo, refDes: refDes, pins: pins
                });
            }
        }

        // 3. 受動部品
        const compCount = 45 + Math.floor(localRandom() * 15);
        for (let i = 0; i < compCount; i++) {
            const rVal = localRandom();
            let type = 'resistor';
            let w = 14, h = 6;
            if (rVal < 0.35) {
                type = 'capacitor';
                w = 10; h = 8;
            } else if (rVal < 0.5) {
                type = 'transistor';
                w = 12; h = 12;
            }

            const cx = 60 + localRandom() * (width - 120);
            const cy = 30 + localRandom() * (height - 120);

            const isOverlapping = circuit.chips.some(chip => {
                return cx < chip.x + chip.w + 20 && cx + w > chip.x - 20 &&
                       cy < chip.y + chip.h + 20 && cy + h > chip.y - 20;
            }) || circuit.components.some(comp => {
                return cx < comp.x + comp.w + 15 && cx + w > comp.x - 15 &&
                       cy < comp.y + comp.h + 15 && cy + h > comp.y - 15;
            });

            if (!isOverlapping) {
                let refDes = 'R';
                let pins = [];

                if (type === 'resistor') {
                    refDes = `R${i + 1}`;
                    pins = [{ x: cx, y: cy + h / 2 }, { x: cx + w, y: cy + h / 2 }];
                } else if (type === 'capacitor') {
                    refDes = `C${i + 1}`;
                    pins = [{ x: cx, y: cy + h / 2 }, { x: cx + w, y: cy + h / 2 }];
                } else {
                    refDes = `Q${i + 1}`;
                    pins = [
                        { x: cx + 2, y: cy + h },
                        { x: cx + w / 2, y: cy },
                        { x: cx + w - 2, y: cy + h }
                    ];
                }

                circuit.components.push({
                    x: cx, y: cy, w: w, h: h,
                    type: type, refDes: refDes, pins: pins
                });
            }
        }

        // 4. 多層配線オートルーター
        const targetLines = 55 + Math.floor(localRandom() * 15);
        for (let k = 0; k < targetLines; k++) {
            if (circuit.chips.length === 0) break;

            let startPin = null;
            let endPin = null;

            if (localRandom() < 0.3 && circuit.edgeConnectors.length > 0) {
                const conn = circuit.edgeConnectors[Math.floor(localRandom() * circuit.edgeConnectors.length)];
                startPin = { x: conn.x + conn.w / 2, y: conn.y };
            } else {
                const startChip = circuit.chips[Math.floor(localRandom() * circuit.chips.length)];
                if (startChip.pins.length > 0) {
                    startPin = startChip.pins[Math.floor(localRandom() * startChip.pins.length)];
                }
            }

            if (localRandom() < 0.4 && circuit.components.length > 0) {
                const endComp = circuit.components[Math.floor(localRandom() * circuit.components.length)];
                endPin = endComp.pins[Math.floor(localRandom() * endComp.pins.length)];
            } else {
                const endChip = circuit.chips[Math.floor(localRandom() * circuit.chips.length)];
                if (endChip.pins.length > 0) {
                    endPin = endChip.pins[Math.floor(localRandom() * endChip.pins.length)];
                }
            }

            if (!startPin || !endPin) continue;

            const sx = startPin.x;
            const sy = startPin.y;
            const ex = endPin.x;
            const ey = endPin.y;

            const layer = localRandom() < 0.65 ? 0 : 1;
            const thickness = localRandom() < 0.08 ? 'power' : 'signal';

            const points = [{ x: sx, y: sy }];

            const dx = Math.abs(ex - sx);
            const dy = Math.abs(ey - sy);

            if (dx > dy) {
                const shiftX = (ey > sy) ? dy : -dy;
                points.push({ x: sx + (ex > sx ? 1 : -1) * (dx - dy) / 2, y: sy });
                points.push({ x: sx + (ex > sx ? 1 : -1) * (dx - dy) / 2 + shiftX, y: ey });
            } else {
                const shiftY = (ex > sx) ? dx : -dx;
                points.push({ x: sx, y: sy + (ey > sy ? 1 : -1) * (dy - dx) / 2 });
                points.push({ x: ex, y: sy + (ey > sy ? 1 : -1) * (dy - dx) / 2 + shiftY });
            }
            points.push({ x: ex, y: ey });

            const parallelCount = (thickness === 'signal' && localRandom() < 0.3) ? 3 : 1;
            const lineBundle = [];

            for (let l = 0; l < parallelCount; l++) {
                const offset = l * 5;
                const offsetPoints = points.map((p, pIdx) => {
                    if (pIdx === 0 || pIdx === points.length - 1) {
                        return { x: p.x, y: p.y };
                    }
                    return { x: p.x + offset, y: p.y + offset };
                });
                lineBundle.push(offsetPoints);

                if (offsetPoints.length > 2 && localRandom() < 0.5) {
                    circuit.vias.push({ x: offsetPoints[1].x, y: offsetPoints[1].y, type: 'standard' });
                }
            }

            circuit.lines.push({
                bundle: lineBundle,
                layer: layer,
                thickness: thickness
            });
        }

        // 5. シルク印刷マーク
        for (let x = 80; x < width; x += 400) {
            circuit.silks.push({
                type: 'text',
                x: x,
                y: 60 + localRandom() * 40,
                text: `PCB-ASSY: ${9000 + Math.floor(localRandom() * 1000)}-X`
            });
            circuit.silks.push({
                type: 'gnd_mark',
                x: x + 200,
                y: 80 + localRandom() * 200
            });
            circuit.silks.push({
                type: 'board_corner',
                x: x + 100,
                y: 50,
                w: 200,
                h: 220
            });
        }

        this.cyberCircuitCache = circuit;
    },
    
// --- 1. 背景 of テーマ別描画（カメラ・キャラ非連動・完全画面固定版） ---
    drawBackground: function(ctx, stage, camera) {
        if (!stage) return;

        const theme = stage.theme || 'default';

        // 🅰️ 【青空アスレチックテーマ：sky_meadow】
        if (theme === 'sky_meadow') {
            ctx.save();
            // 時間経過のみでゆっくり流れる雲（カメラ連動を完全削除）
            const cloudScrollX = (Date.now() * 0.004);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            for (let i = -1; i < 5; i++) {
                const cx = (i * 550) + (cloudScrollX % 550);
                const cy = 110 + Math.sin(Date.now() * 0.0005 + i) * 15;
                ctx.beginPath();
                ctx.arc(cx, cy, 80, 0, Math.PI * 2);
                ctx.arc(cx + 60, cy + 15, 65, 0, Math.PI * 2);
                ctx.arc(cx - 60, cy + 20, 55, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        // 🔥【灼熱の溶岩テーマ：lava】
        else if (theme === 'lava') {
            ctx.save();
            const time = Date.now();
            
            ctx.globalCompositeOperation = 'screen';
            ctx.shadowBlur = 40;
            ctx.shadowColor = '#d84315';
            ctx.strokeStyle = 'rgba(230, 81, 0, 0.15)';
            ctx.lineWidth = 14;

            ctx.beginPath();
            const startX = 0; // 完全固定
            ctx.moveTo(startX - 100, stage.groundY - 180);
            for (let x = startX - 100; x < 2000; x += 80) {
                const waveY = (stage.groundY - 160) + 
                              Math.sin(time * 0.0012 + x * 0.003) * 22 + 
                              Math.cos(time * 0.0007 - x * 0.005) * 12;
                ctx.lineTo(x, waveY);
            }
            ctx.stroke();

            // 溶岩の熱気粒子（カメラ移動に連動しない固定画面）
            ctx.fillStyle = '#ff6600';
            ctx.shadowBlur = 12; ctx.shadowColor = '#ff4500';
            for (let i = 0; i < 15; i++) {
                const particleId = i * 73;
                const speedY = 1.0 + (i % 3) * 0.4;
                const px = (particleId * 80) % 1200;
                const startY = stage.groundY - 50;
                const py = startY - ((time * speedY + particleId) % 450);
                const size = Math.max(0.5, 4.2 * (py / startY));
                const alpha = Math.max(0.1, py / startY);
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                const swayX = Math.sin(time * 0.002 + i) * 12;
                ctx.arc(px + swayX, py, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        // ⚙️【工業ハザードテーマ：industrial】
        else if (theme === 'industrial') {
            ctx.save();
            const fanX = 650; const fanY = 280; const fanRadius = 150;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'; ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 2.0;
            const rotationAngle = Date.now() * 0.0006;
            ctx.translate(fanX, fanY); ctx.rotate(rotationAngle);
            for (let k = 0; k < 4; k++) {
                ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-35, -fanRadius * 0.5, -45, -fanRadius); ctx.lineTo(45, -fanRadius);
                ctx.quadraticCurveTo(35, -fanRadius * 0.5, 0, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
        // 🌐【電脳電子回路基板：cyber】
        else if (theme === 'cyber') {
            ctx.save();

            const circuitW = 3200;
            const circuitH = 600;

            if (!this.cyberCircuitCache) {
                this.generateCyberCircuit(circuitW, circuitH);
            }

            const circuit = this.cyberCircuitCache;
            // 💥【カメラ連動translateを完全削除して背景固定】

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)'; ctx.lineWidth = 1.0;
            for (let x = 0; x < circuitW; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, circuitH); ctx.stroke();
            }
            for (let y = 0; y < circuitH; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(circuitW, y); ctx.stroke();
            }

            ctx.save();
            ctx.strokeStyle = 'rgba(50, 70, 90, 0.15)';
            circuit.lines.forEach(line => {
                if (line.layer === 1) {
                    ctx.lineWidth = line.thickness === 'power' ? 3.0 : 1.0;
                    line.bundle.forEach(points => {
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let pIdx = 1; pIdx < points.length; pIdx++) {
                            ctx.lineTo(points[pIdx].x, points[pIdx].y);
                        }
                        ctx.stroke();
                    });
                }
            });
            ctx.restore();

            ctx.save();
            circuit.lines.forEach(line => {
                if (line.layer === 0) {
                    ctx.strokeStyle = line.thickness === 'power' ? 'rgba(0, 130, 200, 0.5)' : 'rgba(0, 150, 220, 0.4)';
                    ctx.lineWidth = line.thickness === 'power' ? 2.5 : 1.2;

                    line.bundle.forEach(points => {
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let pIdx = 1; pIdx < points.length; pIdx++) {
                            ctx.lineTo(points[pIdx].x, points[pIdx].y);
                        }
                        ctx.stroke();
                    });
                }
            });
            ctx.restore();

            ctx.save();
            circuit.edgeConnectors.forEach(finger => {
                ctx.fillStyle = 'rgba(0, 150, 200, 0.1)';
                ctx.fillRect(finger.x - 2, finger.y - 5, finger.w + 4, 2);

                const grad = ctx.createLinearGradient(finger.x, finger.y, finger.x + finger.w, finger.y);
                grad.addColorStop(0, 'rgba(200, 150, 0, 0.45)');
                grad.addColorStop(1, 'rgba(120, 90, 0, 0.35)');
                ctx.fillStyle = grad;
                ctx.fillRect(finger.x, finger.y, finger.w, finger.h);
            });
            ctx.restore();

            ctx.save();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.lineWidth = 1.0;
            
            circuit.silks.forEach(silk => {
                if (silk.type === 'gnd_mark') {
                    ctx.beginPath();
                    ctx.moveTo(silk.x - 6, silk.y); ctx.lineTo(silk.x + 6, silk.y);
                    ctx.moveTo(silk.x - 4, silk.y + 3); ctx.lineTo(silk.x + 4, silk.y + 3);
                    ctx.stroke();
                } else if (silk.type === 'board_corner') {
                    ctx.strokeRect(silk.x, silk.y, silk.w, silk.h);
                }
            });
            ctx.restore();

            ctx.save();
            circuit.components.forEach(comp => {
                ctx.fillStyle = 'rgba(120, 140, 150, 0.4)';
                comp.pins.forEach(pin => {
                    ctx.fillRect(pin.x - 1.5, pin.y - 1.5, 3, 3);
                });

                if (comp.type === 'resistor') {
                    ctx.fillStyle = 'rgba(40, 50, 60, 0.8)'; 
                    ctx.fillRect(comp.x + 2, comp.y + 1, comp.w - 4, comp.h - 2);
                } else if (comp.type === 'capacitor') {
                    ctx.fillStyle = 'rgba(141, 110, 99, 0.8)'; 
                    ctx.fillRect(comp.x + 1.5, comp.y, comp.w - 3, comp.h);
                } else if (comp.type === 'transistor') {
                    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
                    ctx.fillRect(comp.x, comp.y, comp.w, comp.h - 3);
                }
            });
            ctx.restore();

            ctx.save();
            circuit.vias.forEach(via => {
                ctx.strokeStyle = 'rgba(180, 130, 20, 0.5)'; ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.arc(via.x, via.y, 2.0, 0, Math.PI * 2);
                ctx.stroke();
            });
            ctx.restore();

            circuit.chips.forEach(chip => {
                ctx.save();

                ctx.fillStyle = 'rgba(120, 140, 150, 0.4)';
                chip.pins.forEach(pin => {
                    if (pin.side === 'top') ctx.fillRect(pin.x - 1, pin.y - 2, 2, 2);
                    if (pin.side === 'bottom') ctx.fillRect(pin.x - 1, pin.y, 2, 2);
                    if (pin.side === 'left') ctx.fillRect(pin.x - 2, pin.y - 1, 2, 2);
                    if (pin.side === 'right') ctx.fillRect(pin.x, pin.y - 1, 2, 2);
                });

                ctx.fillStyle = 'rgba(15, 17, 20, 0.9)'; 
                ctx.strokeStyle = 'rgba(0, 150, 200, 0.5)'; ctx.lineWidth = 1.2;
                drawRoundedRect(ctx, chip.x, chip.y, chip.w, chip.h, 3);
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = 'rgba(0, 150, 200, 0.6)';
                ctx.beginPath();
                ctx.arc(chip.x + 6, chip.y + 6, 1.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(200, 210, 220, 0.5)';
                chip.pins.forEach(pin => {
                    if (pin.side === 'top') ctx.fillRect(pin.x - 0.8, pin.y, 1.6, 1.5);
                    if (pin.side === 'bottom') ctx.fillRect(pin.x - 0.8, pin.y - 1.5, 1.6, 1.5);
                    if (pin.side === 'left') ctx.fillRect(pin.x, pin.y - 0.8, 1.5, 1.6);
                    if (pin.side === 'right') ctx.fillRect(pin.x - 1.5, pin.y - 0.8, 1.5, 1.6);
                });

                ctx.restore();
            });

            ctx.restore();
        }
        // 💎【結晶洞窟テーマ：cave】
        else if (theme === 'cave') {
            ctx.save();
            const time = Date.now();
            // 💥【カメラ連動translateを完全削除】

            ctx.fillStyle = 'rgba(10, 15, 25, 0.4)';
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 2.0;

            for (let i = 0; i < 10; i++) {
                const cx = i * 350;
                ctx.beginPath();
                ctx.moveTo(cx, 250);
                ctx.lineTo(cx + 80, 50 + Math.sin(time * 0.001 + i) * 40);
                ctx.lineTo(cx + 160, 250);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }
        // 🏔️【荒岩壁テーマ：cliff】
        else if (theme === 'cliff') {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 204, 0, 0.015)';
            ctx.lineWidth = 150;
            ctx.beginPath();
            ctx.moveTo(500, -200);
            ctx.lineTo(250, 1500);
            ctx.stroke();
            ctx.restore();
        }
        // 🎰【電脳カジノテーマ：casino】（背景全体演出＆1台ずつストップ対応）
        else if (theme === 'casino') {
            ctx.save();

            // 1. マップ中央のワールド座標（stage.width / 2 = 1000px）を算出
            const mapCenterX = stage ? stage.width / 2 : 1000;
            const mapCenterY = stage ? stage.groundY - 430 : 220;

            // 2. カメラ位置に応じた遠景パララックス（視差）位置計算
            const parallax = 0.35;
            const camCenterX = camera.x + camera.width / 2;
            const camCenterY = camera.y + camera.height / 2;

            const screenCenterX = (ctx.canvas.width / 2) + (mapCenterX - camCenterX) * parallax;
            const screenCenterY = (ctx.canvas.height / 2 - 30) + (mapCenterY - camCenterY) * parallax;

            const slotState = stage.slotState || { spinning: false, spinTimer: 0, reels: ["7", "7", "7"] };
            const time = Date.now();

            // 🌟 3. 背景全体の当選演出（フラッシュ＆巨大スポットライト）の計算
            let bgGridColor = 'rgba(255, 0, 255, 0.05)';
            let bgGlowBlur = 0;
            let bgGlowColor = '#ff00ff';

            if (slotState.flashTimer && slotState.flashTimer > 0) {
                const flashProgress = slotState.flashTimer / 90; // 残り時間（1.0 -> 0.0）
                const pulse = Math.sin(time * 0.02) * 0.3 + 0.7; // 鼓動
                const fColor = slotState.flashColor || '#ffd700';

                bgGridColor = fColor;
                bgGlowBlur = 25 * flashProgress * pulse;
                bgGlowColor = fColor;

                // 巨大ネオンスポットライト（背景の天空から放射状に広がる光線）
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = fColor;
                ctx.globalAlpha = 0.18 * flashProgress * pulse;
                ctx.beginPath();
                ctx.moveTo(screenCenterX, screenCenterY - 40);
                ctx.lineTo(screenCenterX - 900, ctx.canvas.height);
                ctx.lineTo(screenCenterX + 900, ctx.canvas.height);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // 4. マップ中央を中心に広がるサイバーネオン格子（当選時は背景全体が激しく発光！）
            ctx.strokeStyle = bgGridColor;
            ctx.lineWidth = bgGlowBlur > 0 ? 2.5 : 1.5;
            ctx.shadowBlur = bgGlowBlur;
            ctx.shadowColor = bgGlowColor;

            const gridRange = 1500;
            for (let x = screenCenterX - gridRange; x < screenCenterX + gridRange; x += 120) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, ctx.canvas.height);
                ctx.stroke();
            }

            // 5. マップ中央上空に浮かぶ巨大ネオンスロットマシン（3ドラム枠）
            const slotCenterX = screenCenterX;
            const slotCenterY = screenCenterY;

            ctx.fillStyle = 'rgba(15, 5, 25, 0.88)';
            ctx.strokeStyle = bgGlowBlur > 0 ? bgGlowColor : '#ffd700';
            ctx.lineWidth = 3.0;
            ctx.shadowBlur = 20 + bgGlowBlur * 0.5;
            ctx.shadowColor = bgGlowBlur > 0 ? bgGlowColor : '#ff00ff';
            drawRoundedRect(ctx, slotCenterX - 180, slotCenterY - 70, 360, 140, 12);
            ctx.fill();
            ctx.stroke();

            // 6. 全OS共通のASCIIネオン記号定義
            const symbolList = ["7", "BAR", "CHRY", "BOMB"];
            const symbolColors = {
                "7": "#ffd700",    // 黄金
                "BAR": "#00e5ff",  // ネオンシアン
                "CHRY": "#ff007f", // ネオンピンク
                "BOMB": "#ff2200"  // 危険レッド
            };

            ctx.textAlign = 'center';

            // 7. 順番にストップする3ドラムの描画（左 ➔ 中 ➔ 右）
            for (let d = -1; d <= 1; d++) {
                const reelIndex = d + 1; // 0 (左), 1 (中), 2 (右)
                const rx = slotCenterX + d * 105;

                ctx.fillStyle = '#080210';
                ctx.strokeStyle = '#00ffcc';
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 0;
                drawRoundedRect(ctx, rx - 42, slotCenterY - 50, 84, 100, 6);
                ctx.fill();
                ctx.stroke();

                // 時間差ストップ判定（左: 90F以上で回転、中: 45F以上で回転、右: 0F以上で回転）
                const stopThreshold = 90 - reelIndex * 45;
                const isReelSpinning = slotState.spinning && (slotState.spinTimer > stopThreshold);

                let currentSymbol = slotState.reels[reelIndex] || "7";

                if (isReelSpinning) {
                    // 回転中シャッフル
                    const spinIndex = Math.floor((time * 0.038 + reelIndex * 88) % symbolList.length);
                    currentSymbol = symbolList[spinIndex];
                }

                const fontColor = symbolColors[currentSymbol] || "#ffd700";
                ctx.fillStyle = fontColor;
                ctx.shadowBlur = 18;
                ctx.shadowColor = fontColor;

                const fontSize = (currentSymbol.length > 1) ? 32 : 52;
                ctx.font = `900 ${fontSize}px "Impact", sans-serif`;
                ctx.fillText(currentSymbol, rx, slotCenterY + (fontSize === 52 ? 18 : 11));
            }

            ctx.restore();
        }
        // 🏙️【電脳ネオン街テーマ：cyber_street】
        else if (theme === 'cyber_street') {
            ctx.save();

            // 背景のビル影シルエット（完全画面固定）
            ctx.fillStyle = '#060810';
            for (let i = 0; i < 12; i++) {
                const bx = i * 220;
                const bh = 300 + (i % 3) * 80;
                ctx.fillRect(bx, stage.groundY - bh, 180, bh);

                ctx.fillStyle = (i % 2 === 0) ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 0, 85, 0.15)';
                for (let wx = bx + 20; wx < bx + 160; wx += 35) {
                    for (let wy = stage.groundY - bh + 20; wy < stage.groundY - 30; wy += 45) {
                        if ((wx + wy) % 3 === 0) ctx.fillRect(wx, wy, 20, 25);
                    }
                }
                ctx.fillStyle = '#060810';
            }
            ctx.restore();
        }
        // 🏢【高層ビル屋上テーマ：rooftop_city】
        else if (theme === 'rooftop_city') {
            ctx.save();
            const time = Date.now();

            // 夜景の遠景光と満月（画面固定）
            ctx.fillStyle = 'rgba(255, 230, 150, 0.15)';
            ctx.beginPath();
            ctx.arc(800, 120, 70, 0, Math.PI * 2);
            ctx.fill();

            // 空飛ぶクルマ
            ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2.0;
            const carX = (time * 0.3) % 3000;
            ctx.beginPath();
            ctx.moveTo(carX - 80, 180); ctx.lineTo(carX, 180);
            ctx.stroke();

            ctx.restore();
        }
        else if (theme === 'subway_station') {
            ctx.save();
            const time = Date.now();
            const groundY = stage ? stage.groundY : 1520;

            // 1. 🧱 背景の壁面タイルパターン（グリッド状の壁）
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
            ctx.lineWidth = 1.0;
            // 縦タイル線
            for (let x = -((camera.x * 0.2) % 60); x < ctx.canvas.width + 60; x += 60) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke();
            }
            // 横タイル線
            for (let y = 0; y < ctx.canvas.height; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke();
            }

            // 2. 🏛️ 重厚な背景構造柱（一定間隔で配置される大型ピラー）
            ctx.fillStyle = '#080c14';
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
            ctx.lineWidth = 2.0;

            const pillarSpacing = 420;
            const pillarOffset = -((camera.x * 0.3) % pillarSpacing);

            for (let px = pillarOffset - 100; px < ctx.canvas.width + 100; px += pillarSpacing) {
                ctx.fillRect(px, 0, 75, ctx.canvas.height);
                ctx.strokeRect(px, 0, 75, ctx.canvas.height);

                // 柱の中央を走るスリットネオン
                ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
                ctx.fillRect(px + 33, 0, 9, ctx.canvas.height);
                ctx.fillStyle = '#080c14';
            }

            // 3. 💡 天井のサイバーネオン管 ＆ 配線ケーブル
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            ctx.moveTo(0, 35); ctx.lineTo(ctx.canvas.width, 35);
            ctx.moveTo(0, 42); ctx.lineTo(ctx.canvas.width, 42);
            ctx.stroke();

            // 天井の連続ネオン照明（白青の光）
            ctx.shadowBlur = 15; ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#e0ffff';
            for (let lx = -((camera.x * 0.3) % 200); lx < ctx.canvas.width + 200; lx += 200) {
                ctx.fillRect(lx, 25, 110, 6);
            }
            ctx.shadowBlur = 0; // 影リセット

            // 4. 🚉 発光する駅名標・デジタル路線図看板
            const signW = 280;
            const signH = 55;
            const signX = (ctx.canvas.width / 2 - signW / 2) - ((camera.x * 0.15) % 800) + 200;
            const signY = 110;

            ctx.fillStyle = 'rgba(10, 16, 28, 0.92)';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 12; ctx.shadowColor = '#00ffff';
            drawRoundedRect(ctx, signX, signY, signW, signH, 4);
            ctx.fill(); ctx.stroke();

            // 看板テキスト
            ctx.fillStyle = '#00ffff';
            ctx.font = '900 13px "Impact", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("NEXUS SUBWAY - SECTOR 09", signX + signW / 2, signY + 24);

            ctx.fillStyle = '#ffcc00';
            ctx.font = '900 10px sans-serif';
            ctx.fillText("<<< NEXT: CYBER LABYRINTH", signX + signW / 2, signY + 42);
            ctx.shadowBlur = 0;

            // 5. 🚆 疾走するサイバー列車（背景の奥を通り抜ける超高速電車）
            const trainCycle = (time * 0.9) % 3500; // 走行サイクル
            if (trainCycle < 2200) {
                const trainSpeed = 2.2;
                const trainX = (trainCycle * trainSpeed) - 800 - (camera.x * 0.4);
                const trainY = groundY - 260 - camera.y;
                const trainW = 1400;
                const trainH = 110;

                ctx.save();
                // 車体ボディ（ダークメタリック）
                ctx.fillStyle = '#0b1320';
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2.0;
                ctx.shadowBlur = 15; ctx.shadowColor = '#00ffff';

                drawRoundedRect(ctx, trainX, trainY, trainW, trainH, 8);
                ctx.fill(); ctx.stroke();

                // 先頭車両の強力な黄色ヘッドライトビーム
                ctx.fillStyle = '#ffff55';
                ctx.shadowBlur = 30; ctx.shadowColor = '#ffff00';
                ctx.beginPath();
                ctx.arc(trainX + trainW - 15, trainY + trainH / 2, 14, 0, Math.PI * 2);
                ctx.fill();

                // 先頭から放射される光の円錐ビーム
                ctx.globalCompositeOperation = 'lighter';
                const beamGrad = ctx.createLinearGradient(trainX + trainW, trainY, trainX + trainW + 400, trainY);
                beamGrad.addColorStop(0, 'rgba(255, 255, 100, 0.4)');
                beamGrad.addColorStop(1, 'rgba(255, 255, 100, 0)');
                ctx.fillStyle = beamGrad;
                ctx.beginPath();
                ctx.moveTo(trainX + trainW, trainY + trainH / 2 - 10);
                ctx.lineTo(trainX + trainW + 400, trainY - 80);
                ctx.lineTo(trainX + trainW + 400, trainY + trainH + 80);
                ctx.lineTo(trainX + trainW, trainY + trainH / 2 + 10);
                ctx.closePath();
                ctx.fill();

                // 列車の光る窓（連なって流れる暖色の明かり）
                ctx.fillStyle = 'rgba(255, 235, 150, 0.75)';
                ctx.shadowBlur = 10; ctx.shadowColor = '#ffcc00';
                for (let wx = trainX + 40; wx < trainX + trainW - 80; wx += 55) {
                    ctx.fillRect(wx, trainY + 22, 38, 38);
                }

                ctx.restore();
            }

            ctx.restore();
        }
        // 🌀【電脳迷宮テーマ：labyrinth】
        else if (theme === 'labyrinth') {
            ctx.save();

            // 背景のネオンサイバー格子グリッド（画面固定）
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
            ctx.lineWidth = 1.5;
            for (let x = 0; x < 3500; x += 100) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 2000); ctx.stroke();
            }
            for (let y = 0; y < 2000; y += 100) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(3500, y); ctx.stroke();
            }
            ctx.restore();
        }
    },

    // --- 2. 地形（プラットフォーム） of テーマ別装飾描画 ---
// --- 2. 地形（プラットフォーム） of テーマ別装飾描画 ---
    drawPlatforms: function(ctx, stage, camera) {
        if (!stage || !stage.platforms) return;

        const theme = stage.theme || 'default';

        stage.platforms.forEach(plat => {
            if (plat.x + plat.width < camera.x - 150 || plat.x > camera.x + camera.width + 150) return;

            // 🌳【特別優先判定】ハザードで急成長した神木（isSproutedTree）の美麗描画
            if (plat.isSproutedTree) {
                ctx.save();
                
                // 1. 木目調の頑丈な樹幹（幹）
                ctx.fillStyle = '#5c3a21';
                ctx.strokeStyle = '#2d180a';
                ctx.lineWidth = 2.5;
                drawRoundedRect(ctx, plat.x, plat.y + 20, plat.width, plat.height - 20, 4);
                ctx.fill(); ctx.stroke();

                // 2. 幹に走る縦の樹皮・年輪スリット線
                ctx.strokeStyle = '#3d2312'; ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(plat.x + plat.width * 0.3, plat.y + 25);
                ctx.lineTo(plat.x + plat.width * 0.3, plat.y + plat.height - 10);
                ctx.moveTo(plat.x + plat.width * 0.7, plat.y + 35);
                ctx.lineTo(plat.x + plat.width * 0.7, plat.y + plat.height - 5);
                ctx.stroke();

                // 3. 頂上にモコモコと生い茂る大樹の葉っぱ冠（グリーンネオン発光）
                ctx.shadowBlur = 15; ctx.shadowColor = '#39ff14';
                ctx.fillStyle = '#228b22';
                ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 2.0;

                const leafRadius = plat.width * 0.42;
                const topCX = plat.x + plat.width / 2;
                const topCY = plat.y + 10;

                ctx.beginPath();
                ctx.arc(topCX - 15, topCY, leafRadius, 0, Math.PI * 2);
                ctx.arc(topCX + 15, topCY, leafRadius, 0, Math.PI * 2);
                ctx.arc(topCX, topCY - 15, leafRadius * 1.1, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

                ctx.restore();
                return; // 神木の描画を終えたので次の足場へ
            }

            // 🅰️ 【青空アスレチックテーマ：sky_meadow】
            if (theme === 'sky_meadow') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#8b5a2b'; 
                    ctx.strokeStyle = '#3d2511'; ctx.lineWidth = 2.0;
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

                    const grassHeight = 8;
                    ctx.fillStyle = '#228b22';
                    ctx.fillRect(plat.x + 1, plat.y + 1, plat.width - 2, grassHeight);

                    ctx.fillStyle = '#228b22';
                    ctx.beginPath();
                    for (let lx = plat.x + 4; lx < plat.x + plat.width; lx += 12) {
                        ctx.moveTo(lx, plat.y + grassHeight);
                        ctx.lineTo(lx - 4, plat.y + grassHeight + 4);
                        ctx.lineTo(lx - 8, plat.y + grassHeight);
                    }
                    ctx.fill();
                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = '#cd853f';
                    ctx.strokeStyle = '#5c3a21'; ctx.lineWidth = 1.8;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();

                    ctx.strokeStyle = 'rgba(92, 58, 33, 0.35)'; ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(plat.x + 15, plat.y + plat.height / 2);
                    ctx.lineTo(plat.x + plat.width - 15, plat.y + plat.height / 2);
                    ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // 🔥【灼熱の溶岩テーマ：lava】の足場
            else if (theme === 'lava') {
                ctx.save();
                if (plat.type === 'solid') {
                    // 💡 リアル化：岩石の黒とマグマの亀裂が混ざったような高温プレート
                    ctx.fillStyle = '#161618'; 
                    ctx.strokeStyle = '#3e1b0c'; ctx.lineWidth = 3.0;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
                    ctx.fill(); ctx.stroke();

                    // 💡 リアル化：足場の内部に「超高温で明滅するマグマの熱ヒビ脈」を描画
                    const pulse = 0.5 + Math.sin(Date.now() * 0.003) * 0.45;
                    ctx.strokeStyle = `rgba(255, 69, 0, ${pulse})`;
                    ctx.shadowBlur = 15; ctx.shadowColor = '#ff4500';
                    ctx.lineWidth = 1.8;

                    // フラクタル（ジグザグ）な亀裂を上面に走らせる
                    ctx.beginPath();
                    ctx.moveTo(plat.x + 10, plat.y + 15);
                    const segments = 5;
                    for (let s = 1; s <= segments; s++) {
                        const px = plat.x + (plat.width * s / segments) - (s === segments ? 10 : 0);
                        const py = plat.y + 12 + (s % 2 === 0 ? 8 : -8);
                        ctx.lineTo(px, py);
                    }
                    ctx.stroke();

                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = '#1c1c1e';
                    ctx.strokeStyle = '#ff4500'; ctx.lineWidth = 1.0;
                    ctx.shadowBlur = 5; ctx.shadowColor = '#ff4500';
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2);
                    ctx.fill(); ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // ⚙️【工業ハザードテーマ：industrial】
            else if (theme === 'industrial') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#37474f'; 
                    ctx.strokeStyle = '#212121'; ctx.lineWidth = 2.5;
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(plat.x + 1, plat.y + 1, plat.width - 2, 7);
                    ctx.clip();
                    ctx.fillStyle = '#ffd700';
                    ctx.fillRect(plat.x, plat.y, plat.width, 8);
                    ctx.fillStyle = '#212121';
                    for (let lx = plat.x - 10; lx < plat.x + plat.width + 10; lx += 16) {
                        ctx.beginPath(); ctx.moveTo(lx, plat.y); ctx.lineTo(lx + 8, plat.y);
                        ctx.lineTo(lx + 8 - 8, plat.y + 8); ctx.lineTo(lx - 8, plat.y + 8);
                        ctx.closePath(); ctx.fill();
                    }
                    ctx.restore();
                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = 'rgba(55, 71, 79, 0.4)'; 
                    ctx.strokeStyle = '#455a64'; ctx.lineWidth = 1.8;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2);
                    ctx.fill(); ctx.stroke();

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'; ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    for (let lx = plat.x + 6; lx < plat.x + plat.width; lx += 8) {
                        ctx.moveTo(lx, plat.y + 1); ctx.lineTo(lx, plat.y + plat.height - 1);
                    }
                    ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // 🌐【電脳仮想空間テーマ：cyber】
            else if (theme === 'cyber') {
                ctx.save();

                if (plat.type === 'solid') {
                    ctx.fillStyle = '#06070a';
                    ctx.strokeStyle = '#ff0055'; 
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 12; ctx.shadowColor = '#ff0055';
                    
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
                    ctx.fill(); ctx.stroke();

                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = 'rgba(255, 0, 85, 0.22)';
                    ctx.strokeStyle = '#ff0055'; 
                    ctx.lineWidth = 1.8;
                    ctx.shadowBlur = 8; ctx.shadowColor = '#ff0055';
                    
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2.5);
                    ctx.fill(); ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; 
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(plat.x + 6, plat.y + 2);
                    ctx.lineTo(plat.x + plat.width - 6, plat.y + 2);
                    ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }

                ctx.restore();
            }
            // 💎【新設：結晶洞窟テーマ：cave】
            else if (theme === 'cave') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#10141d';
                    ctx.strokeStyle = '#00e5ff';
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#00e5ff';

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
                    ctx.fill();
                    ctx.stroke();
                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = 'rgba(186, 85, 211, 0.28)'; 
                    ctx.strokeStyle = '#ba55d3';
                    ctx.lineWidth = 2.0;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ba55d3';

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill();
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fillRect(plat.x + plat.width / 2 - 20, plat.y + 2, 40, 2);
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // 🏔️【新設：荒岩壁テーマ：cliff】の足場
            else if (theme === 'cliff') {
                ctx.save();
                if (plat.type === 'solid') {
                    // 暗い地殻質感（赤茶）
                    ctx.fillStyle = '#2b221d';
                    ctx.strokeStyle = '#1a100a'; ctx.lineWidth = 3.0;

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 5);
                    ctx.fill();
                    ctx.stroke();

                    // 💡 リアル化：立体的な岩石の「フラクタルなひび割れ溝」を描画
                    ctx.strokeStyle = '#140c06'; // ひび割れの陰（暗部：黒茶）
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    
                    const startX = plat.x + 35;
                    const startY = plat.y + 5;
                    ctx.moveTo(startX, startY);
                    // ジグザグに細かく折れ曲がるパス
                    ctx.lineTo(startX + 15, startY + 12);
                    ctx.lineTo(startX - 8, startY + 28);
                    ctx.lineTo(startX + 22, startY + 42);
                    ctx.lineTo(startX + 5, startY + plat.height - 5);
                    ctx.stroke();

                    // 💡 リアル化：ひび割れエッジの「1px光ハイライト（薄茶）」を並走描画
                    ctx.strokeStyle = '#6d4c41'; // 岩壁に差す光エッジ
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(startX + 1, startY);
                    ctx.lineTo(startX + 16, startY + 12);
                    ctx.lineTo(startX - 7, startY + 28);
                    ctx.lineTo(startX + 23, startY + 42);
                    ctx.lineTo(startX + 6, startY + plat.height - 5);
                    ctx.stroke();

                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = '#5c4a37';
                    ctx.strokeStyle = '#3d2e20';
                    ctx.lineWidth = 1.8;

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            else if (theme === 'casino') {
                ctx.save();
                if (plat.type === 'solid') {
                    // メイン床：ディーラーテーブル（カジノグリーン ＆ 黄金のネオン枠）
                    ctx.fillStyle = '#0a2315';
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 3.0;
                    ctx.shadowBlur = 12; ctx.shadowColor = '#ffd700';

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 6);
                    ctx.fill(); ctx.stroke();
                } else if (plat.type === 'passthrough') {
                    // 空中すり抜け台：ゴールドネオンの透けるガラスプレート
                    ctx.fillStyle = 'rgba(10, 35, 21, 0.75)';
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 2.0;
                    ctx.shadowBlur = 10; ctx.shadowColor = '#ffd700';

                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();

                    // 中央を走るスカイブルーのネオンライン
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = 'rgba(0, 255, 204, 0.6)';
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(plat.x + 10, plat.y + plat.height / 2);
                    ctx.lineTo(plat.x + plat.width - 10, plat.y + plat.height / 2);
                    ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
             else if (theme === 'cyber_street') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#10121a';
                    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 10; ctx.shadowColor = '#00e5ff';
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
                    ctx.fill(); ctx.stroke();
                } else if (plat.type === 'passthrough') {
                    // ネオン看板風すり抜け足場
                    ctx.fillStyle = 'rgba(255, 0, 128, 0.25)';
                    ctx.strokeStyle = '#ff0080'; ctx.lineWidth = 2.0;
                    ctx.shadowBlur = 12; ctx.shadowColor = '#ff0080';
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // 🏢【高層ビル屋上テーマ：rooftop_city】の足場（コンクリート・室外機）
            else if (theme === 'rooftop_city') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#22252a'; // コンクリート灰
                    ctx.strokeStyle = '#444c55'; ctx.lineWidth = 2.5;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();
                } else if (plat.type === 'passthrough') {
                    // スチールキャットウォーク風
                    ctx.fillStyle = '#37474f';
                    ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 1.8;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2);
                    ctx.fill(); ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
            // 🚇【地下鉄テーマ：subway_station】の足場（ホーム・掲示板）
            else if (theme === 'subway_station') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#1c2028';
                    ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2.0; // 警告イエローライン
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();

                    // 足場縁の黄色い点滅ブロック線
                    ctx.fillStyle = '#ffcc00';
                    ctx.fillRect(plat.x, plat.y, plat.width, 4);
                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = 'rgba(0, 229, 255, 0.18)';
                    ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1.5;
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 2);
                    ctx.fill(); ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
             else if (theme === 'labyrinth') {
                ctx.save();
                if (plat.type === 'solid') {
                    ctx.fillStyle = '#0a0d16';
                    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 12; ctx.shadowColor = '#00ffff';
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 4);
                    ctx.fill(); ctx.stroke();
                } else if (plat.type === 'passthrough') {
                    ctx.fillStyle = 'rgba(255, 0, 255, 0.22)';
                    ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 1.8;
                    ctx.shadowBlur = 8; ctx.shadowColor = '#ff00ff';
                    drawRoundedRect(ctx, plat.x, plat.y, plat.width, plat.height, 3);
                    ctx.fill(); ctx.stroke();
                } else {
                    this.drawDefaultPlatform(ctx, plat);
                }
                ctx.restore();
            }
        });
    },

    // --- 3. 未装飾・またはデフォルトの足場を描画するヘルパー ---
    drawDefaultPlatform: function(ctx, plat) {
        ctx.save();
        if (plat.type === 'solid') {
            ctx.fillStyle = '#1e1a1a'; ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.strokeStyle = '#ff2200'; ctx.lineWidth = 3; ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'passthrough') {
            ctx.fillStyle = '#333333'; ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2; ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'conveyor') {
            ctx.fillStyle = '#121212'; ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2.5; ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        }
        ctx.restore();
    }
};

// 補助用の角丸四角形関数
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}