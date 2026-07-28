/* ====================================================
   NEXUS LEGION - AUDIO ENGINE (Web Audio API Synthesizer)
   ==================================================== */

// 1. オーディオシステム用のグローバル変数
let audioCtx = null;
let bgmIntervalId = null; 
let bgmVolumeNode = null;
let seVolumeNode = null;

// 音量初期設定
let volumeSettings = {
    bgm: 0.5,
    se: 0.6
};

// ノイズバッファ（スネア、ハット、電撃、火炎等に使用）
let cachedNoiseBuffer = null;

// 2. オーディオエンジンの初期化
function initAudio() {
    if (audioCtx) return; 

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    // 💡 統合リミッター/コンプレッサーを作成し、歪みを防止
    const masterCompressor = audioCtx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-12, audioCtx.currentTime); // -12dB以上で圧縮開始
    masterCompressor.knee.setValueAtTime(10, audioCtx.currentTime);       // 滑らかな圧縮移行
    masterCompressor.ratio.setValueAtTime(12, audioCtx.currentTime);      // 強めの圧縮で音割れガード
    masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);  // 3msで素早く反応
    masterCompressor.release.setValueAtTime(0.08, audioCtx.currentTime);  // リリース80ms
    masterCompressor.connect(audioCtx.destination);

    bgmVolumeNode = audioCtx.createGain();
    seVolumeNode = audioCtx.createGain();

    // 💡 スピーカー直前ではなく、コンプレッサーを介して出力するようにルーティングを変更
    bgmVolumeNode.connect(masterCompressor);
    seVolumeNode.connect(masterCompressor);

    generateNoiseBuffer();
    updateVolume();
    startPseudoBGM();
}


// ホワイトノイズ生成ヘルパー
function generateNoiseBuffer() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 1.5; // 1.5秒分のホワイトノイズ
    cachedNoiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = cachedNoiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
}

function getNoiseBuffer() {
    if (!cachedNoiseBuffer) generateNoiseBuffer();
    return cachedNoiseBuffer;
}

// 💡 修正：UI要素への直接参照を100%完全排除。
// システム側から通知された音量の割合（0.0 〜 1.0）を引数で受け取り、
// Web Audio APIの音量ノードにダイレクトに反映させる純粋な音量更新関数に一本化します。
function applyVolumeSettings(bgmVol, seVol) {
    volumeSettings.bgm = bgmVol;
    volumeSettings.se = seVol;

    if (bgmVolumeNode && seVolumeNode && audioCtx) {
        // BGM音量（0.15倍）とSE音量（0.3倍）の適正補正値を掛けて適用
        bgmVolumeNode.gain.setTargetAtTime(bgmVol * 0.15, audioCtx.currentTime, 0.1); 
        seVolumeNode.gain.setTargetAtTime(seVol * 0.3, audioCtx.currentTime, 0.05);
    }
}

// 💡 修正：システム・UI制御系の changeTargetFPS() 関数は、このオーディオファイルから完全に削除しました。
//（※システム専門である「nexus_system.js」へお引っ越し配置を完了しています）

// 4. BGMトラックの変更
let currentBGMTrack = 'none_mute';
function changeBGMTrack() {
    const selectEl = document.getElementById('sel-bgm-track');
    if (selectEl) {
        currentBGMTrack = selectEl.value;
        if (bgmIntervalId) {
            startPseudoBGM();
        }
    }
}
// ====================================================
// 5. 擬似BGM自動演奏シーケンサー（トラック個別ブラッシュアップ版）
// ====================================================
function startPseudoBGM() {
    stopPseudoBGM();

    if (currentBGMTrack === 'none_mute') {
        return;
    }

    const musicSections = {
        A: [
            { root: 55.00, pad: [110.00, 130.81, 164.81], melody: [220.00, 261.63, 329.63, 440.00] },
            { root: 43.65, pad: [87.31, 110.00, 130.81], melody: [174.61, 220.00, 261.63, 349.23] },
            { root: 65.41, pad: [130.81, 164.81, 196.00], melody: [261.63, 329.63, 392.00, 523.25] },
            { root: 49.00, pad: [98.00, 123.47, 146.83], melody: [196.00, 246.94, 293.66, 392.00] }
        ],
        B: [
            { root: 41.20, pad: [82.41, 98.00, 123.47], melody: [329.63, 392.00, 493.88, 659.25] },
            { root: 32.70, pad: [65.41, 82.41, 98.00], melody: [261.63, 329.63, 392.00, 523.25] },
            { root: 55.00, pad: [110.00, 130.81, 164.81], melody: [440.00, 523.25, 659.25, 880.00] },
            { root: 61.74, pad: [123.47, 146.83, 185.00], melody: [493.88, 587.33, 739.99, 987.77] }
        ],
        C: [
            { root: 65.41, pad: [130.81, 164.81, 246.94], melody: [523.25, 659.25, 783.99, 987.77] },
            { root: 43.65, pad: [87.31, 130.81, 174.61], melody: [349.23, 523.25, 698.46, 880.00] },
            { root: 49.00, pad: [98.00, 146.83, 196.00], melody: [392.00, 587.33, 783.99, 987.77] },
            { root: 41.20, pad: [82.41, 123.47, 164.81], melody: [329.63, 493.88, 659.25, 783.99] }
        ]
    };

    // 💡 1. トラックごとの個別ダイナミクスパラメータの設定
    let intervalTime = 130;  // ステップ周期（ms）
    let delayTimeVal = 0.26; // 空間残響の遅延時間
    let feedbackVal = 0.35;  // ディレイのフィードバック量

    if (currentBGMTrack === 'track_arena') {
        intervalTime = 105;   // ⚡ 疾走感を出すためにテンポアップ（BPM 143相当）
        delayTimeVal = 0.21;   // タイトな残響にして音のトゲを維持
        feedbackVal = 0.22;
    } else if (currentBGMTrack === 'track_apex') {
        intervalTime = 150;   // 👹 シリアスな重低音重視のハーフテンポ（BPM 100相当）
        delayTimeVal = 0.30;   // ディレイの引きずり感を強くしてダークに
        feedbackVal = 0.48;
    } else if (currentBGMTrack === 'track_flight') {
        intervalTime = 135;   // 🍃 爽やかで広大なチルテンポ（BPM 111相当）
        delayTimeVal = 0.42;   // 非常に長いディレイタイムでリバーブのような浮遊感を構築
        feedbackVal = 0.50;
    }

    let step = 0;

    // A. BGMメインローパスフィルター
    const bgmFilter = audioCtx.createBiquadFilter();
    bgmFilter.type = 'lowpass';
    // Flight（C）時は高音をより優しく、Arena（A）時はやや煌びやかに
    const filterFreq = (currentBGMTrack === 'track_flight') ? 1200 : 1600;
    bgmFilter.frequency.setValueAtTime(filterFreq, audioCtx.currentTime);
    bgmFilter.connect(bgmVolumeNode);

    // B. 疑似空間リバーブ（Feedback Delay）回路の構築（動的パラメータ適用）
    const delayNode = audioCtx.createDelay(1.5);
    const feedbackNode = audioCtx.createGain();
    
    delayNode.delayTime.setValueAtTime(delayTimeVal, audioCtx.currentTime);
    feedbackNode.gain.setValueAtTime(feedbackVal, audioCtx.currentTime);

    // ディレイループ接続
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    feedbackNode.connect(bgmFilter); 

    // 指定テンポでループシーケンスを起動
    bgmIntervalId = setInterval(() => {
        if (!audioCtx || volumeSettings.bgm <= 0) return;

        const now = audioCtx.currentTime;
        let currentSection = musicSections.A;
        let styleMode = "A";

        if (currentBGMTrack === 'track_hybrid') {
            const totalBars = Math.floor(step / 8);
            const sectionCycle = Math.floor(totalBars / 16) % 3;
            if (sectionCycle === 1) {
                currentSection = musicSections.B;
                styleMode = "B";
            } else if (sectionCycle === 2) {
                currentSection = musicSections.C;
                styleMode = "C";
            }
        } else if (currentBGMTrack === 'track_arena') {
            currentSection = musicSections.A;
            styleMode = "A";
        } else if (currentBGMTrack === 'track_apex') {
            currentSection = musicSections.B;
            styleMode = "B";
        } else if (currentBGMTrack === 'track_flight') {
            currentSection = musicSections.C;
            styleMode = "C";
        }

        const chordIndex = Math.floor((step / 8) % currentSection.length);
        const noteIndex = step % 8;
        const chord = currentSection[chordIndex];

        // ==========================================
        // 1. メロディアルペジオ
        // ==========================================
        const oscMelody = audioCtx.createOscillator();
        
        // 💡 2. 音色のブラッシュアップ：スタイルに合った波形を選択
        if (styleMode === "B") {
            oscMelody.type = 'sawtooth'; // 👹 Apex：鋭く重厚なノコギリ波
        } else if (styleMode === "C") {
            oscMelody.type = 'sine';     // 🍃 Flight：クリスタルのような丸いサイン波
        } else {
            oscMelody.type = 'triangle'; // Standard / Arena：タイトな三角波
        }

        const melodyNote = chord.melody[noteIndex % chord.melody.length] *
            ((styleMode === "B" && noteIndex % 2 === 1) ? 1.25 : 1.0);
        oscMelody.frequency.setValueAtTime(melodyNote, now);

        const melodyGain = audioCtx.createGain();
        melodyGain.gain.setValueAtTime(0, now);
        
        const decayTime = styleMode === "C" ? 0.35 : (styleMode === "B" ? 0.15 : 0.18);
        const melodyVolume = styleMode === "C" ? 0.03 : 0.04; // 浮遊感を邪魔しないようにC音量を調整

        melodyGain.gain.linearRampToValueAtTime(melodyVolume, now + 0.008);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

        // 💡 Apex時は少し不協和音を重ねてインダストリアル感を演出
        if (styleMode === "B" && noteIndex % 4 === 0) {
            const subOsc = audioCtx.createOscillator();
            subOsc.type = 'square';
            subOsc.frequency.setValueAtTime(melodyNote * 0.5, now); // 1オクターブ下
            const subGain = audioCtx.createGain();
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(0.015, now + 0.01);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            subOsc.connect(subGain);
            subGain.connect(bgmFilter);
            subOsc.start(now);
            subOsc.stop(now + 0.15);
        }

        oscMelody.connect(melodyGain);
        melodyGain.connect(bgmFilter);
        melodyGain.connect(delayNode); 

        oscMelody.onended = () => {
            oscMelody.disconnect();
            melodyGain.disconnect();
        };

        oscMelody.start(now);
        oscMelody.stop(now + decayTime + 0.02);

        // ==========================================
        // 2. 和音伴奏（パッド）
        // ==========================================
        if (step % 4 === 0) {
            chord.pad.forEach((freq) => {
                const oscPad = audioCtx.createOscillator();
                oscPad.type = 'sine';
                // Apex（B）は暗く、Flight（C）はオクターブを1つ上げて明るく
                const octaveShift = (styleMode === "C") ? 4 : ((styleMode === "B") ? 1.5 : 2);
                oscPad.frequency.setValueAtTime(freq * octaveShift, now);

                const padGain = audioCtx.createGain();
                padGain.gain.setValueAtTime(0, now);
                
                const padVolume = styleMode === "B" ? 0.015 : 0.025; // 緊迫進行ではパッドを薄く
                padGain.gain.linearRampToValueAtTime(padVolume * volumeSettings.bgm, now + 0.06);
                padGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                oscPad.connect(padGain);
                padGain.connect(bgmFilter);
                padGain.connect(delayNode); 
                
                oscPad.start(now);
                oscPad.stop(now + 0.85);
            });
        }

        // ==========================================
        // 3. シンセベース
        // ==========================================
        if (step % 2 === 0) {
            const oscBase = audioCtx.createOscillator();
            
            // 💡 3. スタイルに合ったベース音色
            if (styleMode === "C") {
                oscBase.type = 'triangle'; // 🍃 Flight：お腹に響くまろやかな重低音
            } else if (styleMode === "B") {
                oscBase.type = 'square';   // 👹 Apex：歪んだインダストリアル調
            } else {
                oscBase.type = 'sawtooth'; // Standard / Arena：抜けの良いシンセベース
            }

            const baseFreq = (styleMode === "B" && step % 4 === 2) ? chord.root * 1.33 : chord.root;
            oscBase.frequency.setValueAtTime(baseFreq, now);

            const baseFilter = audioCtx.createBiquadFilter();
            baseFilter.type = 'lowpass';
            
            // 💡 4. アシッド・フィルター・スイープの再現（Arenaのみカットオフ周波数をうねらせる）
            let baseCutoff = 320;
            if (styleMode === "A") {
                baseCutoff = 450 + Math.sin(step * 0.8) * 150; // フィルターの開閉でテクノ感
            } else if (styleMode === "C") {
                baseCutoff = 180; // サブベース専用に重低音カット
            }
            baseFilter.frequency.setValueAtTime(baseCutoff, now);

            const baseGain = audioCtx.createGain();
            baseGain.gain.setValueAtTime(0, now);
            
            const baseVol = styleMode === "C" ? 0.15 : (styleMode === "B" ? 0.10 : 0.12);
            baseGain.gain.linearRampToValueAtTime(baseVol, now + 0.012);
            baseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            oscBase.connect(baseFilter);
            baseFilter.connect(baseGain);
            baseGain.connect(bgmVolumeNode);

            oscBase.onended = () => {
                oscBase.disconnect();
                baseFilter.disconnect();
                baseGain.disconnect();
            };

            oscBase.start(now);
            oscBase.stop(now + 0.25);
        }

        // ==========================================
        // 4. ドラム：キック
        // ==========================================
        const skipKick = (styleMode === "C" && step % 8 === 4) || (styleMode === "B" && step % 4 === 2);
        if (step % 4 === 0 && !skipKick) {
            const oscKick = audioCtx.createOscillator();
            oscKick.type = 'sine';
            oscKick.frequency.setValueAtTime(110, now);
            oscKick.frequency.exponentialRampToValueAtTime(38, now + 0.08); // 38Hzのサブ域まで沈ませる

            const kickGain = audioCtx.createGain();
            kickGain.gain.setValueAtTime(0, now);
            
            const kickVol = styleMode === "C" ? 0.28 : 0.35; // チルはキックを少しマイルドに
            kickGain.gain.linearRampToValueAtTime(kickVol * volumeSettings.bgm, now + 0.005);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            oscKick.connect(kickGain);
            kickGain.connect(bgmVolumeNode);
            oscKick.start(now);
            oscKick.stop(now + 0.12);
        }

        // ==========================================
        // 5. ドラム：リアル・ハイハット
        // ==========================================
        // 💡 5. トラックに合わせたハイハットのクローズ／ハーフオープン特性
        if (step % 2 === 1) {
            const noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = getNoiseBuffer();

            const hatFilter = audioCtx.createBiquadFilter();
            hatFilter.type = 'highpass';
            hatFilter.frequency.setValueAtTime(styleMode === "B" ? 7500 : 9000, now); // ダブステップは荒々しく、テクノは高く

            const hatGain = audioCtx.createGain();
            hatGain.gain.setValueAtTime(0, now);
            
            // Flight（C）は繊細に、Arena（A）は刻みを重視
            const hatVol = styleMode === "C" ? 0.012 : (styleMode === "B" ? 0.025 : 0.02);
            const decay = styleMode === "C" ? 0.025 : 0.035;

            hatGain.gain.linearRampToValueAtTime(hatVol * volumeSettings.bgm, now + 0.002);
            hatGain.gain.exponentialRampToValueAtTime(0.001, now + decay);

            noiseSrc.connect(hatFilter);
            hatFilter.connect(hatGain);
            hatGain.connect(bgmVolumeNode);
            noiseSrc.start(now);
            noiseSrc.stop(now + decay + 0.01);
        }

        // ==========================================
        // 6. ドラム：リアル・スネア
        // ==========================================
        const isSnareBeat = (step % 4 === 2) || (styleMode === "B" && step % 8 === 7);
        if (isSnareBeat) {
            // スネアの胴鳴り（低音成分）
            const oscSnareBody = audioCtx.createOscillator();
            oscSnareBody.type = 'triangle';
            oscSnareBody.frequency.setValueAtTime(180, now);
            oscSnareBody.frequency.linearRampToValueAtTime(80, now + 0.07);

            const snareBodyGain = audioCtx.createGain();
            snareBodyGain.gain.setValueAtTime(0, now);
            
            // チル（C）時はスネアを非常に柔らかく
            const snareBodyVol = styleMode === "C" ? 0.04 : 0.08;
            snareBodyGain.gain.linearRampToValueAtTime(snareBodyVol * volumeSettings.bgm, now + 0.005);
            snareBodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            oscSnareBody.connect(snareBodyGain);
            snareBodyGain.connect(bgmVolumeNode);
            oscSnareBody.start(now);
            oscSnareBody.stop(now + 0.09);

            // スネアのスナッピー（ホワイトノイズ成分）
            const noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = getNoiseBuffer();

            const snareFilter = audioCtx.createBiquadFilter();
            snareFilter.type = 'bandpass';
            snareFilter.frequency.setValueAtTime(styleMode === "C" ? 1500 : 1200, now); 

            const snareNoiseGain = audioCtx.createGain();
            snareNoiseGain.gain.setValueAtTime(0, now);
            
            const snareNoiseVol = styleMode === "C" ? 0.03 : 0.07;
            snareNoiseGain.gain.linearRampToValueAtTime(snareNoiseVol * volumeSettings.bgm, now + 0.004);
            snareNoiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            noiseSrc.connect(snareFilter);
            snareFilter.connect(snareNoiseGain);
            snareNoiseGain.connect(bgmVolumeNode);
            noiseSrc.start(now);
            noiseSrc.stop(now + 0.11);
        }

        step++;
    }, intervalTime); // 💡 トラック個別の動的テンポ（周期ms）を適用
}

function stopPseudoBGM() {
    if (bgmIntervalId) {
        clearInterval(bgmIntervalId);
        bgmIntervalId = null;
    }
}

// 6. 各種SE再生合成器（システム標準）
function playSoundSE(type) {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const now = audioCtx.currentTime;
    const seGain = audioCtx.createGain();

    // 💡 正しい直列ルーティングに修正（オシレーター → 個別ゲイン → マスターSE音量）
    osc.connect(seGain);
    seGain.connect(seVolumeNode);

    // 💡 クリーンアップを一元化
    osc.onended = () => {
        osc.disconnect();
        seGain.disconnect();
    };

    if (type === 'click') {
        // 🫧 修正：耳に刺さらない、丸く跳ねる「ぴょこっ」としたバブルサウンドに再設計
        osc.type = 'sine'; // 倍音のない最も丸い波形を使用し、金属音を100%カット
        osc.frequency.setValueAtTime(320, now); // 低めの柔らかい中音からスタート（320Hz）
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.07); // 緩やかに周波数を上げて「ぷょっ」とした質感を演出

        seGain.gain.setValueAtTime(0, now);
        seGain.gain.linearRampToValueAtTime(0.15, now + 0.006); // 立ち上がりを6msにして、アタックの「カチッ」とした角を削る
        seGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // なだらかに音量をフェードアウト

        osc.start(now);
        osc.stop(now + 0.09); // 全体の長さを少しだけ伸ばして、耳なじみの良い余韻に
    } else if (type === 'hit') {
        // 簡易的な衝突音：ピッチを高速下降させ、太さと打撃力を強化
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

        seGain.gain.setValueAtTime(0, now);
        seGain.gain.linearRampToValueAtTime(0.45, now + 0.002);
        seGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.11);
    } else if (type === 'jump') {
        // ✨ ふんわりと浮遊感がある、耳障りの良いレトロポップな跳躍音に
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

        seGain.gain.setValueAtTime(0, now);
        seGain.gain.linearRampToValueAtTime(0.25, now + 0.006); // 滑らかな立ち上がり
        seGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.13);
    }

}
// ====================================================
// 💡 【属性音響システムの極限オーバーホール】
// ====================================================

// ⚡ 1. 超帯電・電撃放電SE（バチバチバチッ！！！と耳を貫く鋭い3連多重放電）
function playLightningSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // 高速放電の3連スパーク
    for (let i = 0; i < 3; i++) {
        const time = now + (i * 0.035);
        const osc = audioCtx.createOscillator();
        osc.type = 'square'; // 最も鋭い高周波を含む矩形波を使用
        osc.frequency.setValueAtTime(2600 + Math.random() * 600, time);
        osc.frequency.exponentialRampToValueAtTime(350, time + 0.035);

        // バンドパスを極限まで鋭く設定（Q: 6.5）し、放電の「バチッ」としたノイズを極大化
        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(3200, time);
        bpf.Q.setValueAtTime(6.5, time);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.28 * volumeSettings.se, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(bpf);
        bpf.connect(gain);
        gain.connect(seVolumeNode);

        const triggerTime = time;
        osc.onended = () => {
            osc.disconnect();
            bpf.disconnect();
            gain.disconnect();
        };

        osc.start(triggerTime);
        osc.stop(triggerTime + 0.045);
    }
}

// 🔥 2. 超爆風・火炎大爆発SE（ゴォォォッ！！！と深く炸裂して燃え広がる炎の圧力）
function playFireSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // A. 爆風の地響き（Sawtooth ➔ 低域スライド）
    const oscBody = audioCtx.createOscillator();
    oscBody.type = 'sawtooth';
    oscBody.frequency.setValueAtTime(160, now);
    oscBody.frequency.exponentialRampToValueAtTime(25, now + 0.25); // ウーファーが揺れる 25Hz へ急降下

    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(140, now); // 重低音だけを通過

    const gainBody = audioCtx.createGain();
    gainBody.gain.setValueAtTime(0, now);
    gainBody.gain.linearRampToValueAtTime(0.65 * volumeSettings.se, now + 0.01);
    gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    oscBody.connect(lpf);
    lpf.connect(gainBody);
    gainBody.connect(seVolumeNode);

    // B. ボォッ！と点火して燃え上がるノイズ層
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const lpfNoise = audioCtx.createBiquadFilter();
    lpfNoise.type = 'lowpass';
    lpfNoise.frequency.setValueAtTime(350, now);

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.48 * volumeSettings.se, now + 0.02);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    noiseSrc.connect(lpfNoise);
    lpfNoise.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    // クリーンアップ
    const cleanup = () => {
        oscBody.disconnect();
        lpf.disconnect();
        gainBody.disconnect();
        noiseSrc.disconnect();
        lpfNoise.disconnect();
        gainNoise.disconnect();
    };

    noiseSrc.onended = cleanup;

    oscBody.start(now);
    noiseSrc.start(now);

    oscBody.stop(now + 0.29);
    noiseSrc.stop(now + 0.33);
}

// ❄️ 3. 超結晶・氷結凍結SE（ピキィィィーーン！！！というガラスが砕けて凍りつく硬質な冷気）
function playFreezeSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // A. 氷のひび割れ結晶音（不協和金属高音：3200Hz ➔ 4500Hz上昇スイープ）
    const oscIce = audioCtx.createOscillator();
    oscIce.type = 'triangle';
    oscIce.frequency.setValueAtTime(2400, now);
    oscIce.frequency.exponentialRampToValueAtTime(4500, now + 0.18);

    const hpf = audioCtx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.setValueAtTime(1800, now);

    const gainIce = audioCtx.createGain();
    gainIce.gain.setValueAtTime(0, now);
    gainIce.gain.linearRampToValueAtTime(0.45 * volumeSettings.se, now + 0.004);
    gainIce.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    oscIce.connect(hpf);
    hpf.connect(gainIce);
    gainIce.connect(seVolumeNode);

    // B. キィィンと耳の奥に冷気が残る高周波ノイズ層
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const bpfNoise = audioCtx.createBiquadFilter();
    bpfNoise.type = 'bandpass';
    bpfNoise.frequency.setValueAtTime(4000, now);
    bpfNoise.Q.setValueAtTime(5.0, now); // 非常に鋭くノイズを冷気化

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.18 * volumeSettings.se, now + 0.01);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    noiseSrc.connect(bpfNoise);
    bpfNoise.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    // クリーンアップ
    const cleanup = () => {
        oscIce.disconnect();
        hpf.disconnect();
        gainIce.disconnect();
        noiseSrc.disconnect();
        bpfNoise.disconnect();
        gainNoise.disconnect();
    };

    noiseSrc.onended = cleanup;

    oscIce.start(now);
    noiseSrc.start(now);

    oscIce.stop(now + 0.39);
    noiseSrc.stop(now + 0.43);
}

// 💥 4. 【新規新設】：極限破砕メテオスマッシュSE（空間が割れる高音 ➔ 奈落への高速叩き落とし超重低音）
function playMeteorHitSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // A. 空間がピキィン！と引き裂かれる高音アタック層
    const oscCrack = audioCtx.createOscillator();
    oscCrack.type = 'sawtooth';
    oscCrack.frequency.setValueAtTime(1500, now);
    oscCrack.frequency.linearRampToValueAtTime(3200, now + 0.04);
    oscCrack.frequency.exponentialRampToValueAtTime(220, now + 0.28);

    const bpfCrack = audioCtx.createBiquadFilter();
    bpfCrack.type = 'bandpass';
    bpfCrack.frequency.setValueAtTime(1600, now);
    bpfCrack.Q.setValueAtTime(3.0, now);

    const gainCrack = audioCtx.createGain();
    gainCrack.gain.setValueAtTime(0, now);
    gainCrack.gain.linearRampToValueAtTime(0.48 * volumeSettings.se, now + 0.003);
    gainCrack.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    oscCrack.connect(bpfCrack);
    bpfCrack.connect(gainCrack);
    gainCrack.connect(seVolumeNode);

    // B. ドゴォォォン！！！と真下に叩き落とす急降下サブベース（180Hz ➔ 20Hz急スライド）
    const oscDrop = audioCtx.createOscillator();
    oscDrop.type = 'triangle';
    oscDrop.frequency.setValueAtTime(180, now);
    oscDrop.frequency.exponentialRampToValueAtTime(20, now + 0.35); // 奈落の底へ引き摺り込む超低域

    const lpfDrop = audioCtx.createBiquadFilter();
    lpfDrop.type = 'lowpass';
    lpfDrop.frequency.setValueAtTime(160, now);

    const gainDrop = audioCtx.createGain();
    gainDrop.gain.setValueAtTime(0, now);
    gainDrop.gain.linearRampToValueAtTime(1.25 * volumeSettings.se, now + 0.008); // 強烈なウーファー空気震動
    gainDrop.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    oscDrop.connect(lpfDrop);
    lpfDrop.connect(gainDrop);
    gainDrop.connect(seVolumeNode);

    // C. ザバシャァァーーン！と激しく破砕して弾け飛ぶアタックノイズ
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const sweepFilter = audioCtx.createBiquadFilter();
    sweepFilter.type = 'bandpass';
    sweepFilter.frequency.setValueAtTime(800, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(120, now + 0.2);

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.55 * volumeSettings.se, now + 0.005);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noiseSrc.connect(sweepFilter);
    sweepFilter.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    // クリーンアップ
    const cleanup = () => {
        oscCrack.disconnect();
        bpfCrack.disconnect();
        gainCrack.disconnect();
        oscDrop.disconnect();
        lpfDrop.disconnect();
        gainDrop.disconnect();
        noiseSrc.disconnect();
        sweepFilter.disconnect();
        gainNoise.disconnect();
    };

    noiseSrc.onended = cleanup;

    oscCrack.start(now);
    oscDrop.start(now);
    noiseSrc.start(now);

    oscCrack.stop(now + 0.31);
    oscDrop.stop(now + 0.39);
    noiseSrc.stop(now + 0.36);
}


// 🖋️ インクペイントSE（ペチャッ、バシャッという液状水分衝突音）
function playPaintSE() {
    if (!audioCtx) initAudio();
    // 💡 判定条件の論理エラーを修正 (audioCtx のチェックを適正化)
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    // 💡 未使用変数の大掃除およびローカル定数の宣言（strictモード/ES6準拠化）
    const oscSlap = audioCtx.createOscillator();
    oscSlap.type = 'sine';
    oscSlap.frequency.setValueAtTime(450, now);
    oscSlap.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    const gainSlap = audioCtx.createGain();
    gainSlap.gain.setValueAtTime(0, now);
    const gainGain = 0.55 * volumeSettings.se;
    gainSlap.gain.linearRampToValueAtTime(gainGain, now + 0.005);
    const gainTail = 0.001;
    gainSlap.gain.exponentialRampToValueAtTime(gainTail, now + 0.14);

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(650, now);

    oscSlap.connect(lowpass);
    lowpass.connect(gainSlap);
    gainSlap.connect(seVolumeNode);

    const oscSlare = audioCtx.createOscillator();
    oscSlare.type = 'triangle';
    oscSlare.frequency.setValueAtTime(90, now);
    oscSlare.frequency.linearRampToValueAtTime(30, now + 0.16);

    const gainLobe = audioCtx.createGain();
    const gainLamp = 0.35 * volumeSettings.se;
    gainLobe.gain.setValueAtTime(0, now);
    gainLobe.gain.linearRampToValueAtTime(gainLamp, now + 0.005);
    gainLobe.gain.exponentialRampToValueAtTime(gainTail, now + 0.18);

    oscSlare.connect(gainLobe);
    gainLobe.connect(seVolumeNode);

    // 💡 修正：終了カウンタを1つにまとめ、2つの音が両方消えたら一括で接続を切断（クリーンアップ）します
    let endCount = 0;

    function cleanup() {
        oscSlap.disconnect();
        oscSlare.disconnect();
        lowpass.disconnect();
        gainSlap.disconnect();
        gainLobe.disconnect();
    }

    const checkCleanup = () => {
        endCount++;
        if (endCount === 2) {
            cleanup();
        }
    };

    // 💡 両方のオシレーターの終了イベントに同じ監視関数を登録します
    oscSlap.onended = checkCleanup;
    oscSlare.onended = checkCleanup;

    oscSlap.start(now);
    oscSlap.stop(now + 0.15);

    oscSlare.start(now);
    oscSlare.stop(now + 0.18);
}

// ⚔️ 鋭い金属斬撃・シャキィィンSE（キレのあるバンドパス高速スイープ）
function playSwordSlashSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);

    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1800, now);
    bpf.frequency.exponentialRampToValueAtTime(450, now + 0.15);
    bpf.Q.setValueAtTime(3.5, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35 * volumeSettings.se, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(bpf);
    bpf.connect(gain);
    gain.connect(seVolumeNode);

    osc.start(now);
    osc.stop(now + 0.18);
}
// 🌀【リファイン】：リアル暴風・風切り真空SE（ノイズ気流とうねり低音の2レイヤー合成）
function playWindStormSE() {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    // ==========================================
    // レイヤー1: 暴風気流ノイズ（シューーッ！という空気の激しい摩擦音）
    // ==========================================
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    // バンドパスフィルターで摩擦の「芯」を取り出し、高さをうねらせて風を表現
    const bpfNoise = audioCtx.createBiquadFilter();
    bpfNoise.type = 'bandpass';
    bpfNoise.frequency.setValueAtTime(350, now); // 低い風鳴りからスタート
    bpfNoise.frequency.exponentialRampToValueAtTime(1400, now + 0.15); // ピーク時に高音の突風に
    bpfNoise.frequency.exponentialRampToValueAtTime(450, now + 0.4); // 静かに収束
    bpfNoise.Q.setValueAtTime(2.5, now); // 少し金属感を含んだ鋭い風切り

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.48 * volumeSettings.se, now + 0.06); // 突発的に巻き起こるアタック
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noiseSrc.connect(bpfNoise);
    bpfNoise.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    // ==========================================
    // レイヤー2: 突風の圧力波（ゴォォン！という重低音の空気圧）
    // ==========================================
    const oscWind = audioCtx.createOscillator();
    oscWind.type = 'triangle'; // 角の取れた低音に適した三角波を使用
    oscWind.frequency.setValueAtTime(160, now); // 160Hz
    oscWind.frequency.exponentialRampToValueAtTime(55, now + 0.35); // 55Hz（ウーファーが震える低域へスライド）

    const lpfWind = audioCtx.createBiquadFilter();
    lpfWind.type = 'lowpass';
    lpfWind.frequency.setValueAtTime(180, now); // 不要な高域をカットして「ゴーッ」という重低音に絞る

    const gainWind = audioCtx.createGain();
    gainWind.gain.setValueAtTime(0, now);
    gainWind.gain.linearRampToValueAtTime(0.42 * volumeSettings.se, now + 0.04);
    gainWind.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    oscWind.connect(lpfWind);
    lpfWind.connect(gainWind);
    gainWind.connect(seVolumeNode);

    // ==========================================
    // ライフサイクル管理（クリーンアップ）
    // ==========================================
    const cleanup = () => {
        noiseSrc.disconnect();
        bpfNoise.disconnect();
        gainNoise.disconnect();
        oscWind.disconnect();
        lpfWind.disconnect();
        gainWind.disconnect();
    };

    // 最長のノイズソース終了時にリソースを一括解放
    noiseSrc.onended = cleanup;

    // 同期スタート
    noiseSrc.start(now);
    oscWind.start(now);

    noiseSrc.stop(now + 0.46);
    oscWind.stop(now + 0.45);
}
// 🧲 重力吸引・ブラックホール電子音（吸い込まれるような逆再生風SE）
function playBlackholeSuctionSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    // 低音から高域に向けてじわじわと周波数が加速スイープ
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.4);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.38 * volumeSettings.se, now + 0.15); // 盛り上がりの逆スイープ
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(seVolumeNode);

    osc.start(now);
    osc.stop(now + 0.5);
}

// ====================================================
// ====================================================

function playBuriedSE() {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    const oscMud = audioCtx.createOscillator();
    oscMud.type = 'triangle';
    oscMud.frequency.setValueAtTime(110, now);
    oscMud.frequency.linearRampToValueAtTime(30, now + 0.18);

    const gainMud = audioCtx.createGain();
    gainMud.gain.setValueAtTime(0, now);
    gainMud.gain.linearRampToValueAtTime(0.7 * volumeSettings.se, now + 0.005);
    gainMud.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    oscMud.connect(gainMud);
    gainMud.connect(seVolumeNode);
    oscMud.start(now);
    oscMud.stop(now + 0.25);

    const oscCrack = audioCtx.createOscillator();
    oscCrack.type = 'sawtooth';
    oscCrack.frequency.setValueAtTime(350, now);
    oscCrack.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(420, now);

    const gainCrack = audioCtx.createGain();
    gainCrack.gain.setValueAtTime(0, now);
    gainCrack.gain.linearRampToValueAtTime(0.35 * volumeSettings.se, now + 0.005);
    gainCrack.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    oscCrack.connect(bpf);
    bpf.connect(gainCrack);
    gainCrack.connect(seVolumeNode);
    oscCrack.start(now);
    oscCrack.stop(now + 0.18);
}

function playApplauseSE() {
    // 💡 自動初期化とサスペンド状態の復帰ガードを明示的に整備
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    for (let i = 0; i < 45; i++) {
        const triggerTime = now + (i * 0.035) + Math.random() * 0.03;

        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100 + Math.random() * 900, triggerTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, triggerTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, triggerTime);
        gain.gain.linearRampToValueAtTime(0.09 * volumeSettings.se, triggerTime + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(seVolumeNode);

        // 💡 各ループで生成される全ての動的ノードを再生後に確実に解放
        osc.onended = () => {
            osc.disconnect();
            filter.disconnect();
            gain.disconnect();
        };

        osc.start(triggerTime);
        osc.stop(triggerTime + 0.04);
    }
}
function playPachinkoJackpotSE() {
    // 💡 自動初期化およびサスペンド保護ガードを追加
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    for (let i = 0; i < 6; i++) {
        const triggerTime = now + (i * 0.12);

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, triggerTime);
        osc.frequency.exponentialRampToValueAtTime(2600, triggerTime + 0.08);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, triggerTime);
        gain.gain.linearRampToValueAtTime(0.3 * volumeSettings.se, triggerTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.11);

        osc.connect(gain);
        gain.connect(seVolumeNode);

        // 💡 終了時解放
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };

        osc.start(triggerTime);
        osc.stop(triggerTime + 0.12);
    }

    for (let i = 0; i < 11; i++) {
        const triggerTime = now + 0.72 + (i * 0.06);

        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800 + (i % 2 === 0 ? 350 : 0), triggerTime);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, triggerTime);
        gain.gain.linearRampToValueAtTime(0.12 * volumeSettings.se, triggerTime + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 0.055);

        osc.connect(gain);
        gain.connect(seVolumeNode);

        // 💡 終了時解放
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };

        osc.start(triggerTime);
        osc.stop(triggerTime + 0.06);
    }
}

// 💡 修正：物理衝突の強さに合わせて、通常打撃(ボコッ！)と強烈スマッシュ打撃(ドゴォォォン！)を脳汁仕様に肉厚強化
function playHitSoundSE(kbForce) {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    if (kbForce >= 11.5) {
        // ==========================================
        // 💥 【強烈スマッシュ重打撃】：骨を砕く破砕アタックと、ウーファーを揺らす重低音
        // ==========================================
        
        // A. 重打撃の核（Sawtoothデチューンによる歪み金属音）
        const oscTreble1 = audioCtx.createOscillator();
        oscTreble1.type = 'sawtooth';
        oscTreble1.frequency.setValueAtTime(450, now);
        oscTreble1.frequency.exponentialRampToValueAtTime(45, now + 0.22);

        const oscTreble2 = audioCtx.createOscillator();
        oscTreble2.type = 'square'; // 矩形波をまぜて「バリバキッ！」という破砕感を強調
        oscTreble2.frequency.setValueAtTime(440, now);
        oscTreble2.frequency.exponentialRampToValueAtTime(42, now + 0.22);

        const bpfTreble = audioCtx.createBiquadFilter();
        bpfTreble.type = 'bandpass';
        bpfTreble.frequency.setValueAtTime(650, now);
        bpfTreble.Q.setValueAtTime(1.8, now);

        const gainTreble = audioCtx.createGain();
        gainTreble.gain.setValueAtTime(0, now);
        gainTreble.gain.linearRampToValueAtTime(0.68 * volumeSettings.se, now + 0.004); // 非常に鋭いアタック立ち上がり
        gainTreble.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        oscTreble1.connect(bpfTreble);
        oscTreble2.connect(bpfTreble);
        bpfTreble.connect(gainTreble);
        gainTreble.connect(seVolumeNode);

        // B. 地響きサブベース（ドーーーーーン！！！）
        const oscBass = audioCtx.createOscillator();
        oscBass.type = 'sine';
        oscBass.frequency.setValueAtTime(95, now);
        oscBass.frequency.exponentialRampToValueAtTime(25, now + 0.28); // ウーファーが震える超低域へスライド

        const gainBass = audioCtx.createGain();
        gainBass.gain.setValueAtTime(0, now);
        gainBass.gain.linearRampToValueAtTime(1.15 * volumeSettings.se, now + 0.008); // 低音圧力を極限まで高める
        gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.32); // 長めのディケイ

        oscBass.connect(gainBass);
        gainBass.connect(seVolumeNode);

        // C. ホワイトノイズによる爆風クラッシュ層（バシャァァーン！）
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const lpfNoise = audioCtx.createBiquadFilter();
        lpfNoise.type = 'lowpass';
        lpfNoise.frequency.setValueAtTime(550, now);

        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0, now);
        gainNoise.gain.linearRampToValueAtTime(0.48 * volumeSettings.se, now + 0.012);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        noiseSrc.connect(lpfNoise);
        lpfNoise.connect(gainNoise);
        gainNoise.connect(seVolumeNode);

        // スタート
        oscTreble1.start(now);
        oscTreble2.start(now);
        oscBass.start(now);
        noiseSrc.start(now);

        oscTreble1.stop(now + 0.26);
        oscTreble2.stop(now + 0.26);
        oscBass.stop(now + 0.33);
        noiseSrc.stop(now + 0.28);

    } else {
        // ==========================================
        // ✨ 【通常被弾ヒット】：ドスッ！とめり込み、肉厚で重みのある打撃
        // ==========================================
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now); 
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08); // 僅か80msで45Hzへ超高速急降下（アタックを鋭く！）

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.55 * volumeSettings.se, now + 0.003); // めり込み感を出す極短アタック
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

        osc.connect(gain);
        gain.connect(seVolumeNode);

        // ドシャッ！という肉厚な摩擦ノイズをレイヤー
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const bpfNoise = audioCtx.createBiquadFilter();
        bpfNoise.type = 'bandpass';
        bpfNoise.frequency.setValueAtTime(750, now); // 心地よい打撃摩擦
        bpfNoise.Q.setValueAtTime(1.8, now);

        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0, now);
        gainNoise.gain.linearRampToValueAtTime(0.28 * volumeSettings.se, now + 0.003);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // 50msの超高速減衰

        noiseSrc.connect(bpfNoise);
        bpfNoise.connect(gainNoise);
        gainNoise.connect(seVolumeNode);

        // クリーンアップ
        const cleanup = () => {
            osc.disconnect();
            gain.disconnect();
            noiseSrc.disconnect();
            bpfNoise.disconnect();
            gainNoise.disconnect();
        };

        noiseSrc.onended = cleanup;

        osc.start(now);
        noiseSrc.start(now);

        osc.stop(now + 0.09);
        noiseSrc.stop(now + 0.06);
    }
}

function playLethalSlowSE() {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (!audioCtx || volumeSettings.se <= 0) return;

    const now = audioCtx.currentTime;

    const oscHeart1 = audioCtx.createOscillator();
    oscHeart1.type = 'sine';
    oscHeart1.frequency.setValueAtTime(65, now);
    oscHeart1.frequency.linearRampToValueAtTime(30, now + 0.12);

    const gainHeart1 = audioCtx.createGain();
    gainHeart1.gain.setValueAtTime(0, now);
    gainHeart1.gain.linearRampToValueAtTime(0.75 * volumeSettings.se, now + 0.005);
    gainHeart1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscHeart1.connect(gainHeart1);
    gainHeart1.connect(seVolumeNode);
    oscHeart1.start(now);
    oscHeart1.stop(now + 0.16);

    const oscHeart2 = audioCtx.createOscillator();
    oscHeart2.type = 'sine';
    oscHeart2.frequency.setValueAtTime(55, now + 0.16);
    oscHeart2.frequency.linearRampToValueAtTime(25, now + 0.32);

    const gainHeart2 = audioCtx.createGain();
    gainHeart2.gain.setValueAtTime(0, now + 0.16);
    gainHeart2.gain.linearRampToValueAtTime(0.65 * volumeSettings.se, now + 0.165);
    gainHeart2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    oscHeart2.connect(gainHeart2);
    gainHeart2.connect(seVolumeNode);
    oscHeart2.start(now + 0.16);
    oscHeart2.stop(now + 0.36);

    const oscWarp = audioCtx.createOscillator();
    oscWarp.type = 'sine';
    oscWarp.frequency.setValueAtTime(1600, now);
    oscWarp.frequency.exponentialRampToValueAtTime(300, now + 1.2);

    const filterWarp = audioCtx.createBiquadFilter();
    filterWarp.type = 'bandpass';
    filterWarp.frequency.setValueAtTime(1200, now);

    const gainWarp = audioCtx.createGain();
    gainWarp.gain.setValueAtTime(0, now);
    gainWarp.gain.linearRampToValueAtTime(0.28 * volumeSettings.se, now + 0.05);
    gainWarp.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    oscWarp.connect(filterWarp);
    filterWarp.connect(gainWarp);
    gainWarp.connect(seVolumeNode);
    oscWarp.start(now);
    oscWarp.stop(now + 1.4);

    const oscBoom = audioCtx.createOscillator();
    oscBoom.type = 'triangle';
    oscBoom.frequency.setValueAtTime(90, now);
    oscBoom.frequency.linearRampToValueAtTime(10, now + 1.0);

    const gainBoom = audioCtx.createGain();
    gainBoom.gain.setValueAtTime(0, now);
    gainBoom.gain.linearRampToValueAtTime(0.42 * volumeSettings.se, now + 0.01);
    gainBoom.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    oscBoom.connect(gainBoom);
    gainBoom.connect(seVolumeNode);
    oscBoom.start(now);
    oscBoom.stop(now + 1.15);
}

// 💥【スマブラ風・極限強化版】：撃墜（KO）大爆発シンセサイザー
function playBurstKOSoundSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    
    // コンテキストが一時停止している場合は復帰
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;

    // ==========================================
    // レイヤー1: 【一閃キーン音（高域・金属破砕アタック）】
    // 瞬間的に 6000Hz まで跳ね上がる鋭い金属音で「打撃が抜けた」質感を表現
    // ==========================================
    const oscHighA = audioCtx.createOscillator();
    const oscHighB = audioCtx.createOscillator();
    oscHighA.type = 'sawtooth';
    oscHighB.type = 'square'; // 矩形波をデチューンして厚みを追加

    // ピッチスウィープ (一瞬で急上昇してから下降)
    oscHighA.frequency.setValueAtTime(1800, now);
    oscHighA.frequency.linearRampToValueAtTime(6200, now + 0.03);
    oscHighA.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    oscHighB.frequency.setValueAtTime(1750, now); // わずかにピッチをズラす
    oscHighB.frequency.linearRampToValueAtTime(6100, now + 0.03);
    oscHighB.frequency.exponentialRampToValueAtTime(115, now + 0.35);

    // バンドパスフィルターで金属的な「キィィン」というレゾナンス（Q値）を強調
    const bpfHigh = audioCtx.createBiquadFilter();
    bpfHigh.type = 'bandpass';
    bpfHigh.frequency.setValueAtTime(3200, now);
    bpfHigh.frequency.exponentialRampToValueAtTime(500, now + 0.35);
    bpfHigh.Q.setValueAtTime(5.5, now);

    const gainHigh = audioCtx.createGain();
    gainHigh.gain.setValueAtTime(0, now);
    gainHigh.gain.linearRampToValueAtTime(0.7 * volumeSettings.se, now + 0.004);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    oscHighA.connect(bpfHigh);
    oscHighB.connect(bpfHigh);
    bpfHigh.connect(gainHigh);
    gainHigh.connect(seVolumeNode);

    oscHighA.start(now);
    oscHighB.start(now);
    oscHighA.stop(now + 0.4);
    oscHighB.stop(now + 0.4);

    // ==========================================
    // レイヤー2: 【爆風ノイズ（ドバシャァァン！）】
    // カットオフ周波数を急降下させ、爆発の「広がり」と「勢い」を作る
    // ==========================================
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(5500, now); // 高音の破裂からスタート
    noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.3); // 一瞬で重低音へ落ちる

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.6 * volumeSettings.se, now + 0.008);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    noiseSrc.start(now);
    noiseSrc.stop(now + 0.68);

    // ==========================================
    // レイヤー3: 【超低域・重地響きサブベース（ドゥゥゥゥン！）】
    // スマブラ特有の「お腹に響く重量感」。160Hz -> 28Hz へスライド
    // ==========================================
    const oscSub = audioCtx.createOscillator();
    oscSub.type = 'sine'; // 歪みのない純粋なサイン波でウーファーを揺らす
    oscSub.frequency.setValueAtTime(160, now);
    oscSub.frequency.exponentialRampToValueAtTime(28, now + 0.7);

    const gainSub = audioCtx.createGain();
    gainSub.gain.setValueAtTime(0, now);
    gainSub.gain.linearRampToValueAtTime(1.4 * volumeSettings.se, now + 0.01); // 強力な低音アタック
    gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    oscSub.connect(gainSub);
    gainSub.connect(seVolumeNode);

    oscSub.start(now);
    oscSub.stop(now + 0.88);

    // ==========================================
    // レイヤー4: 【時間差フィニッシュ・余韻（0.04秒遅れて鳴る追撃インパクト）】
    // 打撃の直後にワンテンポ遅れて「空間が歪む」ような追撃効果を追加
    // ==========================================
    const delayTime = now + 0.04;
    const oscTail = audioCtx.createOscillator();
    oscTail.type = 'triangle';
    oscTail.frequency.setValueAtTime(220, delayTime);
    oscTail.frequency.exponentialRampToValueAtTime(35, delayTime + 0.25);

    const gainTail = audioCtx.createGain();
    gainTail.gain.setValueAtTime(0, delayTime);
    gainTail.gain.linearRampToValueAtTime(0.5 * volumeSettings.se, delayTime + 0.005);
    gainTail.gain.exponentialRampToValueAtTime(0.001, delayTime + 0.3);

    oscTail.connect(gainTail);
    gainTail.connect(seVolumeNode);

    oscTail.start(delayTime);
    oscTail.stop(delayTime + 0.32);

    // ==========================================
    // クリーンアップ
    // ==========================================
    oscSub.onended = () => {
        oscHighA.disconnect();
        oscHighB.disconnect();
        bpfHigh.disconnect();
        gainHigh.disconnect();
        noiseSrc.disconnect();
        noiseFilter.disconnect();
        gainNoise.disconnect();
        oscSub.disconnect();
        gainSub.disconnect();
        oscTail.disconnect();
        gainTail.disconnect();
    };
}
// コンテキストが一時停止（suspended）していても確実に復帰を待ってから再生する安全ラッパー
function safePlay(callback) {
    if (volumeSettings.se <= 0) return; // 💡 最初に弾いて無駄な生成処理をスキップ

    if (!audioCtx) initAudio();
    if (audioCtx) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                if (volumeSettings.se > 0) callback();
            }).catch(e => console.warn("Audio Resume Failed:", e));
        } else {
            callback();
        }
    }
}
// ⚔️ 必殺技・通常スイングの発動・空振り音（風を鋭く切り裂く金属刀剣スイング音）
function playSwordSwingSE() {
    safePlay(() => {
        const now = audioCtx.currentTime;

        // --- レイヤー1: 金属質のシャキィン音 ---
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.07); // 高速急上昇

        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(1200, now);
        bpf.Q.setValueAtTime(2.2, now); // 少し金属のキレを強調

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.16 * volumeSettings.se, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        osc.connect(bpf);
        bpf.connect(gain);
        gain.connect(seVolumeNode);

        // --- レイヤー2: リアル風切り空気摩擦音（シュッ！というノイズ） ---
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const bpfNoise = audioCtx.createBiquadFilter();
        bpfNoise.type = 'bandpass';
        bpfNoise.frequency.setValueAtTime(800, now);
        bpfNoise.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0, now);
        gainNoise.gain.linearRampToValueAtTime(0.24 * volumeSettings.se, now + 0.005); // 鋭いアタック
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // 80msの短い摩擦

        noiseSrc.connect(bpfNoise);
        bpfNoise.connect(gainNoise);
        gainNoise.connect(seVolumeNode);

        // クリーンアップ
        const cleanup = () => {
            osc.disconnect();
            bpf.disconnect();
            gain.disconnect();
            noiseSrc.disconnect();
            bpfNoise.disconnect();
            gainNoise.disconnect();
        };

        noiseSrc.onended = cleanup;

        osc.start(now);
        noiseSrc.start(now);

        osc.stop(now + 0.12);
        noiseSrc.stop(now + 0.09);
    });
}
// 🔥 火炎ブレスの吹き出し・点火発動音（ゴォォッ！という点火とノイズ）
function playFireBreathSE() {
    safePlay(() => {
        const now = audioCtx.currentTime;
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const lpf = audioCtx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(250, now); // 低音ノイズ

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4 * volumeSettings.se, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        noiseSrc.connect(lpf);
        lpf.connect(gain);
        gain.connect(seVolumeNode);

        noiseSrc.onended = () => {
            noiseSrc.disconnect();
            lpf.disconnect();
            gain.disconnect();
        };
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.3);
    });
}

// 🌀 風・竜巻の引き裂き被弾ヒット音（ザザザザッ！という空気の細かな摩擦連続アタック）
function playWindHitSE() {
    safePlay(() => {
        const now = audioCtx.currentTime;
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(800, now);
        bpf.frequency.exponentialRampToValueAtTime(1800, now + 0.08); // ヒットの鋭い摩擦
        bpf.Q.setValueAtTime(3.0, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35 * volumeSettings.se, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        noiseSrc.connect(bpf);
        bpf.connect(gain);
        gain.connect(seVolumeNode);

        noiseSrc.onended = () => {
            noiseSrc.disconnect();
            bpf.disconnect();
            gain.disconnect();
        };
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.11);
    });
}

// 🧪 毒霧の設置・噴射音（シューーーッ！という低いガス噴出音）
function playPoisonFogDeploySE() {
    safePlay(() => {
        const now = audioCtx.currentTime;
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(1000, now);
        bpf.frequency.exponentialRampToValueAtTime(350, now + 0.55); // ガス圧が弱まるようにピッチ下降
        bpf.Q.setValueAtTime(2.2, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35 * volumeSettings.se, now + 0.05); // じわっと噴出
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        noiseSrc.connect(bpf);
        bpf.connect(gain);
        gain.connect(seVolumeNode);

        noiseSrc.onended = () => {
            noiseSrc.disconnect();
            bpf.disconnect();
            gain.disconnect();
        };
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.62);
    });
}

// 🧪 毒持続・腐食スリップダメージ音（ジュワァ…という不気味な泡立ちと酸の浸食）
function playPoisonDamageSE() {
    safePlay(() => {
        const now = audioCtx.currentTime;

        // 1. パチパチとした不気味な気泡の破裂（高域ノイズ）
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = getNoiseBuffer();

        const bpf = audioCtx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(2200, now); // 高い泡立ち音
        bpf.Q.setValueAtTime(4.0, now);

        const gainNoise = audioCtx.createGain();
        gainNoise.gain.setValueAtTime(0, now);
        // 主張しすぎないよう、音量はマイルド（通常のSEの3分の1以下）にクランプ
        gainNoise.gain.linearRampToValueAtTime(0.09 * volumeSettings.se, now + 0.002);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noiseSrc.connect(bpf);
        bpf.connect(gainNoise);
        gainNoise.connect(seVolumeNode);

        // 2. 「ジュワァ」という酸の溶けるようなうねり（サイン波）
        const oscSizz = audioCtx.createOscillator();
        oscSizz.type = 'sine';
        oscSizz.frequency.setValueAtTime(120, now);
        oscSizz.frequency.linearRampToValueAtTime(70, now + 0.14);

        const gainOsc = audioCtx.createGain();
        gainOsc.gain.setValueAtTime(0, now);
        gainOsc.gain.linearRampToValueAtTime(0.08 * volumeSettings.se, now + 0.01);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        oscSizz.connect(gainOsc);
        gainOsc.connect(seVolumeNode);

        // ライフサイクル管理
        let endCount = 0;
        const cleanup = () => {
            endCount++;
            if (endCount === 2) {
                noiseSrc.disconnect();
                bpf.disconnect();
                gainNoise.disconnect();
                oscSizz.disconnect();
                gainOsc.disconnect();
            }
        };
        noiseSrc.onended = cleanup;
        oscSizz.onended = cleanup;

        noiseSrc.start(now);
        noiseSrc.stop(now + 0.13);

        oscSizz.start(now);
        oscSizz.stop(now + 0.16);
    });
}


// ====================================================
// 💡 【新規実装】：パッシブアビリティ覚醒・専用効果音エンジン
// ====================================================

// 1. 限界突破（オーバードライブ）発動SE ➔ 急上昇SF電子音＋バーニア逆噴射
function playOverdriveActivateSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // A. 限界突破の電磁急上昇スイープ
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(2500, now + 0.38);

    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1400, now);
    bpf.Q.setValueAtTime(3.5, now);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.38 * volumeSettings.se, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(bpf);
    bpf.connect(gain);
    gain.connect(seVolumeNode);

    // B. スラスター点火爆風ノイズ
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(380, now);

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.55 * volumeSettings.se, now + 0.02);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noiseSrc.connect(lpf);
    lpf.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    const cleanup = () => {
        osc.disconnect();
        bpf.disconnect();
        gain.disconnect();
        noiseSrc.disconnect();
        lpf.disconnect();
        gainNoise.disconnect();
    };

    noiseSrc.onended = cleanup;

    osc.start(now);
    noiseSrc.start(now);
    osc.stop(now + 0.4);
    noiseSrc.stop(now + 0.36);
}

// 2. 必殺極限強化（リミットブレイク）完了SE ➔ 美麗なSF電子チャージ完了音
function playLimitBreakSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(3500, now + 0.22); // クリスタルガラス高音

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35 * volumeSettings.se, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(seVolumeNode);

    osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
    };

    osc.start(now);
    osc.stop(now + 0.28);
}

// 3. 反逆召喚（レベリオン）SE ➔ 荘厳な重低音地響き＋悪魔の気流ノイズ
function playRebellionSummonSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // 地を震わせるサブベース（110Hz ➔ 30Hz）
    const oscBass = audioCtx.createOscillator();
    oscBass.type = 'sine';
    oscBass.frequency.setValueAtTime(110, now);
    oscBass.frequency.linearRampToValueAtTime(30, now + 0.48);

    const gainBass = audioCtx.createGain();
    gainBass.gain.setValueAtTime(0, now);
    gainBass.gain.linearRampToValueAtTime(0.85 * volumeSettings.se, now + 0.01);
    gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    oscBass.connect(gainBass);
    gainBass.connect(seVolumeNode);

    // 吹き出す幻影のオーラノイズ
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer();

    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(750, now);
    bpf.frequency.exponentialRampToValueAtTime(220, now + 0.42);
    bpf.Q.setValueAtTime(2.0, now);

    const gainNoise = audioCtx.createGain();
    gainNoise.gain.setValueAtTime(0, now);
    gainNoise.gain.linearRampToValueAtTime(0.32 * volumeSettings.se, now + 0.04);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    noiseSrc.connect(bpf);
    bpf.connect(gainNoise);
    gainNoise.connect(seVolumeNode);

    const cleanup = () => {
        oscBass.disconnect();
        gainBass.disconnect();
        noiseSrc.disconnect();
        bpf.disconnect();
        gainNoise.disconnect();
    };

    noiseSrc.onended = cleanup;

    oscBass.start(now);
    noiseSrc.start(now);
    oscBass.stop(now + 0.53);
    noiseSrc.stop(now + 0.49);
}

// 4. 逆転の一撃（KOゲージMAX）SE ➔ 頭上を貫く2連の危険ホログラム警告音
function playKOGaugeMaxSE() {
    if (!audioCtx) initAudio();
    if (volumeSettings.se <= 0) return;
    const now = audioCtx.currentTime;

    // 警告アラート（120ms間隔で2回鳴らす）
    for (let i = 0; i < 2; i++) {
        const time = now + (i * 0.14);
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(980, time);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2 * volumeSettings.se, time + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

        osc.connect(gain);
        gain.connect(seVolumeNode);

        const triggerTime = time;
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };

        osc.start(triggerTime);
        osc.stop(triggerTime + 0.1);
    }
}