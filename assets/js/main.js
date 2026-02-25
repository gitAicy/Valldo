document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. THEME ─────────────────────────────────────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
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
        const isDark = document.body.classList.contains('dark');
        themeToggleBtn.innerHTML = isDark
            ? '<span aria-hidden="true">☀️</span> Светлая тема'
            : '<span aria-hidden="true">🌙</span> Темная тема';
    }

    // ─── 2. MOBILE MENU ───────────────────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Create backdrop overlay
    let overlay = document.getElementById('menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    // Inject × close button inside nav
    if (navMenu && !document.getElementById('menu-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'menu-close';
        closeBtn.setAttribute('aria-label', 'Закрыть меню');
        closeBtn.innerHTML = '&times;';
        navMenu.insertBefore(closeBtn, navMenu.firstChild);
        closeBtn.addEventListener('click', closeMenu);
    }

    function openMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('hidden');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!navMenu) return;
        navMenu.classList.add('hidden');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.contains('hidden') ? openMenu() : closeMenu();
        });
        overlay.addEventListener('click', closeMenu);
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ─── 3. ACTIVE NAV LINK ─────────────────────────────────────────────
    (function setActiveNavLink() {
        const current = location.pathname.split('/').pop() || 'index.html';
        const map = {
            'index.html': '#home',
            '': '#home',
            'caesar.html': 'caesar.html',
            'carbonara.html': 'carbonara.html',
            'tikka.html': 'tikka.html',
            'margherita.html': 'margherita.html',
            'lava-cake.html': 'lava-cake.html',
            'recipe-of-the-month.html': 'recipe-of-the-month.html',
            'favorites.html': 'favorites.html',
        };
        const target = map[current];
        if (!target) return;

        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === target || href.endsWith(target)) {
                link.classList.add('nav-link-active');
            }
        });
    })();

    // ─── 4. SHARE RECIPE ────────────────────────────────────────────────────
    window.shareRecipe = async function (title, text) {
        const url = location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (_) { }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                showToast('Ссылка скопирована в буфер 📋', 'info');
            } catch (_) {
                showToast('Скопируйте ссылку из адресной строки', 'info');
            }
        }
    };

    // ─── 5. SMOOTH SCROLL ──────────────────────────────────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── 4. SCROLL TO TOP ─────────────────────────────────────────────────────
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── 5. RECIPE FILTER ─────────────────────────────────────────────────────
    window.filterRecipes = function (category) {
        const cards = document.querySelectorAll('.recipe-card');
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('bg-orange-700');
                btn.classList.remove('bg-orange-500');
            } else {
                btn.classList.add('bg-orange-500');
                btn.classList.remove('bg-orange-700');
            }
        });
        cards.forEach(card => {
            card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
        });
    };

    // ─── 6. TOAST SYSTEM ──────────────────────────────────────────────────────
    // Inject container once
    if (!document.getElementById('toast-container')) {
        const el = document.createElement('div');
        el.id = 'toast-container';
        document.body.appendChild(el);
    }

    window.showToast = function (message, type = 'success') {
        const container = document.getElementById('toast-container');
        const icons = { success: '❤️', info: 'ℹ️', remove: '💔' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        }, 2800);
    };

    // ─── 7. FAVORITES COUNTER in NAV ──────────────────────────────────────────
    function updateFavBadge() {
        const count = (JSON.parse(localStorage.getItem('favorites')) || []).length;
        document.querySelectorAll('.nav-fav-link').forEach(link => {
            let badge = link.querySelector('.nav-fav-badge');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-fav-badge';
                    link.appendChild(badge);
                }
                badge.textContent = count;
            } else if (badge) {
                badge.remove();
            }
        });
    }
    updateFavBadge(); // on page load

    // ─── 8. FAVORITES LOGIC ───────────────────────────────────────────────────
    window.addToFavorites = function (recipeId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const btn = document.getElementById('fav-btn-' + recipeId);

        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (btn) btn.textContent = '💔 Удалить из избранного';
            showToast('Рецепт добавлен в избранное!', 'success');
        } else {
            favorites = favorites.filter(id => id !== recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            if (btn) btn.textContent = '❤️ Добавить в избранное';
            showToast('Рецепт удалён из избранного', 'remove');
        }
        updateFavBadge();
    };

    // Set initial text for fav buttons
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('[id^="fav-btn-"]').forEach(btn => {
        const recipeId = btn.id.replace('fav-btn-', '');
        btn.textContent = favorites.includes(recipeId)
            ? '💔 Удалить из избранного'
            : '❤️ Добавить в избранное';
    });

    // ─── 9. FAVORITES PAGE ────────────────────────────────────────────────────
    if (document.getElementById('favorites-container')) {
        renderFavorites();
    }
});

// ─── RECIPES DATA ─────────────────────────────────────────────────────────────
const recipesData = {
    'caesar': {
        title: 'Салат Цезарь',
        url: 'caesar.html',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        time: '15 минут', difficulty: 'Легко',
        desc: 'Классический салат с ромейном, крутонами и сливочной заправкой.'
    },
    'carbonara': {
        title: 'Спагетти Карбонара',
        url: 'carbonara.html',
        image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804',
        time: '30 минут', difficulty: 'Средне',
        desc: 'Нежная паста с яйцами, сыром и панчеттой.'
    },
    'tikka': {
        title: 'Курица Тикка Масала',
        url: 'tikka.html',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
        time: '45 минут', difficulty: 'Средне',
        desc: 'Пряное и сливочное индийское карри с курицей.'
    },
    'margherita': {
        title: 'Пицца Маргарита',
        url: 'margherita.html',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        time: '25 минут', difficulty: 'Легко',
        desc: 'Простая пицца с помидорами, моцареллой и базиликом.'
    },
    'lava-cake': {
        title: 'Шоколадный лавовый пирог',
        url: 'lava-cake.html',
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3',
        time: '20 минут', difficulty: 'Средне',
        desc: 'Тёплый пирог с жидким шоколадным центром.'
    },
    'pumpkin-soup': {
        title: 'Тыквенный суп',
        url: 'recipe-of-the-month.html',
        image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
        time: '40 минут', difficulty: 'Средне',
        desc: 'Идеальное блюдо для осени с нежным вкусом тыквы.'
    }
};

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    const emptyState = document.getElementById('empty-state');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        container.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';

    favorites.forEach(id => {
        const item = recipesData[id];
        if (!item) return;

        const card = document.createElement('div');
        card.className = 'recipe-card bg-white rounded-xl shadow-md fade-in';
        card.innerHTML = `
            <div class="relative">
                <img src="${item.image}" alt="${item.title}" class="recipe-image rounded-t-xl" loading="lazy">
                <div class="recipe-overlay">
                    <h3 class="text-white text-2xl font-bold">${item.title}</h3>
                </div>
            </div>
            <div class="p-6">
                <p class="recipe-card-title">${item.title}</p>
                <p class="text-stone-600 mt-1 text-sm">${item.desc}</p>
                <p class="text-stone-600 mt-2">⏱ Время: ${item.time}</p>
                <p class="text-stone-600 mt-1">📊 Сложность: ${item.difficulty}</p>
                <div class="mt-4 flex flex-col items-start gap-2">
                    <a href="${item.url}" class="inline-block bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition transform hover:scale-105">Посмотреть рецепт</a>
                    <button onclick="window.addToFavorites('${id}'); setTimeout(renderFavorites, 150);"
                        class="text-sm font-semibold text-red-500 hover:text-red-700 underline mt-1">💔 Удалить из избранного</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
