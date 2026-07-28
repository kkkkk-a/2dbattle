// ==========================================
// ■ nexus_data.js (改良版ステージデータベース)
// ==========================================
const stageDatabase = {
    'nexus_flat': {
        name: "終点型",
        desc: "ギミックや空中台が一切存在しない、純粋な実力勝負向けの終点型マップ。",
        theme: 'cyber',
        particleEffect: 'digital_dust',
        width: 2200,
        height: 900,
        groundY: 1050,
        cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' }
        ],
        gimmicks: [],
        bgGradient: ['#040312', '#080517', '#010005']
    },
    'homerun_stage': {
        name: "ホームラン競技場",
        desc: "飛距離測定専用競技場。右側の無限滑走路を使い、サンドバッグをどこまでぶっ飛ばせるか競います。",
        theme: 'industrial',
        particleEffect: 'sparks',
        width: 45000,
        height: 800,
        groundY: 650,
        cameraScroll: true,
        platforms: [
            { x: 690, y: 500, width: 320, height: 150, type: 'solid' },
            { x: 1010, y: 640, width: 44000, height: 100, type: 'solid' }
        ],
        gimmicks: [],
        bgGradient: ['#02010a', '#080b1c', '#010003']
    },
    'nexus_arena': {
        name: "戦場型",
        desc: "メイン足場の上にすり抜け台が3枚浮遊する、対戦格闘ゲームの最も王道な対戦ステージ。",
        theme: 'cyber', 
        particleEffect: 'digital_dust',
        width: 1000, 
        height: 420, 
        groundY: 380,
        cameraScroll: false,
        platforms: [
            { x: 150, y: 280, width: 700, height: 140, type: 'solid', shape: 'trapezoid' },
            { x: 220, y: 190, width: 180, height: 8, type: 'passthrough' },
            { x: 600, y: 190, width: 180, height: 8, type: 'passthrough' },
            { x: 380, y: 100, width: 240, height: 8, type: 'passthrough' }
        ],
        gimmicks: [],
        bgGradient: ['#10041c', '#07020d', '#020105']
    },
    'sector_n9': {
        name: "空中機動要塞",
        desc: "空中要塞。ジャンプパッドや化学コンベア、最底部の酸の海などハザードが満載。",
        theme: 'industrial',
        particleEffect: 'steam',
        width: 3200, 
        height: 1200, 
        groundY: 1050,
        cameraScroll: true,
        platforms: [
            { x: 0, y: 1050, width: 800, height: 150, type: 'solid' },
            { x: 2400, y: 1050, width: 800, height: 150, type: 'solid' },

            { x: 400, y: 850, width: 300, height: 20, type: 'solid' },
            { x: 850, y: 700, width: 400, height: 20, type: 'conveyor', speed: 4 }, 
            { x: 1400, y: 550, width: 400, height: 30, type: 'solid' }, // 💡 メイン安全プラットフォーム
            { x: 1950, y: 700, width: 400, height: 20, type: 'conveyor', speed: -4 }, 
            { x: 2500, y: 850, width: 300, height: 20, type: 'solid' },

            { x: 150, y: 650, width: 200, height: 10, type: 'passthrough' },
            { x: 600, y: 500, width: 200, height: 10, type: 'passthrough' },
            { x: 1100, y: 380, width: 250, height: 10, type: 'passthrough' },
            { x: 1850, y: 380, width: 250, height: 10, type: 'passthrough' },
            { x: 2400, y: 500, width: 200, height: 10, type: 'passthrough' },
            { x: 2850, y: 650, width: 200, height: 10, type: 'passthrough' },

            { x: 1100, y: 200, width: 150, height: 12, type: 'moving', rangeX: 300, rangeY: 0, speed: 2.0 }
        ],
        gimmicks: [
            { x: 600, y: 1040, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: 10 }, 
            { x: 2820, y: 1040, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: -10 }, 

            { x: 450, y: 810, width: 60, height: 60, type: 'cannon', forceX: 18, forceY: -24 }, 
            { x: 2690, y: 810, width: 60, height: 60, type: 'cannon', forceX: -18, forceY: -24 }, 

            { x: 800, y: 1070, width: 1600, height: 50, type: 'acid' },

            { x: 100, y: 590, width: 40, height: 60, type: 'portal', targetX: 3060, targetY: 590, color: '#00e5ff' },
            { x: 3060, y: 590, width: 40, height: 60, type: 'portal', targetX: 100, targetY: 590, color: '#ff007f' },

            // 💥【調整】：固定大砲を中央スポーン地帯から離れた右高台（x:2500）の端へ配置
            { x: 2520, y: 810, width: 40, height: 40, type: 'fixed_turret', facing: -1, hp: 20, shootTimer: 0 }
        ],
        bgGradient: ['#3a1212', '#140c24', '#04040e']
    },
   'chemical_shaft': {
        name: "地下化学精製シャフト",
        desc: "非常に深く落下する、縦方向への移動や登り差し合いに特化した超縦長構造シリンダー。",
        theme: 'industrial', 
        particleEffect: 'steam',
        width: 1300,
        height: 1800,
        groundY: 1720,
        cameraScroll: true,
        platforms: [
            // 💡【メインスポーン地点】中層プラットフォームを先頭(platforms[0])に配置して開幕事故を根絶
            { x: 400, y: 1000, width: 500, height: 35, type: 'solid' },

            // 最下層の左右足場
            { x: 0, y: 1700, width: 250, height: 100, type: 'solid' },
            { x: 1050, y: 1700, width: 250, height: 100, type: 'solid' },

            // 下層エリア
            { x: 350, y: 1450, width: 600, height: 20, type: 'conveyor', speed: 3.0 },
            { x: 150, y: 1250, width: 300, height: 12, type: 'passthrough' },
            { x: 850, y: 1250, width: 300, height: 12, type: 'passthrough' },
            
            // 中層サポート足場
            { x: 100, y: 800, width: 350, height: 15, type: 'passthrough' },
            { x: 850, y: 800, width: 350, height: 15, type: 'passthrough' },

            // 上層エリア
            { x: 350, y: 550, width: 600, height: 20, type: 'conveyor', speed: -3.0 },
            { x: 100, y: 450, width: 180, height: 15, type: 'moving', rangeX: 0, rangeY: 250, speed: 1.8 },
            { x: 1020, y: 450, width: 180, height: 15, type: 'moving', rangeX: 0, rangeY: 250, speed: -1.8 },
            
            { x: 200, y: 350, width: 300, height: 15, type: 'passthrough' },
            { x: 800, y: 350, width: 300, height: 15, type: 'passthrough' },

            // 最上層天井足場
            { x: 450, y: 150, width: 400, height: 20, type: 'solid' }
        ],
        gimmicks: [
            // 💡【最下層レスキュー大砲】：崖下に落ちかけた時に上空中央へ一気に逆転復帰できる配置
            { x: 10, y: 1640, width: 60, height: 60, type: 'cannon', forceX: 22, forceY: -38 },  
            { x: 1230, y: 1640, width: 60, height: 60, type: 'cannon', forceX: -22, forceY: -38 },

            // 💡【中層ジャンプパッド】：下層から中層〜上層へハイスピード移動できるバネ
            { x: 250, y: 1240, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: 10 },
            { x: 970, y: 1240, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: -10 },

            // 💡【中央上空の射出バレル＆上昇風エリア】：縦コンボや空中戦のハイライトとなるギミック
            { x: 500, y: 700, width: 300, height: 60, type: 'cannon', forceX: 0, forceY: -40 }, 
            { x: 500, y: 380, width: 300, height: 320, type: 'wind_zone', forceX: 0, forceY: -5.0 },

            // 最底部の酸の海
            { x: 250, y: 1720, width: 800, height: 80, type: 'acid' }
        ],
        bgGradient: ['#061a0c', '#030510', '#010104']
    },
'athletic_way': {
        name: "疾走回廊",
        desc: "非常に横に長い空中アスレチック走破マップ。右端のゴールポールを掴めば勝利。",
        theme: 'sky_meadow', 
        particleEffect: 'sakura_petals',
        width: 6500,        
        height: 800,
        groundY: 720,
        cameraScroll: true,
        platforms: [
            { x: 0, y: 700, width: 1000, height: 100, type: 'solid' },
            { x: 1150, y: 550, width: 220, height: 20, type: 'solid' },
            { x: 1500, y: 700, width: 600, height: 100, type: 'solid' },
            { x: 2250, y: 550, width: 450, height: 20, type: 'conveyor', speed: 4.5 }, 
            { x: 2800, y: 450, width: 300, height: 12, type: 'passthrough' },
            { x: 3250, y: 600, width: 150, height: 20, type: 'solid' },
            { x: 3500, y: 480, width: 150, height: 20, type: 'solid' },
            { x: 3750, y: 400, width: 150, height: 20, type: 'moving', rangeX: 0, rangeY: 200, speed: 2.5 },
            { x: 4000, y: 700, width: 800, height: 100, type: 'solid' },
            { x: 4950, y: 660, width: 60, height: 60, type: 'solid' },
            { x: 5010, y: 600, width: 60, height: 120, type: 'solid' },
            { x: 5070, y: 540, width: 60, height: 180, type: 'solid' },
            { x: 5130, y: 480, width: 120, height: 240, type: 'solid' },
            { x: 5250, y: 540, width: 60, height: 180, type: 'solid' },
            { x: 5310, y: 600, width: 60, height: 120, type: 'solid' },
            { x: 5370, y: 660, width: 60, height: 60, type: 'solid' },
            { x: 5430, y: 700, width: 1070, height: 100, type: 'solid' }
        ],
        gimmicks: [
            // jumppadの数値（forceY/forceX）は現状のまま完璧に維持
            { x: 850, y: 690, width: 80, height: 10, type: 'jumppad', forceY: -16, forceX: 18 },  
            { x: 1950, y: 690, width: 80, height: 10, type: 'jumppad', forceY: -18, forceX: 15 },
            { x: 4600, y: 690, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: 12 },

            // 💥 大砲の横射出スピードのみ 25 ➔ 38 へ爆速強化！
            { x: 1300, y: 490, width: 60, height: 60, type: 'cannon', forceX: 38, forceY: -12 },

            { x: 5850, y: 300, width: 25, height: 400, type: 'goal_pole' }
        ],
        bgGradient: ['#59a7f5', '#94c9f7', '#d0e7ff']
    },
    'lava_castle': {
        name: "溶岩城",
        desc: "戦術の異なる3つのエリアが共存する城郭。壁ハメ密室の『左砦』、王道戦闘の『中央本丸』、遠距離・アスレチックの『右砦』を駆け巡れ！",
        theme: 'lava', 
        particleEffect: 'embers',
        width: 4500, 
        height: 1400, 
        groundY: 1250,
        cameraScroll: true,
        platforms: [
            // 🏯【中央：天を貫く五重の大天守閣タワー】
            { x: 1800, y: 950, width: 900, height: 350, type: 'solid' },       // 本丸メイン広間 (platforms[0] スポーン)
            { x: 1900, y: 780, width: 700, height: 12,  type: 'passthrough' }, // 天守1層目反り屋根
            { x: 2000, y: 620, width: 500, height: 12,  type: 'passthrough' }, // 天守2層目反り屋根
            { x: 2100, y: 460, width: 300, height: 12,  type: 'passthrough' }, // 天守3層目反り屋根
            { x: 2180, y: 300, width: 140, height: 18,  type: 'solid' },       // 天守4層目高台テラス

            // 👑【天に立つもの：極高・黄金シャチホコ天守尖塔】（最高標高 y: 140 に聳え立つお城の象徴！）
            { x: 2225, y: 140, width: 50,  height: 160, type: 'solid' },       // 垂直に天へ突き刺さる神木石塔
            { x: 2200, y: 140, width: 100, height: 15,  type: 'passthrough' }, // 頂上シャチホコ演武台（てっぺん）

            // ⛓️【左砦：多層城門 ＆ 密室処刑タワー】
            { x: 100,  y: 950, width: 900, height: 350, type: 'solid' },       // 左砦メイン床
            { x: 100,  y: 0,   width: 80,  height: 1300, type: 'solid' },      // 左側完全封鎖外壁
            { x: 920,  y: 350, width: 80,  height: 950,  type: 'solid' },      // 右側城門隔壁（下部に出入り口）
            { x: 250,  y: 780, width: 300, height: 12,   type: 'passthrough' },// 密室下層見張り台
            { x: 550,  y: 610, width: 300, height: 12,   type: 'passthrough' },// 密室中層見張り台
            { x: 200,  y: 440, width: 220, height: 15,   type: 'solid' },      // 密室天井裏隠し櫓（高台）

            // ⚙️【右砦：三段溶鉱炉 ＆ 機械化城塞】
            { x: 3500, y: 950, width: 900, height: 350, type: 'solid' },       // 右砦メイン床
            { x: 3300, y: 780, width: 500, height: 22,  type: 'conveyor', speed: 3.5 },  // 下段溶鉱炉コンベア（左流）
            { x: 3850, y: 620, width: 500, height: 22,  type: 'conveyor', speed: -3.5 }, // 中段溶鉱炉コンベア（右流）
            { x: 3400, y: 460, width: 400, height: 22,  type: 'conveyor', speed: 4.0 },  // 上段溶鉱炉コンベア（左流）
            { x: 3700, y: 300, width: 200, height: 14,  type: 'moving', rangeX: 300, rangeY: 0, speed: 2.0 }, // 最上層リフト

            // 🌉【エリア連結：空中廊下 ＆ すり抜け跳ね橋】
            { x: 1100, y: 950, width: 600, height: 15,  type: 'passthrough' }, // 下段跳ね橋（左砦 ⇄ 本丸）
            { x: 2800, y: 950, width: 600, height: 15,  type: 'passthrough' }, // 下段跳ね橋（本丸 ⇄ 右砦）
            { x: 1350, y: 620, width: 450, height: 12,  type: 'passthrough' }, // 上空空中回廊（左城壁 ⇄ 天守屋根）
            { x: 2700, y: 620, width: 450, height: 12,  type: 'passthrough' }  // 上空空中回廊（天守屋根 ⇄ 右溶鉱炉）
        ],
        gimmicks: [
            // 🚀【安全・快適設計：大砲キャノン・ネットワーク】（即死・天井激突を完全解消した放物線軌道）
            // 1. 左砦・床大砲（本丸広場へふんわり安全射出）
            { x: 250,  y: 890,  width: 60, height: 60, type: 'cannon', forceX: 20,  forceY: -28 },
            // 2. 左砦・上空大砲（本丸天守屋根へ安全射出）
            { x: 200,  y: 450,  width: 60, height: 60, type: 'cannon', forceX: 22,  forceY: -18 },

            // 3. 本丸左レスキュー大砲（上空撃墜ラインを突かず、本丸中央広間へ安全リターン）
            { x: 1720, y: 890,  width: 60, height: 60, type: 'cannon', forceX: 10,  forceY: -28 },
            // 4. 本丸右レスキュー大砲（上空撃墜ラインを突かず、本丸中央広間へ安全リターン）
            { x: 2720, y: 890,  width: 60, height: 60, type: 'cannon', forceX: -10, forceY: -28 },

            // 5. 右砦・中段コンベア端の大砲（天守閣方向へスムーズリターン）
            { x: 3750, y: 690,  width: 60, height: 60, type: 'cannon', forceX: -18, forceY: -26 },
            // 6. 右砦・最奥の大砲（本丸広場へふんわり安全射出）
            { x: 4250, y: 890,  width: 60, height: 60, type: 'cannon', forceX: -22, forceY: -28 },

            // 💥【ピンボール・ジャンプバネ（全6台）】
            { x: 1850, y: 940,  width: 70, height: 10, type: 'jumppad', forceY: -22, forceX: 12 },
            { x: 2580, y: 940,  width: 70, height: 10, type: 'jumppad', forceY: -22, forceX: -12 },
            { x: 1350, y: 940,  width: 80, height: 10, type: 'jumppad', forceY: -24, forceX: 0 },
            { x: 3050, y: 940,  width: 80, height: 10, type: 'jumppad', forceY: -24, forceX: 0 },
            { x: 1200, y: 1240, width: 90, height: 10, type: 'jumppad', forceY: -28, forceX: 10 },
            { x: 3200, y: 1240, width: 90, height: 10, type: 'jumppad', forceY: -28, forceX: -10 },

            // 🌋【灼熱溶岩海】
            { x: 1000, y: 1280, width: 800, height: 200, type: 'lava' },
            { x: 2700, y: 1280, width: 800, height: 200, type: 'lava' },
            { x: 0,    y: 1280, width: 100, height: 200, type: 'lava' },
            { x: 4400, y: 1280, width: 100, height: 200, type: 'lava' }
        ],
        bgGradient: ['#2b0202', '#0f0101', '#010000']
    },

    'battlefield_1': {
        name: "戦場型1",
        desc: "メイン浮遊島の中央上空に、すり抜け台が1枚だけふんわりと配置された戦場。",
        theme: 'cyber', 
        particleEffect: 'digital_dust',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' },
            { x: 950, y: 360, width: 300, height: 10, type: 'passthrough' } 
        ],
        gimmicks: [],
        bgGradient: ['#060614', '#020208', '#000000']
    },
    'battlefield_2': {
        name: "戦場型2",
        desc: "メイン浮遊島の左右の上空に、すり抜け台が合計2枚対称に配置された戦場。",
        theme: 'cyber', 
        particleEffect: 'digital_dust',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' },
            { x: 600, y: 360, width: 280, height: 10, type: 'passthrough' }, 
            { x: 1320, y: 360, width: 280, height: 10, type: 'passthrough' } 
        ],
        gimmicks: [],
        bgGradient: ['#060614', '#020208', '#000000']
    },
    'battlefield_3': {
        name: "戦場型3",
        desc: "左右と中央上の合計3箇所にすり抜け台が浮遊する、王道の戦場アリーナ。",
        theme: 'cyber', 
        particleEffect: 'digital_dust',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' },
            { x: 600, y: 380, width: 280, height: 10, type: 'passthrough' }, 
            { x: 1320, y: 380, width: 280, height: 10, type: 'passthrough' }, 
            { x: 950, y: 220, width: 300, height: 10, type: 'passthrough' }  
        ],
        gimmicks: [],
        bgGradient: ['#0c0214', '#05010a', '#000000']
    },
    'flat_ground_2': {
        name: "終点型2",
        desc: "崖（奈落）が一切存在せず、左右の画面端まで地面が繋がっている落下死のない平地。",
        theme: 'cyber', 
        particleEffect: 'digital_dust',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 0, y: 550, width: 2200, height: 500, type: 'solid' } 
        ],
        gimmicks: [],
        bgGradient: ['#02120a', '#010503', '#000000']
    },
    'flat_ceiling_3': {
        name: "終点型3",
        desc: "上空を強固なソリッド鉄板が覆っているため、上方向への撃墜が絶対に発生しないステージ。",
        theme: 'industrial',
        particleEffect: 'steam',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' },
            { x: 0, y: -450, width: 2200, height: 50, type: 'solid' } 
        ],
        gimmicks: [],
        bgGradient: ['#121212', '#050505', '#000000']
    },
    'flat_walled_4': {
        name: "終点型4",
        desc: "左右両端に高くそびえる強固な垂直壁。横撃墜がなく、壁バウンドコンボを極限まで楽しめます。",
        theme: 'industrial',
        particleEffect: 'steam',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 100, y: 550, width: 2000, height: 500, type: 'solid' },
            { x: 0, y: -300, width: 100, height: 1350, type: 'solid' },      
            { x: 2100, y: -300, width: 100, height: 1350, type: 'solid' }
        ],
        gimmicks: [],
        bgGradient: ['#1a0505', '#0a0101', '#000000']
    },
    'athletic_deep': {
        name: "要塞深部シャフト",
        desc: "タイムアタック用垂直シャフト。底からせり上がる酸のプールから逃げて最上部のポールを掴め！",
        theme: 'industrial', 
        particleEffect: 'steam',
        width: 1400, height: 2600, groundY: 2520, cameraScroll: true,
        platforms: [
            { x: 300, y: 2450, width: 800, height: 100, type: 'solid' },
            { x: 200, y: 2250, width: 250, height: 12, type: 'passthrough' },
            { x: 950, y: 2250, width: 250, height: 12, type: 'passthrough' },
            { x: 550, y: 2050, width: 300, height: 12, type: 'passthrough' },
            { x: 150, y: 1850, width: 350, height: 12, type: 'conveyor', speed: -3.0 }, 
            { x: 900, y: 1850, width: 350, height: 12, type: 'conveyor', speed: 3.0 },  
            { x: 450, y: 1550, width: 500, height: 30, type: 'solid' },
            { x: 150, y: 1350, width: 180, height: 15, type: 'solid' },
            { x: 1070, y: 1350, width: 180, height: 15, type: 'solid' },
            { x: 400, y: 1150, width: 150, height: 12, type: 'moving', rangeX: 120, rangeY: 0, speed: 1.5 },
            { x: 850, y: 1150, width: 150, height: 12, type: 'moving', rangeX: -120, rangeY: 0, speed: 1.5 },
            { x: 100, y: 950, width: 250, height: 15, type: 'solid' },
            { x: 1050, y: 950, width: 250, height: 15, type: 'solid' },
            { x: 575, y: 750, width: 250, height: 15, type: 'passthrough' },
            { x: 350, y: 550, width: 120, height: 20, type: 'solid' },
            { x: 930, y: 550, width: 120, height: 20, type: 'solid' },
            { x: 450, y: 350, width: 500, height: 350, type: 'solid' }
        ],
        gimmicks: [
            { x: 670, y: 2440, width: 60, height: 10, type: 'jumppad', forceY: -26, forceX: 0 }, 
            { x: 0, y: 2530, width: 1400, height: 70, type: 'acid' },
            { x: 210, y: 1480, width: 60, height: 60, type: 'cannon', forceX: 18, forceY: -32 }, 
            { x: 1130, y: 1480, width: 60, height: 60, type: 'cannon', forceX: -18, forceY: -32 }, 
            { x: 670, y: 1090, width: 60, height: 60, type: 'cannon', forceX: 0, forceY: -35 }, 
            { x: 550, y: 650, width: 300, height: 200, type: 'wind_zone', forceX: 0, forceY: 3.5 },
            { x: 690, y: -50, width: 20, height: 400, type: 'goal_pole' }
        ],
        bgGradient: ['#020b08', '#07170f', '#010502'] 
    },
'crystal_cave': {
        name: "地底結晶洞窟",
        desc: "シャープな結晶群と各種ギミックが入り組む広大な大洞窟。移動リフトや消えるホログラム足場、ジャンプ台や大砲を使いこなして洞窟を制覇せよ！",
        theme: 'cave',
        particleEffect: 'crystal_dust',
        width: 3600,   
        height: 1500,  
        groundY: 1650, 
        cameraScroll: true,
        platforms: [
            // 💎【メインスポーン台】中央の安全な平坦大結晶プラットフォーム (platforms[0])
            { x: 1450, y: 900, width: 700, height: 35, type: 'solid', color: '#00e5ff' },

            // 💎 下から突き出る「乗れる」スリム結晶トゲ
            { x: 300,  y: 1100, width: 130, height: 550, type: 'solid', shape: 'spike', color: '#ba55d3' },
            { x: 650,  y: 950,  width: 140, height: 700, type: 'solid', shape: 'spike', color: '#00e5ff' },
            { x: 1050, y: 1150, width: 120, height: 500, type: 'solid', shape: 'spike', color: '#ff007f' },
            { x: 2250, y: 900,  width: 150, height: 750, type: 'solid', shape: 'spike', color: '#39ff14' },
            { x: 2650, y: 1100, width: 120, height: 550, type: 'solid', shape: 'spike', color: '#ffaa00' },
            { x: 3050, y: 1000, width: 140, height: 650, type: 'solid', shape: 'spike', color: '#ba55d3' },

            // 💎 天井から垂れ下がる「激突する」スリム結晶トゲ
            { x: 480,  y: -200, width: 120, height: 450, type: 'solid', shape: 'spike_down', color: '#00e5ff' },
            { x: 880,  y: -200, width: 140, height: 380, type: 'solid', shape: 'spike_down', color: '#ba55d3' },
            { x: 1280, y: -200, width: 110, height: 500, type: 'solid', shape: 'spike_down', color: '#00ffff' },
            { x: 1680, y: -200, width: 150, height: 420, type: 'solid', shape: 'spike_down', color: '#ff007f' },
            { x: 2080, y: -200, width: 120, height: 480, type: 'solid', shape: 'spike_down', color: '#00e5ff' },
            { x: 2480, y: -200, width: 130, height: 400, type: 'solid', shape: 'spike_down', color: '#39ff14' },
            { x: 2880, y: -200, width: 120, height: 450, type: 'solid', shape: 'spike_down', color: '#ffd700' },

            // ✨ 1.【空中すり抜け結晶台】
            { x: 450,  y: 900,  width: 160, height: 12, type: 'passthrough' },
            { x: 850,  y: 750,  width: 180, height: 12, type: 'passthrough' },
            { x: 1250, y: 750,  width: 160, height: 12, type: 'passthrough' },
            { x: 2180, y: 750,  width: 160, height: 12, type: 'passthrough' },
            { x: 2450, y: 700,  width: 180, height: 12, type: 'passthrough' },
            { x: 2850, y: 850,  width: 160, height: 12, type: 'passthrough' },

            // ⚙️ 2.【動く結晶リフト】
            { x: 1000, y: 550,  width: 180, height: 14, type: 'moving', rangeX: 200, rangeY: 0, speed: 1.5 },
            { x: 2300, y: 500,  width: 180, height: 14, type: 'moving', rangeX: 0, rangeY: 150, speed: 1.2 },

            // 🌐 3.【消えるホログラム結晶】
            { x: 1670, y: 680,  width: 260, height: 14, type: 'hologram', interval: 240, offset: 0, color: '#00ffff' }
        ],
        gimmicks: [
            // 🌀 左右のワープポータル
            { x: 150,  y: 1140, width: 40, height: 60, type: 'portal', targetX: 3350, targetY: 1040, color: '#00e5ff' },
            { x: 3350, y: 1040, width: 40, height: 60, type: 'portal', targetX: 150,  targetY: 1140, color: '#ff007f' },

            // 💥 4.【谷底からの大逆転バネ ＆ 大砲】
            { x: 800,  y: 1130, width: 60, height: 10, type: 'jumppad', forceY: -26, forceX: 0 },
            { x: 2700, y: 1090, width: 60, height: 10, type: 'jumppad', forceY: -26, forceX: 0 },
            { x: 1800, y: 1100, width: 60, height: 60, type: 'cannon', forceX: 0, forceY: -35 }
        ],
        bgGradient: ['#010103', '#000000', '#000000']
    },
    'craggy_cliff': {
        name: "荒岩壁の谷底",
        desc: "左右を強固な垂直岩壁に挟まれた狭い断層谷。落石デブリが絶え間なく降り注ぐ中、垂直方向へ駆け登れ！",
        theme: 'cliff',
        particleEffect: 'dust_debris',
        width: 1600, height: 1800, groundY: 1720, cameraScroll: true,
        platforms: [
            { x: 150, y: 1650, width: 1300, height: 100, type: 'solid' },
            { x: 0, y: 0, width: 150, height: 1800, type: 'solid' },
            { x: 1450, y: 0, width: 150, height: 1800, type: 'solid' },
            { x: 400, y: 1400, width: 300, height: 15, type: 'passthrough' },
            { x: 900, y: 1400, width: 300, height: 15, type: 'passthrough' },
            { x: 650, y: 1150, width: 300, height: 15, type: 'passthrough' },
            { x: 250, y: 900, width: 180, height: 15, type: 'moving', rangeX: 0, rangeY: 200, speed: 2.0 },
            { x: 1170, y: 900, width: 180, height: 15, type: 'moving', rangeX: 0, rangeY: 200, speed: -2.0 },
            { x: 500, y: 650, width: 600, height: 20, type: 'conveyor', speed: 3.5 },
            { x: 450, y: 350, width: 700, height: 30, type: 'solid' }
        ],
        gimmicks: [
            { x: 250, y: 1640, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: 10 },
            { x: 1270, y: 1640, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: -10 }
        ],
        bgGradient: ['#14100d', '#080504', '#000000']
    },
'casino_neon': {
        name: "電脳カジノ",
        desc: "ネオンがきらめく確率演算ドーム。バンパーやスロットが配置されたギャンブルステージ！",
        theme: 'casino',
        particleEffect: 'casino_spark',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 500, y: 550, width: 1200, height: 500, type: 'solid', shape: 'trapezoid' },
            { x: 580, y: 380, width: 220, height: 12, type: 'passthrough' },
            { x: 1400, y: 380, width: 220, height: 12, type: 'passthrough' },
            { x: 920, y: 240, width: 360, height: 12, type: 'passthrough' }
        ],
        gimmicks: [
            { x: 880, y: 540, width: 400, height: 10, type: 'casino_roulette', cooldown: 0 },
            { x: 450, y: 300, width: 60, height: 60, type: 'casino_bumper' },
            { x: 1690, y: 300, width: 60, height: 60, type: 'casino_bumper' }
        ],
        bgGradient: ['#000000', '#110022', '#001122']
    },
    'cyber_street': {
        name: "電脳ネオン街",
        desc: "ビルの谷間が空いたスカスカなネオン街。時間経過で消滅・実体化を繰り返すホログラム足場を渡り歩け！",
        theme: 'cyber_street',
        particleEffect: 'digital_dust',
        width: 2600, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            // 🏢【メイン中央ビル屋上】スポーン地点(platforms[0])
            { x: 1050, y: 550, width: 500, height: 500, type: 'solid' },

            // 🏢【左ビル屋上】
            { x: 300, y: 550, width: 500, height: 500, type: 'solid' },

            // 🏢【右ビル屋上】
            { x: 1800, y: 550, width: 500, height: 500, type: 'solid' },

            // 🌐【ビル間のホログラム橋1：左谷間】(4秒周期で消滅/出現)
            { x: 800, y: 550, width: 250, height: 15, type: 'hologram', interval: 240, offset: 0, color: '#00ffff' },

            // 🌐【ビル間のホログラム橋2：右谷間】(橋1と交互に消える)
            { x: 1550, y: 550, width: 250, height: 15, type: 'hologram', interval: 240, offset: 120, color: '#ff00ff' },

            // 🌐【空中ホログラム看板1：左上】
            { x: 500, y: 380, width: 220, height: 15, type: 'hologram', interval: 200, offset: 60, color: '#00ffff' },

            // 🌐【空中ホログラム看板2：右上】
            { x: 1880, y: 380, width: 220, height: 15, type: 'hologram', interval: 200, offset: 160, color: '#ff00ff' },

            // 🌐【最上層ホログラムステージ：中央】
            { x: 1050, y: 260, width: 500, height: 15, type: 'hologram', interval: 300, offset: 0, color: '#ffd700' }
        ],
        gimmicks: [],
        bgGradient: ['#040312', '#0a0820', '#010005']
    },
'rooftop_city': {
        name: "高層ビル屋上",
        desc: "大型室外機や給水タワーが並ぶビルの屋上。きらめく星空と満月、動く足場が特徴的なステージ。",
        theme: 'rooftop_city',
        particleEffect: 'sparks',
        width: 2400, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            // メイン屋上足場（固定）
            { x: 300, y: 550, width: 1800, height: 500, type: 'solid' },

            // 💡【動く空中台1：左側】ゆっくり上下昇降（高さ・振幅をジャンプで届く範囲に調整）
            { x: 550, y: 410, width: 260, height: 15, type: 'moving', rangeX: 0, rangeY: 55, speed: 0.6 },

            // 💡【動く空中台2：右側】左側と逆位相でゆっくり上下昇降
            { x: 1590, y: 410, width: 260, height: 15, type: 'moving', rangeX: 0, rangeY: 55, speed: -0.6 },

            // 💡【動く空中台3：中央上空】適切なサイズ（260px）でゆっくり左右移動
            { x: 1070, y: 280, width: 260, height: 15, type: 'moving', rangeX: 160, rangeY: 15, speed: 0.5 }
        ],
        gimmicks: [],
        bgGradient: ['#06061a', '#02020d', '#000003']
    },
'subway_station': {
        name: "地下鉄ホーム",
        desc: "警告アラートと共に線路をサイバー電車が爆走する駅。激突すると20%ダメージ＋大吹っ飛びのデンジャラスステージ！",
        theme: 'subway_station',
        particleEffect: 'steam',
        width: 2200, height: 900, groundY: 1050, cameraScroll: true,
        platforms: [
            { x: 200, y: 550, width: 1800, height: 500, type: 'solid' },
            { x: 400, y: 380, width: 300, height: 10, type: 'passthrough' },
            { x: 1500, y: 380, width: 300, height: 10, type: 'passthrough' },
            { x: 900, y: 220, width: 400, height: 10, type: 'passthrough' }
        ],
        gimmicks: [
            { x: 100, y: 590, width: 40, height: 60, type: 'portal', targetX: 2060, targetY: 590, color: '#00e5ff' },
            { x: 2060, y: 590, width: 40, height: 60, type: 'portal', targetX: 100, targetY: 590, color: '#ff007f' }
        ],
        bgGradient: ['#0d111a', '#04060a', '#000000']
    },
'cyber_labyrinth': {
        name: "電脳迷宮",
        desc: "壁と抜け道が複雑に入り組んだ超巨大2D迷宮ステージ。激しい壁バウンドとワープポータルを駆使して迷宮を制覇せよ！",
        theme: 'labyrinth',
        particleEffect: 'digital_dust',
        width: 3000,
        height: 1600,
        groundY: 1520,
        cameraScroll: true,
        platforms: [
            // 外枠・外壁
            { x: 0, y: 1500, width: 3000, height: 100, type: 'solid' }, // 底床
            { x: 0, y: 0, width: 80, height: 1600, type: 'solid' },     // 左壁
            { x: 2920, y: 0, width: 80, height: 1600, type: 'solid' },  // 右壁

            // 迷宮内部の隔壁（下層） - 左端（x:80〜220）に縦穴通り道を開設！
            { x: 220, y: 1250, width: 930, height: 30, type: 'solid' },
            { x: 1150, y: 1280, width: 30, height: 220, type: 'solid' }, // 垂直壁（底床y:1500までピッタリ接続）
            { x: 1400, y: 1250, width: 500, height: 30, type: 'conveyor', speed: 3.5 },
            { x: 2100, y: 1250, width: 680, height: 30, type: 'solid' }, // 右端にも通り抜け穴を確保

            // 迷宮内部の隔壁（中層） - 左端（x:80〜220）に縦穴通り道を開設！
            { x: 220, y: 950, width: 530, height: 30, type: 'solid' },
            { x: 750, y: 680, width: 30, height: 300, type: 'solid' },  // 垂直壁（上層と中層をピッタリ接続）
            { x: 1000, y: 950, width: 1000, height: 30, type: 'solid' },
            { x: 2220, y: 680, width: 30, height: 300, type: 'solid' }, // 垂直壁（上層と中層をピッタリ接続）
            { x: 2250, y: 950, width: 530, height: 30, type: 'solid' },

            // 迷宮内部の隔壁（上層）
            { x: 350, y: 650, width: 1250, height: 30, type: 'solid' },
            { x: 1800, y: 650, width: 970, height: 30, type: 'solid' },

            // すり抜け隠しショートカット足場
            { x: 850, y: 1100, width: 200, height: 12, type: 'passthrough' },
            { x: 1400, y: 800, width: 250, height: 12, type: 'passthrough' },
            { x: 1000, y: 480, width: 300, height: 12, type: 'passthrough' }
        ],
        gimmicks: [
            // 双方向ワープポータル
            { x: 150, y: 1440, width: 40, height: 60, type: 'portal', targetX: 2700, targetY: 580, color: '#00e5ff' },
            { x: 2700, y: 580, width: 40, height: 60, type: 'portal', targetX: 150, targetY: 1440, color: '#ff007f' },

            // 上層への打ち上げジャンプパッド
            { x: 1250, y: 1490, width: 80, height: 10, type: 'jumppad', forceY: -28, forceX: 0 }
        ],
        bgGradient: ['#02010c', '#08051a', '#000000']
    },
    'ancient_forest': {
        name: "太古の神木樹海",
        desc: "神木の根と大枝が交差する幻想的な大樹海。跳ね上がるキノコや樹洞大砲、最底部に底なしの毒沼が広がるステージ。",
        theme: 'sky_meadow',
        particleEffect: 'sakura_petals',
        width: 2600,
        height: 900,
        groundY: 1050,
        cameraScroll: true,
        platforms: [
            // 🌳【メイン巨木台】スポーン地点(platforms[0]) - 中央で安全に戦える大樹の根
            { x: 900, y: 550, width: 800, height: 500, type: 'solid' },

            // 🌳【左の幹＆大枝】
            { x: 250, y: 550, width: 450, height: 500, type: 'solid' },

            // 🌳【右の幹＆大枝】
            { x: 1900, y: 550, width: 450, height: 500, type: 'solid' },

            // 🌿【空中枝デッキ1：左上】
            { x: 450, y: 380, width: 240, height: 12, type: 'passthrough' },

            // 🌿【空中枝デッキ2：右上】
            { x: 1910, y: 380, width: 240, height: 12, type: 'passthrough' },

            // 🌿【中央上空ツリーハウス足場】
            { x: 1100, y: 280, width: 400, height: 14, type: 'passthrough' },

            // 🍃【動く風の浮遊葉っぱリフト】
            { x: 700, y: 220, width: 160, height: 12, type: 'moving', rangeX: 120, rangeY: 0, speed: 1.2 }
        ],
        gimmicks: [
            // 🍄【跳ね上がる巨大キノコバネ】（左枝＆右枝に設置）
            { x: 500, y: 540, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: 10 },
            { x: 2020, y: 540, width: 80, height: 10, type: 'jumppad', forceY: -22, forceX: -10 },

            // 🪵【樹洞の大砲バレル】（中央メイン台の左右口に配置）
            { x: 920, y: 490, width: 60, height: 60, type: 'cannon', forceX: 20, forceY: -28 },
            { x: 1620, y: 490, width: 60, height: 60, type: 'cannon', forceX: -20, forceY: -28 },

            // 沼【最底部の底なし毒沼】（落ちると毒ダメージで打ち上がる）
            { x: 0, y: 1060, width: 2600, height: 60, type: 'acid' }
        ],
        bgGradient: ['#041a0b', '#0d3318', '#020d05']
    },
};
const allMovesDatabase = {
    // ------------------------------------
    // A. 地上通常攻撃（弱・強・牽制）
    // ------------------------------------
'normal-n-jab': {
        name: '弱ジャブ連撃', cost: 0,
        desc: 'その場で素早くジャブ ➔ ストレート ➔ フックの3段パンチを自動で叩き込む連続技。発生が極めて早く、ヒットした敵を優しく拘束して押し出します。',
        startup: 4, active: 16, endlag: 6, damage: 2.8, kbScale: 0.65, angle: 15,
        width: 65, height: 30, offsetY: 15, attackerHitstop: 2, receiverHitstop: 2, 
        isMultiHit: true, hitInterval: 5,
        hitboxAttribute: 'normal'
    },
    'normal-n-upper': {
        name: 'インファイトアッパー', cost: 5,
        desc: '踏み込んで懐から突き上げる。発生が早く、ヒットした敵を真上に浮かせて空中コンボの起点にしやすい。',
        startup: 5, active: 5, endlag: 11, damage: 8.5, kbScale: 0.8, angle: 80,
        width: 45, height: 70, offsetY: -25, attackerHitstop: 3, receiverHitstop: 4, hitboxAttribute: 'normal'
    },
'normal-d-lowkick': {
        name: 'アンダーローキック', cost: 4,
        desc: '姿勢を低くして足元をなぎ払うキック。発生が早く、敵を低い角度で滑るように吹き飛ばす。',
        startup: 6, active: 4, endlag: 10, damage: 7.5, kbScale: 0.75, angle: 35,
        width: 75, height: 20, offsetY: 40, attackerHitstop: 3, receiverHitstop: 3, hitboxAttribute: 'normal'
    },
    'normal-d-anchor': {
        name: 'アンカースラスト', cost: 4,
        desc: '相手を真上に軽く打ち上げる下強攻撃。後隙が短く、そのまま地上・空中コンボの起点にできる。',
        startup: 5, active: 3, endlag: 1, damage: 5.5, kbScale: 0.55, angle: 82,
        width: 50, height: 35, offsetY: 25, attackerHitstop: 2, receiverHitstop: 2, hitboxAttribute: 'normal'
    },
'normal-s-kunai': {
        name: 'クナイ投擲', cost: 8,
        desc: '牽制用のクナイを投げる。当たった敵を毒状態にします。',
        startup: 7, active: 0, endlag: 12, damage: 7.0, kbScale: 0.6, angle: 20,
        width: 16, height: 10, offsetY: 20, isProjectile: true,
        attackerHitstop: 1, receiverHitstop: 3, onHitEffect: { type: 'poison', duration: 180 }
    },
    'normal-s-dash': {
        name: 'スライディング・ラッシュ', cost: 12,
        desc: '前方に滑り込みながらローキックを放つ。発生が早く、一気に距離を詰められる。',
        startup: 5, active: 10, endlag: 14, damage: 8.5, kbScale: 0.8, angle: 45,
        width: 65, height: 30, offsetY: 30, attackerHitstop: 4, receiverHitstop: 4, hitboxAttribute: 'normal'
    },

    // ------------------------------------
    // B. 地上スマッシュ攻撃（コストを8〜10PTに低減）
    // ------------------------------------

    'smash-n-straight': {
        name: 'ストレートブレイク', cost: 3,
        desc: '電撃を帯びた強力な正拳突き。発生が早く隙が少ないため、安定して撃墜を狙える。',
        startup: 13, active: 6, endlag: 15, damage: 14.0, kbScale: 1.4, angle: 30,
        width: 85, height: 55, offsetY: 0, attackerHitstop: 8, receiverHitstop: 14,
        hitboxAttribute: 'electric', maxChargeFrames: 50, chargeDmgLimit: 1.45
    },
    'smash-n-rapid-slash': {
        name: '百烈スラッシュ', cost: 9,
        desc: '剣を素早く構え、前方に白銀の超高速多段突きを連射します。長大な持続時間を持ち、ヒットした敵を自分側に引き寄せて拘束し続け、最終段で強烈な一閃を放ちます。',
        startup: 9, active: 40, endlag: 18, damage: 1.5, kbScale: 1.45, angle: 30,
        width: 105, height: 40, offsetY: 10, attackerHitstop: 1, receiverHitstop: 2,
        hitboxAttribute: 'normal', maxChargeFrames: 60, chargeDmgLimit: 1.50,
        actionType: 'rapid_slash', isMultiHit: true, hitInterval: 4,
        weapon: { type: 'sword', color: '#eef5f7', attach: 'hand' }
    },
    'smash-n-fire-fist': {
        name: 'バーニングナックル', cost: 7,
        desc: '前方に激しい炎を纏った拳を突き出す。ヒットした敵を大きく炎上させ、やけどの追加持続ダメージを与える。',
        startup: 14, active: 5, endlag: 16, damage: 15.5, kbScale: 1.5, angle: 35,
        width: 95, height: 50, offsetY: 5, attackerHitstop: 9, receiverHitstop: 11,
        onHitEffect: { type: 'burn', duration: 180 }, maxChargeFrames: 60, chargeDmgLimit: 1.5,
        weapon: { type: 'fist', color: '#ff4500', attach: 'hand' } 
    },
    'smash-n-phantom-fist': {
        name: 'ファントムフィスト', cost: 6,
        desc: '紫のオーラを纏った特殊な拳で正拳突きを放つ。吹っ飛ばさない代わりに敵をスタンし、チャージするほどフラフラの拘束時間が大幅に延長される。',
        startup: 16, active: 4, endlag: 22, damage: 12.0, kbScale: 0.1, angle: 45, 
        width: 90, height: 60, offsetY: 0, attackerHitstop: 6, receiverHitstop: 10,
        maxChargeFrames: 60, chargeDmgLimit: 1.45,
        actionType: 'phantom_fist',
        weapon: { type: 'fist', color: '#da70d6', attach: 'hand' } 
    },
'smash-s-bat-homerun': {
        name: 'ホームランフルスイング', cost: 6,
        desc: '木製バットを担いで力強く振り抜く。発生は遅いが、超威力と飛び道具の反射効果を持つ。',
        startup: 16, active: 4, endlag: 28, damage: 18.0, kbScale: 2.2, angle: 25, // 💥 後隙を18から28へ増加
        width: 90, height: 30, offsetY: 0, attackerHitstop: 14, receiverHitstop: 16,
        hitboxAttribute: 'reflect', maxChargeFrames: 60, chargeDmgLimit: 2.0,
        weapon: { type: 'bat', color: '#cd853f', attach: 'hand' }
    },
    'smash-s-blast-fist': {
        name: 'ブラストフィスト', cost: 8,
        desc: '前方に超高速で突進し、触れた敵を掴んで零距離大爆破を放ちます。チャージすることで威力・突進速度・吹っ飛び力が上昇しますが、外した際の後隙が非常に大きいです。',
        startup: 11, active: 14, endlag: 34, damage: 16.0, kbScale: 1.5, angle: 35,
        width: 65, height: 50, offsetY: 5, attackerHitstop: 12, receiverHitstop: 16,
        hitboxAttribute: 'explosion', maxChargeFrames: 60, chargeDmgLimit: 1.55,
        actionType: 'blast_fist' 
    },
    'smash-s-phantom-strike': {
        name: 'ファントムストライク', cost: 6,
        desc: '紫のオーラを纏った拳を突き出す。溜めの長さに比例して、射程がビヨーンと伸びる特殊な伸縮パンチ。',
        startup: 15, active: 6, endlag: 25, damage: 14.5, kbScale: 1.4, angle: 35,
        width: 75, height: 50, offsetY: 0, attackerHitstop: 8, receiverHitstop: 10,
        maxChargeFrames: 60, chargeDmgLimit: 1.4,
        actionType: 'phantom_strike',
        weapon: { type: 'fist', color: '#9400d3', attach: 'hand' } 
    },
        'smash-s-sword-draw': {
        name: '迅一閃', cost: 7,
        desc: '一瞬で刀を引き抜き、前方の広範囲を一閃する。刀身が長く、リーチに極めて優れている。',
        startup: 11, active: 4, endlag: 23, damage: 14.5, kbScale: 1.4, angle: 20, // 💥 後隙を17から23へ増加
        width: 120, height: 35, offsetY: 10, attackerHitstop: 10, receiverHitstop: 12,
        maxChargeFrames: 50, chargeDmgLimit: 1.4,
        weapon: { type: 'sword', color: '#eef5f7', attach: 'hand' }
    },
    'smash-s-surprise': {
        name: '変則奇襲斬り', cost: 8,
        desc: '前方に高速突進し、一撃を放ちます。突進中に上下キーを入力することで突進軌道を上下に曲げることができます。最大距離に達する前に敵にぶつかるとその場で即時攻撃します。',
        startup: 40, active: 4, endlag: 14,
        damage: 15.5, kbScale: 1.45,
        width: 75, height: 60, offsetY: 0,
        actionType: 'surprise_strike',
        weapon: { type: 'sword', color: '#ffd700', attach: 'hand' }
    },
    'smash-s-ice-hammer': {
        name: 'アイスバーグクラッシュ', cost: 8,
        desc: 'シアンに輝く巨大な氷のハンマーを叩きつける。ヒットした敵を完全に凍りつかせ、大きな隙を晒させます。',
        startup: 15, active: 4, endlag: 18, damage: 15.0, kbScale: 1.45, angle: 45,
        width: 90, height: 70, offsetY: 10, attackerHitstop: 6, receiverHitstop: 8,
        maxChargeFrames: 60, chargeDmgLimit: 1.5,
        onHitEffect: { type: 'freeze', duration: 120 }, 
        weapon: { type: 'hammer', color: '#00e5ff', attach: 'hand' }
    },
    'smash-d-somersault': {
        name: '地烈サマーソルトキック', cost: 4,
        desc: '宙返りしながら地面近くから上空を大きく薙ぎ払う。足元をすくいながら相手を大きく真上に打ち上げる。',
        startup: 11, active: 7, endlag: 21, damage: 15.0, kbScale: 1.3, angle: 85, // 💥 後隙を17から21へ増加
        width: 65, height: 90, offsetY: -40, attackerHitstop: 8, receiverHitstop: 9,
        maxChargeFrames: 60, chargeDmgLimit: 1.50
    },
     'smash-d-chika-enen': {
        name: '地火延々', cost: 8,
        desc: '姿勢を低くして地面を殴りつけ、地形に沿って高速で前進する火柱を放つ。段差や急な傾斜も滑らかに駆け登りながら敵を押し流します。',
        startup: 12, active: 4, endlag: 22, damage: 10.0, angle: 45, kbScale: 1.25, // 💥 後隙を16から22へ増加
        width: 45, height: 110,
        actionType: 'chika_enen_action',
        isProjectile: true
    },
    'smash-d': {
        name: '破砕グランドフォースプレス', cost: 9,
        desc: '地面を強く踏み抜いて衝撃波を放つ。地上の敵を衝撃で一時的に埋め（行動不能）状態にする。',
        startup: 15, active: 5, endlag: 20, damage: 13.5, kbScale: 1.45, angle: 50,
        width: 180, height: 30, offsetY: 35, attackerHitstop: 8, receiverHitstop: 10,
        maxChargeFrames: 90, chargeDmgLimit: 1.75
    },
    'smash-d-spin-kick': {
        name: '迅雷旋風スピニングスウィープ', cost: 8,
        desc: '姿勢を低くしながら前後に1回ずつ高速回転足払いを放つ。前後同時に敵が迫っているときの囲み突破に有効。',
        startup: 7, active: 10, endlag: 14, damage: 11.5, kbScale: 1.25, angle: 45,
        width: 160, height: 25, offsetY: 35, attackerHitstop: 6, receiverHitstop: 8,
        hitboxAttribute: 'electric', maxChargeFrames: 50, chargeDmgLimit: 1.4
    },
    'smash-d-earth-quake': {
        name: '隆起する大震岩石ブレイク', cost: 9,
        desc: '地面に強烈な拳を打ち込み、左右の地表からトゲトゲしい岩石を隆起させる。判定の縦幅が広い。',
        startup: 16, active: 6, endlag: 22, damage: 15.0, kbScale: 1.35, angle: 65,
        width: 140, height: 55, offsetY: 20, attackerHitstop: 10, receiverHitstop: 10,
        maxChargeFrames: 60, chargeDmgLimit: 1.5,
        actionType: 'earthquake_smash' 
    },
    'smash-d-ground-explosion': {
        name: 'グラウンドエクスプロージョン', cost: 9,
        desc: '地面を殴りつけた衝撃（一段目）のあと、地表から天を貫く極太衝撃波（二段目・飛び道具）を噴き出させます。前隙は大きいですが、チャージすることで攻撃範囲（高さ）と威力が極大化します。',
        startup: 25, active: 5, endlag: 24, damage: 17.5, kbScale: 1.45, angle: 85, // 💥 後隙を18から24へ増加
        width: 75, height: 50, offsetY: 15, attackerHitstop: 10, receiverHitstop: 12,
        maxChargeFrames: 60, chargeDmgLimit: 1.60,
        actionType: 'ground_explosion' 
    },
// ------------------------------------
    // C. 空中通常攻撃
    // ------------------------------------
    'air-normal-n': {
        name: '全方位電撃スピン', cost: 4,
        desc: '全身から雷を放出しながらスピンする。周囲の敵を感電させるため、暴れや着地際のお守りに最適。',
        startup: 5, active: 8, endlag: 10, damage: 7.5, kbScale: 0.8, angle: 45,
        width: 80, height: 80, offsetY: -10, attackerHitstop: 4, receiverHitstop: 8,
        hitboxAttribute: 'electric', isMultiHit: true
    },
    'air-normal-n-crystal-chaff': {
        name: 'クリスタルチャフ', cost: 6,
        desc: '周囲に氷の結晶を散布しながら、自身の落下速度をスローにする。',
        startup: 4, active: 22, endlag: 8, damage: 6.5, kbScale: 0.85, angle: 45,
        width: 90, height: 90, offsetY: 0, attackerHitstop: 2, receiverHitstop: 4,
        actionType: 'crystal_chaff_action', isMultiHit: true, hitInterval: 6,
        onHitEffect: { type: 'freeze', duration: 30 }
    },
    'air-normal-n-gravity-pulse': {
        name: 'グラビティパルス', cost: 7,
        desc: '自身の中心から紫色の重力波を発生させる。ヒットした敵を吹き飛ばさずに手元へ強く引き寄せる。',
        startup: 6, active: 18, endlag: 10, damage: 1.5, kbScale: 0.1, angle: 90,
        width: 340, height: 340, offsetY: 0, attackerHitstop: 1, receiverHitstop: 2, // 💥 直径340px（半径170px：元の2倍）に変更
        actionType: 'gravity_pulse_action'
    },
    'air-normal-tail-spin': {
        name: 'しっぽヘリコプター', cost: 7,
        desc: 'しっぽをプロペラのように回してゆっくり落下しながら、周囲を多段ヒットで巻き込みます。',
        startup: 5, active: 30, endlag: 12, damage: 2.2, kbScale: 0.4, angle: 80,
        width: 110, height: 52, offsetY: 5, attackerHitstop: 1, receiverHitstop: 2,
        isMultiHit: true, fastFallSpeed: 0.5
    },
    'air-normal-s-meteor-punch': {
        name: 'メテオイナズマパンチ', cost: 5,
        desc: '前方に豪快な鉄拳を振り下ろす。拳の先端で捉えると相手を真下へ叩き落とすメテオ判定になります。',
        startup: 13, active: 4, endlag: 16, damage: 11.5, kbScale: 1.4, angle: 270,
        width: 75, height: 50, offsetY: 15, attackerHitstop: 8, receiverHitstop: 12, hitboxAttribute: 'electric'
    },
    'air-normal-up': {
        name: 'クレセント・ソニック', cost: 8,
        desc: '真上に三日月型の真空波を放つ。上にいる敵を鋭く切り裂き、さらに上空へ運ぶ。',
        startup: 6, active: 6, endlag: 12, damage: 9.5, kbScale: 1.0, angle: 90,
        width: 70, height: 90, offsetY: -45, attackerHitstop: 4, receiverHitstop: 6,
        actionType: 'crescent_sonic',
        isProjectile: true 
    },
    
    'air-normal-up-somersault': {
        name: 'サマーソルト・エアキック', cost: 5,
        desc: '空中宙返りをしながら、頭上の広範囲を鋭い蹴り技でなぎ払う。真上に強く打ち上げるコンボ技。',
        startup: 6, active: 5, endlag: 10, damage: 8.5, kbScale: 1.15, angle: 85,
        width: 65, height: 75, offsetY: -35, attackerHitstop: 4, receiverHitstop: 4, hitboxAttribute: 'normal'
    },
    'air-normal-d': {
        name: '急降下メテオドリル', cost: 6,
        desc: '急降下して敵にまとわりつき、そのまま地上の連携の起点とする。',
        startup: 5, active: 8, endlag: 6, damage: 7.5, kbScale: 0.95, angle: 270,
        width: 40, height: 60, offsetY: 30, attackerHitstop: 4, receiverHitstop: 5, fastFallSpeed: 10
    },
    'air-normal-d-meteor-nail': {
        name: 'メテオネイル', cost: 6,
        desc: '足元に炎爪を宿して真下を切り裂く。先端の刃に触れた敵を、強烈なメテオ判定（真下へ撃墜）で奈落へ叩き落とします。',
        startup: 8, active: 16, endlag: 12, damage: 10.5, kbScale: 1.5, angle: 270,
        width: 48, height: 95, offsetY: 35, attackerHitstop: 6, receiverHitstop: 10,
        fastFallSpeed: 1.5,
        weapon: { type: 'claw', color: '#ff4500', attach: 'foot' }
    },
    'air-normal-d-drain-heel': {
        name: 'ドレインヒールキック', cost: 9,
        desc: '空中でピタッと高度を維持し、ピンヒールを上下に多段ヒットで拘束し、最終段で相手を大きく蹴り飛ばしてHPをドレインします。',
        startup: 8, active: 28, endlag: 14, damage: 10.0, kbScale: 1.25, angle: 45,
        width: 55, height: 65, offsetY: 25, attackerHitstop: 6, receiverHitstop: 8, onHitEffect: { type: 'heal', duration: 1 },
        weapon: { type: 'heel', color: '#ff3388', attach: 'foot' },
        actionType: 'drain_heel_kick',
        isMultiHit: true
    },
    'air-normal-s': {
        name: '煉獄ダブルクロー', cost: 7,
        desc: '炎を帯びた鋭い爪で、前方の空間を激しく引き裂く多段爪撃。当たった敵を炎上させ、やけどの追加持続ダメージを与えます。',
        startup: 5, active: 18, endlag: 10, damage: 5.5, angle: 35, kbScale: 0.9,
        width: 85, height: 40, offsetY: 0, attackerHitstop: 3, receiverHitstop: 4,
        onHitEffect: { type: 'burn', duration: 120 },
        isMultiHit: true, hitInterval: 6,
        weapon: { type: 'claw', color: '#ff4500', attach: 'hand' } 
    },
    'air-normal-s-mach-tornado': {
        name: '竜巻', cost: 8,
        desc: '自身を竜巻で包み込みながら高速で多段ヒット攻撃を行う。発動中は左右キー空中を横移動できる。',
        startup: 8, active: 45, endlag: 18, damage: 1.2, kbScale: 0.1, angle: 80,
        width: 80, height: 80, offsetY: 0, attackerHitstop: 1, receiverHitstop: 3,
        actionType: 'mach_tornado', isMultiHit: true, hitInterval: 5,
        isProjectile: true
    },
    'air-normal-s-lightning-hip': {
        name: 'ライトニングヒップ', cost: 5,
        desc: '前方に鋭く体当たりを放ちます。クリーンヒット時に激しい電撃を帯び、敵を強く吹き飛ばします。',
        startup: 6, active: 6, endlag: 15, damage: 11.5, kbScale: 1.2, angle: 25,
        width: 85, height: 45, offsetY: 5, attackerHitstop: 10, receiverHitstop: 14, hitboxAttribute: 'electric'
    },

    // ------------------------------------
    // D. 空中強スマッシュ攻撃（コストを10〜12PTに低減）
    // ------------------------------------
    'air-smash-n-sphere': {
        name: '真空爆縮サークル', cost: 6,
        desc: '前方にゆっくり進みながら範囲内の敵を中心へ強力に引き寄せ、最後に大爆破を起こす真空サークルを放つ。',
        startup: 9, active: 6, endlag: 16, damage: 14.0, kbScale: 1.35, angle: 45,
        width: 85, height: 85, offsetY: -12, attackerHitstop: 6, receiverHitstop: 10,
        hitboxAttribute: 'normal', maxChargeFrames: 50, chargeDmgLimit: 1.45,
        isProjectile: true
    },
    'air-smash-n-halo-burst': {
        name: '創世ホーリーリング', cost: 9,
        desc: '頭上にふわりと上昇しながら浮遊する神聖な黄金の光輪を射出。上空で拡大しながら超広範囲 of 神聖大爆発を引き起こします。',
        startup: 12, active: 6, endlag: 20, damage: 16.5, kbScale: 1.55, angle: 90,
        width: 130, height: 110, offsetY: -65, attackerHitstop: 8, receiverHitstop: 12,
        hitboxAttribute: 'explosion',
        actionType: 'halo_burst',
        isProjectile: true
    },
    'air-smash-s': {
        name: '重突進メガブレイカー', cost: 9,
        desc: '真横へ超高速突進し、触れた敵を彼方へ吹き飛ばす。復帰補助としての横移動にも使える。',
        startup: 10, active: 10, endlag: 18, damage: 14.5, kbScale: 1.35, angle: 20,
        width: 95, height: 55, offsetY: 0, attackerHitstop: 6, receiverHitstop: 10,
        actionType: 'mega_breaker'
    },
    'air-smash-up': {
        name: '竜巻昇天撃', cost: 4,
        desc: '自身を包み込む巨大な竜巻を発生させて上空へ急上昇！敵を竜巻に巻き込んで多段ヒットさせながら連れ去り、頂上で強烈に打ち上げます。',
        startup: 8, active: 25, endlag: 18, damage: 12.0, kbScale: 1.25, angle: 90,
        width: 75, height: 85, offsetY: -20, attackerHitstop: 4, receiverHitstop: 6,
        actionType: 'tornado_rise', isMultiHit: true,
        isProjectile: true
    },
    'air-smash-s-laser-pierce': {
        name: '超電磁レーザーブレイク', cost: 12,
        desc: '前方の空間を貫く極太電磁レーザーを放ちます。突進しない代わりに非常に射程が長く、離れた敵を安全に撃墜できます。',
        startup: 14, active: 6, endlag: 18, damage: 15.0, kbScale: 1.3, angle: 25,
        width: 240, height: 40, offsetY: 10, attackerHitstop: 8, receiverHitstop: 12, hitboxAttribute: 'electric',
        isProjectile: true
    },
    'air-smash-s-spin-assault': {
        name: '変則急襲斬り', cost: 9,
        desc: '体を激しく前転させながら前方に突撃し、触れた敵を何度も切り刻みながら連れ去り、最後に強力な一撃を放ちます。チャージ量に応じて突進速度と飛距離が上昇します。',
        startup: 12, active: 30, endlag: 28, damage: 13.5, kbScale: 1.35, angle: 35, 
        width: 75, height: 60, offsetY: 0, attackerHitstop: 6, receiverHitstop: 8,
        actionType: 'spin_assault',
        weapon: { type: 'sword', color: '#eef5f7', attach: 'hand' }
    },
    'air-smash-d-giga-drill': {
        name: '破砕ギガドリルメテオ', cost: 9,
        desc: '高速回転ドリルとなり多段ヒットしながら急降下し、最終段で強烈なメテオ判定で敵を叩き落とします。',
        startup: 11, active: 20, endlag: 15, damage: 4.5, kbScale: 1.5, angle: 270,
        width: 44, height: 65, offsetY: 30, attackerHitstop: 2, receiverHitstop: 3,
        isMultiHit: true, fastFallSpeed: 15,
        weapon: { type: 'drill', color: '#cfd8dc', attach: 'foot' }
    },
    'air-smash-s-lightning-chain': {
        name: 'ライトニングチェーン', cost: 10,
        desc: '真横に電磁鎖を射出して敵を自分側に引き寄せ、すれ違いざまに電撃で切り裂く。吹っ飛びは低いが、空中コンボや追撃の起点として極めて優秀。',
        startup: 8, active: 20, endlag: 14, damage: 9.0, kbScale: 1.65, angle: 45,
        width: 40, height: 40, hitboxAttribute: 'electric',
        actionType: 'lightning_chain'
    },
    'air-smash-d-gigaton-press': {
        name: '破砕ギガトンヒッププレス', cost: 11,
        desc: 'お尻を突き出して真下へ超高速急降下！空中の敵には強烈なメテオ、地上の敵には深く埋め状態を適用し、着地時に左右へ衝撃波を放つ。',
        startup: 12, active: 25, endlag: 16, damage: 15.0, kbScale: 1.35, angle: 270,
        width: 55, height: 60, fastFallSpeed: 20,
        actionType: 'gigaton_press'
    },
    'air-smash-d': {
        name: 'ディザスターコメット', cost: 4,
        desc: '当たり判定がわずか「30px幅」の極小ピンポイント。当たれば敵は完全に気絶し、そのまま奈落へ叩き落とされる。',
        startup: 14, active: 4, endlag: 22, damage: 18.0, kbScale: 1.6, angle: 270,
        width: 30, height: 45, offsetY: 40, attackerHitstop: 15, receiverHitstop: 25,
        onHitEffect: { type: 'dizzy', duration: 180 }
    },
    'air-smash-d-buster-bomb': {
        name: 'バスターボム', cost: 11,
        desc: '真下に爆弾を投下する。溜めに応じて、ボム本体の大きさと起爆時の爆風判定サイズが極大化する。時限信管または接触で大爆発。',
        startup: 10, active: 4, endlag: 16, damage: 12.0, kbScale: 1.3, angle: 45,
        width: 30, height: 30,
        isProjectile: true,
        actionType: 'buster_bomb_shoot'
    },
    // ------------------------------------
    // E. 必殺技 (通常・横・上・下)
    // ------------------------------------
    'sp_n_fire': {
        name: 'スプレッドファイア', cost: 5,
        desc: '正面3方向に拡散する火の玉を放つ牽制技。広範囲だが後隙が大きい。',
        startup: 8, active: 4, endlag: 24, damage: 4.0, angle: 30, kbScale: 0.8,
        selfVx: 0, selfVy: 0, width: 90, height: 30, attackerHitstop: 2, receiverHitstop: 2,
        actionType: 'projectile', projCount: 3, fxColor: '#ff6600'
    },
    'sp_n_tentacle': {
        name: 'テンタクル・ホイップ', cost: 10,
        desc: '体から妖しくうねる2本の触手を放ちます。技の実行中に【W/Sキーで上下角度を操作】し、【A/Dキーで長さ（リーチ）を伸縮】させながら、触手全体で敵をバチバチと切り刻み（多段打撃）ます。',
        startup: 4, active: 45, endlag: 12, damage: 1.5, kbScale: 0.12, angle: 80, // 多段ヒット用に再設計
        width: 0, height: 0, attackerHitstop: 1, receiverHitstop: 2,
        actionType: 'tentacle_whip_action' // 💥 完全新規のアクションを登録！
    },
    'sp_n_thunder_blade': {
        name: '雷刃撃', cost: 11,
        desc: '雷を纏った電磁刃を放つチャージ必殺技。ためなしでは高速で直進する長射程の牽制弾になり、溜めるほど射程と弾速が縮小する代わり、至近距離での吹っ飛び力が極大化します。',
        startup: 10, active: 4, endlag: 14, damage: 4.0, angle: 35, kbScale: 0.8,
        isChargeable: true, isKeepable: true,
        actionType: 'thunder_blade_shoot',
        isProjectile: true
    },
'sp_n_charge': {
        name: 'チャージバスター', cost: 9,
        desc: '長押しでエネルギーをチャージ。左右移動・ジャンプ・ガードでためを保持したままキャンセル可能。',
        startup: 15, active: 10, endlag: 15, 
        damage: 19.0,
        kbScale: 1.35,
        angle: 25,
        selfVx: -3, selfVy: 0, width: 60, height: 60, attackerHitstop: 4, receiverHitstop: 5,
        isChargeable: true, isKeepable: true,
        actionType: 'charge_shoot', chargeDmgMult: 2.5, fxColor: '#ffcc00'
    },
    'sp_n_falcon': {
        name: 'ノヴァインパクト', cost: 12,
        desc: '超高威力・超絶ノックバックを誇る渾身の一撃。前隙が極めて大きいがロマン抜群。',
        startup: 45, active: 6, endlag: 25, damage: 28.0, angle: 30, kbScale: 2.2,
        selfVx: 2, selfVy: 0, width: 100, height: 60, attackerHitstop: 15, receiverHitstop: 18,
        actionType: 'falcon_punch', fxColor: '#ff3300'
    },
    'sp_n_arrow': {
        name: 'ガイダンスコア', cost: 11,
        desc: '発射後、W/A/S/Dキーで自由に操作できるエネルギー弾。操作中本体は無敵だが無防備。',
        startup: 10, active: 180, endlag: 15, damage: 10.0, angle: 45, kbScale: 1.1,
        selfVx: 0, selfVy: 0, width: 25, height: 25, attackerHitstop: 2, receiverHitstop: 4,
        isGuided: true, actionType: 'guided_bullet', bulletLife: 180, fxColor: '#00ffcc',
        isProjectile: true // ★追加：これにより、発動時の不自然な赤い四角形（近接判定枠）が非表示になります
    },
    'sp_n_flame': {
        name: '火炎ブレス', cost: 13,
        desc: '前方に多段ヒットする火炎放射を放射。吹っ飛びは弱いが発生が非常に早い。',
        startup: 3, active: 40, 
        endlag: 6, // ★ 15 から 6 に短縮
        damage: 0.4, angle: 15, kbScale: 0.2,
        selfVx: 0.2, selfVy: 0, width: 140, height: 50, attackerHitstop: 1, receiverHitstop: 1,
        isFlame: true, isMultiHit: true, actionType: 'flame_breath', fxColor: '#ff4400',
        isProjectile: true,
        isCustomHold: true // 💡 追加：長押し入力を有効にする
    },
    'sp_n_homing': {
        name: 'シーカーストライク', cost: 12,
        desc: '空中へ軽くジャンプ後、最も近くにいる敵を検出し、その座標へ超高速で突進体当たりする。',
        startup: 12, active: 15, endlag: 12, damage: 11.0, angle: 30, kbScale: 1.2,
        selfVx: 0, selfVy: -5, width: 50, height: 50, attackerHitstop: 4, receiverHitstop: 6,
        isHoming: true, actionType: 'homing_attack', 
        homingSpeed: 32,
        fxColor: '#ff3333'
    },
    'sp_n_grab': {
        name: 'グラビティキャッチ', cost: 13,
        desc: '前方の敵を拘束フィールドで「つかみ」、身動きを奪ったあとで斜め上に豪快に投げ飛ばす。',
        startup: 6, active: 6, endlag: 20, damage: 13.0, angle: 45, kbScale: 1.4,
        selfVx: 0, selfVy: 0, width: 45, height: 40, attackerHitstop: 3, receiverHitstop: 3,
        isGrab: true, actionType: 'grab_throw', isFixedKb: true, fixedKbValue: 12, fxColor: '#aa33ff'
    },
    'sp_n_javelin': {
        name: 'タクティカルジャベリン', cost: 15,
        desc: 'エネルギー槍を生成して手元に持つ。もう一度押すと前方に投擲する。地面に刺さった槍は再利用可能。',
        startup: 8, active: 4, endlag: 12, damage: 12.0, angle: 35, kbScale: 1.2,
        selfVx: 0, selfVy: 0, width: 20, height: 20, attackerHitstop: 3, receiverHitstop: 4,
        isJavelin: true, actionType: 'javelin', paramSpeed: 14, fxColor: '#00ff00'
    },
    'sp_n_block': {
        name: 'ブロッククリエイト', cost: 15,
        desc: '目の前の空中に乗れるブロックを1個だけ生成する。新しく作ると古いブロックは自動的に消滅する。',
        startup: 6, active: 2, endlag: 12, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 45, height: 45, actionType: 'create_block'
    },
    'sp_n_fireball': {
        name: 'ファイアボール', cost: 12,
        desc: '地形に当たるとポンポンと跳ねる（バウンドする）火の玉を前方に放つ。',
        startup: 8, active: 2, endlag: 12, damage: 5.0, angle: 20, kbScale: 0.6,
        selfVx: 0, selfVy: 0, width: 20, height: 20, actionType: 'fireball_shoot'
    },
    'sp_n_chef': {
        name: 'フライパンからこぼれ落ちる物', cost: 8,
        desc: '前方に放物線を描いて飛ぶフライパンの具材を連続でばら撒く。',
        startup: 5, active: 40, endlag: 15, damage: 3.0, angle: 45, kbScale: 0.3,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'chef_pan'
    },
    'sp_n_flare_seal': {
        name: 'シャドウフレア', cost: 11,
        desc: '追尾する闇の弾を撃ち、当たった敵の周囲を回る。5秒後に中心に向かって大爆発を起こす。',
        startup: 10, active: 4, endlag: 14, damage: 18.0, angle: 45, kbScale: 1.5,
        selfVx: 0, selfVy: 0, width: 25, height: 25, actionType: 'flare_seal'
    },
    'sp_n_boomerang': {
        name: 'クレイモアブーメラン', cost: 10,
        desc: '前方に投げて、手元に自動で戻ってくるブーメラン。行きと帰りの両方に攻撃判定がある。',
        startup: 6, active: 2, endlag: 10, damage: 6.0, angle: 35, kbScale: 0.8,
        selfVx: 0, selfVy: 0, width: 22, height: 22, actionType: 'boomerang_shoot'
    },
    'sp_n_byleth_bow': {
        name: '神魔弓', cost: 16,
        desc: '長押しでチャージ。最大まで溜めて放つ矢は、ステージの端まで一瞬で突き抜ける即死級の光弾となる。',
        startup: 15, active: 4, endlag: 18, damage: 10.0, angle: 25, kbScale: 1.0,
        selfVx: -2, selfVy: 0, width: 30, height: 10, attackerHitstop: 6, receiverHitstop: 8,
        isCustomHold: true, maxChargeFrames: 100, actionType: 'bow_shoot'
    },
    'sp_n_giant_hammer': {
        name: 'ギガブレイカー', cost: 9,
        desc: '極限チャージハンマー。溜めている間は敵の攻撃に耐える頑丈なアーマーを纏い、最大溜めで放つ一撃は相手を撃墜させる。',
        startup: 18, active: 4, endlag: 22, damage: 18.0, angle: 35, kbScale: 1.4,
        selfVx: 4, selfVy: 0, width: 90, height: 70, isCustomHold: true, maxChargeFrames: 90,
        actionType: 'giant_hammer',
        weapon: { type: 'hammer', color: '#546e7a', attach: 'hand' }
    },
    'sp_n_poison_fog': {
        name: 'ポイズン・フォグ', cost: 15,
        desc: '前方に侵入した敵に持続ダメージと毒を付与し続ける紫のガス雲を設置する。最大1個のみ設置可能。',
        startup: 8, active: 4, endlag: 14, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'place_poison_fog'
    },
    'sp_n_sing': {
        name: 'プリン・うたう', cost: 14,
        desc: '周囲に子守唄の音波を3回放ち、触れた敵を一時的に深いねむり状態にする。',
        startup: 12, active: 40, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'sing_song'
    },
    'sp_n_giant_punch': {
        name: 'ジャイアントパンチ', cost: 7,
        desc: '長押しでチャージ。左右移動・ジャンプ・ガードでためを保持したままキャンセル可能。',
        startup: 12, active: 5, endlag: 18, 
        damage: 20.0,
        kbScale: 3,
        angle: 25,
        width: 75, height: 60,
        selfVx: 4, selfVy: 0,
        attackerHitstop: 6, receiverHitstop: 10,
        weapon: { type: 'fist', color: '#ffcc00', attach: 'hand' },
        isChargeable: true,
        isKeepable: true,
        actionType: 'giant_punch',
        fxColor: '#ffcc00'
    },
'sp_n_thack': {
        name: '死の弾丸', cost: 16,
        desc: '自傷50%の代償と引き換えに、20%（1/5）の確率で敵を即死させる死の弾丸。吸収されると敵は全快する。反射されるたびに即死確率が倍増（40%➔80%➔確定）し、最終段は反射・吸収を完全貫通する確定即死弾となります。',
        startup: 16, active: 4, endlag: 12, damage: 3.5, kbScale: 1.1, angle: 45,
        actionType: 'thack_bullet', isProjectile: true
    },
    'sp_n_blizzard_breath': {
        name: 'ブリザードブレス', cost: 11,
        desc: '前方に吹雪と冷気を放射する。長押しで維持・収束が可能。当たった敵を凍らせて機動力を著しく奪います。',
        startup: 4, active: 40, endlag: 8, damage: 0.5, angle: 15, kbScale: 0.15,
        width: 140, height: 50, attackerHitstop: 1, receiverHitstop: 1,
        actionType: 'blizzard_breath', fxColor: '#e0ffff',
        isProjectile: true,
        isCustomHold: true // 💡 追加：長押し入力を有効にする
    },
'sp_s_dash': {
        name: 'スラッシュドライブ', cost: 6,
        desc: '前方に画面半分を一瞬で一閃突進。',
        startup: 6, active: 12, endlag: 14, damage: 9.0, angle: 25, kbScale: 1.85,
        selfVx: 20, selfVy: 0, width: 110, height: 60, attackerHitstop: 4, receiverHitstop: 8,
        actionType: 'dash_slash', fxColor: '#ffffff'
    },
       'sp_s_max_typhoon': {
        name: 'マキシマムタイフーン', cost: 10,
        desc: '突風弾を前方に飛ばす。長押しチャージすることで弾のサイズ、飛距離、および押し出しノックバックが大幅に強化される。',
        startup: 10, active: 4, endlag: 12, damage: 0.0, angle: 35, kbScale: 1.35,
        isProjectile: true, isChargeable: true, isKeepable: false,
        actionType: 'max_typhoon_action'
    },
    'sp_s_max_cyclone': {
        name: 'マキシマムサイクロン', cost: 12,
        desc: '進行方向に引き寄せ重力場を纏った風の刃を飛ばす。ルート上の敵や敵の飛び道具を絡め取って吸引しながら前進する。ためで射程と範囲が強化。',
        startup: 12, active: 4, endlag: 14, damage: 0.0, angle: 45, kbScale: 0.85,
        isProjectile: true, isChargeable: true, isKeepable: false,
        actionType: 'max_cyclone_action'
    },

     'sp_s_chargerush': {
        name: 'マッハディバイド', cost: 11,
        desc: '長押しでチャージ。最大まで溜まるか、ボタンを離すと自動発動する長押しリリース型必殺技。',
        startup: 10, active: 12, endlag: 18, damage: 9.0, angle: 15, kbScale: 1.2,
        selfVx: 6, selfVy: 0, width: 80, height: 50, attackerHitstop: 4, receiverHitstop: 5,
        isChargeable: true, 
        isKeepable: false, // ★修正：ため保持「不可（リリース型）」に変更
        actionType: 'charge_dash', maxCharge: 100, fxColor: '#ffff00'
    },
    'sp_s_cape': {
        name: 'リバースクローク', cost: 3,
        desc: 'マントを翻し、相手の移動方向を真逆に反転させる。空中発動で少し浮く。',
        startup: 5, active: 4, endlag: 12, damage: 3.0, angle: 0, kbScale: 0.5,
        selfVx: 1, selfVy: -3, width: 75, height: 50, attackerHitstop: 2, receiverHitstop: 6,
        actionType: 'reverse_cloak', fxColor: '#555555'
    },
    'sp_s_dodge': {
        name: 'フェイズシフト', cost: 4,
        desc: '向いている方向へ高速ダッシュで回避移動を行う。',
        startup: 2, active: 16, endlag: 5, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 13, selfVy: 0, width: 0, height: 0, isDodge: true,
        actionType: 'dodge_shift', fxColor: '#33ffff'
    },
    'sp_s_quick_attack': {
        name: '電光石火', cost: 7,
        desc: '超高速で方向転換しながら2連続で突進する。移動中に触れた敵を切り裂く。',
        startup: 4, active: 16, endlag: 10, damage: 4.0, angle: 45, kbScale: 0.8,
        selfVx: 0, selfVy: 0, width: 50, height: 50, attackerHitstop: 2, receiverHitstop: 2,
        actionType: 'quick_attack'
    },
    'sp_s_judge': {
        name: 'ジャッジハンマー', cost: 3,
        desc: 'ハンマーを振り下ろして1〜9の数字をランダムに判定。9が出れば即死級。ハンマー側面に抽選されたデジタル数字が浮かび上がります。',
        startup: 16, active: 4, endlag: 20, damage: 10.0, angle: 45, kbScale: 1.0,
        selfVx: 3, selfVy: 0, width: 70, height: 60, attackerHitstop: 6, receiverHitstop: 8,
        actionType: 'judge_hammer',
        weapon: { type: 'judge_hammer', color: '#1c1c1c', attach: 'hand' } // 💥 デジタルハンマー
    },
    'sp_s_slot_hammer': {
        name: 'スロットハンマー', cost: 5,
        desc: 'ハンマー3つ分を並べて豪快に振り下ろす。3つの数字が揃うと、そのゾロ目値がそのまま被弾ダメージに（999%なら即死）。ハズレ時は自分が10%自傷。自分のダメージが高いほど、揃う当たり確率が劇的に上昇します。',
        startup: 18, active: 4, endlag: 22, damage: 8.0, angle: 45, kbScale: 1.1,
        selfVx: 3, selfVy: 0, width: 210, height: 60, attackerHitstop: 8, receiverHitstop: 10, // 3倍の判定範囲(210px)
        actionType: 'slot_hammer',
        weapon: { type: 'slot_hammer', color: '#ffaa00', attach: 'hand' } // 💥 3連金ハンマー
    },
    'sp_s_diving_press': {
        name: 'ダイビングスラム', cost: 10,
        desc: '前方に突進し、触れた敵を掴んだまま一緒に大跳躍。その後、超高速で垂直落下して地面に叩き潰す。',
        startup: 8, active: 20, endlag: 15, damage: 16.0, angle: 45, kbScale: 1.4,
        selfVx: 8, selfVy: 0, width: 55, height: 50, attackerHitstop: 5, receiverHitstop: 8,
        isGrab: true, actionType: 'diving_press'
    },
    'sp_s_focus_strike': {
        name: 'セービングフォーカス', cost: 9,
        desc: 'K(またはI)キーを押し続けている間、敵の攻撃を1発だけ完全に耐えるアーマーを纏い、離すと敵を崩れ落ちダウンにする打撃を放つ。',
        startup: 6, active: 10, endlag: 15, damage: 12.0, angle: 40, kbScale: 0.5,
        selfVx: 0, selfVy: 0, width: 60, height: 50, attackerHitstop: 5, receiverHitstop: 6,
        actionType: 'focus_strike'
    },
    'sp_s_blast_flare': {
        name: 'ブラストフレア', cost: 7,
        desc: '前方に火の玉を撃ち、敵や地面に触れた瞬間に激しい火柱となってその場に数秒間残り、敵を多段ヒットで拘束する。',
        startup: 8, active: 4, endlag: 14, damage: 3.0, angle: 45, kbScale: 0.3,
        selfVx: 0, selfVy: 0, width: 15, height: 15, actionType: 'blast_flare'
    },
    'sp_s_clay_rocket': {
        name: 'ハニワロケット', cost: 6,
        desc: 'ハニワを前方に射出。ボタン長押しで自分自身がハニワに乗って突進し、途中で飛び降りることも可能。',
        startup: 10, active: 30, endlag: 14, damage: 13.0, angle: 35, kbScale: 1.3,
        selfVx: 0, selfVy: 0, width: 40, height: 25, actionType: 'loid_rocket',
        isCustomHold: true,
        weapon: { type: 'clay_rocket', color: '#deb887', attach: 'foot' }
    },
       'sp_s_minecart': {
        name: 'トロッコ', cost: 10,
        desc: '長押しでトロッコに乗って高速体当たり（バースト力強）。単押し時は空のトロッコを走らせ、当たった敵を中に閉じ込めて搬送し、復帰阻止や追撃を狙えます。空中では単押し・搭乗とも即失速してほぼ垂直落下します。',
        startup: 12, active: 35, endlag: 16, damage: 14.0, angle: 45, kbScale: 1.35,
        selfVx: 0, selfVy: 0, width: 45, height: 30, actionType: 'minecart_action',
        isCustomHold: true,
        weapon: { type: 'minecart', color: '#546e7a', attach: 'foot' }
    },
    'sp_s_kart': {
        name: 'カートランナー', cost: 12,
        desc: '長押しでカートに乗り、他の行動（ジャンプ・通常・スマッシュ・必殺技）をするまで高速自由走破。地上・空中性能が上がります。単押し時は目の前にカートを落とし、落下物（メテオ判定）として崖下の復帰を阻止する障害物になります。',
        startup: 10, active: 40, endlag: 14, damage: 11.0, angle: 35, kbScale: 1.2,
        selfVx: 0, selfVy: 0, width: 50, height: 35, actionType: 'kart_action',
        isCustomHold: true,
        weapon: { type: 'kart', color: '#ff3300', attach: 'foot' }
    },
    'sp_s_roller': {
        name: 'スプラローラー', cost: 11,
        desc: 'ローラーを引いて地上を高速突進。地上の敵を衝撃で深く「埋め」、空中の敵を下に叩き落とす「メテオ」にします。走行中、足元のローラー部分に丸い衝突判定が発生します。',
        startup: 8, active: 35, endlag: 15, damage: 7.0, angle: 270, kbScale: 1.0,
        selfVx: 5.5, selfVy: 0, width: 55, height: 45,
        actionType: 'roller_dash',
        // ★修正：インクローラー（type: 'roller'、インク色: #39ff14）を武器としてアタッチ
        weapon: { type: 'roller', color: '#39ff14', attach: 'hand' }
    },
    'sp_s_power_dot': {
        name: 'ドット・ランナー', cost: 17,
        desc: '自由軌道突進。突進中、方向キーを入力することで上下左右の全方向に最大3回まで「直角ターン」しながらジグザグに突き抜ける。触れた敵に大ダメージ。',
        startup: 6, active: 45, endlag: 12, damage: 15.0, angle: 30, kbScale: 1.3,
        selfVx: 0, selfVy: 0, width: 60, height: 60, actionType: 'power_dot_dash'
    },
    'sp_s_assault': {
        name: '変則強襲斬り', cost: 8,
        desc: '突進中は一切攻撃判定がなく無防備ですが、突進中にジャンプボタン（Wキー）で動作をキャンセルできます。終着点で強力な単発バースト斬撃を浴びせます。',
        startup: 32, active: 4, endlag: 14, damage: 21.5, kbScale: 2.25, angle: 30, // 💡威力を21.5、吹っ飛びを1.85へ大幅強化
        selfVx: 0, selfVy: 0, width: 85, height: 60, offsetY: 0, attackerHitstop: 10, receiverHitstop: 12,
        actionType: 'surprise_assault',
        weapon: { type: 'sword', color: '#eef5f7', attach: 'hand' }
    },
    'sp_s_blaze_nova': {
        name: 'ブレイズノヴァ', cost: 10,
        desc: '前方に低速で滞空する3つの炎の塊を発射する。敵が接触するか一定時間経過すると爆発して敵を吹き飛ばす。',
        startup: 12, active: 4, endlag: 16, damage: 8.0, angle: 45, kbScale: 1.2,
        actionType: 'blaze_nova_shoot'
    },
   'sp_n_lockon': {
        name: 'ロックオン射撃', cost: 14,
        desc: '自機から敵に向けてカーソルが移動し、一定時間でレーザー射撃。発動中も移動できますが、長押しで誘導性能が強化。ただし自機と敵の間に障害物があると射線が遮られます。',
        startup: 35, active: 4, endlag: 14, damage: 13.5, kbScale: 1.25, angle: 35,
        actionType: 'lockon_shot'
    },
        'sp_n_ryoga': {
        name: '凌牙天征', cost: 5,
        desc: '長押し中、周囲の敵や飛び道具を暴風で手元に強烈に引き寄せる。ボタン解放時に凄まじい上バースト力で天高く打ち上げる。ガードをも押し出す。',
        startup: 10, active: 6, endlag: 22, damage: 0.0, angle: 90, kbScale: 2.85,
        isCustomHold: true, maxChargeFrames: 120,
        actionType: 'ryoga_action'
    },

    'sp_up_jump': {
        name: 'ライジングスラスト', cost: 3,
        desc: '上昇気流を纏って真上に急上昇。復帰に必須の技。敵を真上に突き上げる。',
        startup: 4, active: 12, endlag: 18, damage: 9.0, angle: 85, kbScale: 1.1,
        selfVx: 1.5, selfVy: -16, width: 50, height: 100, attackerHitstop: 3, receiverHitstop: 4,
        isHelpless: true, actionType: 'rising_thrust', fxColor: '#ffffff'
    },
    'sp_up_ice_storm': {
        name: 'アイスストーム', cost: 8,
        desc: '足元に氷の暴風を発生させて急上昇する復帰技。下に作り出された嵐に触れた敵を凍らせて奈落へ叩き落とします。',
        startup: 8, active: 25, endlag: 15, damage: 2.0, angle: 270, kbScale: 1.20, // 真下メテオ
        actionType: 'ice_storm_action', fxColor: '#00ffff',
        isProjectile: true,
        isHelpless: true // 💡 追加：上昇終了時に「尻もち落下（灰色状態）」へ移行するように設定します
    },
'sp_up_flame_wheel': {
        name: '火炎車', cost: 10,
        desc: '短い溜めの間に方向キーを入力し、炎を纏って一直線に突進する。',
        startup: 11, active: 10, endlag: 18, 
        damage: 19.5,
        angle: 36,
        kbScale: 1.90,
        isHelpless: true,
        actionType: 'flame_wheel_dash'
    },
    'sp_up_teleport': {
        name: '次元跳躍', cost: 9,
               desc: '一瞬で向いている方向に長距離を瞬間移動する。移動中は無敵状態となる。',
        startup: 2, active: 2, endlag: 8, damage: 0.0, angle: 90, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 40, height: 40, attackerHitstop: 0, receiverHitstop: 0,
        actionType: 'teleport', paramDist: 180, fxColor1: '#aa33ff', fxColor2: '#7700cc',
        isProjectile: true,
        isHelpless: true // ★追加：これにより、ワープ硬直の明けは着地するまでアクション不可（尻もち落下）になります
    },
    'sp_up_aether': {
        name: 'グランドディバイド', cost: 13,
        desc: '上昇気流で上昇後、超高速で垂直急降下し、敵を真下に叩き落とす。着地時に大爆発を起こす。',
        startup: 6, active: 35, endlag: 20, damage: 14.0, angle: 270, kbScale: 1.8,
        selfVx: 0, selfVy: -14, width: 60, height: 90, attackerHitstop: 5, receiverHitstop: 10,
        isAether: true, isHelpless: true, actionType: 'aether', fxColor: '#ffffff',
        fastFallSpeed: 22 // ★追加：物理上限クランプを強制解除し、落下中に『時速マッハ級』の等速急降下を維持します
    },
    'sp_up_grapple': {
        name: 'グラップ・リンク', cost: 4,
        desc: '斜め上に電磁ワイヤーを射出。地形や空中足場にヒットすると、その位置まで自身をスイング牽引する。',
        startup: 4, active: 15, endlag: 10, damage: 2.0, angle: 90, kbScale: 0.2,
        selfVx: 0, selfVy: 0, width: 8, height: 8, attackerHitstop: 1, receiverHitstop: 1,
        actionType: 'grapple', paramDist: 450, fxColor: '#00ffcc' // ★射程を450pxに向上
    },
    'sp_up_spin_attack': {
        name: '大回転斬り', cost: 5,
        desc: '地上ではその場で大回転の多段攻撃。空中では多段ヒットしながら上昇する強力な復帰技。左右キーで空中を大きく横移動できる。',
        startup: 6, active: 30, endlag: 15, damage: 2.2, angle: 45, kbScale: 0.4,
        isHelpless: true, actionType: 'spin_attack', isMultiHit: true,
        weapon: { type: 'sword', color: '#eef5f7', attach: 'hand' } // 💥 鋼鉄の白銀聖剣
    },
    'sp_up_falcon_dive': {
        name: '鷹ダイブ', cost: 12,
        desc: '斜め上につかみ判定を持った突進。敵に触れると捕まえて爆破し、自分は上空へ宙返りする。',
        startup: 8, active: 20, endlag: 12, damage: 14.0, angle: 45, kbScale: 1.5,
        selfVx: 7.0, selfVy: -15.5, width: 45, height: 50, attackerHitstop: 6, receiverHitstop: 8,
        isGrab: true, isHelpless: true, actionType: 'falcon_dive'
    },
'sp_up_chain_pull': {
        name: 'チェイン・グラブ', cost: 7,
        desc: '斜め上に鎖を伸ばし、敵に当たると自分側に引き寄せてすれ違いざまに真下へ叩き落とす（極大メテオ判定）。',
        startup: 6, active: 20, endlag: 12, damage: 14.0, angle: 270, kbScale: 2.4, 
        selfVx: 0, selfVy: 0, width: 40, height: 40, offsetY: -30, attackerHitstop: 6, receiverHitstop: 12,
        actionType: 'chain_pull' 
    },
    'sp_up_balloon': {
        name: '風船トリップ', cost: 14,
        desc: '風船を2個つけて空をふわふわと自在に上昇する。風船が割られると尻もち落下になります。上昇中は頭上の風船部分に丸い攻撃判定が発生します。',
        startup: 4, active: 60, endlag: 10, damage: 4.0, angle: 85, kbScale: 0.8,
        selfVx: 0, selfVy: -6, width: 30, height: 30, isHelpless: true,
        actionType: 'balloon_trip',
        weapon: { type: 'balloon', color: '#ff2200', attach: 'head' }
    },
    'sp_up_gravity_reverse': {
        name: 'グラビティリバース', cost: 16,
        desc: '重力反転。使用すると約3秒間、プレイヤーの重力が反転し、上空に向かって落下（上昇フライト）する。空中戦を完全に支配する特殊技。',
        startup: 4, active: 10, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'gravity_reverse'
    },
      'sp_up_warpdoor': {
        name: 'ワープドア', cost: 13,
        desc: '使うと目の前に消滅時間の短いドアを設置。消える前にもう一度上Bを押すとドアに瞬間移動。出入り後は長い後隙を伴う尻もち落下に移行するため、精密な状況判断が必要です。',
        startup: 10, active: 2, endlag: 18, damage: 0.0, kbScale: 0.0, angle: 0,
        actionType: 'warp_door_action'
    },
    'sp_up_zoom': {
        name: '飛翔魔法', cost: 12,
        desc: '前隙は長いが上空へ圧倒的な距離を飛び上がる。攻撃判定はなく尻もち落下に移行するが、発動中に再度上Bを押すことで飛行をキャンセルして通常落下に戻れます。',
        startup: 32, active: 5, endlag: 12, damage: 0.0, kbScale: 0.0, angle: 0,
        actionType: 'zoom_magic'
    },
    'sp_up_multislash': {
        name: '連斬', cost: 8,
        desc: '方向キーで突進方向を指定し、鋭い斬撃波とともに高速突進します。技の終了後は着地まで尻もち落下になります。',
        startup: 11, active: 8, endlag: 16, damage: 12.0, kbScale: 1.3, angle: 45,
        isHelpless: true, // 💥 追加：これにより突進終了後は自動的に尻もち落下状態になります。
        actionType: 'multi_slash_strike',
        weapon: { type: 'sword', color: '#00ffff', attach: 'hand' }
    },
    'sp_up_hasso': {
        name: '八艘飛び', cost: 18,
        desc: '方向指定して小さく跳躍。敵・壁・床に激突すると「尻もち落下」せず、最大8回まで連続して跳び回れます。8回連続で激突を成功させると威力・射程が最大化し即死級となります（空振りでリセット）。体に連続回数が大きく表示されます。',
        startup: 8, active: 15, endlag: 12, damage: 3.5, kbScale: 0.8, angle: 45,
        actionType: 'hasso_leap'
    },
'sp_up_trampoline': {
        name: 'トランポリン', cost: 12,
        desc: '足元に落下するトランポリンを設置して跳ね上がる。上から乗ると大ジャンプ、下から頭をぶつけるとメテオで落下。トランポリン自体の直撃にもメテオ判定があります。',
        startup: 6, active: 4, endlag: 14, damage: 0.0, kbScale: 0.0, angle: 0,
        width: 50,          // ★追加：ギミックの横幅
        height: 12,         // ★追加：ギミックの高さ
        isProjectile: true, // ★追加：召喚/飛び道具属性（赤い四角形の描画を抑制するフラグ）
        isHelpless: true,
        actionType: 'trampoline_deploy'
    },
    'sp_up_risingpunch': {
        name: '上昇パンチ', cost: 11,
        desc: '拳を斜め上に突き上げて急上昇。何かに激突すると上昇距離が延長。出始めが最も強く、上昇中の多段ヒット数が多いほど頂上の吹っ飛び力が極大化します。当てられると上昇をキャンセルされる駆け引きもあります。',
        startup: 4, active: 22, endlag: 16, damage: 14.0, kbScale: 1.35, angle: 45, // 💡 80 ➔ 45 に変更
        actionType: 'rising_punch',
        weapon: { type: 'fist', color: '#00ffcc', attach: 'hand' }
    },
    'sp_d_thundaga': {
        name: '雷祭り', cost: 14,
        desc: '自分の左右に2条ずつ、計4本の巨大な雷柱を落とす。落とした本人も雷に巻き込まれる（自傷）リスクがあり、敵のコンボを助けてしまう可能性もあるが、圧倒的な制圧力を誇ります。',
        startup: 10, active: 4, endlag: 10, damage: 15.0, kbScale: 1.45, angle: 80,
        actionType: 'thundaga_festival'
    },
      'sp_d_discharge': {
        name: '放電', cost: 12,
        desc: '自分を中心に電磁ドームを展開する多段攻撃。ボタン長押し（ホールド）で展開を維持できますが、時間の経過とともに放電範囲が徐々に小さく縮小ます。',
        startup: 4, active: 40, 
        endlag: 8, // ★ 18 から 8 に短縮
        damage: 0.6, angle: 80, kbScale: 0.25,
        width: 280, height: 280, 
        isMultiHit: true, hitInterval: 5,
        hitboxAttribute: 'electric',
        actionType: 'discharge_action',
        isProjectile: true 
    },
    'sp_d_blast_wind': {
    name: 'ブラストウィンド', cost: 5,
    desc: '周囲に電磁暴風を発生させて敵を強く押し流す。さらに敵の飛び道具を1.5倍にして反射する。ガード崩しやカウンター空振りに有効。',
    startup: 1, active: 4, endlag: 8, damage: 0.0, angle: 45, kbScale: 2.8, // ★強化：基礎吹っ飛び倍率を 1.8 から 2.8 に大幅底上げ
    actionType: 'blast_wind_action'
},
    'sp_d_tomoshibi': {
        name: 'ともしび', cost: 12,
        desc: '地上では連鎖する火柱を発生させ、空中では強力な真下メテオ火柱を繰り出す。最大3段階までため可能。超威力の代償として、前隙と後隙が非常に大きく差し込まれやすい。',
        startup: 24, active: 4, endlag: 28, damage: 13.5, angle: 45, kbScale: 1.35, // ★隙を増加
        width: 45, height: 110,
        isProjectile: true, isChargeable: true, isKeepable: false,
        actionType: 'tomoshibi_action'
    },
'sp_d_mirror_plate': {
        name: 'ミラーシールド', cost: 12,
        desc: '自機の前方に、自分以外の飛び道具のみを跳ね返す特殊シールドをその場に配置します。自分の飛び道具はそのまま透過して前方に突き抜けます。', // 💡「5秒間」に修正
        startup: 8, active: 4, endlag: 14, damage: 0.0, angle: 0, kbScale: 0.0,
        width: 15, height: 75,
        isProjectile: true, 
        actionType: 'mirror_plate_action'
    },
    'sp_d_shield': {
        name: 'ホログラフィックシールド', cost: 6,
        desc: '敵の攻撃を安全に防ぐ。シールドHPが0になると破壊され気絶する。',
        startup: 3, active: 15, endlag: 8, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: -2, width: 70, height: 70, actionType: 'shield',
        isCustomHold: true // ★修正追記：押しっぱなしによる維持を許可
    },
    'sp_d_reflector': {
        name: 'リフレクター', cost: 4,
        desc: '攻撃的反射板。発生1Fで周囲に電撃光波を放ち、敵を軽く浮かせて空中コンボの起点にできる。ボタン長押しで反射バリアを持続展開し、敵の飛び道具を1.5倍で跳ね返す。',
        startup: 1, active: 4, endlag: 8, damage: 4.0, angle: 80, kbScale: 0.4,
        selfVx: 0, selfVy: 0, width: 75, height: 75, hitboxAttribute: 'reflect',
        hitInterval: 12,
        actionType: 'reflector_strike',
        isCustomHold: true // 💡 長押し持続を許可
    },
    'sp_d_parry': {
        name: 'パリィブロッキング', cost: 3,
        desc: '打撃パリィ。一瞬だけ攻撃を受け流す構えをとる。相手の物理直接打撃をこの瞬間に受けると、相手をフラフラ状態にする。',
        startup: 2, active: 8, endlag: 18, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 50, height: 50, actionType: 'parry_pose'
    },
    'sp_d_counter': {
        name: 'カウンター', cost: 6,
        desc: '光るカウンターシールドを展開。展開中に敵の体が触れると、大ダメージの強力な反撃一閃を放つ。',
        startup: 3, active: 25, endlag: 15, damage: 0.0, angle: 40, kbScale: 1.5,
        selfVx: 0, selfVy: 0, width: 60, height: 60, attackerHitstop: 4, receiverHitstop: 4,
        isCounter: true, actionType: 'counter_shield', fxColor: '#ff8800'
    },
    'sp_d_pump': {
        name: 'ハイドロプレッシャー', cost: 2,
        desc: '前方に水流を放射し、ダメージを与えずに相手を押し流す。',
        startup: 8, active: 25, endlag: 15, damage: 0.0, angle: 10, kbScale: 0.0,
        selfVx: -1, selfVy: 0, width: 160, height: 40, attackerHitstop: 1, receiverHitstop: 1,
        noFlinch: true, isPump: true, actionType: 'water_pump', fxColor: '#3399ff',
        isProjectile: true // ★追加：シールド等の赤い四角が重なって表示されるのを防ぎます
    },
    'sp_d_c4': {
        name: 'リモート爆弾', cost: 7,
        desc: '足元に爆弾を設置。設置済みの状態で再度下Bを押すと手動で起爆し、大爆発を起こす。',
        startup: 8, active: 4, endlag: 12, damage: 0.0, angle: 60, kbScale: 1.6,
        selfVx: 0, selfVy: 0, width: 30, height: 10, attackerHitstop: 3, receiverHitstop: 3,
        isC4: true, actionType: 'c4_bomb', fxColor: '#ff2200'
    },
'sp_d_meteor': {
    name: 'グラビティダスト', cost: 5,
    desc: '急降下して真下へ強烈なキックを放つ。空中の敵に当てると問答無用で真下に撃墜（メテオ）する。',
    startup: 12, 
    active: 18, // 💡 ここを18等に伸ばせば、突進距離（持続時間）が自動的に引き伸ばされます
    endlag: 15, 
    damage: 12.0, angle: 270, kbScale: 1.5,
    selfVx: 0, selfVy: 0, 
    width: 45, height: 50, attackerHitstop: 5, receiverHitstop: 8,
    actionType: 'meteor_dive', isFixedKb: true, fixedKbValue: 14, fxColor: '#ff3300'
},
    'sp_d_guard': {
        name: 'フルシールドコア', cost: 8,
        desc: '強力な球体障壁を展開する。発動中は無敵状態で敵の掴み属性以外のあらゆる攻撃を防ぐ。',
        startup: 1, active: 30, endlag: 5, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, attackerHitstop: 0, receiverHitstop: 0,
        actionType: 'absolute_guard', fxColor: '#33ffff'
    },
    'sp_d_hipdrop': {
        name: 'ギガプレス', cost: 6,
        desc: '真上へ急上昇した後、超高速で垂直落下しヒップドロップを放つ。着地時に左右へ衝撃波が発生する。',
        startup: 4, active: 30, endlag: 20, damage: 15.0, angle: 80, kbScale: 1.4,
        selfVx: 0, selfVy: -12, width: 55, height: 60, attackerHitstop: 6, receiverHitstop: 8,
        isHipDrop: true, actionType: 'hip_drop', fxColor: '#ffcc00'
    },
       'sp_d_resonance': {
        name: 'フォースレゾナンス', cost: 5,
        // 💡 説明文に「滞空」と「ジャンプ復活（全回復）」の仕様を追記
        desc: '発動時に周囲に極小の衝撃波を放ちながら、空中で約0.9秒間ピタッと完全滞空（ホバリング）する。発動した瞬間に空中ジャンプ回数が全回復するため、空中復帰やコンボの切り返しに極めて優秀。',
        // 💡 発生1Fを保ち、持続を9F（3倍）、後隙を44F（約3倍）にして合計54F（0.9秒）の滞空時間に強化
        startup: 1, active: 9, endlag: 44, damage: 3.0, angle: 360, kbScale: 0.4,
        selfVx: 0, selfVy: 0, width: 70, height: 70, attackerHitstop: 1, receiverHitstop: 2,
        isResonance: true, noFlinch: true, actionType: 'resonance_blast', fxColor: '#ff33ff'
    },
    'sp_d_metal': {
        name: 'アイアンスキン', cost: 6,
        desc: '自身を一時的にメタル化し、吹っ飛びに非常に強くなる。',
        startup: 10, active: 5, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, attackerHitstop: 0, receiverHitstop: 0,
        actionType: 'self_buff', selfEffect: { type: 'metal', duration: 600 }
    },
    'sp_d_revenge': {
        name: 'リベンジコア', cost: 8,
        desc: '構え中に攻撃を受けると、その威力を吸収。次に放つ自分の攻撃のダメージと吹っ飛び力が最大3倍に強化される。',
        startup: 2, active: 22, endlag: 14, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 60, height: 60, attackerHitstop: 3, receiverHitstop: 3,
        actionType: 'revenge_pose'
    },
'sp_d_thunder': {
        name: 'かみなり', cost: 10,
        desc: '上空から雷雲を呼び、真下に雷柱を落とす。自分に雷が当たると、周囲に強力な放電衝撃波が発生する。',
        startup: 8, active: 4, endlag: 8, damage: 16.0, angle: 80, kbScale: 1.5,
        selfVx: 0, selfVy: 0, width: 0, height: 0, offsetY: 0,
        attackerHitstop: 6, receiverHitstop: 8,
        actionType: 'call_thunder'
    },
    'sp_d_detonation_bolt': {
    name: '爆雷', cost: 11,
    desc: '自分の頭上にゆっくり落下する強力な雷を1つ呼び出す。爆発属性を持ち、自分自身も巻き込まれる。地面に当たると黄色の地雷になり、触れると大爆発する。',
    startup: 15, active: 4, endlag: 18, damage: 18.0, kbScale: 1.8, angle: 45,
    actionType: 'detonation_bolt_action'
},
    'sp_d_hydrant': {
        name: 'ウォーターハイドラント', cost: 9,
        desc: '足元に固い消火栓を設置。定期的に左右に押し流す水を放ち、攻撃を当ててHPを0にすると強力な飛び道具として吹っ飛んでいく。',
        startup: 8, active: 4, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 40, height: 50, attackerHitstop: 2, receiverHitstop: 2,
        actionType: 'create_hydrant'
    },
    'sp_d_lightweight': {
        name: 'アクセルブースター', cost: 8,
        desc: '一定時間、自分の体重を軽くする代わりに、地上・空中速度とジャンプ力を1.5倍にする（吹っ飛びやすくなる）。',
        startup: 8, active: 5, endlag: 12, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, attackerHitstop: 0, receiverHitstop: 0,
        actionType: 'self_buff', selfEffect: { type: 'lightweight', duration: 480 }
    },
    'sp_d_absorb': {
        name: 'グラビティマグネット', cost: 7,
        desc: '周囲に吸収バリアを展開。ボタン長押しでバリアを持続展開し、触れた敵の飛び道具をかき消して自分の％ダメージを回復する。',
        startup: 3, active: 40, endlag: 10, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 90, height: 90, attackerHitstop: 1, receiverHitstop: 2,
        actionType: 'absorber_shield',
        isCustomHold: true // 💡 長押し持続を許可
    },
    'sp_d_megante': {
        name: 'アポカリプスコア', cost: 5,
        desc: '禁忌の自爆。自分のストックを1つ失う代わりに、自分を中心に敵を即死させる超巨大・超絶火力の暗黒爆発を引き起こす。',
        startup: 25, active: 10, endlag: 30, damage: 68.0, angle: 45, kbScale: 4.8,
        selfVx: 0, selfVy: 0, width: 280, height: 280, actionType: 'megante'
    },
    'sp_d_deep_breath': {
        name: 'インナーフォーカス', cost: 12,
        desc: '精神統一の深呼吸を行う。成功すると自身の％ダメージを15%回復し、8秒間攻撃力と移動速度が1.25倍に上昇する。',
        startup: 40, active: 5, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'deep_breath'
    },
    'sp_d_supply_drop': {
        name: 'タクティカルサプライ', cost: 20,
        desc: '上空へ発煙筒を投げる。約2.5秒後、頭上から35%回復する支援物資がゆっくり落下。敵に横取りされるリスクもある。',
        startup: 10, active: 2, endlag: 12, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'supply_drop'
    },
    'sp_d_landmine': {
        name: 'タクティカルマイン', cost: 10,
        desc: '足元に接触起爆式の地雷を設置。敵が上を通ると自動で感知して大爆発を起こす。最大1個のみ設置可能。',
        startup: 8, active: 4, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'place_mine'
    },
    'sp_d_sentry': {
        name: 'オートセントリー', cost: 15,
        desc: '自立式のターゲットガンを設置。範囲内の敵をロックオンし、のけぞらせない電撃レーザーを自動で連射する。最大1個のみ設置可能。',
        startup: 10, active: 4, endlag: 15, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 0, height: 0, actionType: 'place_sentry'
    },
    'sp_d_rest': {
        name: 'ねる', cost: 7,
        desc: '超極小の密着一撃必殺技。ヒットすると相手を猛毒状態にし、使用者自身は20%回復する。使用後自分が3秒間気絶する。',
        startup: 2, active: 2, endlag: 45, damage: 32.0, angle: 35, kbScale: 2.8,
        selfVx: 0, selfVy: 0, width: 15, height: 15, attackerHitstop: 12, receiverHitstop: 15,
        actionType: 'rest_strike',
        onHitEffect: { type: 'poison', duration: 900 }
    },
    'sp_d_pitfall': {
        name: '落とし穴の種', cost: 10,
        desc: '地上では「踏むと埋まる落とし穴」を設置。空中で敵に直接当てると強烈な「メテオ」になる。',
        startup: 6, active: 4, endlag: 10, damage: 6.0, angle: 270, kbScale: 1.8,
        selfVx: 0, selfVy: 0, width: 30, height: 30, actionType: 'pitfall_action'
    },
    'sp_d_cargo_lift': {
        name: 'リフティングホールド', cost: 18,
        desc: '前方の敵を担ぎ上げ、掴んだまま自由に歩いたり、ジャンプして奈落へ道連れ落下することもできる。通常攻撃で前方に放り投げる。',
        startup: 6, active: 10, endlag: 15, damage: 12.0, angle: 35, kbScale: 1.2,
        selfVx: 0, selfVy: 0, width: 50, height: 45, isGrab: true,
        actionType: 'cargo_lift'
    },
    'sp_d_witch_time': {
        name: '時停止', cost: 15,
        desc: '時間操作カウンター。構え中に攻撃を受けると、ダメージを無効化し、攻撃してきた敵の時間の流れを3秒間極限までスローにして、無防備な隙を晒させる。',
        startup: 2, active: 24, endlag: 16, damage: 0.0, angle: 0, kbScale: 0.0,
        selfVx: 0, selfVy: 0, width: 60, height: 60, actionType: 'counter_witch'
    },
    'sp_d_flash_slash': {
        name: 'シャドウスラッシュ', cost: 14,
        desc: '多段一閃カウンター。構え中に攻撃を受けると、自分の周囲広範囲に一瞬で無数の暗黒斬撃を放ち、敵を真横に強く引き裂き吹き飛ばす。',
        startup: 2, active: 22, endlag: 15, damage: 8.0, angle: 20, kbScale: 1.5,
        selfVx: 0, selfVy: 0, width: 140, height: 100, actionType: 'counter_slash'
    },

 // ------------------------------------
    // F. 特殊パッシブアビリティ（直感的名称に完全リニューアル）
    // ------------------------------------
    'p_none': { 
        name: 'アビリティなし', cost: 0, desc: '特殊アビリティを装備せず、基礎コストを節約する。',
        aura: null
    },
    'p_desperado': {
        name: '逆転の一撃', cost: 15,
        desc: 'ゲージアビリティ。MAX時に通常必殺技（ニュートラルB）を入力すると強力なアッパーカットが発動可能。',
        aura: {
            color: '#8b0000', type: 'smoke', rate: 0.1, size: 5,
            activeColor: '#ff1100', activeType: 'glow', activeRate: 0.8, activeSize: 8
        }
    },
    'p_desperado_slash': {
        name: '逆転の一閃', cost: 15,
        desc: 'ゲージMAX時に通常Bで、画面端まで超高速で突進一閃する『神速・終焉の太刀』を放つ。15秒間持続。',
        aura: {
            color: '#4a00e0', type: 'smoke', rate: 0.1, size: 5,
            activeColor: '#00ffff', activeType: 'electric_spark', activeRate: 0.8, activeSize: 8
        }
    },
    'p_desperado_beam': {
        name: '逆転のビーム', cost: 15,
        desc: 'ゲージMAX時に通常Bで、前方の空間全てを薙ぎ払う超極太ビーム『メガバスター放射』を射出する。15秒間持続。',
        aura: {
            color: '#006688', type: 'smoke', rate: 0.1, size: 5,
            activeColor: '#00e5ff', activeType: 'glow', activeRate: 0.8, activeSize: 8
        }
    },
    'p_overdrive': { 
        name: '限界突破', cost: 20, desc: 'ゲージアビリティ。MAX時に一定時間移動性能と技威力を劇的に向上。',
        aura: {
            color: '#ffaa00', type: 'glow', rate: 0.2, size: 4,
            activeColor: '#ff3300', activeType: 'electric_spark', activeRate: 1.0, activeSize: 8
        }
    },
    'p_mantle': { 
        name: '光学迷彩', cost: 20,
        desc: '攻撃を当てる・受けるのを5秒間停止すると、自機がほぼ透明になり、敵から追尾されなくなります。',
        aura: {
            color: '#333333', type: 'smoke', rate: 0.1, size: 5,
            activeColor: '#1a1a1a', activeType: 'smoke', activeRate: 0.2, activeSize: 4 // ステルス中：さらにうっすらとした黒煙モヤに
        }
    },
    'p_float': { 
        name: '空中滑空', cost: 20, desc: '空中横移動中に重力を遮断し、一定時間空中をフワフワと滑空（浮遊）する。',
        aura: {
            color: '#e0ffff', type: 'glow', rate: 0.05, size: 3,
            activeColor: '#00ffff', activeType: 'smoke', activeRate: 0.6, activeSize: 7
        }
    },
    'p_dash': { 
        name: '激突ダッシュ', cost: 20, desc: '地上走行速度が極限までアップし、走って敵に衝突するだけで自動的にダメージを与える。',
        aura: {
            color: '#555555', type: 'smoke', rate: 0.1, size: 4,
            activeColor: '#ffcc00', activeType: 'electric_spark', activeRate: 0.8, activeSize: 6
        }
    },
    'p_paint': { 
        name: 'ペンキ汚染', cost: 20, desc: '自分の攻撃すべてにインク効果が付与される。敵を染めると、被ダメージが最大1.5倍に増加する。',
        aura: {
            color: '#39ff14', type: 'bubble', rate: 0.3, size: 5,
            activeColor: '#39ff14', activeType: 'bubble', activeRate: 0.3, activeSize: 5
        }
    },
    'p_limit': { 
        name: '必殺極限強化', cost: 30, desc: 'ゲージアビリティ。必殺技が大幅に強化される。',
        aura: {
            color: '#00e5ff', type: 'glow', rate: 0.1, size: 4,
            activeColor: '#00ffff', activeType: 'electric_spark', activeRate: 0.7, activeSize: 7
        }
    },
    'p_rebellion': { 
        name: '反逆召喚', cost: 22, desc: 'ゲージアビリティ。MAXで自動発動し、一定時間すべての攻撃の威力が強化され一部の技の判定が強化される。',
        aura: {
            color: '#4a0000', type: 'smoke', rate: 0.2, size: 6,
            activeColor: '#ff0055', activeType: 'glow', activeRate: 0.9, activeSize: 8
        }
    },
    'p_full_health': { 
        name: '無傷の加護', cost: 15, desc: '自分の％が0%に近いほど、移動速度と全攻撃の威力が強化。',
        aura: {
            color: '#ffffff', type: 'glow', rate: 0.05, size: 3,
            activeColor: '#ffffff', activeType: 'glow', activeRate: 0.5, activeSize: 6
        }
    },
    'p_rage_aura': { 
        name: '逆境の加護', cost: 18, desc: '自分の％がピンチになる程、移動速度と全攻撃の威力が強化。',
        aura: {
            color: '#ff2200', type: 'glow', rate: 0.2, size: 4,
            activeColor: '#ff0033', activeType: 'electric_spark', activeRate: 0.8, activeSize: 8
        }
    },
    'p_echo': { 
        name: '時間差分身', cost: 25, desc: '自分の背後に分身を出現させ、自分の12F前の行動を完全に時間差トレース（攻撃も代理発生）させる。',
        aura: {
            color: '#ff00ff', type: 'electric_spark', rate: 0.15, size: 4,
            activeColor: '#ff00ff', activeType: 'electric_spark', activeRate: 0.15, activeSize: 4
        }
    },
    'p_self_harm': { 
        name: '代償契約（コスト枠120PT化）', cost: 0, desc: '装備するとカスタマイズ上限が120PTに拡張されるが、戦闘中に必殺技を使うたびに自分が1.8%自傷する。',
        aura: {
            color: '#9400d3', type: 'glow', rate: 0.2, size: 4,
            activeColor: '#ba55d3', activeType: 'electric_spark', activeRate: 0.6, activeSize: 6
        }
    },
    'p_infuse_electric': { 
        name: '雷属性付与', cost: 15, desc: '自分のすべての攻撃に帯電属性を宿し、被弾した敵の硬直を延長する。',
        aura: {
            color: '#00ffff', type: 'electric_spark', rate: 0.4, size: 5,
            activeColor: '#00ffff', activeType: 'electric_spark', activeRate: 0.4, activeSize: 5
        }
    },
    'p_infuse_burn': { 
        name: '炎属性付与', cost: 15, desc: '自分のすべての攻撃に、当たった敵を「やけど」状態にしてジワジワ体力を奪う効果を付与する。',
        aura: {
            color: '#ff4500', type: 'glow', rate: 0.4, size: 6,
            activeColor: '#ff4500', activeType: 'glow', activeRate: 0.4, activeSize: 6
        }
    },
    'p_infuse_freeze': { 
        name: '氷属性付与', cost: 15, desc: '自分のすべての攻撃に、当たった敵を一時的に「凍結」状態にして動きを完全に止める効果を付与する。',
        aura: {
            color: '#e0ffff', type: 'smoke', rate: 0.4, size: 5,
            activeColor: '#e0ffff', activeType: 'smoke', activeRate: 0.4, activeSize: 5
        }
    },
    'p_charge_walk': { 
        name: 'スマッシュ溜め歩き', cost: 18, desc: 'スマッシュ攻撃を溜めている間、通常速度の2倍のスピードで疾走することができる。',
        aura: {
            color: '#ffff00', type: 'glow', rate: 0.05, size: 3,
            activeColor: '#ffff00', activeType: 'electric_spark', activeRate: 0.6, activeSize: 6
        }
    },
    'p_magic_cant': { 
        name: '飛び道具反射', cost: 26, desc: 'シールドや攻撃を行っていなくても、体に触れた敵のあらゆる遠距離飛び道具を自動で100%反射して撃ち返す。',
        aura: {
            color: '#ff00ff', type: 'glow', rate: 0.2, size: 4,
            activeColor: '#ff00ff', activeType: 'glow', activeRate: 0.2, activeSize: 4
        }
    },

    // ------------------------------------
    // G. 全スロット共通の「なし (NONE)」スロット用定義
    // ------------------------------------
    'normal-none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに通常攻撃を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'smash-none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットにスマッシュ攻撃を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'air-normal-none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに空中通常攻撃を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'air-smash-none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに空中スマッシュ攻撃を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'sp_n_none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに通常B必殺技を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'sp_s_none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに横B必殺技を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'sp_up_none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに上B必殺技を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 },
    'sp_d_none': { name: 'なし (NONE)', cost: 0, desc: 'このスロットに下B必殺技を装備しません（消費コスト0）。', startup: 0, active: 0, endlag: 0, damage: 0, kbScale: 0, angle: 0, width: 0, height: 0 }
};

// ==========================================
// ■ nexus_data.js (ストーリーミッション・データベース完全修正版)
// ==========================================
// 4. ストーリー・シナリオデータベース（専門用語・カッコ書き全廃・完全直線化版）
const storyMissionDatabase = {
    'tutorial': {
        title: "MISSION 01: 侵食されるマントル",
        desc: "地底へ侵入してきた探査ドローン。静かな居場所を脅かす機械を撃退せよ。",
        stage: "sector_n9",
        color: "#00ffcc",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「警告。地底エリアでスライムを検出。スマホや車の燃料として全量を吸い上げます」"
            },
            {
                speaker: "MIRKA",
                text: "「うわ、頭の上がえらい派手に開いたなぁ。せっかく静かに寝てたのに台無しやんか」"
            },
            {
                speaker: "SYSTEM VOICE",
                text: "「捕獲を開始します。じっとしていると体が冷えて動きが遅くなります」"
            },
            {
                speaker: "MIRKA",
                text: "「サボって動かんでおったら体が硬くなるってことか。絶え間なく暴れてどつき回せばええんやな！ 分かりやすくて助かるわ、そこ座りなはれ！」"
            }
        ]
    },
    'bossrush': {
        title: "MISSION 02: 暴走ドリル重機",
        desc: "地底を削り荒らす巨大ドリル重機。暴走する鉄の塊を破壊せよ。",
        stage: "sector_n9",
        color: "#ffcc00",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「大型ドリル重機を投入。邪魔なスライムを粉砕しながら掘削を続行します」"
            },
            {
                speaker: "MIRKA",
                text: "「ごっつい音立てて泥水撒き散らしとるわ。無駄に元気な鉄の塊やなぁ」"
            },
            {
                speaker: "MIRKA",
                text: "「奥から捕まった仲間たちの泣き声が聞こえるわ。その邪魔な配線を全部うちの身体でショートさせて、大人しくさせたやる！」"
            }
        ]
    },
    'lavacastle': {
        title: "MISSION 03: 灼熱の発電工場",
        desc: "仲間からエネルギーを絞り取る工場。大型防衛戦車を破壊せよ。",
        stage: "lava_castle",
        color: "#ff5500",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「発電プラント稼働中。捕獲したスライムから電力を搾り取ります」"
            },
            {
                speaker: "MIRKA",
                text: "「ここめっちゃ熱くて電気バチバチいうて最悪の部屋やわ。みんなをぎゅうぎゅうに押し潰すなんてエグいことするなぁ」"
            },
            {
                speaker: "SYSTEM VOICE",
                text: "「侵入者を感知。防衛戦車で押し潰します」"
            },
            {
                speaker: "MIRKA",
                text: "「そんな勢いで突っ込んできたらブレーキ間に合わんで？ 危ないから全部包み込んで電気抜いたるわ！」"
            }
        ]
    },
    'masterhand': {
        title: "MISSION 04: 巨大な白い手",
        desc: "上空から降りてきた5本アームの巨大手。迫りくる巨手を撃退せよ。",
        stage: "nexus_flat",
        color: "#ff2200",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「巨大マニピュレーターを降下。地底のスライムをまるごと残さず掴み取ります」"
            },
            {
                speaker: "MIRKA",
                text: "「地上に持っていくために、ごっつい白いおてて降ろしてきたで。おとなしい私でもさすがに怒るわ」"
            },
            {
                speaker: "MIRKA",
                text: "「そのでっかい指の関節、一本ずつ優しくねじ折って静かな暗闇に落としたる。ずっと一緒におとなしく眠ろ！」"
            }
        ]
    },
    'sentinel_core': {
        title: "MISSION 05: 要塞の青いコア",
        desc: "吸い上げ装置の要塞コア。青く光る防衛システムを停止させよ。",
        stage: "chemical_shaft",
        color: "#00e5ff",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「最終防衛コアを起動。吸い上げラインを死守します」"
            },
            {
                speaker: "MIRKA",
                text: "「奥からなんか不気味に青く光る玉が浮き上がってきたわ。周りのリングがものすごい勢いで回っとる」"
            },
            {
                speaker: "MIRKA",
                text: "「私らのパワーを全部吸い取って動いとるんか。吸いすぎてお腹パンクしても知らんで。全部飲ませたるから爆発しなはれ！」"
            }
        ]
    },
    'athletic_run': {
        title: "MISSION 06: 空中アスレチック走破",
        desc: "崩れ続ける危険な空中回廊。ジャンプとフライト能力でゴールを目指せ！",
        stage: "athletic_way",
        color: "#59a7f5",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「通路崩落。足場が小さく分裂しています」"
            },
            {
                speaker: "MIRKA",
                text: "「地面がバラバラになって浮いとる！ あんな遠いところまで飛び越えて行けって言うん？ 落ちたら真っ逆さまやんか」"
            },
            {
                speaker: "MIRKA",
                text: "「でも私の柔らかい身体なら、空を泳ぐように飛んでいけるわ。あそこの一番奥にあるゴールポールにしがみついて抜けてやる！」"
            }
        ]
    },
    'dica_alpha': {
        title: "MISSION 07: 紫のガチガチ装甲",
        desc: "一発の攻撃が効かないカチコチの重装甲。手数の多い連撃やつかみ技で破砕せよ。",
        stage: "flat_walled_4",
        color: "#9c27b0",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「新型硬化装甲を起動。強い一撃を受けると一瞬でダイヤモンドより硬くなります」"
            },
            {
                speaker: "MIRKA",
                text: "「なんやあの紫の塊。思いっきり殴ってもカチコチになってビクともせえへんやんか！」"
            },
            {
                speaker: "SYSTEM VOICE",
                text: "「弱点警告。素早い連続攻撃や、直接つかむ攻撃には硬化が間に合いません」"
            },
            {
                speaker: "MIRKA",
                text: "「なるほどな！ 特大パンチ一発はあかんけど、弱パンチの連打やつかみ技で攻めたらふにゃふにゃになるんやな！ その紫の殻、ペリペリに剥がしたる！」"
            }
        ]
    },
    'athletic_deep_run': {
        title: "MISSION 08: 垂直シャフト脱出",
        desc: "底から迫る緑の酸。多段ジャンプやワイヤー移動で高度2500pxの塔を駆け登れ！",
        stage: "athletic_deep",
        color: "#00e5ff",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「最下層のタンクが破損。危険な液体の水位が上昇中です。上部へ避難してください」"
            },
            {
                speaker: "MIRKA",
                text: "「下から変な色の水がせり上がってきたわ！ あんなん浴びたら一瞬で体溶けてまうやんか！」"
            },
            {
                speaker: "MIRKA",
                text: "「文句言ってる暇ないわ！ スライムの粘性をバネに変えてお空に飛んでったる！ てっぺんまで一気に駆け登ったるからな！」"
            }
        ]
    },
    'gigant_battle': {
        title: "MISSION 09: マグマの巨神",
        desc: "地底の熱が集まって生まれた超巨大な神。飛び跳ねて高所の頭上を殴り倒せ！",
        stage: "nexus_flat",
        color: "#ff3300",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「超巨大物体が接近。地底の熱が凝固して生まれた巨神です」"
            },
            {
                speaker: "MIRKA",
                text: "「なになにあれ！ おっきいとかそういうレベルちゃうで！ まるでお山が歩いてるみたいやんか！」"
            },
            {
                speaker: "MIRKA",
                text: "「逃げてても踏み潰されるだけやな。よし、高いところまでジャンプして、あのデカブツの脳天に特大スマッシュ叩き込んでやる！ そこ座りなはれ！」"
            }
        ]
    },
    'crystal_resonance': {
        title: "MISSION 10: 輝く結晶洞窟",
        desc: "周囲をカチコチに凍らせる結晶プラント。キラキラ光る結晶装置を破壊せよ。",
        stage: "crystal_cave",
        color: "#00e5ff",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「冷凍エリア稼働。スライムをカチコチに凍らせて標本にします」"
            },
            {
                speaker: "MIRKA",
                text: "「うわ、近寄るだけでぷにぷにの体が凍ってまうわ！ 氷漬けの標本にされる前に、そのキラキラしたトゲ全部粉々に砕いたる！」"
            }
        ]
    },
    'craggy_escape': {
        title: "MISSION 11: 崩れ落ちる断層",
        desc: "上から降り注ぐ落石の雨。岩を避けながら壁を蹴り上げて上部ゲートへ逃げ延びろ！",
        stage: "craggy_cliff",
        color: "#ffcc00",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「崖が崩壊中。上から大量の岩が落ちてきます。直撃に注意してください」"
            },
            {
                speaker: "MIRKA",
                text: "「上から岩の雨が降ってきてるやんか！ うっかり当たったら埋め立てられてまうわ。壁を蹴り上げて一瞬で抜け出したる！」"
            }
        ]
    },
    'casino_gamble': {
        title: "MISSION 12: 電脳カジノと確率の魔神",
        desc: "イカサマスロットで確率を操る魔神。ズルをするディーラーをぶちのめせ！",
        stage: "casino_neon",
        color: "#ff00ff",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「カジノエリア起動。スロットの当たり確率を操作してハズレを確定させます」"
            },
            {
                speaker: "MIRKA",
                text: "「人のパワー勝手に使ってスロット回してお金稼ぎしとるんか！ えらいがめついなぁ！」"
            },
            {
                speaker: "MIRKA",
                text: "「ハズレ確定なんて嘘っぱちや。そんな都合のいい数字、私のパンチでぐちゃぐちゃにシャッフルしたるわ！ そこ座りなはれ！」"
            }
        ]
    },
    'turret_fortress': {
        title: "MISSION 13: 鋼鉄の大砲要塞",
        desc: "ズラリと並んだ大砲群。攻撃のスキを突いて背後に回り込み一撃で粉砕せよ！",
        stage: "sector_n9",
        color: "#ff2200",
        dialogs: [
            {
                speaker: "SYSTEM VOICE",
                text: "「自動大砲を全域に配備。鉄の弾を連続発射して排除します」"
            },
            {
                speaker: "MIRKA",
                text: "「あちこちに黒い大砲が並んでこっち睨んどるわ！ 近づいただけで容赦なく鉄の弾撃ってきよる！」"
            },
            {
                speaker: "MIRKA",
                text: "「でもあの砲台、前しか狙われへんみたいやな。上から飛び込むか後ろに回り込んで、その鉄の筒を一本ずつ綺麗にへし折ったる！」"
            }
        ]
    }
};
const enemyDatabase = {
    /* ★以下、お掃除・ボコボコ用お助け雑魚キャラクターを追加★ */
    
    // 1. 完全無抵抗コンボ練習用：テストダミーロボ
    'dummy_bot': {
        name: "テストダミー",
        shape: "square",
        width: 32, height: 50,
        color: "#90a4ae", glowColor: "#b0bec5", // 無機質なスチールグレー
        stats: {
            groundSpeed: 0.0, airSpeed: 0.0,    // 自発的に移動しない
            jumpPower: 0, weight: 1.0,           // 💡体重が極限に軽く、あらゆる技で面白いようにフワフワ浮く
            airJumpsMax: 0,
            gravity: 0.14,                      // ふんわりとゆっくり落下する重力
            fallSpeedLimit: 3.5,                // 拾いやすさを高めるための低落下速度
            chaseMult: 0.0,
            detectRange: 0, detectHeight: 0
        },
        scaleFactor: 0.9,
        powerFactor: 0.0,                       // 攻撃力0
        maxPercent: 30,                         // 30%で即撃墜されるためボコボコ感抜群
        moves: {
            close: ['normal-n-jab'],             // ★ 'normal-n' から変更
            far: ['normal-n-jab']               // ★ 'normal-n' から変更
        },
        parts: { eye: true, nose: false, mouth: true, mantle: false }
    },

    // 2. 一撃で弾け飛ぶお掃除ターゲット：炭素系自壊スライム
'slime_carbon': {
        name: "低圧炭素スライム",
        shape: "circle", // まあるい流体フォルム
        width: 28, height: 28,
        color: "#37474f", glowColor: "#00e5ff", // 炭色の身体と光るシアンコア
        stats: {
            groundSpeed: 1.2, airSpeed: 1.0,
            jumpPower: -6, weight: 0.8,         // 💡羽毛より軽い体重「0.8」。触れるだけで星になる
            airJumpsMax: 1,
            gravity: 0.20,
            fallSpeedLimit: 4.5,
            chaseMult: 0.8,
            detectRange: 250, detectHeight: 100
        },
        scaleFactor: 0.8,
        powerFactor: 0.2,                       // 当たっても痛くない（20%の攻撃力）
        maxPercent: 20,                         // 蓄積20%で問答無用でK.O.バースト
        moves: {
            close: ['normal-n'],             // 弱い体当たりのみ
            far: ['normal-n']
        },
        parts: { eye: true, nose: false, mouth: false, mantle: false }
    },
'pod_wasp': {
        name: "偵察ポッド",
        shape: "circle",
        width: 22, height: 22,
        color: "#ffab00", glowColor: "#ffab00", // 警告のイエローゴールド
        stats: {
            groundSpeed: 1.8, airSpeed: 2.2,    // 空中移動がやや滑らか
            jumpPower: -10, weight: 1.2,        // 空中でコンボを拾いやすい超軽量ウェイト
            airJumpsMax: 2,
            gravity: 0.16,
            fallSpeedLimit: 4.0,
            chaseMult: 1.1,
            detectRange: 380, detectHeight: 180
        },
        scaleFactor: 0.7,
        powerFactor: 0.3,
        maxPercent: 35,                         // 35%で爆砕
       moves: {
            close: ['normal-n-jab'],             // ★ 'normal-n' から変更
            far: ['normal-s-kunai']              // ★ 'normal-s' から変更
        },
        parts: { eye: true, nose: false, mouth: false, mantle: false }
    },
'drone_yellow': {
        name: "自律型探査ドローン",
        shape: "triangle",
        width: 24, height: 34,
        color: "#ffea00", glowColor: "#ffea00",
        stats: {
            groundSpeed: 2.6, airSpeed: 2.6,
            jumpPower: -12, weight: 3, airJumpsMax: 2,
            gravity: 0.22, fallSpeedLimit: 5.5, chaseMult: 1.0,         
            detectRange: 450, detectHeight: 220
        },
        scaleFactor: 0.7, powerFactor: 0.6, maxPercent: 100,
        moves: {
            close: ['normal-n-jab', 'normal-d-lowkick'],
            far: ['normal-s-kunai', 'sp_n_fire'],
            recovery: ['sp_up_jump'] 
        }
    },
'gear_purple': {
        name: "自動掘削重機",
        shape: "pentagon",
        width: 48, height: 64,
        color: "#9400d3", glowColor: "#9400d3",
        stats: {
            groundSpeed: 1.1, airSpeed: 1.1,
            jumpPower: -8, weight: 16, airJumpsMax: 1,
            gravity: 0.45, fallSpeedLimit: 12.0, chaseMult: 1.15,        
            detectRange: 280, detectHeight: 120
        },
        scaleFactor: 1.15, powerFactor: 1.2, maxPercent: 130,
       moves: {
            close: ['normal-d-lowkick', 'smash-d', 'smash-d-chika-enen'], // ★ 'normal-d' から変更
            far: ['sp_n_fireball', 'sp_s_clay_rocket'] 
        }
    },
'boss_balanced': {
        name: "防衛用重戦車",
        shape: "hexagon",
        width: 65, height: 95,
        color: "#cc0022", glowColor: "#cc0022",
        stats: {
            groundSpeed: 2.4, airSpeed: 2.1,
             jumpPower: -14, weight: 12, airJumpsMax: 2, 
            gravity: 0.38, fallSpeedLimit: 10.0, chaseMult: 1.30,
            detectRange: 550, detectHeight: 250
        },
        scaleFactor: 1.4, powerFactor: 1.3, maxPercent: 200,
        moves: {
            close: ['smash-n-straight', 'smash-d', 'sp_s_roller'],
            far: ['sp_n_fire', 'sp_s_minecart', 'sp_d_c4'],
            recovery: ['sp_up_jump']
        }
    },
  'master_hand': {
        name: "地殻マニピュレーター",
        shape: "hand",
        width: 115, height: 115,
        color: "#ffffff", glowColor: "#ff2200", 
        stats: {
            groundSpeed: 3.5, airSpeed: 3.0,
            jumpPower: 0, weight: 30, airJumpsMax: 0,
            gravity: 0.35, fallSpeedLimit: 18.0, chaseMult: 1.0,
            detectRange: 1000, detectHeight: 600
        },
        scaleFactor: 2.0, powerFactor: 1.8, isHandBoss: true, maxPercent: 300,
        moves: {
            // 💥 衝撃を反射するリフレクターを far に登録してハメを防ぐ
            close: ['smash-d'], 
            far: ['sp_n_fire', 'sp_d_reflector']
        },
        // 💡 修正：手には目も鼻も口も表示させない（eye: false, mouth: false）
        parts: { eye: false, nose: false, mouth: false, halo: true, booster: true },
        customizerTransforms: {
            halo: { scale: 3.5, x: 0, y: -90 },     
            booster: { scale: 2.2, x: 0, y: 55 }    
        }
    },
  'nexus_sentinel': {
        name: "センチネル",
        shape: "fortress", 
        width: 90, height: 90,
        color: "#00e5ff", glowColor: "#00ffcc",
        stats: {
            groundSpeed: 3.5, airSpeed: 3.0,
            jumpPower: 0, weight: 26, airJumpsMax: 0,
            gravity: 0.28, fallSpeedLimit: 8.0, chaseMult: 1.0
        },
        scaleFactor: 1.8, powerFactor: 1.6, isSentinelBoss: true, maxPercent: 280,
        moves: {
            // 💥 地上サマーソルトと、飛び道具を吸い込んで回復するグラビティマグネットを装備
            close: ['smash-d-somersault', 'sp_d_discharge'], 
            far: ['sp_d_absorb', 'air-smash-n-sphere']
        },
        // 💡 修正：目や口を表示させず、バイザー（コア眼）を点灯（eye: false, mouth: false, visor: true）
        parts: { eye: false, nose: false, mouth: false, visor: true, halo: true, booster: true },
        customizerTransforms: {
            visor: { scale: 2.0, x: 0, y: 0 },      
            halo: { scale: 2.4, x: 0, y: 15 },      
            booster: { scale: 1.8, x: 0, y: 35 }     
        }
    },
   'dica_alpha': {
        name: "衝撃制御装甲機",
        shape: "fortress", 
        width: 75, height: 105,
        color: "#6a1b9a", glowColor: "#e040fb",
        stats: {
            groundSpeed: 1.4, airSpeed: 1.1,
            jumpPower: -13, weight: 28, airJumpsMax: 2,
            gravity: 0.42, fallSpeedLimit: 12.0, chaseMult: 1.25,        
            detectRange: 600, detectHeight: 250
        },
        scaleFactor: 1.6, powerFactor: 1.4, isHandBoss: false, maxPercent: 240,
        moves: {
            close: ['smash-n-straight', 'smash-d-earth-quake', 'sp_n_grab', 'sp_s_assault'],
            far: ['sp_n_charge', 'sp_s_kart', 'sp_d_counter', 'sp_n_poison_fog'],
            recovery: ['sp_up_teleport']
        },
 // 💡 修正：ロボット装甲機のため、目や口を非表示化（eye: false, mouth: false, visor: true）
        parts: { eye: false, nose: false, mouth: false, mantle: true, visor: true, wing: true, booster: true },
        customizerTransforms: {
            visor: { scale: 1.8, x: 0, y: 0 },    
            wing: { scale: 1.5, x: 0, y: 5 },     
            mantle: { scale: 1.3, x: 0, y: 15 },  
            booster: { scale: 1.6, x: 0, y: 22 }  
        }
    },
    'nexus_gigant': {
        name: "ギガント",
        shape: "vortex", 
        // 💡 基礎サイズを 140x200 から 180x250 へ拡大
        width: 180, height: 250, 
        color: "#1a0302", glowColor: "#ff3300", 
        stats: {
            groundSpeed: 1.0, airSpeed: 0.8, 
             jumpPower: -15, weight: 45, airJumpsMax: 2,
            gravity: 0.55,          
            fallSpeedLimit: 14.0,   
            chaseMult: 1.1,         
            detectRange: 1200,      
            detectHeight: 600
        },
        // 💡 描画・物理スケール要因を 2.8 から 3.6 へ引き上げて超巨大化
        scaleFactor: 3.6,           
        powerFactor: 2.2,           
        isHandBoss: false,
        maxPercent: 500,            
        moves: {
            close: ['smash-n-straight', 'smash-d-earth-quake', 'sp_d_hipdrop'],
            far: ['sp_n_charge', 'sp_d_thunder', 'sp_s_max_typhoon', 'air-smash-n-sphere'],
            recovery: ['sp_up_aether'] 
        },
// 💡 修正：目、鼻、口、バイザー、マント、天使の輪、ブースターなど、巨神に不要なあらゆる余計なパーツを完全に排除（falseに固定）します
        parts: { eye: false, nose: false, mouth: false, mantle: false, visor: false, horn: true, halo: false, booster: false },
        customizerTransforms: {
            // 💡 必要なツノ（horn）のオフセット位置調整のみを残し、不要なブースターや天使の輪の変形設定を綺麗に削除します
            horn: { scale: 2.5, x: 0, y: -65 }
        }
    },
    'dealer_777': {
        name: "DEALER-777",
        shape: "skull", 
        width: 80, height: 80,
        color: "#ffcc00", glowColor: "#ff00ff",
        stats: {
            groundSpeed: 2.0, airSpeed: 1.8,
            jumpPower: -10, weight: 14, airJumpsMax: 1,
            gravity: 0.28, fallSpeedLimit: 8.5, chaseMult: 1.15
        },
        scaleFactor: 1.5, powerFactor: 1.3, maxPercent: 250,
        moves: {
            close: ['sp_s_slot_hammer', 'sp_s_judge', 'normal-n-upper'],
            far: ['sp_n_thack', 'sp_n_fireball', 'air-smash-n-sphere']
        },
        // 💡 ドクロは眼窩に目を置くため、eye: true のままで口のみ非表示に変更（mouth: false）
        parts: { eye: true, nose: false, mouth: false, mantle: false, cheek: true, horn: true },
        customizerTransforms: {
            eye: { scale: 1.8, x: -6, y: -15 },   
            horn: { scale: 2.5, x: 0, y: -45 },   
            cheek: { scale: 2.2, x: 0, y: 25 }    
        }
    },
    'vortex_omega': {
        name: "重力黒孔",
        shape: "vortex", 
        width: 90, height: 90,
        color: "#4a148c", glowColor: "#ff00ff",
        stats: {
            groundSpeed: 2.5, airSpeed: 2.2,
            jumpPower: -11, weight: 25, airJumpsMax: 2,
            gravity: 0.28, fallSpeedLimit: 7.5, chaseMult: 1.25
        },
        scaleFactor: 1.8, powerFactor: 1.6, maxPercent: 300,
        moves: {
            close: ['sp_n_grab', 'sp_s_diving_press', 'air-smash-d-giga-drill'],
            // 💥 吸収バリア（sp_d_absorb）を装備させ、ハメ射撃を無力化する
            far: ['sp_up_gravity_reverse', 'air-smash-neutral-sphere', 'sp_d_absorb']
        },
        // 💡 修正：重力渦には目や口を非表示にし、コアだけを点灯（eye: false, mouth: false, visor: true）
        parts: { eye: false, nose: false, mouth: false, visor: true, booster: true },
        customizerTransforms: {
            visor: { scale: 1.4, x: 0, y: 0 },    
            booster: { scale: 1.8, x: 0, y: 25 }  
        }
    },
    'carrier_x': {
        name: "廃棄キメラ",
        shape: "trapezoid", 
        width: 100, height: 80,
        color: "#3d2e20", glowColor: "#ff5500",
        stats: {
            groundSpeed: 3.5, airSpeed: 2.8, 
            jumpPower: -11, weight: 26, airJumpsMax: 2,
            gravity: 0.32, fallSpeedLimit: 10.0, chaseMult: 1.35
        },
        scaleFactor: 1.7, powerFactor: 1.5, maxPercent: 320,
        moves: {
            close: ['sp_s_dash', 'sp_s_quick_attack', 'smash-d-somersault'],
            far: ['air-smash-s-laser-pierce', 'sp_s_kart', 'sp_n_charge']
        },
        // 💡 修正：キメラ兵器のため、目や口を非表示（eye: false, mouth: false）
        parts: { eye: false, nose: false, mouth: false, mantle: true, tail: true, hat: true },
        customizerTransforms: {
            tail: { scale: 2.5, x: 0, y: -35 },   
            hat: { scale: 1.8, x: -25, y: 12 },   
            mantle: { scale: 1.6, x: 0, y: 15 }   
        }
    },
    'death_core': {
        name: "デスコア",
        shape: "skull", // 💡 ドクロ形状のバインド
        width: 90, height: 110,
        color: "#4a0000", glowColor: "#ff1100",
        stats: {
            groundSpeed: 1.8, airSpeed: 1.8,
            jumpPower: -10, weight: 18, airJumpsMax: 1,
            gravity: 0.3, fallSpeedLimit: 8.5, chaseMult: 1.2
        },
        scaleFactor: 1.6, powerFactor: 1.5, maxPercent: 280,
        moves: {
            close: ['sp_d_flash_slash', 'smash-n-phantom-fist', 'normal-n-upper'],
            far: ['sp_n_thack', 'sp_n_flare_seal', 'sp_d_c4']
        },
        parts: { eye: true, nose: false, mouth: false, mantle: true },
        customizerTransforms: {
            eye: { scale: 1.8, x: -6, y: -15 },  // 眼窩に収まる赤い眼球
            mantle: { scale: 1.5, x: 0, y: 15 }   // 漂う禍々しいマント
        }
    },
    'king_hydra': {
        name: "三頭龍",
        shape: "hydra", // 💡 三頭ハイドラ形状のバインド
        width: 130, height: 130,
        color: "#1b5e20", glowColor: "#39ff14",
        stats: {
            groundSpeed: 1.2, airSpeed: 1.2,
            jumpPower: -8, weight: 32, airJumpsMax: 1,
            gravity: 0.45, fallSpeedLimit: 12.0, chaseMult: 1.10
        },
        scaleFactor: 1.9, powerFactor: 1.7, maxPercent: 350,
        moves: {
            close: ['sp_n_flame', 'smash-d-earth-quake', 'sp_s_roller'],
            far: ['sp_d_thundaga', 'sp_n_fireball', 'sp_n_blizzard_breath']
        },
        parts: { eye: true, nose: false, mouth: false, horn: true },
        customizerTransforms: {
            // 三つの首それぞれに変形パーツをワープ配置
            eye: { scale: 1.3, x: -38, y: -30 },    // 左の首の目
            horn: { scale: 1.6, x: 0, y: -55 },     // 中央の首の角
            cheek: { scale: 1.3, x: 38, y: -30 }    // 右の首のコア
        }
    },
    'mother_fortress': {
        name: "マザーフォートレス",
        shape: "fortress", // 💡 回転シールド付き電脳要塞形状のバインド
        width: 100, height: 100,
        color: "#0d47a1", glowColor: "#00ffff",
        stats: {
            groundSpeed: 1.4, airSpeed: 1.4,
            jumpPower: -6, weight: 38, airJumpsMax: 0, // 浮遊要塞のためジャンプは鈍重
            gravity: 0.2, fallSpeedLimit: 5.0, chaseMult: 1.05
        },
        scaleFactor: 2.1, powerFactor: 1.4, maxPercent: 400,
        moves: {
            close: ['sp_d_reflector', 'sp_d_discharge', 'smash-d'],
            // 💥 5秒間の電磁反射板（sp_d_mirror_plate）を登録して、前面の射線をガード
            far: ['air-smash-s-laser-pierce', 'sp_s_max_cyclone', 'sp_d_mirror_plate']
        },
        parts: { eye: true, nose: false, mouth: false, visor: true, halo: true },
        customizerTransforms: {
            visor: { scale: 1.5, x: 0, y: 0 },    // 中央コアのセンサー
            halo: { scale: 2.0, x: 0, y: 15 }      // 下部の反重力粒子リング
        }
    },
    'ground_grinder': {
        name: "削岩ドリル・グラインダー",
        shape: "gear", // 歯車（ローター回転体を模した形）
        width: 85, height: 85,
        color: "#795548", glowColor: "#cfd8dc", // 泥と鉄のダークブラウン
        stats: {
            groundSpeed: 1.8, airSpeed: 1.5,
            jumpPower: -11, weight: 25, airJumpsMax: 1,
            gravity: 0.42, fallSpeedLimit: 11.0, chaseMult: 1.25,        
            detectRange: 600, detectHeight: 300
        },
        scaleFactor: 1.65, powerFactor: 1.5, maxPercent: 260,
        moves: {
            close: ['air-smash-d-giga-drill', 'smash-d-earth-quake', 'normal-d-lowkick'],
            far: ['sp_s_clay_rocket', 'sp_n_charge']
        },
        // 💡 ドリルロボのため、目や口は非表示（コア眼のみ点灯）
        parts: { eye: false, nose: false, mouth: false, visor: true, horn: true, booster: true },
        customizerTransforms: {
            visor: { scale: 1.8, x: 0, y: -10 },
            horn: { scale: 2.2, x: 0, y: -50 },     // 削岩ヘッド
            booster: { scale: 1.6, x: 0, y: 35 }
        }
    },
    'system_voice_core': {
        name: "自律型監視コア",
        shape: "ai_core", // 💥 新形状「サイバー単眼AIコア」
        width: 80, height: 80,
        color: "#00e5ff", glowColor: "#ff0055", // ネオンシアン枠と赤く輝くカメラアイ
        stats: {
            groundSpeed: 2.2, airSpeed: 2.2,
            jumpPower: 0, weight: 15, airJumpsMax: 0,
            gravity: 0.2, fallSpeedLimit: 6.0, chaseMult: 1.1
        },
        scaleFactor: 1.5, powerFactor: 1.3, maxPercent: 220,
        moves: {
            close: ['sp_d_discharge', 'normal-n-jab'],
            far: ['sp_n_lockon', 'sp_n_fire', 'air-smash-s-laser-pierce']
        },
        parts: { eye: false, nose: false, mouth: false, visor: true, halo: true }
    }
};
