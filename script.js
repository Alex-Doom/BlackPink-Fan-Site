// ===== ОСНОВНОЙ СКРИПТ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ =====

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ =====
    const doorScreen = document.getElementById('doorScreen');
    const doorContainer = document.getElementById('doorContainer');
    const doorHandle = document.getElementById('doorHandle');
    const mainContent = document.getElementById('mainContent');
    const siteHeader = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    let isDoorOpened = false;
    let isMenuOpen = false;
    
    // ===== ФУНКЦИЯ ОТКРЫТИЯ ДВЕРИ =====
    function openDoor() {
        if (isDoorOpened) return;
        
        isDoorOpened = true;
        
        // 1. Добавляем класс для анимации открытия
        doorContainer.classList.add('open');
        
        // 2. Убираем класс активности с body
        document.body.classList.remove('door-active');
        
        // 3. Через время скрываем экран двери
        setTimeout(() => {
            doorScreen.classList.remove('active');
            doorScreen.classList.add('hidden');
            
            // 4. Показываем основной контент
            mainContent.classList.add('visible');
            
            // 5. Восстанавливаем скролл
            document.body.style.overflow = 'auto';
            
            // 6. Инициализируем другие функции после открытия
            initAfterDoorOpen();
            
        }, 1500); // Время должно совпадать с CSS transition
    }
    
    // ===== ФУНКЦИИ ПОСЛЕ ОТКРЫТИЯ ДВЕРИ =====
    function initAfterDoorOpen() {
        // Инициализация скролла хедера
        initHeaderScroll();
        
        // Инициализация мобильного меню
        initMobileMenu();
        
        // Инициализация выпадающих меню на мобильных
        initMobileDropdowns();
        
        // Анимация силуэтов участниц (только если есть на странице)
        initSilhouetteAnimation();
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ СКРОЛЛА ХЕДЕРА =====
    function initHeaderScroll() {
        if (!siteHeader) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ МОБИЛЬНОГО МЕНЮ =====
    function initMobileMenu() {
        if (!menuToggle || !mainNav) return;
        
        menuToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Блокируем скролл при открытом меню
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
                
                // Закрываем все выпадающие меню
                closeAllDropdowns();
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    if (menuToggle) menuToggle.classList.remove('active');
                    if (mainNav) mainNav.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    isMenuOpen = false;
                    
                    // Закрываем все выпадающие меню
                    closeAllDropdowns();
                }
            });
        });
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ ВЫПАДАЮЩИХ МЕНЮ НА МОБИЛЬНЫХ =====
    function initMobileDropdowns() {
        if (window.innerWidth <= 768) {
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('a');
                
                if (toggle) {
                    toggle.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Закрываем другие открытые dropdown
                            dropdowns.forEach(other => {
                                if (other !== dropdown) {
                                    other.classList.remove('active');
                                }
                            });
                            
                            // Открываем/закрываем текущий
                            dropdown.classList.toggle('active');
                        }
                    });
                }
            });
            
            // Закрытие dropdown при клике вне его
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        }
    }
    
    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    // ===== АНИМАЦИЯ СИЛУЭТОВ УЧАСТНИЦ =====
    function initSilhouetteAnimation() {
    const silhouetteMembers = document.querySelectorAll('.silhouette-member');
    if (!silhouetteMembers.length) return;

    const members = [
        { name: 'jisoo',   color: '#ff4d6d', displayName: 'JISOO',  imageSrc: 'assets/img/jisoo-portrait.webp' },
        { name: 'jennie', color: '#ff0066', displayName: 'JENNIE', imageSrc: 'assets/img/jennie-portrait.jpg' },
        { name: 'rose',   color: '#ff66b2', displayName: 'ROSÉ',   imageSrc: 'assets/img/rose-portrait.jpg' },
        { name: 'lisa',   color: '#ffcc00', displayName: 'LISA',   imageSrc: 'assets/img/lisa-portrait.jpg' }
    ];

    let order = [0, 1, 2, 3];
    let activeIndex = 0;
    let isAnimating = false;
    let isPaused = false;
    let timer = null;

    /* =========================
       ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    ========================== */

    function hideMember(el) {
        el.querySelector('.member-image').style.opacity = '0';
        el.querySelector('.member-image').style.transform = 'scale(1.1)';
        el.querySelector('.member-name').style.opacity = '0';
        el.style.filter = 'none';
        el.style.transform = 'translateY(0) scale(1)';
        el.style.zIndex = '1';
    }

    function showMember(index) {
        const el = silhouetteMembers[index];
        const data = members[order[index]];

        hideAll();

        const img = el.querySelector('.member-image');
        const name = el.querySelector('.member-name');

        img.src = data.imageSrc;
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';

        name.textContent = data.displayName;
        name.style.color = data.color;
        name.style.opacity = '1';

        el.style.filter = `drop-shadow(0 10px 20px ${data.color})`;
        el.style.transform = 'translateY(-15px) scale(1.05)';
        el.style.zIndex = '2';
    }

    function hideAll() {
        silhouetteMembers.forEach(hideMember);
    }

    /* =========================
       РОТАЦИЯ ОВАЛОВ
    ========================== */

    function rotateOvals() {
        if (isAnimating) return;
        isAnimating = true;

        hideAll();

        const newOrder = [...order];
        const last = newOrder.pop();
        newOrder.unshift(last);

        setTimeout(() => {
            order = newOrder;
            isAnimating = false;
        }, 500); // совпадает с CSS transition
    }

    /* =========================
       ОСНОВНОЙ ЦИКЛ
    ========================== */

    function loop() {
        if (isPaused || isAnimating) {
            timer = setTimeout(loop, 300);
            return;
        }

        showMember(activeIndex);

        timer = setTimeout(() => {
            activeIndex++;

            if (activeIndex >= silhouetteMembers.length) {
                activeIndex = 0;
                rotateOvals();
            }
        }, 1500);

        timer = setTimeout(loop, 1600);
    }

    /* =========================
       HOVER / CLICK
    ========================== */

    silhouetteMembers.forEach((el, index) => {
        el.addEventListener('mouseenter', () => {
            isPaused = true;
            clearTimeout(timer);
            showMember(index);
        });

        el.addEventListener('mouseleave', () => {
            isPaused = false;
            clearTimeout(timer);
            timer = setTimeout(loop, 800);
        });

        el.addEventListener('click', () => {
            window.location.href = `${members[order[index]].name}.html`;
        });
    });

    /* =========================
       ИНИЦИАЛИЗАЦИЯ
    ========================== */

    hideAll();
    setTimeout(loop, 1000);
}




    
    // ===== ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ДВЕРИ =====
    
    // Клик по ручке
    if (doorHandle) {
        doorHandle.addEventListener('click', openDoor);
    }
    
    // Нажатие клавиши пробел или Enter
    document.addEventListener('keydown', function(e) {
        if ((e.code === 'Space' || e.code === 'Enter') && !isDoorOpened) {
            e.preventDefault();
            openDoor();
        }
    });
    
    // ===== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== АДАПТИВНОСТЬ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ОКНА =====
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            if (menuToggle) menuToggle.classList.remove('active');
            if (mainNav) mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
            closeAllDropdowns();
        }
        
        // Переинициализация dropdown для мобильных
        initMobileDropdowns();
    });
    
    // ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
    
    // Блокируем скролл пока дверь не открыта (только если есть дверь)
    if (doorScreen) {
        document.body.classList.add('door-active');
        document.body.style.overflow = 'hidden';
        
        // Предзагрузка анимаций
        setTimeout(() => {
            if (doorHandle) {
                doorHandle.style.animationPlayState = 'running';
            }
        }, 500);
    } else {
        // Если двери нет, сразу показываем контент
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        initAfterDoorOpen();
    }
    
    // Инициализация для страниц без двери (если пользователь зашел сразу на внутреннюю страницу)
    if (!doorScreen) {
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        initAfterDoorOpen();
    }
    
    // ===== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ =====
    
    // Эффект параллакса для герой-секции (только если есть элементы)
    if (document.querySelector('.hero-section')) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            const heroVisual = document.querySelector('.group-silhouette');
            
            if (heroSection && heroVisual) {
                const rate = scrolled * -0.5;
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками статистики и участниц
    document.querySelectorAll('.stat-card, .member-card').forEach(card => {
        if (card) {
            observer.observe(card);
        }
    });
});

// ===== ФУНКЦИИ ДЛЯ ДРУГИХ СТРАНИЦ =====

// Если на странице есть игра "Выбор лучшей"
if (document.querySelector('.game-container')) {
    initGame();
}

function initGame() {
    console.log('Игра инициализирована');
    // Здесь будет код для страницы vote.html
}

// Если на странице есть галерея
if (document.querySelector('.gallery')) {
    initGallery();
}

function initGallery() {
    console.log('Галерея инициализирована');
    // Здесь будет код для галереи на страницах участниц
}

// Универсальная функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Обработчик закрытия
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ СТРАНИЦ УЧАСТНИЦ =====

// Lightbox функция (используется на страницах участниц)
function openLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="Увеличенное изображение">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    // Закрытие lightbox
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.closest('.lightbox-close')) {
            document.body.removeChild(lightbox);
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
            }
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// Инициализация галереи (если есть элементы)
function initGalleryIfExists() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                openLightbox(imgSrc);
            });
        });
    }
}

// Инициализация видео-фона с обработкой ошибок автовоспроизведения
function initVideoBackground() {
    const video = document.getElementById('equalizer-video');
    if (!video) return;
    
    // Устанавливаем тихую громкость
    video.volume = 0.05;
    
    // Функция для запуска видео с обработкой ошибок
    function playVideo() {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Видео успешно запущено');
            }).catch(error => {
                console.log('Автовоспроизведение видео заблокировано:', error);
                
                // Показываем кнопку для ручного запуска видео
                showVideoPlayButton(video);
                
                // Пытаемся снова после взаимодействия пользователя
                document.addEventListener('click', function tryPlayOnInteraction() {
                    video.play().then(() => {
                        console.log('Видео запущено после взаимодействия');
                        hideVideoPlayButton();
                    }).catch(() => {
                        console.log('Не удалось запустить видео');
                    });
                    document.removeEventListener('click', tryPlayOnInteraction);
                }, { once: true });
            });
        }
    }
    
    // Запускаем видео
    playVideo();
    
    // Зацикливание видео
    video.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play().catch(console.error);
    });
}

// Функция для показа кнопки запуска видео
function showVideoPlayButton(video) {
    // Удаляем старую кнопку, если есть
    const oldButton = document.querySelector('.video-play-button');
    if (oldButton) oldButton.remove();
    
    // Создаем кнопку
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '<i class="fas fa-play"></i> Включить видео-фон';
    playButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff0066, #ffcc00);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 1000;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: transform 0.3s ease;
    `;
    
    playButton.addEventListener('mouseenter', () => {
        playButton.style.transform = 'scale(1.05)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.transform = 'scale(1)';
    });
    
    playButton.addEventListener('click', () => {
        video.play().then(() => {
            console.log('Видео запущено после клика');
            playButton.style.display = 'none';
        }).catch(error => {
            console.log('Не удалось запустить видео после клика:', error);
        });
    });
    
    document.body.appendChild(playButton);
}

// Скрыть кнопку запуска видео
function hideVideoPlayButton() {
    const button = document.querySelector('.video-play-button');
    if (button) {
        button.style.display = 'none';
    }
}

// Автоматическая инициализация для страниц участниц
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация галереи на страницах участниц
    initGalleryIfExists();
    
    // Инициализация видео-фона на странице about
    initVideoBackground();
});