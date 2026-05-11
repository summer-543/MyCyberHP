// travel.js
document.addEventListener('DOMContentLoaded', () => {
    const travelList = document.getElementById('travel-list');

    // 旅行データ：香川の島々と名所（直島、男木島、女木島の順）
    const travelData = [
        {
            id: 'naoshima',
            title: '直島 - アートが息づく島',
            date: '2024.09',
            images: [
                'images/travel/naoshima_miyaura_port.jpg',
                'images/travel/naoshima_art_01.jpg',
                'images/travel/naoshima_benzaiten.jpg'
            ],
            episode: '島全体にアートが溶け込む、不思議な魅力を持つ島。自転車で島をあちこち巡る中、特に早朝の澄んだ空気の中で眺める穏やかな海は格別な美しさでした。旅先で出会った人たちと一緒に回ったり、時には一人でのんびりしたりと、一期一会の出会いも楽しめる豊かな時間でした。',
            tags: ['アート', 'レンタサイクル', '一期一会']
        },
        {
            id: 'ogijima',
            title: '男木島 - 猫と坂道の島',
            date: '2024.09',
            images: [
                'images/travel/ogijima_cat.jpg',
                'images/travel/ogijima.jpg',
                'images/travel/ogijima_lighthouse.jpg',
                'images/travel/ogijima_toyotamahime_shrine.jpg'
            ],
            episode: 'フェリーを降りると猫たちが迎えてくれるのどかな島。今回は島に宿泊し、夜には静寂に包まれた灯台を訪れたり、地元の花火大会に参加したりと、島の生活を肌で感じる特別な時間を過ごしました。迷路のような坂道の先に広がる海を眺めていると、どこか懐かしく、安心感に包まれるような温かい場所でした。',
            tags: ['島旅', '猫', '灯台', '花火大会']
        },
        {
            id: 'megijima',
            title: '女木島 - 鬼ヶ島の伝説',
            date: '2024.09',
            images: [
                'images/travel/megijima_cave_entrance.jpg',
                'images/travel/megijima_cave.jpg'
            ],
            episode: '別名「鬼ヶ島」。夏の暑い中、山を登りきった先に待っていた洞窟のひんやりとした空気は、忘れられない心地よさでした。展望台からは高松の街並みだけでなく、瀬戸内海に浮かぶ美しい島々を一望でき、伝説と自然が混ざり合う不思議な魅力を感じました。',
            tags: ['伝説', '洞窟', '展望台']
        }
    ];

    // エピソードカードの生成
    function createTravelCard(data, index) {
        const card = document.createElement('div');
        card.className = 'travel-card animate-on-scroll';
        card.style.animationDelay = `${index * 0.1}s`;

        const isEven = index % 2 === 0;
        card.classList.add(isEven ? 'layout-left' : 'layout-right');

        // スライダー構造の生成
        const hasMultipleImages = data.images.length > 1;

        card.innerHTML = `
            <div class="travel-slider-container" data-current="0" data-total="${data.images.length}">
                <div class="travel-slider-main">
                    <img src="${data.images[0]}" alt="${data.title}" class="active-slide" onclick="window.expandImage(this)">
                    <div class="image-overlay"></div>
                </div>
                ${hasMultipleImages ? `
                    <div class="slider-controls-bottom">
                        <button class="slider-btn prev" onclick="window.changeSlide(this, -1)">
                            <svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
                        </button>
                        <div class="slider-dots">
                            ${data.images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" onclick="window.setSlide(this, ${i})"></span>`).join('')}
                        </div>
                        <button class="slider-btn next" onclick="window.changeSlide(this, 1)">
                            <svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="travel-card-content">
                <div class="travel-card-header">
                    <span class="travel-date">${data.date}</span>
                    <h3 class="travel-title">${data.title}</h3>
                </div>
                <p class="travel-episode">${data.episode}</p>
                <div class="travel-tags">
                    ${data.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // データの保持
        card.querySelector('.travel-slider-container')._images = data.images;

        return card;
    }

    // スライド切り替えロジック
    window.changeSlide = (btn, dir) => {
        const container = btn.closest('.travel-slider-container');
        let current = parseInt(container.getAttribute('data-current'));
        const total = parseInt(container.getAttribute('data-total'));
        const images = container._images;

        current = (current + dir + total) % total;
        updateSliderUI(container, current, images);
    };

    window.setSlide = (dot, idx) => {
        const container = dot.closest('.travel-slider-container');
        const images = container._images;
        updateSliderUI(container, idx, images);
    };

    function updateSliderUI(container, idx, images) {
        container.setAttribute('data-current', idx);

        const img = container.querySelector('.active-slide');
        img.style.opacity = '0';

        setTimeout(() => {
            img.src = images[idx];
            img.style.opacity = '1';
        }, 200);

        const dots = container.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }

    // 画像拡大表示用の機能
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-modal');

    window.expandImage = (img) => {
        modal.style.display = 'block';
        modalImg.src = img.src;
        captionText.innerHTML = img.alt;
        document.body.style.overflow = 'hidden';
    };

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // リストの描画
    travelData.forEach((data, index) => {
        const card = createTravelCard(data, index);
        travelList.appendChild(card);
    });

    if (window.observeElements) {
        window.observeElements();
    }
});
