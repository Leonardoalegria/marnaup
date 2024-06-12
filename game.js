const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const levelElement = document.getElementById('level');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let level = 1;
let speed = 4;
let redCats = [];
let gameInterval;
let gameOver = false;

class Cat {
    constructor(name, color, x, y, radius = 20) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();

        // Drawing cat ears
        context.beginPath();
        context.moveTo(this.x - this.radius / 2, this.y - this.radius);
        context.lineTo(this.x, this.y - this.radius * 1.5);
        context.lineTo(this.x + this.radius / 2, this.y - this.radius);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();

        // Drawing cat eyes
        context.beginPath();
        context.arc(this.x - this.radius / 3, this.y - this.radius / 3, 2, 0, Math.PI * 2);
        context.arc(this.x + this.radius / 3, this.y - this.radius / 3, 2, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off the edges
        if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1;
    }
}

const marcelina = new Cat('Marcelina', 'white', canvas.width / 2, canvas.height / 2);
let nanani = new Cat('Nanani', 'gray', Math.random() * canvas.width, Math.random() * canvas.height);
let nananiSpeedMultiplier = 1.5;

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    marcelina.draw();
    nanani.draw();
    redCats.forEach(cat => cat.draw());
}

function updateGame() {
    nanani.update();
    redCats.forEach(cat => cat.update());
}

function setupLevel() {
    redCats = [];
    for (let i = 0; i < level; i++) {
        redCats.push(new Cat('Red Cat', 'red', Math.random() * canvas.width, Math.random() * canvas.height));
    }
    nanani.vx *= nananiSpeedMultiplier;
    nanani.vy *= nananiSpeedMultiplier;
}

canvas.addEventListener('click', (event) => {
    if (gameOver) return;

    const distanceToNanani = Math.sqrt((event.clientX - nanani.x) ** 2 + (event.clientY - nanani.y) ** 2);
    if (distanceToNanani < nanani.radius * 2) {
        level++;
        levelElement.textContent = `Level: ${level}`;
        if (level <= 5) {
            speed += 1;
            nanani = new Cat('Nanani', 'gray', Math.random() * canvas.width, Math.random() * canvas.height, 20);
            setupLevel();
        } else {
            alert('Congratulations! You completed all levels!');
            level = 1;
            speed = 4;
            nanani = new Cat('Nanani', 'gray', Math.random() * canvas.width, Math.random() * canvas.height, 20);
            setupLevel();
            levelElement.textContent = `Level: ${level}`;
        }
    } else {
        redCats.forEach(cat => {
            const distanceToRedCat = Math.sqrt((event.clientX - cat.x) ** 2 + (event.clientY - cat.y) ** 2);
            if (distanceToRedCat < cat.radius * 2) {
                gameOver = true;
                alert('Marcelina scratched the wrong cat. You lose. Boink boink.');
                return;
            }
        });
    }
});

function gameLoop() {
    if (gameOver) return;
    draw();
    updateGame();
    requestAnimationFrame(gameLoop);
}

setupLevel();
gameLoop();
