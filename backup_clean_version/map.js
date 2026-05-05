// map.js
document.addEventListener('DOMContentLoaded', () => {
    const mapArea = document.getElementById('map-area');
    const infoPlaceholder = document.getElementById('info-placeholder');
    const infoContent = document.getElementById('info-content');
    const episodeTitle = document.getElementById('episode-pref-name');
    const episodeText = document.getElementById('episode-text');

    // Dummy data for visited prefectures
    const visitedData = {
        'hokkaido': {
            visited: true,
            name: '北海道',
            episode: '研究室の全体合宿で訪問。広大な自然と美味しい海鮮を堪能しました。次回の学会も札幌で開催されることを期待しています。'
        },
        'kyoto': {
            visited: true,
            name: '京都府',
            episode: '国際学会での発表のため滞在。空き時間に歴史的な寺社仏閣を巡り、研究のインスピレーションを得ることができました。'
        },
        'wakayama': {
            visited: true,
            name: '和歌山県',
            episode: 'サークル旅行で南紀白浜へ。アドベンチャーワールドでのリフレッシュが、その後の論文執筆の活力になりました。'
        }
    };

    // Japan Prefecture Grid Coordinates (Stylized Tile Map)
    // x: 0-14, y: 0-14 roughly
    const prefCoordinates = [
        { id: 'hokkaido', name: '北海道', x: 12, y: 0 },
        { id: 'aomori', name: '青森', x: 12, y: 2 },
        { id: 'akita', name: '秋田', x: 11, y: 3 },
        { id: 'iwate', name: '岩手', x: 12, y: 3 },
        { id: 'yamagata', name: '山形', x: 11, y: 4 },
        { id: 'miyagi', name: '宮城', x: 12, y: 4 },
        { id: 'niigata', name: '新潟', x: 10, y: 5 },
        { id: 'fukushima', name: '福島', x: 11, y: 5 },
        { id: 'tochigi', name: '栃木', x: 12, y: 5 },
        { id: 'toyama', name: '富山', x: 9, y: 5 },
        { id: 'gunma', name: '群馬', x: 11, y: 6 },
        { id: 'saitama', name: '埼玉', x: 12, y: 6 },
        { id: 'ibaraki', name: '茨城', x: 13, y: 6 },
        { id: 'ishikawa', name: '石川', x: 8, y: 5 },
        { id: 'nagano', name: '長野', x: 10, y: 6 },
        { id: 'yamanashi', name: '山梨', x: 11, y: 7 },
        { id: 'tokyo', name: '東京', x: 12, y: 7 },
        { id: 'chiba', name: '千葉', x: 13, y: 7 },
        { id: 'fukui', name: '福井', x: 8, y: 6 },
        { id: 'gifu', name: '岐阜', x: 9, y: 6 },
        { id: 'aichi', name: '愛知', x: 10, y: 7 },
        { id: 'shizuoka', name: '静岡', x: 11, y: 8 },
        { id: 'kanagawa', name: '神奈川', x: 12, y: 8 },
        { id: 'kyoto', name: '京都', x: 7, y: 6 },
        { id: 'shiga', name: '滋賀', x: 8, y: 7 },
        { id: 'mie', name: '三重', x: 9, y: 8 },
        { id: 'hyogo', name: '兵庫', x: 6, y: 6 },
        { id: 'osaka', name: '大阪', x: 7, y: 7 },
        { id: 'nara', name: '奈良', x: 8, y: 8 },
        { id: 'wakayama', name: '和歌山', x: 7, y: 8 },
        { id: 'tottori', name: '鳥取', x: 5, y: 6 },
        { id: 'okayama', name: '岡山', x: 5, y: 7 },
        { id: 'shimane', name: '島根', x: 4, y: 6 },
        { id: 'hiroshima', name: '広島', x: 4, y: 7 },
        { id: 'yamaguchi', name: '山口', x: 3, y: 7 },
        { id: 'kagawa', name: '香川', x: 5, y: 9 },
        { id: 'tokushima', name: '徳島', x: 6, y: 9 },
        { id: 'ehime', name: '愛媛', x: 4, y: 9 },
        { id: 'kochi', name: '高知', x: 5, y: 10 },
        { id: 'fukuoka', name: '福岡', x: 2, y: 7 },
        { id: 'oita', name: '大分', x: 2, y: 8 },
        { id: 'saga', name: '佐賀', x: 1, y: 7 },
        { id: 'kumamoto', name: '熊本', x: 1, y: 8 },
        { id: 'miyazaki', name: '宮崎', x: 2, y: 9 },
        { id: 'nagasaki', name: '長崎', x: 0, y: 7 },
        { id: 'kagoshima', name: '鹿児島', x: 1, y: 9 },
        { id: 'okinawa', name: '沖縄', x: 0, y: 12 }
    ];

    const blockSize = 40;
    const gap = 4;
    const svgWidth = 14 * (blockSize + gap) + gap;
    const svgHeight = 13 * (blockSize + gap) + gap;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.style.width = "100%";
    svg.style.height = "auto";

    let activeRect = null;

    prefCoordinates.forEach(pref => {
        const isVisited = visitedData[pref.id] ? true : false;
        
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        const xPos = pref.x * (blockSize + gap) + gap;
        const yPos = pref.y * (blockSize + gap) + gap;

        rect.setAttribute("x", xPos);
        rect.setAttribute("y", yPos);
        rect.setAttribute("width", blockSize);
        rect.setAttribute("height", blockSize);
        rect.setAttribute("rx", 4); // rounded corners
        rect.classList.add("pref-path");
        
        if (isVisited) {
            rect.classList.add("visited");
        }

        // Add text label
        text.setAttribute("x", xPos + blockSize / 2);
        text.setAttribute("y", yPos + blockSize / 2 + 4); // roughly vertical center
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "10px");
        text.setAttribute("fill", "var(--color-text-muted)");
        text.style.pointerEvents = "none"; // Text shouldn't block clicks
        
        // Use single char or short name for small blocks
        text.textContent = pref.name.charAt(0);

        g.appendChild(rect);
        g.appendChild(text);

        if (isVisited) {
            g.addEventListener('click', () => {
                // Remove active class from previous
                if (activeRect) {
                    activeRect.classList.remove('active');
                }
                
                // Add active to current
                rect.classList.add('active');
                activeRect = rect;

                // Show info
                infoPlaceholder.style.display = 'none';
                infoContent.style.display = 'block';
                
                episodeTitle.textContent = visitedData[pref.id].name;
                episodeText.textContent = visitedData[pref.id].episode;
            });
        }

        svg.appendChild(g);
    });

    mapArea.appendChild(svg);
});
