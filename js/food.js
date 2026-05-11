/* FOODページ専用のスクリプト: 地図モーダルの動的制御 */
document.addEventListener('DOMContentLoaded', () => {
    const mapModal = document.getElementById('mapModal');
    const closeMapBtn = document.getElementById('closeMapBtn');
    const mapIframe = document.getElementById('mapIframe');
    const mapTargetName = document.getElementById('mapTargetName');
    const mapLat = document.getElementById('mapLat');
    const mapLng = document.getElementById('mapLng');
    const mapFooterAddress = document.getElementById('mapFooterAddress');
    const mapFooterTicker = document.getElementById('mapFooterTicker');

    const openMapBtns = document.querySelectorAll('.open-map-btn');

    if (mapModal && openMapBtns.length > 0 && closeMapBtn) {
        openMapBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                const query = btn.getAttribute('data-query');
                const lat = btn.getAttribute('data-lat');
                const lng = btn.getAttribute('data-lng');
                const embedUrl = btn.getAttribute('data-embed-url');

                // モーダル内の情報を更新
                if (mapTargetName) {
                    // 店名と支店名の間にスペースがある場合、改行を入れる
                    const parts = target.split(' ');
                    mapTargetName.innerHTML = parts.join('<br>');
                }
                
                if (mapLat) mapLat.textContent = `${lat}°N`;
                if (mapLng) mapLng.textContent = `${lng}°E`;
                if (mapFooterAddress) mapFooterAddress.textContent = `LOCATING::${target.replace(/ /g, '_')}`;

                // iframeのURLを更新
                let mapUrl = '';
                if (embedUrl) {
                    // 個別の埋め込みURLが指定されている場合
                    mapUrl = embedUrl;
                } else {
                    // クエリから生成する場合
                    mapUrl = `https://www.google.com/maps?output=embed&q=${query}&z=15`;
                }
                
                if (mapIframe) mapIframe.src = mapUrl;

                // ティッカー演出
                if (mapFooterTicker) {
                    mapFooterTicker.textContent = 'ESTABLISHING_STATION_LINK...';
                    setTimeout(() => {
                        mapFooterTicker.textContent = 'GEOSPATIAL_DATA_SYNC_COMPLETE';
                    }, 1500);
                }

                // モーダルを表示
                mapModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // 背景スクロール禁止
            });
        });

        /* 閉じるボタンでモーダル非表示 */
        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.remove('show');
            document.body.style.overflow = ''; // スクロール再開
            if (mapIframe) mapIframe.src = ''; // リソース解放
        });

        /* モーダル外をクリックで閉じる */
        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                mapModal.classList.remove('show');
                document.body.style.overflow = '';
                if (mapIframe) mapIframe.src = '';
            }
        });
    }
});
