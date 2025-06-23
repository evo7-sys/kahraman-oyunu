const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoreElement = document.getElementById('highScoreValue');
const restartButton = document.getElementById('restartButton');
const startMenu = document.getElementById('startMenu');
const settingsMenu = document.getElementById('settingsMenu');
const gameContainer = document.querySelector('.game-container');
const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const backButton = document.getElementById('backButton');
const colorOptions = document.querySelectorAll('.color-option');
const shapeOptions = document.querySelectorAll('.shape-option');
const bulletColorOptions = document.querySelectorAll('.bullet-color-option');
const clickSound = document.getElementById('clickSound');
const buttonSound = document.getElementById('buttonSound');
const gameOverSound = document.getElementById('gameOverSound');
const gameStartSound = document.getElementById('gameStartSound');
const saveSettingsButton = document.getElementById('saveSettings');

// Canvas boyutları
canvas.width = 800;
canvas.height = 600;

// Oyun değişkenleri
let score = 0;
let highScore = 0;
let gameOver = false;
let lives = 3; // Can sayısı
let selectedColor = '#00ff00'; // Varsayılan renk
let selectedShape = 'square'; // Varsayılan şekil
let selectedBulletColor = '#ffff00'; // Varsayılan mermi rengi

// Geçici ayarlar için değişkenler
let tempSelectedColor = selectedColor;
let tempSelectedShape = selectedShape;
let tempSelectedBulletColor = selectedBulletColor;

// Kahraman özellikleri
const hero = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    color: selectedColor,
    shape: selectedShape
};

// Mermiler dizisi
let bullets = [];

// Düşmanlar dizisi
let enemies = [];

// Düşman tipleri
const ENEMY_TYPES = {
    NORMAL: {
        color: '#ff0000',
        speed: 3,
        health: 1,
        points: 10,
        width: 30,
        height: 30
    },
    FAST: {
        color: '#0000ff',
        speed: 5,
        health: 1,
        points: 15,
        width: 25,
        height: 25
    },
    TANK: {
        color: '#00ff00',
        speed: 2,
        health: 2,
        points: 20,
        width: 40,
        height: 40
    },
    BONUS: {
        color: '#ffd700',
        speed: 4,
        health: 1,
        points: 50,
        width: 35,
        height: 35
    }
};

// Düşman hareket tipleri
const MOVEMENT_TYPES = {
    STRAIGHT: 'straight',
    ZIGZAG: 'zigzag',
    CIRCULAR: 'circular',
    WAVE: 'wave'
};

// Buton sesi çalma fonksiyonu
function playButtonSound() {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(error => {
        console.log("Buton sesi çalma hatası:", error);
    });
}

// Ses çalma fonksiyonu
function playHitSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(error => {
        console.log("Ses çalma hatası:", error);
    });
}

// Game over sesi çalma fonksiyonu
function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(error => {
        console.log("Game over sesi çalma hatası:", error);
    });
}

// Game start sesi çalma fonksiyonu
function playGameStartSound() {
    gameStartSound.currentTime = 0;
    gameStartSound.play().catch(error => {
        console.log("Game start sesi çalma hatası:", error);
    });
}

// Menü işlevleri
startButton.addEventListener('click', () => {
    playButtonSound();
    startMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    playGameStartSound();
    resetGame();
});

settingsButton.addEventListener('click', () => {
    playButtonSound();
    startMenu.style.display = 'none';
    settingsMenu.style.display = 'block';
});

// İlk seçenekleri seçili olarak işaretle
document.addEventListener('DOMContentLoaded', () => {
    // Kahraman rengi seçimi
    colorOptions.forEach(opt => {
        if (opt.dataset.color === selectedColor) {
            opt.classList.add('selected');
        }
    });

    // Kahraman şekli seçimi
    shapeOptions.forEach(opt => {
        if (opt.dataset.shape === selectedShape) {
            opt.classList.add('selected');
        }
    });

    // Mermi rengi seçimi
    bulletColorOptions.forEach(opt => {
        if (opt.dataset.color === selectedBulletColor) {
            opt.classList.add('selected');
        }
    });
});

// Renk seçimi
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        playButtonSound();
        // Sadece kahraman renk seçeneklerini güncelle
        if (!option.classList.contains('bullet-color-option')) {
            colorOptions.forEach(opt => {
                if (!opt.classList.contains('bullet-color-option')) {
                    opt.classList.remove('selected');
                }
            });
            option.classList.add('selected');
            tempSelectedColor = option.dataset.color;
        }
    });
});

// Şekil seçimi
shapeOptions.forEach(option => {
    option.addEventListener('click', () => {
        playButtonSound();
        shapeOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        tempSelectedShape = option.dataset.shape;
    });
});

// Mermi rengi seçimi
bulletColorOptions.forEach(option => {
    option.addEventListener('click', () => {
        playButtonSound();
        bulletColorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        tempSelectedBulletColor = option.dataset.color;
    });
});

// Ayarları kaydet
saveSettingsButton.addEventListener('click', () => {
    playButtonSound();
    selectedColor = tempSelectedColor;
    selectedShape = tempSelectedShape;
    selectedBulletColor = tempSelectedBulletColor;
    hero.color = selectedColor;
    hero.shape = selectedShape;
    settingsMenu.style.display = 'none';
    startMenu.style.display = 'block';
});

// Geri butonu
backButton.addEventListener('click', () => {
    playButtonSound();
    // Geçici ayarları sıfırla
    tempSelectedColor = selectedColor;
    tempSelectedShape = selectedShape;
    tempSelectedBulletColor = selectedBulletColor;
    
    // Seçili öğeleri güncelle
    colorOptions.forEach(opt => {
        if (opt.dataset.color === selectedColor) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    shapeOptions.forEach(opt => {
        if (opt.dataset.shape === selectedShape) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    bulletColorOptions.forEach(opt => {
        if (opt.dataset.color === selectedBulletColor) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    settingsMenu.style.display = 'none';
    startMenu.style.display = 'block';
});

// Tema değiştirme fonksiyonu
function updateTheme() {
    if (score >= 500) {
        document.body.classList.add('day-theme');
    } else {
        document.body.classList.remove('day-theme');
    }
}

// Canları güncelle
function updateLives() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index < lives) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

// Oyunu sıfırla
function resetGame() {
    score = 0;
    gameOver = false;
    lives = 3; // Canları sıfırla
    bullets = [];
    enemies = [];
    hero.y = canvas.height / 2;
    hero.color = selectedColor;
    hero.shape = selectedShape;
    scoreElement.textContent = score;
    updateLives(); // Canları güncelle
    restartButton.style.display = 'none';
    updateTheme(); // Temayı sıfırla
    gameLoop();
}

// Düşman oluşturma fonksiyonu
function createEnemy() {
    // Rastgele düşman tipi seç
    const enemyTypes = Object.keys(ENEMY_TYPES);
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemyType = ENEMY_TYPES[randomType];

    // Rastgele hareket tipi seç
    const movementTypes = Object.values(MOVEMENT_TYPES);
    const randomMovement = movementTypes[Math.floor(Math.random() * movementTypes.length)];

    const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - enemyType.height),
        width: enemyType.width,
        height: enemyType.height,
        speed: enemyType.speed,
        color: enemyType.color,
        health: enemyType.health,
        points: enemyType.points,
        movementType: randomMovement,
        movementTime: 0,
        originalY: 0
    };

    // Hareket tipine göre başlangıç değerlerini ayarla
    if (enemy.movementType === MOVEMENT_TYPES.WAVE) {
        enemy.originalY = enemy.y;
    }

    enemies.push(enemy);
}

// Düşman hareketini güncelle
function updateEnemyMovement(enemy) {
    enemy.movementTime += 0.05;

    switch(enemy.movementType) {
        case MOVEMENT_TYPES.ZIGZAG:
            enemy.y += Math.sin(enemy.movementTime * 2) * 2;
            break;
        case MOVEMENT_TYPES.CIRCULAR:
            enemy.y += Math.sin(enemy.movementTime) * 3;
            break;
        case MOVEMENT_TYPES.WAVE:
            enemy.y = enemy.originalY + Math.sin(enemy.movementTime) * 30;
            break;
    }

    // Ekran sınırlarını kontrol et
    if (enemy.y < 0) enemy.y = 0;
    if (enemy.y > canvas.height - enemy.height) enemy.y = canvas.height - enemy.height;
}

// Ateş etme fonksiyonu
function shoot() {
    if (!gameOver) {
        const bullet = {
            x: hero.x + hero.width,
            y: hero.y + hero.height / 2,
            width: 10,
            height: 5,
            speed: 7,
            color: selectedBulletColor
        };
        bullets.push(bullet);
    }
}

// Klavye kontrolleri
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    // Boşluk tuşuna basıldığında ateş et
    if (e.key === ' ' || e.key === 'Space') {
        shoot();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Fare kontrolleri
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    hero.y = e.clientY - rect.top - hero.height / 2;
});

// Ateş etme (fare tıklaması)
canvas.addEventListener('click', () => {
    shoot();
});

// Çarpışma kontrolü
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Kahramanı çiz
function drawHero() {
    ctx.fillStyle = hero.color;
    switch(hero.shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(hero.x + hero.width/2, hero.y + hero.height/2, hero.width/2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(hero.x + hero.width/2, hero.y);
            ctx.lineTo(hero.x, hero.y + hero.height);
            ctx.lineTo(hero.x + hero.width, hero.y + hero.height);
            ctx.closePath();
            ctx.fill();
            break;
        default: // square
            ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
    }
}

// Oyun döngüsü
function gameLoop() {
    if (gameOver) return;

    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kahramanı hareket ettir
    if (keys['ArrowUp'] && hero.y > 0) hero.y -= hero.speed;
    if (keys['ArrowDown'] && hero.y < canvas.height - hero.height) hero.y += hero.speed;

    // Kahramanı çiz
    drawHero();

    // Mermileri güncelle ve çiz
    bullets = bullets.filter(bullet => {
        bullet.x += bullet.speed;
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        return bullet.x < canvas.width;
    });

    // Düşmanları güncelle ve çiz
    enemies = enemies.filter(enemy => {
        enemy.x -= enemy.speed;
        updateEnemyMovement(enemy);
        
        // Düşmanı çiz
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Düşman-mermi çarpışması
        for (let bullet of bullets) {
            if (checkCollision(bullet, enemy)) {
                enemy.health--;
                if (enemy.health <= 0) {
                    playHitSound();
                    score += enemy.points;
                    scoreElement.textContent = score;
                    if (score > highScore) {
                        highScore = score;
                        highScoreElement.textContent = highScore;
                    }
                    updateTheme(); // Skor değiştiğinde temayı güncelle
                    return false;
                }
            }
        }

        // Düşman-kahraman çarpışması
        if (checkCollision(enemy, hero)) {
            lives--; // Canı azalt
            updateLives(); // Canları güncelle
            if (lives <= 0) { // Canlar bittiyse
                gameOver = true;
                playGameOverSound();
                restartButton.style.display = 'block';
            }
            return false;
        }

        return enemy.x > -enemy.width;
    });

    // Rastgele düşman oluştur
    if (Math.random() < 0.01) {
        createEnemy();
    }

    requestAnimationFrame(gameLoop);
}

// Yeniden başlatma butonu tıklama olayı
restartButton.addEventListener('click', () => {
    playButtonSound();
    gameContainer.style.display = 'none';
    startMenu.style.display = 'block';
    resetGame();
});

// Oyunu başlat
gameLoop(); 