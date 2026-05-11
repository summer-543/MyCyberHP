/* サイト全体に動きとインタラクションを追加するメインスクリプト */

document.addEventListener('DOMContentLoaded', () => {
    /* システム起動時のタイピングエフェクトとロード画面 (一時的にコメントアウト)
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
    */

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
        // タッチデバイス以外（マウス操作）の場合のみ実行
        if (window.matchMedia('(pointer: fine)').matches) {
            createRipple(e.clientX, e.clientY);
        }
    });


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

    /* メールアドレスのコピー機能 */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    let copyMessageTimeout = null;

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailTextEl = copyEmailBtn.querySelector('.email-text');
            const email = emailTextEl ? emailTextEl.innerText.trim() : copyEmailBtn.innerText.trim();
            navigator.clipboard.writeText(email).then(() => {
                /* フィードバック：一瞬発光させる */
                copyEmailBtn.style.backgroundColor = 'rgba(0, 243, 255, 0.4)';
                copyEmailBtn.style.boxShadow = '0 0 25px var(--color-primary)';

                /* メッセージの表示：ステータスバーのテキストを一時的に変更 */
                const statusText = copyEmailBtn.closest('.contact-info-content').querySelector('.status-text');
                if (statusText) {
                    /* 元のテキストを初回のみ保持（連続クリック対策） */
                    if (!statusText.hasAttribute('data-original')) {
                        statusText.setAttribute('data-original', statusText.textContent);
                    }
                    
                    /* 既存のタイマーがあればクリア */
                    if (copyMessageTimeout) clearTimeout(copyMessageTimeout);

                    statusText.textContent = 'COMM_LINK :: ADDR_COPIED';
                    statusText.style.color = '#fff';
                    statusText.style.textShadow = '0 0 8px var(--color-primary)';

                    /* 4秒後に元に戻す */
                    copyMessageTimeout = setTimeout(() => {
                        statusText.textContent = statusText.getAttribute('data-original');
                        statusText.style.color = '';
                        statusText.style.textShadow = '';
                        copyMessageTimeout = null;
                    }, 4000);
                }

                setTimeout(() => {
                    copyEmailBtn.style.backgroundColor = '';
                    copyEmailBtn.style.boxShadow = '';
                }, 200);
            });
        });
    }

    /* スクロールに応じたナビゲーションのハイライト（ScrollSpy） */
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section[id]');
    const mainContent = document.querySelector('.main-content');

    function scrollSpy() {
        if (!mainContent) return;
        
        // メインコンテンツ内のスクロール位置を取得（ヘッダーの高さを考慮）
        const scrollPos = mainContent.scrollTop + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(`#${sectionId}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // ページ最上部（スクロールが少ない時）はプロフィールを確実にアクティブにする
        if (mainContent.scrollTop < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const firstLink = document.querySelector('.nav a[href*="#profile"]');
            if (firstLink) firstLink.classList.add('active');
        }
    }

    // スクロールイベントを監視（メインページ：#profileが存在する場合のみ実行）
    if (mainContent && sections.length > 0 && document.getElementById('profile')) {
        mainContent.addEventListener('scroll', scrollSpy, { passive: true });
        scrollSpy();
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
    giantRing.style.width = '1000px';
    giantRing.style.height = '1000px';
    giantRing.style.opacity = '0.3';
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
    topLeft.style.opacity = '0.5';
    topLeft.style.zIndex = '20';
    topLeft.style.transformOrigin = 'top left';
    topLeft.innerHTML = `
        <svg viewBox="0 0 300 300" class="hud-ring" style="width: 100%; height: 100%;">
            <circle cx="150" cy="150" r="140" stroke="var(--color-primary)" stroke-width="4" stroke-dasharray="40 10 10 10" fill="none" class="spin-cw" />
            <circle cx="150" cy="150" r="100" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="5 5" fill="none" class="spin-ccw-fast" />
            <circle cx="150" cy="150" r="70" stroke="var(--color-primary)" stroke-width="10" stroke-dasharray="50 150" fill="none" class="spin-cw-fast" />
            <path d="M 150 10 L 150 290 M 10 150 L 290 150" stroke="var(--color-primary)" stroke-width="1" opacity="0.5"/>
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
    bottomLeft.style.opacity = '0.9';
    bottomLeft.style.zIndex = '20';
    bottomLeft.style.transformOrigin = 'bottom left';
    
    bottomLeft.innerHTML = `
        <!-- 背景フレームと固定装飾 -->
        <svg viewBox="0 0 400 120" style="position: absolute; top:0; left:0; width: 100%; height: 100%; filter: drop-shadow(0 0 5px var(--color-primary)); z-index: 1;">
            
            <!-- 上部装飾バー -->
            <path d="M 70 25 L 320 25 L 330 35 L 70 35 Z" fill="var(--color-primary-dim)" />
            <!-- メインプログレスバーの枠線 -->
            <path d="M 74.5 35 L 350 35 L 370 55 L 350 75 L 60 75 Z" fill="rgba(255, 255, 255, 0.05)" stroke="var(--color-primary)" stroke-width="2" />
            <!-- 下部装飾線とテキスト -->
            <path d="M 115 80 L 300 80 L 310 90 L 115 90 Z" fill="none" stroke="var(--color-primary)" stroke-width="1.5" />
            <line x1="120" y1="85" x2="160" y2="85" stroke="var(--color-primary)" stroke-width="3" />
            <text id="dl-status-text" x="170" y="88" fill="var(--color-primary)" font-family="'Share Tech Mono', monospace" font-size="10" letter-spacing="2">LOADING_DATA...</text>
        </svg>

        <!-- 円形インジケーター用SVG（回転中心を保つため正方形に分離） -->
        <svg viewBox="0 0 120 120" style="position: absolute; top:0; left:0; width: 120px; height: 120px; z-index: 2;">
            <!-- 円形部分のマスク用背景 -->
            <circle cx="60" cy="60" r="56" fill="var(--color-bg-main)" />
            
            <!-- 円形装飾（自転アニメーション） -->
            <circle cx="60" cy="60" r="55" fill="rgba(0, 243, 255, 0.05)" stroke="var(--color-primary)" stroke-width="2" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="5 5" class="spin-cw-slow" opacity="0.8" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="var(--color-primary-dim)" stroke-width="3" stroke-dasharray="20 10" class="spin-ccw-fast" opacity="0.6"/>
            <circle cx="60" cy="60" r="35" fill="none" stroke="var(--color-primary-dim)" stroke-width="1" />
            
            <!-- 照準線装飾 -->
            <path d="M 60 20 L 60 30 M 60 90 L 60 100 M 20 60 L 30 60 M 90 60 L 100 60" stroke="var(--color-primary)" stroke-width="1" opacity="0.5" />

            <!-- 円形の進行状況アーク -->
            <g style="transform: rotate(-90deg); transform-origin: 60px 60px;">
                <circle id="dl-arc" cx="60" cy="60" r="41.5" fill="none" stroke="var(--color-primary)" stroke-width="10" stroke-dasharray="261" stroke-dashoffset="261" style="transition: stroke-dashoffset 0.1s linear;" />
            </g>
        </svg>

        <!-- パーセント表示テキスト -->
        <div id="dl-text" style="position: absolute; top: 0; left: 0; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; font-weight: bold; color: var(--color-primary); text-shadow: 0 0 8px var(--color-primary); z-index: 3;">
            0%
        </div>

        <!-- セグメント分割されたプログレスバー（15個、間隔5px、三角エリア回避） -->
        <div style="position: absolute; top: 38px; left: 61px; width: 309px; height: 34px; display: flex; gap: 5px; align-items: center; padding: 0 10px 0 62px; box-sizing: border-box; z-index: 2; clip-path: polygon(12.4px 0, 292px 0, 100% 50%, 292px 100%, 0 100%);">
            <div id="dl-segments" style="display: flex; gap: 5px; align-items: center; width: 100%; height: 100%;"></div>
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
        seg.style.width = '10px';
        seg.style.height = '22px';
        seg.style.transform = 'skewX(-20deg)'; 
        seg.style.backgroundColor = 'var(--color-primary-dim)';
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

        // 進捗速度を調整：
        // 通常時：平均で1秒間に約2%（60msあたり平均 0.12 加算）
        // 95%以降：停滞感を出すため大幅に減速（1秒間に約0.4%程度）
        let currentIncrement = (dlProgress < 95) 
            ? (Math.random() * 0.16 + 0.04)  // 0.04 ~ 0.20 (平均 0.12)
            : (Math.random() * 0.02 + 0.005); // 0.005 ~ 0.025 (平均 0.015)
        dlProgress += currentIncrement;

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
                dlStatusText.style.textShadow = '0 0 10px #fff';
            }

            /* 3秒後に「安定状態」へ移行して停止 */
            setTimeout(() => {
                // 色をサイバーカラーに戻す
                dlText.style.color = 'var(--color-primary)';
                dlText.style.textShadow = '0 0 8px var(--color-primary)';
                
                dlArc.style.stroke = 'var(--color-primary)';
                dlArc.style.filter = 'none';
                
                for(let i=0; i<totalSegments; i++) {
                    children[i].style.backgroundColor = 'var(--color-primary)';
                    children[i].style.boxShadow = '0 0 5px var(--color-primary)';
                }

                // ステータスを「完了・保護済み」に変更
                if (dlStatusText) {
                    dlStatusText.textContent = 'SYSTEM_SECURED';
                    dlStatusText.setAttribute('fill', 'var(--color-primary)');
                    dlStatusText.style.textShadow = 'none';
                }
                
                // ここでリセット処理を呼ばずに終了することで、100%状態で静止する
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
    topRight.style.top = '6%';
    topRight.style.right = '3%';
    topRight.style.width = '300px';
    topRight.style.height = '130px';
    topRight.style.opacity = '0.7';
    topRight.style.zIndex = '20';
    topRight.style.border = '1px solid rgba(0, 243, 255, 0.4)';
    topRight.style.backgroundColor = 'rgba(0, 243, 255, 0.05)';
    topRight.style.boxShadow = 'inset 0 0 15px rgba(0, 243, 255, 0.2)';
    topRight.style.display = 'flex';
    topRight.style.flexDirection = 'column';
    topRight.style.overflow = 'hidden';
    topRight.style.transformOrigin = 'top right';

    /* 内部のグラフバー要素をランダムに生成 */
    let bars = '';
    const barStates = []; // 各バーの状態を管理
    for(let i=0; i<12; i++) {
        let initialWidth = Math.random() * 50 + 30; 
        barStates.push({
            current: initialWidth,
            target: initialWidth,
            timer: Math.random() * 100 // 更新タイミングをずらす
        });
        bars += `<div class="mem-bar" style="height: 2px; margin-bottom: 4px; background: rgba(0, 243, 255, 0.4); box-shadow: 0 0 2px rgba(0, 243, 255, 0.2); max-width: ${initialWidth}%; width: 100%;"></div>`;
    }

    topRight.innerHTML = `
        <div style="padding: 4px 10px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(0, 243, 255, 0.6); border-bottom: 1px solid rgba(0, 243, 255, 0.3); text-shadow: 0 0 2px rgba(0, 243, 255, 0.3); display: flex; justify-content: space-between;">
            <span>SYS_MEM // ALLOC</span>
            <span class="pulse-op"><span id="mem-val">94.2</span>%</span>
        </div>
        <div style="flex: 1; display: flex; padding: 5px 15px; overflow: hidden;">
            <div style="width: 2px; height: 85%; background: rgba(0, 243, 255, 0.4); align-self: center;"></div>
            <div id="mem-bars-container" style="flex: 1; padding: 0 8px; display: flex; flex-direction: column; justify-content: center;">
                ${bars}
            </div>
        </div>
    `;
    bg.appendChild(topRight);

    /* システムモニターを連続アニメーションで更新 */
    function animateSystemMonitor() {
        const barEls = topRight.querySelectorAll('.mem-bar');
        const memVal = topRight.querySelector('#mem-val');
        let totalWidth = 0;

        barEls.forEach((bar, i) => {
            const state = barStates[i];
            
            // 数秒おきにターゲットを更新
            state.timer++;
            if (state.timer > 200 + Math.random() * 100) {
                state.target = Math.random() * 60 + 30;
                state.timer = 0;
            }

            // 目標値への緩やかな移動 + 微細なノイズ(jitter)
            const jitter = (Math.random() - 0.5) * 0.8;
            state.current += (state.target - state.current) * 0.02;
            
            const finalWidth = Math.max(10, Math.min(100, state.current + jitter));
            bar.style.maxWidth = `${finalWidth}%`;
            totalWidth += finalWidth;
        });

        // ％表示もバーの平均値にゆるく連動させる
        if (memVal && Math.random() > 0.9) {
            const avg = totalWidth / 12;
            const displayMem = 85 + (avg / 100) * 15; // 85-100%の範囲にマップ
            memVal.textContent = displayMem.toFixed(1);
        }

        requestAnimationFrame(animateSystemMonitor);
    }
    animateSystemMonitor();

    /* 右下の波形周波数グラフ装飾を生成 */
    const bottomRight = document.createElement('div');
    bottomRight.style.position = 'absolute';
    bottomRight.style.top = '25%';
    bottomRight.style.right = '7%';
    bottomRight.style.width = '300px';
    bottomRight.style.height = '130px';
    bottomRight.style.opacity = '0.7';
    bottomRight.style.zIndex = '21';
    bottomRight.style.border = '1px solid rgba(0, 243, 255, 0.4)';
    bottomRight.style.backgroundColor = 'rgba(0, 243, 255, 0.05)';
    bottomRight.style.backdropFilter = 'none';
    bottomRight.style.boxShadow = 'inset 0 0 15px rgba(0, 243, 255, 0.2)';
    bottomRight.style.display = 'flex';
    bottomRight.style.flexDirection = 'column';
    bottomRight.style.justifyContent = 'flex-end';
    bottomRight.style.overflow = 'hidden';
    bottomRight.style.transformOrigin = 'top right';
    
    /* 連続する波形のパスデータを生成 */
    const waveSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    waveSvg.setAttribute("viewBox", "0 0 300 100");
    waveSvg.setAttribute("preserveAspectRatio", "none");
    waveSvg.style.width = "100%";
    waveSvg.style.height = "100%";
    waveSvg.style.position = "absolute";
    waveSvg.style.left = "0";

    const wavePathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wavePathEl.setAttribute("fill", "none");
    wavePathEl.setAttribute("stroke", "var(--color-primary)");
    wavePathEl.setAttribute("stroke-opacity", "0.35");
    wavePathEl.setAttribute("stroke-width", "2");
    wavePathEl.style.filter = "drop-shadow(0 0 3px rgba(0, 243, 255, 0.4))";
    waveSvg.appendChild(wavePathEl);

    bottomRight.style.overflow = 'visible';
    bottomRight.innerHTML = `
        <div style="padding: 4px 10px; font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(0, 243, 255, 0.6); border-bottom: 1px solid rgba(0, 243, 255, 0.3); text-shadow: 0 0 2px rgba(0, 243, 255, 0.3); background: var(--color-bg-main); position: absolute; top: -26px; left: -1px; width: calc(100% + 2px); height: 32px; border: 1px solid rgba(0, 243, 255, 0.4); border-bottom: 1px solid rgba(0, 243, 255, 0.4); display: flex; align-items: center; box-sizing: border-box; z-index: 2;">
            FREQ_ANALYSIS // <span id="freq-val" style="margin-left: 5px;">---</span> kHz
        </div>
        <div id="wave-container" style="position: relative; width: 100%; height: 100%; padding-top: 6px; box-sizing: border-box; display: flex; align-items: center; overflow: hidden; background: transparent;">
        </div>
    `;
    bottomRight.querySelector('#wave-container').appendChild(waveSvg);
    bg.appendChild(bottomRight);

    /* 連続アニメーション用の変数 */
    let currentFreq = 2;
    let targetFreq = 2;
    let currentAmp = 20;
    let targetAmp = 20;
    let currentPhase = 0;

    /* 波形を連続的に描画する関数 */
    function animateWaveform() {
        const points = 50; 
        const width = 300;
        const step = width / (points - 1);
        
        // 目標値への緩やかな補完 (Lerp)
        currentFreq += (targetFreq - currentFreq) * 0.01;
        currentAmp += (targetAmp - currentAmp) * 0.01;
        
        // 位相を常に進める (動き続ける)
        currentPhase += 0.05;
        
        let d = `M 0 ${50 + Math.sin(currentPhase) * currentAmp} `;
        for (let i = 1; i < points; i++) {
            const x = i * step;
            const y = 50 + Math.sin((i / (points - 1)) * Math.PI * 2 * currentFreq + currentPhase) * currentAmp;
            d += `L ${x} ${y} `;
        }
        wavePathEl.setAttribute('d', d);

        // 数値を現在の周波数と連動させて更新
        const freqVal = bottomRight.querySelector('#freq-val');
        if (freqVal) {
            // currentFreq(1〜5)をスケールアップして表示
            const displayFreq = (currentFreq * 125.4).toFixed(2);
            freqVal.textContent = displayFreq;
        }

        requestAnimationFrame(animateWaveform);
    }

    /* 3つ目のオブジェクト: マルチレイヤー・サイバー・ダイヤル (超大型・画面外はみ出し演出) */
    const dialSize = 500;
    const cyberDial = document.createElement('div');
    cyberDial.id = 'cyber-dial';
    cyberDial.style.position = 'absolute';
    cyberDial.style.bottom = '-80px';
    cyberDial.style.right = '-80px';
    cyberDial.style.width = `${dialSize}px`;
    cyberDial.style.height = `${dialSize}px`;
    cyberDial.style.opacity = '0.35';
    cyberDial.style.zIndex = '18';
    cyberDial.style.pointerEvents = 'none';
    cyberDial.style.transformOrigin = 'center center';

    cyberDial.innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 0 3px var(--color-primary-dim));">
            <!-- 背景ドット層 -->
            <circle cx="50" cy="50" r="49.5" fill="none" stroke="var(--color-primary)" stroke-width="0.3" pathLength="200" stroke-dasharray="0.2, 0.8" stroke-opacity="0.15" style="transform-origin: 50px 50px; animation: rotate-scanner 120s linear infinite;" />
            
            <!-- 外側メイン二重構造 (維持) -->
            <g style="transform-origin: 50px 50px; animation: rotate-scanner 30s linear infinite;">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-primary)" stroke-width="4" pathLength="300" stroke-dasharray="70, 30" stroke-opacity="0.5" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="var(--color-primary)" stroke-width="1" pathLength="300" stroke-dasharray="70, 30" stroke-opacity="0.8" />
            </g>
            
            <!-- モールス信号層 A: 複雑な断続パルス (合計86ユニット、pathLengthで補正) -->
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--color-primary)" stroke-width="1.5" pathLength="86" stroke-dasharray="20, 5, 2, 5, 2, 5, 30, 10, 2, 5" stroke-opacity="0.6" style="transform-origin: 50px 50px; animation: rotate-scanner 25s linear infinite reverse;" />
            
            <!-- モールス信号層 B: 高速ドット通信 (合計22ユニット、5倍の110で補正) -->
            <circle cx="50" cy="50" r="32" fill="none" stroke="var(--color-primary-dim)" stroke-width="1" pathLength="110" stroke-dasharray="1, 4, 1, 4, 8, 4" stroke-opacity="0.5" style="transform-origin: 50px 50px; animation: rotate-scanner 12s linear infinite;" />
            
            <!-- モールス信号層 C: 微細インナーシグナル (合計16ユニット、8倍の128で補正) -->
            <circle cx="50" cy="50" r="26" fill="none" stroke="var(--color-primary)" stroke-width="0.8" pathLength="128" stroke-dasharray="2, 2, 10, 2" stroke-opacity="0.4" style="transform-origin: 50px 50px; animation: rotate-scanner 40s linear infinite;" />
            
            <!-- センター・ソリッド・コア (シンプル) -->
            <circle cx="50" cy="50" r="3.5" fill="var(--color-primary)" style="animation: hex-pulse 4s ease-in-out infinite alternate; transform-origin: 50px 50px;" />
        </svg>
    `;
    bg.appendChild(cyberDial);

    animateWaveform();

    // ダイヤル回転・パルス用のアニメーションを追加
    if (!document.getElementById('dial-style')) {
        const style = document.createElement('style');
        style.id = 'dial-style';
        style.textContent = `
            @keyframes rotate-scanner {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes hex-pulse {
                0% { transform: scale(0.9); opacity: 0.3; }
                100% { transform: scale(1.1); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    animateWaveform();

    /* 10秒ごとに次の目標値を設定 */
    function pickNewTargets() {
        targetFreq = Math.random() * 4 + 1;
        
        // 30%の確率で振幅を非常に小さく（直線に近く）する
        if (Math.random() < 0.3) {
            targetAmp = Math.random() * 4 + 1; // 1〜5の小さな振幅
        } else {
            targetAmp = Math.random() * 30 + 15; // 15〜45の通常の振幅
        }
    }

    setInterval(pickNewTargets, 10000);
    animateWaveform();

    /* ウィンドウサイズに応じた動的スケール調整処理 */
    function updateHUDScale() {
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        // 基準解像度(1920x1080)に対する現在のウィンドウサイズの比率（単位なし数値）
        const scale = Math.min(ww / 1920, wh / 1080);
        
        // 四隅のオブジェクト用に追加の拡大倍率を定義（ここでサイズを調整：1.6倍）
        const cornerScale = scale * 1.6;
        
        giantRing.style.transform = `translate(-50%, -50%) scale(${scale})`;
        topLeft.style.transform = `scale(${cornerScale})`;
        bottomLeft.style.transform = `scale(${cornerScale})`;
        topRight.style.transform = `scale(${cornerScale})`;
        bottomRight.style.transform = `scale(${cornerScale})`;
        if(typeof netStream !== 'undefined' && netStream) netStream.style.transform = `scale(${cornerScale})`;
    }

    // 初回実行とリサイズイベントの登録
    updateHUDScale();
    window.addEventListener('resize', updateHUDScale);
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
        overlay.className = 'sf-transition-overlay';
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
        sfWindow.className = 'sf-transition-window';
        sfWindow.style.cssText = `
            position: relative;
            width: 0px; height: 2px;
            background-color: var(--color-primary);
            box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
            overflow: hidden; /* アニメーション中の内容溢れを防止 */
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
            " class="sf-window-inner">
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
                " class="sf-window-body">
                    <div style="font-size:1.5rem; margin-bottom:14px; letter-spacing:0.06em; animation:sf-glitch-text 3s infinite; text-align:center; text-shadow:0 0 10px rgba(0, 243, 255, 0.5);" class="sf-glitch-title">
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

        /* ウィンドウのアニメーションを開始（レスポンシブ対応） */
        requestAnimationFrame(() => {
            const isMobile = window.innerWidth <= 768;
            sfWindow.style.width = isMobile ? '90vw' : 'min(70vw, 700px)';
            sfWindow.style.height = isMobile ? '40vh' : '55vh';
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



