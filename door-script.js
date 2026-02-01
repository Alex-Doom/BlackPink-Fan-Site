// door-script.js - Скрипт только для страницы-приветствия с дверью

document.addEventListener('DOMContentLoaded', function() {
    // ===== ЭЛЕМЕНТЫ =====
    const doorScreen = document.getElementById('doorScreen');
    const doorContainer = document.getElementById('doorContainer');
    const doorHandle = document.getElementById('doorHandle');
    const doorSound = document.getElementById('doorSound');
    
    let isDoorOpened = false;
    let isAnimating = false;
    
    // ===== ПРЕДЗАГРУЗКА РЕСУРСОВ =====
    function preloadResources() {
        // Предзагрузка изображений для главной страницы
        const imagesToPreload = [
            'assets/img/jisoo/jisoo-portrait.webp',
            'assets/img/jennie/jennie-portrait.jpg',
            'assets/img/rose/rose-portrait.jpg',
            'assets/img/lisa/lisa-portrait.jpg'
        ];
        
        let loadedCount = 0;
        const totalImages = imagesToPreload.length;
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                
                if (loadedCount === totalImages) {
                    console.log('Все ресурсы загружены');
                    // Показываем анимацию ручки после загрузки
                    if (doorHandle) {
                        doorHandle.style.animationPlayState = 'running';
                    }
                }
            };
            img.onerror = () => {
                loadedCount++;
                console.warn('Не удалось загрузить:', src);
            };
            img.src = src;
        });
    }
    
    // ===== ФУНКЦИЯ ОТКРЫТИЯ ДВЕРИ =====
    function openDoor() {
        if (isDoorOpened || isAnimating) return;
        
        isAnimating = true;
        isDoorOpened = true;
        
        // Анимация открытия двери
        doorContainer.classList.add('open');
        
        // Через время перенаправляем на главную страницу
        setTimeout(() => {
            // Скрываем экран двери
            doorScreen.classList.remove('active');
            doorScreen.classList.add('hidden');
            
            // Перенаправляем на главную страницу
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 500);
            
        }, 1800); // Время должно совпадать с CSS анимацией
    }
    
    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    
    // Клик по ручке
    if (doorHandle) {
        doorHandle.addEventListener('click', openDoor);
    }
    
    // Нажатие клавиш
    document.addEventListener('keydown', function(e) {
        if ((e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') && !isDoorOpened) {
            e.preventDefault();
            openDoor();
        }
        
        // Для отладки: Alt+O принудительно открывает дверь
        if (e.altKey && e.code === 'KeyO') {
            openDoor();
        }
    });
    
    // ===== ИНИЦИАЛИЗАЦИЯ =====
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    
    // Запускаем предзагрузку
    setTimeout(preloadResources, 500);
    
    // ===== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ =====
    
    // Эффект мерцания для текста
    setInterval(() => {
        const subtitles = document.querySelectorAll('.subtitle');
        subtitles.forEach(subtitle => {
            subtitle.style.opacity = Math.random() > 0.5 ? '1' : '0.7';
        });
    }, 2000);
    
    // Эффект пульсации для свечения
    setInterval(() => {
        const glows = document.querySelectorAll('.pink-glow');
        glows.forEach(glow => {
            glow.style.opacity = (0.3 + Math.random() * 0.2).toFixed(2);
        });
    }, 1500);
});

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Функция для принудительного сброса (для тестирования)
function resetDoorPage() {
    localStorage.removeItem('blink_has_visited');
    window.location.reload();
}