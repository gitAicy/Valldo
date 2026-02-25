document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Configuration
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark'); // for tailwind
        localStorage.setItem('theme', 'dark');
    }

    if (themeToggleBtn) {
        updateThemeToggleText();

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            document.documentElement.classList.toggle('dark');
            
            const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateThemeToggleText();
        });
    }

    function updateThemeToggleText() {
        if (!themeToggleBtn) return;
        themeToggleBtn.textContent = document.body.classList.contains('dark') ? 'Светлая тема' : 'Темная тема';
    }

    // 2. Mobile Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });
    }

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll to top logic
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // 5. Setup Recipe Filters
    window.filterRecipes = function(category) {
        const cards = document.querySelectorAll('.recipe-card');
        const btns = document.querySelectorAll('.filter-btn');

        // Update button active state
        btns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('bg-orange-700');
                btn.classList.remove('bg-orange-500');
            } else {
                btn.classList.add('bg-orange-500');
                btn.classList.remove('bg-orange-700');
            }
        });

        // Filter cards
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // 6. Favorites logic
    window.addToFavorites = function(recipeId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const btn = document.getElementById('fav-btn-' + recipeId);

        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (btn) btn.textContent = 'Удалить из избранного';
            alert('Рецепт добавлен в избранное!');
        } else {
            favorites = favorites.filter(id => id !== recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (btn) btn.textContent = 'Добавить в избранное';
            alert('Рецепт удален из избранного!');
        }
    };

    // Set initial text for favorites button
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('[id^="fav-btn-"]').forEach(btn => {
        const recipeId = btn.id.replace('fav-btn-', '');
        if (favorites.includes(recipeId)) {
            btn.textContent = 'Удалить из избранного';
        } else {
            btn.textContent = 'Добавить в избранное';
        }
    });

    if (document.getElementById('favorites-container')) {
        renderFavorites();
    }
});

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const noMsg = document.getElementById('no-favorites-msg');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const recipesData = {
        'caesar': {
            title: 'Салат Цезарь',
            url: 'caesar.html',
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
            time: '15 минут',
            difficulty: 'Легко',
            desc: 'Классический салат с ромейном, крутонами и сливочной заправкой.'
        },
        'carbonara': {
            title: 'Спагетти Карбонара',
            url: 'carbonara.html',
            image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804',
            time: '30 минут',
            difficulty: 'Средне',
            desc: 'Нежная паста с яйцами, сыром и панчеттой.'
        },
        'tikka': {
            title: 'Курица Тикка Масала',
            url: 'tikka.html',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
            time: '45 минут',
            difficulty: 'Средне',
            desc: 'Пряное и сливочное индийское карри с курицей.'
        },
        'margherita': {
            title: 'Пицца Маргарита',
            url: 'margherita.html',
            image: 'https://chudobludo.com/delicious-italian-pizza-wooden-table.jpg',
            time: '25 минут',
            difficulty: 'Легко',
            desc: 'Простая пицца с помидорами, моцареллой и базиликом.'
        },
        'lava-cake': {
            title: 'Шоколадный лавовый пирог',
            url: 'lava-cake.html',
            image: 'https://cs10.pikabu.ru/post_img/big/2019/02/06/8/1549457465167186599.jpg',
            time: '20 минут',
            difficulty: 'Средне',
            desc: 'Теплый пирог с жидким шоколадным центром.'
        },
        'pumpkin-soup': {
            title: 'Тыквенный суп',
            url: 'recipe-of-the-month.html',
            image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
            time: '40 минут',
            difficulty: 'Средне',
            desc: 'Идеальное блюдо для осени с нежным вкусом тыквы.'
        }
    };

    if (favorites.length === 0) {
        noMsg.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    noMsg.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';

    favorites.forEach(id => {
        const item = recipesData[id];
        if (!item) return;

        const card = document.createElement('div');
        card.className = 'recipe-card bg-white rounded-xl shadow-md fade-in';
        card.innerHTML = `
            <div class="relative">
                <img src="${item.image}" alt="${item.title}" class="recipe-image rounded-t-xl">
                <div class="recipe-overlay">
                    <h3 class="text-white text-2xl font-bold">${item.title}</h3>
                </div>
            </div>
            <div class="p-6">
                <h4 class="text-xl font-bold text-stone-800 dark:text-stone-300 mt-2">${item.title}</h4>
                <p class="text-stone-600 mt-2">${item.desc}</p>
                <p class="text-stone-600 mt-2">Время: ${item.time}</p>
                <p class="text-stone-600 mt-1">Сложность: ${item.difficulty}</p>
                <div class="mt-4 flex flex-col items-start gap-2">
                    <a href="${item.url}" class="inline-block bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition transform hover:scale-105">Посмотреть рецепт</a>
                    <button onclick="window.addToFavorites('${id}'); setTimeout(renderFavorites, 100);" class="text-sm font-semibold text-red-500 hover:text-red-700 underline mt-2">Удалить из избранного</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
