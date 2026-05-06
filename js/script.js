/* サイト全体に動きとインタラクションを追加するメインスクリプト */

document.addEventListener('DOMContentLoaded', () => {
    /* システム起動時のタイピングエフェクトとロード画面 */
    if (!sessionStorage.getItem('sysInitDone')) {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = '#02060c';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'flex-start';
        overlay.style.padding = '0 10%';
        overlay.style.transition = 'opacity 1s ease-out';
        
        const textContainer = document.createElement('div');
        textContainer.style.color = '#39ff14'; // ロード画面専用のネオングリーン
        textContainer.style.fontFamily = "'Share Tech Mono', monospace";
        textContainer.style.fontSize = '1.5rem';
        textContainer.style.textShadow = '0 0 10px #39ff14';
        textContainer.style.lineHeight = '2';
        
        overlay.appendChild(textContainer);
        document.body.appendChild(overlay);

        const lines = [
            "> SYSTEM INITIALIZATION...",
            "> ESTABLISHING SECURE CONNECTION...",
            "> ACCESS GRANTED.",
            "> LOADING ARCHIVE DATA..."
        ];
        
        let currentLine = 0;
        let currentChar = 0;

        /* テキストを1文字ずつ表示するタイピング関数 */
        function typeLine() {
            if (currentLine < lines.length) {
                if (currentChar < lines[currentLine].length) {
                    textContainer.innerHTML += lines[currentLine].charAt(currentChar);
                    currentChar++;
                    setTimeout(typeLine, 20); // タイピング速度
                } else {
                    textContainer.innerHTML += '<br>';
                    currentLine++;
                    currentChar = 0;
                    setTimeout(typeLine, 300); // 行間の待機時間
                }
            } else {
                /* 全行表示後のフェードアウト処理 */
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        sessionStorage.setItem('sysInitDone', 'true');
                    }, 1000);
                }, 800);
            }
        }
        
        setTimeout(typeLine, 500);
    }

    /* スクロール時に要素をフェードインさせるための監視設定 */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    /* 監視対象が画面に入った時の動作を定義 */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // 一度表示されたら監視を終了
            }
        });
    }, observerOptions);

    /* 対象クラスを持つ全要素を監視に登録 */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    /* ステータスグラフのクリックポップアップ制御 */
    const graphBtn = document.getElementById('statusGraphBtn');
    const radarPopup = document.getElementById('radarPopup');

    if(graphBtn && radarPopup) {
        /* グラフクリックでポップアップを切り替え */
        graphBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 親要素へのクリック伝播を防止
            radarPopup.classList.toggle('show');
        });

        /* ポップアップ外をクリックで閉じる */
        document.addEventListener('click', (e) => {
            if (radarPopup.classList.contains('show') && !radarPopup.contains(e.target)) {
                radarPopup.classList.remove('show');
            }
        });

        /* 画面外にスクロールした時にポップアップを閉じる */
        window.addEventListener('scroll', () => {
            if (radarPopup.classList.contains('show')) {
                const rect = radarPopup.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    radarPopup.classList.remove('show');
                }
            }
        }, { passive: true });
    }

    /* クリック（マウスダウン）時の波紋エフェクト開始 */
    window.addEventListener('mousedown', (e) => {
        createRipple(e.clientX, e.clientY);
    });

    /* タッチ操作時の波紋エフェクト開始 */
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            createRipple(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    /* 指定座標に波紋とフラッシュを生成する関数 */
    function createRipple(x, y) {
        /* 中心点のフラッシュエフェクト生成 */
        const flash = document.createElement('div');
        flash.className = 'click-flash';
        flash.style.left = `${x}px`;
        flash.style.top = `${y}px`;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

        /* 複数の波紋リングを時間差で生成 */
        for(let i = 0; i < 2; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.className = 'click-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                document.body.appendChild(ripple);
                setTimeout(() => ripple.remove(), 900);
            }, i * 150);
        }
    }

    /* 背景のサイバーHUD装飾を初期化 */
    initCyberHUD();

    /* Googleマップモーダルの制御 */
    const mapModal = document.getElementById('mapModal');
    const mapBtn = document.getElementById('mapObjectBtn');
    const closeMapBtn = document.getElementById('closeMapBtn');

    if (mapModal && mapBtn && closeMapBtn) {
        /* オブジェクトクリックでモーダル表示 */
        mapBtn.addEventListener('click', () => {
            mapModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 背景スクロール禁止
        });

        /* 閉じるボタンでモーダル非表示 */
        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.remove('show');
            document.body.style.overflow = ''; // スクロール再開
        });

        /* モーダル外をクリックで閉じる */
        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                mapModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
});

/* 背景のサイバーパンク風装飾要素を生成・制御する関数 */
function initCyberHUD() {
    const bg = document.getElementById('cyber-bg');
    if (!bg) return;
    bg.innerHTML = ''; 

    /* 背景中央の巨大なリングと3D球体装飾を生成 */
    const giantRing = document.createElement('div');
    giantRing.style.position = 'absolute';
    giantRing.style.top = '50%';
    giantRing.style.left = '50%';
    giantRing.style.transform = 'translate(-50%, -50%)';
    giantRing.style.width = '100vw';
    giantRing.style.height = '100vw';
    giantRing.style.maxWidth = '1000px';
    giantRing.style.maxHeight = '1000px';
    giantRing.style.opacity = '0.5';
    giantRing.style.zIndex = '0'; 
    giantRing.innerHTML = `
        <svg viewBox="0 0 1000 1000" class="hud-ring" style="width: 100%; height: 100%; position: absolute; top:0; left:0; opacity: 1;">
            <circle cx="500" cy="500" r="480" fill="var(--color-bg-main)" stroke="var(--color-border)" stroke-width="2" />
            <circle cx="500" cy="500" r="460" stroke="var(--color-primary)" stroke-width="4" stroke-dasharray="10 30" fill="none" class="spin-cw-slow" />
            <circle cx="500" cy="500" r="420" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="2 8" fill="none" class="spin-ccw" />
            <circle cx="500" cy="500" r="380" stroke="var(--color-accent)" stroke-width="20" stroke-dasharray="150 40 20 40 100 80" fill="none" class="spin-cw" opacity="0.5"/>
            <circle cx="500" cy="500" r="320" stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="5 5" fill="none" class="spin-ccw-fast" />
            <path d="M 500 20 L 500 980 M 20 500 L 980 500" stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="2 10" opacity="0.5" />
            <circle cx="500" cy="500" r="300" stroke="var(--color-primary)" stroke-width="1" fill="none" opacity="0.3"/>
        </svg>

        <div class="sphere-container" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: 400px; perspective: 800px;">
            <div class="sphere" style="width: 100%; height: 100%; transform-style: preserve-3d; animation: rotate-sphere 20s linear infinite;">
                <!-- 経度方向のリング（15度刻み） -->
                <div class="ring" style="transform: rotateY(0deg);"></div>
                <div class="ring" style="transform: rotateY(15deg);"></div>
                <div class="ring" style="transform: rotateY(30deg);"></div>
                <div class="ring" style="transform: rotateY(45deg);"></div>
                <div class="ring" style="transform: rotateY(60deg);"></div>
                <div class="ring" style="transform: rotateY(75deg);"></div>
                <div class="ring" style="transform: rotateY(90deg);"></div>
                <div class="ring" style="transform: rotateY(105deg);"></div>
                <div class="ring" style="transform: rotateY(120deg);"></div>
                <div class="ring" style="transform: rotateY(135deg);"></div>
                <div class="ring" style="transform: rotateY(150deg);"></div>
                <div class="ring" style="transform: rotateY(165deg);"></div>
                
                <!-- 緯度方向のリング（中心から上下に配置） -->
                <div class="ring" style="transform: rotateX(90deg);"></div> <!-- 赤道 -->
                
                <div class="ring" style="transform: rotateX(90deg) translateZ(51.8px) scale(0.966);"></div> <!-- 15度 -->
                <div class="ring" style="transform: rotateX(90deg) translateZ(-51.8px) scale(0.966);"></div> 
                
                <div class="ring" style="transform: rotateX(90deg) translateZ(100px) scale(0.866);"></div> <!-- 30度 -->
                <div class="ring" style="transform: rotateX(90deg) translateZ(-100px) scale(0.866);"></div> 
                
                <div class="ring" style="transform: rotateX(90deg) translateZ(141.4px) scale(0.707);"></div> <!-- 45度 -->
                <div class="ring" style="transform: rotateX(90deg) translateZ(-141.4px) scale(0.707);"></div> 
                
                <div class="ring" style="transform: rotateX(90deg) translateZ(173.2px) scale(0.5);"></div> <!-- 60度 -->
                <div class="ring" style="transform: rotateX(90deg) translateZ(-173.2px) scale(0.5);"></div> 
                
                <div class="ring" style="transform: rotateX(90deg) translateZ(193.2px) scale(0.259);"></div> <!-- 75度 -->
                <div class="ring" style="transform: rotateX(90deg) translateZ(-193.2px) scale(0.259);"></div> 
            </div>
        </div>
    `;
    bg.appendChild(giantRing);

    /* 左上のサブレーダー装飾を生成 */
    const topLeft = document.createElement('div');
    topLeft.style.position = 'absolute';
    topLeft.style.top = '3%';
    topLeft.style.left = '3%';
    topLeft.style.width = '250px';
    topLeft.style.height = '250px';
    topLeft.style.opacity = '0.4';
    topLeft.style.zIndex = '10';
    topLeft.innerHTML = `
        <svg viewBox="0 0 300 300" class="hud-ring" style="width: 100%; height: 100%;">
            <circle cx="150" cy="150" r="140" stroke="var(--color-primary)" stroke-width="4" stroke-dasharray="40 10 10 10" fill="none" class="spin-cw" />
            <circle cx="150" cy="150" r="100" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="5 5" fill="none" class="spin-ccw-fast" />
            <circle cx="150" cy="150" r="70" stroke="var(--color-primary)" stroke-width="10" stroke-dasharray="50 150" fill="none" class="spin-cw-fast" />
            <path d="M 150 0 L 150 300 M 0 150 L 300 150" stroke="var(--color-primary)" stroke-width="1" opacity="0.5"/>
            <circle cx="150" cy="150" r="20" stroke="var(--color-primary)" stroke-width="1" fill="none" class="pulse-op"/>
        </svg>
    `;
    bg.appendChild(topLeft);

    /* 左下の多機能データ転送ゲージ（ダウンロードバー）を生成 */
    const bottomLeft = document.createElement('div');
    bottomLeft.style.position = 'absolute';
    bottomLeft.style.bottom = '3%';
    bottomLeft.style.left = '3%';
    bottomLeft.style.width = '400px';
    bottomLeft.style.height = '120px';
    bottomLeft.style.opacity = '0.8';
    bottomLeft.style.zIndex = '10';
    
    bottomLeft.innerHTML = `
        <!-- 背景フレームと固定装飾 -->
        <svg viewBox="0 0 400 120" style="position: absolute; top:0; left:0; width: 100%; height: 100%; filter: drop-shadow(0 0 5px var(--color-primary)); z-index: 1;">
            
            <!-- 上部装飾バー -->
            <path d="M 115 25 L 320 25 L 330 35 L 115 35 Z" fill="var(--color-primary-dim)" />
            <!-- メインプログレスバーの枠線 -->
            <path d="M 60 35 L 350 35 L 370 55 L 350 75 L 60 75 Z" fill="rgba(0, 243, 255, 0.1)" stroke="var(--color-primary)" stroke-width="2" />
            <!-- 下部装飾線とテキスト -->
            <path d="M 115 80 L 300 80 L 310 90 L 115 90 Z" fill="none" stroke="var(--color-primary)" stroke-width="1.5" />
            <line x1="120" y1="85" x2="160" y2="85" stroke="var(--color-primary)" stroke-width="3" />
            <text id="dl-status-text" x="170" y="88" fill="var(--color-primary)" font-family="'Share Tech Mono', monospace" font-size="10" letter-spacing="2">LOADING_DATA...</text>

            <!-- 円形部分のマスク用背景 -->
            <circle cx="60" cy="60" r="56" fill="var(--color-bg-main)" />
            
            <!-- 円形装飾（回転アニメーション付き） -->
            <circle cx="60" cy="60" r="55" fill="rgba(0, 243, 255, 0.05)" stroke="var(--color-primary)" stroke-width="2" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="5 5" class="spin-cw-slow" opacity="0.8" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="var(--color-primary-dim)" stroke-width="3" stroke-dasharray="20 10" class="spin-ccw-fast" opacity="0.6"/>
            <circle cx="60" cy="60" r="35" fill="none" stroke="var(--color-primary-dim)" stroke-width="1" />
            <!-- 照準線装飾 -->
            <path d="M 60 20 L 60 30 M 60 90 L 60 100 M 20 60 L 30 60 M 90 60 L 100 60" stroke="var(--color-primary)" stroke-width="1" opacity="0.5" />
        </svg>

        <!-- 円形の進行状況アーク -->
        <svg viewBox="0 0 120 120" style="position: absolute; top:0; left:0; width: 120px; height: 120px; transform: rotate(-90deg); z-index: 2;">
            <circle id="dl-arc" cx="60" cy="60" r="41.5" fill="none" stroke="var(--color-primary)" stroke-width="10" stroke-dasharray="261" stroke-dashoffset="261" style="transition: stroke-dashoffset 0.1s linear;" />
        </svg>

        <!-- パーセント表示テキスト -->
        <div id="dl-text" style="position: absolute; top: 0; left: 0; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: bold; color: var(--color-primary); text-shadow: 0 0 8px var(--color-primary); z-index: 3;">
            0%
        </div>

        <!-- セグメント分割されたプログレスバー -->
        <div style="position: absolute; top: 40px; left: 125px; width: 220px; height: 30px; display: flex; gap: 4px; padding: 5px; box-sizing: border-box; z-index: 2; clip-path: polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%);">
            <div id="dl-segments" style="display: flex; gap: 4px; width: 100%; height: 100%;"></div>
        </div>
    `;
    bg.appendChild(bottomLeft);

    /* ダウンロードバーのアニメーションロジック */
    const dlSegmentsContainer = bottomLeft.querySelector('#dl-segments');
    const dlText = bottomLeft.querySelector('#dl-text');
    const dlArc = bottomLeft.querySelector('#dl-arc');
    
    /* 15個の傾斜したセグメントブロックを生成 */
    const totalSegments = 15;
    for(let i=0; i<totalSegments; i++) {
        const seg = document.createElement('div');
        seg.style.flex = '1';
        seg.style.backgroundColor = 'var(--color-primary-dim)';
        seg.style.transform = 'skewX(-20deg)'; 
        seg.style.transition = 'background-color 0.1s, box-shadow 0.1s';
        dlSegmentsContainer.appendChild(seg);
    }

    let dlProgress = 0;
    let isComplete = false;
    let isWaitingForStart = false;
    const dlStatusText = bottomLeft.querySelector('#dl-status-text');

    /* 進捗状況を一定間隔で更新 */
    setInterval(() => {
        if (isComplete || isWaitingForStart) return;

        dlProgress += Math.random() * 0.3 + 0.1; 

        if (dlProgress >= 100) {
            dlProgress = 100;
            isComplete = true;

            /* 100%完了時のエフェクト実行 */
            dlText.textContent = '100%';
            dlText.style.color = '#fff';
            dlText.style.textShadow = '0 0 15px #fff, 0 0 30px var(--color-primary)';
            
            dlArc.style.stroke = '#fff';
            dlArc.style.filter = 'drop-shadow(0 0 10px #fff)';
            dlArc.style.strokeDashoffset = 0;

            const children = dlSegmentsContainer.children;
            for(let i=0; i<totalSegments; i++) {
                children[i].style.backgroundColor = '#fff';
                children[i].style.boxShadow = '0 0 15px #fff, 0 0 30px var(--color-primary)';
            }

            if (dlStatusText) {
                dlStatusText.textContent = 'TRANSFER_COMPLETE';
                dlStatusText.setAttribute('fill', '#fff');
            }

            /* 3秒後にリセットしてループさせる */
            setTimeout(() => {
                dlProgress = 0;
                isComplete = false;
                isWaitingForStart = true;
                
                dlText.textContent = '0%';
                dlText.style.color = 'var(--color-primary)';
                dlText.style.textShadow = '0 0 8px var(--color-primary)';
                
                dlArc.style.stroke = 'var(--color-primary)';
                dlArc.style.filter = 'none';
                dlArc.style.strokeDashoffset = 261;
                
                for(let i=0; i<totalSegments; i++) {
                    children[i].style.backgroundColor = 'var(--color-primary-dim)';
                    children[i].style.boxShadow = 'none';
                }
                
                if (dlStatusText) {
                    dlStatusText.textContent = 'LOADING_DATA...';
                    dlStatusText.setAttribute('fill', 'var(--color-primary)');
                }

                setTimeout(() => {
                    isWaitingForStart = false;
                }, 3000);

            }, 3000);
            return;
        }

        /* 進行中の数値を反映 */
        const displayProgress = Math.floor(dlProgress);
        dlText.textContent = displayProgress + '%';
        
        const offset = 261 - (261 * (displayProgress / 100));
        dlArc.style.strokeDashoffset = offset;

        const activeSegments = Math.floor((displayProgress / 100) * totalSegments);
        const children = dlSegmentsContainer.children;
        for(let i=0; i<totalSegments; i++) {
            if(i < activeSegments) {
                children[i].style.backgroundColor = 'var(--color-primary)';
                children[i].style.boxShadow = '0 0 5px var(--color-primary)';
            } else {
                children[i].style.backgroundColor = 'var(--color-primary-dim)';
                children[i].style.boxShadow = 'none';
            }
        }
    }, 60);

    /* 右上のシステムリソース監視パネルを生成 */
    const topRight = document.createElement('div');
    topRight.style.position = 'absolute';
    topRight.style.top = '3%';
    topRight.style.right = '3%';
    topRight.style.width = '300px';
    topRight.style.height = '150px';
    topRight.style.opacity = '0.6';
    topRight.style.zIndex = '10';
    topRight.style.border = '1px solid var(--color-primary)';
    topRight.style.backgroundColor = 'rgba(0, 243, 255, 0.05)';
    topRight.style.boxShadow = 'inset 0 0 15px rgba(0, 243, 255, 0.2)';
    topRight.style.display = 'flex';
    topRight.style.flexDirection = 'column';
    topRight.style.overflow = 'hidden';

    /* 内部のグラフバー要素をランダムに生成 */
    let bars = '';
    for(let i=0; i<12; i++) {
        let delay = Math.random() * 2;
        let maxWidth = Math.random() * 80 + 20; 
        bars += `<div style="height: 3px; margin-bottom: 3px; background: var(--color-primary); box-shadow: 0 0 5px var(--color-primary); max-width: ${maxWidth}%; width: 100%; animation: pulse-width 1s ease-in-out infinite alternate ${delay}s;"></div>`;
    }

    topRight.innerHTML = `
        <div style="padding: 10px; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: var(--color-primary); border-bottom: 1px solid var(--color-primary); text-shadow: 0 0 5px var(--color-primary); display: flex; justify-content: space-between;">
            <span>SYS_MEM // ALLOC</span>
            <span class="pulse-op">94.2%</span>
        </div>
        <div style="flex: 1; padding: 10px; display: flex; flex-direction: column; justify-content: center; border-left: 2px solid var(--color-primary); margin: 5px 10px;">
            ${bars}
        </div>
    `;
    bg.appendChild(topRight);

    /* 右下の波形周波数グラフ装飾を生成 */
    const bottomRight = document.createElement('div');
    bottomRight.style.position = 'absolute';
    bottomRight.style.bottom = '3%';
    bottomRight.style.right = '3%';
    bottomRight.style.width = '300px';
    bottomRight.style.height = '150px';
    bottomRight.style.opacity = '0.6';
    bottomRight.style.zIndex = '10';
    bottomRight.style.border = '1px solid var(--color-primary)';
    bottomRight.style.backgroundColor = 'rgba(0, 243, 255, 0.05)';
    bottomRight.style.boxShadow = 'inset 0 0 15px rgba(0, 243, 255, 0.2)';
    bottomRight.style.display = 'flex';
    bottomRight.style.flexDirection = 'column';
    bottomRight.style.justifyContent = 'flex-end';
    bottomRight.style.overflow = 'hidden';
    
    /* 連続する波形のパスデータを生成 */
    let wavePath = "M 0 50 ";
    const peaks = 20; 
    const step = 30; 
    for (let i=0; i<peaks; i++) {
        let sx = i * step;
        wavePath += `Q ${sx + 7.5} 0, ${sx + 15} 50 T ${sx + 30} 50 `;
    }
    
    bottomRight.innerHTML = `
        <div style="padding: 10px; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: var(--color-primary); border-bottom: 1px solid var(--color-primary); text-shadow: 0 0 5px var(--color-primary);">
            FREQ_ANALYSIS // 84.992Mhz
        </div>
        <div style="position: relative; width: 100%; height: 100px; overflow: hidden;">
            <svg viewBox="0 0 ${peaks*step} 100" preserveAspectRatio="none" style="width: 200%; height: 100%; position: absolute; left: 0; animation: wave-slide 5s linear infinite;">
                <path d="${wavePath}" fill="none" stroke="var(--color-primary)" stroke-width="2" style="filter: drop-shadow(0 0 5px var(--color-primary));" />
            </svg>
        </div>
    `;
    bg.appendChild(bottomRight);
}

/* お気に入りや作品リンクをクリックした際のページ遷移演出 */
document.addEventListener('DOMContentLoaded', () => {
    /* 演出用の追加CSSアニメーションを注入 */
    if (!document.getElementById('sf-window-style')) {
        const style = document.createElement('style');
        style.id = 'sf-window-style';
        style.innerHTML = `
            @keyframes sf-glitch-text {
                0% { opacity: 1; transform: translateX(0); }
                10% { opacity: 0.8; transform: translateX(-2px); }
                20% { opacity: 1; transform: translateX(2px); }
                30% { opacity: 0.9; transform: translateX(-1px); }
                100% { opacity: 1; transform: translateX(0); }
            }
            .sf-scanning-bar {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: var(--color-primary);
                box-shadow: 0 0 10px var(--color-primary);
                animation: sf-scan 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            @keyframes sf-scan {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            @keyframes fav-card-burst {
                0%   { transform: scale(1); opacity: 1; }
                40%  { transform: scale(1.04); opacity: 1; }
                100% { transform: scale(1.01); opacity: 0.5; }
            }
            .fav-card-launching {
                animation: fav-card-burst 0.4s ease-out forwards !important;
                z-index: 200 !important;
                border-color: #fff !important;
                box-shadow: 0 0 40px rgba(0, 243, 255, 0.6), inset 0 0 30px rgba(0, 243, 255, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* 遷移対象となるリンク要素を取得 */
    const transitionLinks = document.querySelectorAll('a.fav-card');
    const backLinks = document.querySelectorAll('a.back-btn');

    /* 次のページへ進む際のSFウィンドウ展開演出を制御 */
    const handleForwardTransition = (e, link) => {
        e.preventDefault();
        const targetUrl = link.getAttribute('href');
        const targetTitle = link.querySelector('.card-title')
            ? link.querySelector('.card-title').innerText.toUpperCase()
            : 'UNKNOWN';

        /* 画面を覆う半透明のオーバーレイを作成 */
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background-color: rgba(5, 11, 20, 0.4);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            opacity: 1;
        `;

        /* 中央で展開するSFスタイルのウィンドウを作成 */
        const sfWindow = document.createElement('div');
        sfWindow.style.cssText = `
            position: relative;
            width: 0px; height: 2px;
            background-color: var(--color-primary);
            box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
            transition:
                width 0.3s cubic-bezier(0.1, 1, 0.1, 1),
                height 0.35s cubic-bezier(0.1, 1, 0.1, 1) 0.3s,
                background-color 0.1s 0.3s;
        `;

        /* ウィンドウ内の詳細装飾とテキストを構築 */
        sfWindow.innerHTML = `
            <div style="
                position: absolute; top: 0; left: 0;
                width: 100%; height: 100%;
                border: 1px solid rgba(0, 243, 255, 0.4);
                background-color: rgba(3, 10, 22, 0.88);
                box-shadow:
                    0 4px 20px rgba(0, 0, 0, 0.5),
                    inset 0 0 15px rgba(0, 243, 255, 0.05);
                opacity: 0;
                transition: opacity 0.2s 0.62s;
                display: flex; flex-direction: column; box-sizing: border-box;
                overflow: hidden;
                font-family: 'Share Tech Mono', monospace;
            ">
                <!-- 走査線レイヤー -->
                <div style="position:absolute; inset:0; background:linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.3) 50%); background-size:100% 4px; pointer-events:none; z-index:10;"></div>

                <!-- 四隅のブラケット装飾 -->
                <span style="position:absolute; top:0; left:0; width:10px; height:10px; border-top:1px solid #fff; border-left:1px solid #fff; opacity:0.5; pointer-events:none; z-index:3;"></span>
                <span style="position:absolute; top:0; right:0; width:10px; height:10px; border-top:1px solid #fff; border-right:1px solid #fff; opacity:0.5; pointer-events:none; z-index:3;"></span>
                <span style="position:absolute; bottom:0; left:0; width:10px; height:10px; border-bottom:1px solid #fff; border-left:1px solid #fff; opacity:0.5; pointer-events:none; z-index:3;"></span>
                <span style="position:absolute; bottom:0; right:0; width:10px; height:10px; border-bottom:1px solid #fff; border-right:1px solid #fff; opacity:0.5; pointer-events:none; z-index:3;"></span>

                <!-- ウィンドウ上部のタイトルバー -->
                <div style="
                    padding: 10px 18px;
                    border-bottom: 1px solid rgba(0, 243, 255, 0.15);
                    background: rgba(0, 243, 255, 0.06);
                    display: flex; justify-content: space-between; align-items: center;
                    flex-shrink: 0; position: relative; z-index: 2;
                ">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="color:rgba(0,243,255,0.4); font-size:0.75rem; letter-spacing:0.1em;">WINDOW.ID.102</span>
                        <span style="color:#fff; font-size:1.05rem; font-weight:bold; letter-spacing:0.06em;">&gt; ${targetTitle}</span>
                    </div>
                    <div style="font-size:0.75rem; color:rgba(0,243,255,0.5); letter-spacing:0.05em;">ENCRYPTED_LINK</div>
                </div>

                <!-- 接続中を示す中央コンテンツ -->
                <div style="
                    flex:1; display:flex; align-items:center; justify-content:center;
                    flex-direction:column; padding:0 40px;
                    color:var(--color-primary);
                    position: relative; z-index: 2;
                ">
                    <div style="font-size:1.5rem; margin-bottom:14px; letter-spacing:0.06em; animation:sf-glitch-text 3s infinite; text-align:center; text-shadow:0 0 10px rgba(0,243,255,0.5);">
                        ESTABLISHING SECURE CONNECTION
                    </div>
                    <div style="font-size:0.95rem; opacity:0.6; margin-bottom:28px; letter-spacing:0.12em;">
                        TARGETNODE: [${targetTitle}]
                    </div>

                    <!-- 接続状況を示すバー -->
                    <div style="width:min(320px, 50vw);">
                        <div style="height:2px; background:rgba(0,243,255,0.1); position:relative; overflow:hidden;">
                            <div class="sf-scanning-bar" style="height:100%; background:var(--color-primary);"></div>
                        </div>
                    </div>
                </div>

                <!-- ウィンドウ下部のステータスバー -->
                <div style="
                    padding:6px 18px;
                    border-top:1px solid rgba(0,243,255,0.1);
                    background:rgba(0, 243, 255, 0.02);
                    display:flex; justify-content:flex-end;
                    font-size:0.72rem; color:rgba(0,243,255,0.35); letter-spacing:0.06em;
                    position: relative; z-index: 2;
                ">
                    <span>REMOTE_ACCESS_INITIALIZED</span>
                </div>
            </div>
        `;

        overlay.appendChild(sfWindow);
        document.body.appendChild(overlay);

        /* ウィンドウのアニメーションを開始 */
        requestAnimationFrame(() => {
            sfWindow.style.width = 'min(70vw, 700px)';
            sfWindow.style.height = '55vh';
            sfWindow.style.backgroundColor = 'transparent';
            const content = sfWindow.querySelector('div');
            if (content) content.style.opacity = '1';
        });

        /* 一定時間後に実際のURLへ遷移 */
        setTimeout(() => { window.location.href = targetUrl; }, 1600);
    };

    /* 戻るボタンをクリックした際の閉鎖演出を制御 */
    const handleBackTransition = (e, link) => {
        e.preventDefault();
        const targetUrl = link.getAttribute('href');
        document.body.classList.add('closing'); // CSSで定義された縮小アニメーションを実行
        setTimeout(() => { window.location.href = targetUrl; }, 230);
    };

    /* 各リンク要素にイベントリスナーを登録 */
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => handleForwardTransition(e, link));
    });

    backLinks.forEach(link => {
        link.addEventListener('click', (e) => handleBackTransition(e, link));
    });
});



