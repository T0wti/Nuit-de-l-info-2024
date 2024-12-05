// Sélection des éléments HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const oxygenBar = document.getElementById('oxygenBar');
const gameOverMessage = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

// Dimensions du canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Variables du jeu
let phytoY = canvasHeight / 2; // Position verticale du phytoplancton
let phytoX = 100; // Position horizontale fixe du phytoplancton
let velocity = 0; // Vitesse verticale
let gravity = 0.5; // Gravité qui fait descendre le phytoplancton
let lift = -10; // Force appliquée pour remonter
let obstacles = []; // Liste des obstacles
let frameCount = 0; // Compteur de frames pour générer des obstacles
let score = 0; // Score du joueur (quantité d'oxygène produit)
let oxygenLevel = 100; // Niveau d'oxygène (barre de progression)
let isGameOver = false;
let isStarted = false; // Nouveau flag pour indiquer si le jeu a commencé

// Écouteur d'événement pour le contrôle du phytoplancton
document.addEventListener('keydown', () => {
    if (!isGameOver) {
        if (!isStarted) {
            isStarted = true; // Le jeu démarre au premier input
        }
        velocity += lift;
    }
});

// Fonction pour redémarrer le jeu
function restartGame() {
    phytoY = canvasHeight / 2;
    velocity = 0;
    obstacles = [];
    frameCount = 0;
    score = 0;
    oxygenLevel = 100;
    isGameOver = false;
    isStarted = false; // Réinitialisation du flag

    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'none';

    gameLoop(); // Relance la boucle de jeu
}

// Fonction pour générer des obstacles aléatoires
function generateObstacle() {
    const gapHeight = Math.random() * (canvasHeight / 2) + 50; // Hauteur de l'espace entre les obstacles
    const gapPosition = Math.random() * (canvasHeight - gapHeight); // Position verticale du trou

    obstacles.push({
        x: canvasWidth,
        width: 50,
        top: gapPosition,
        bottom: gapPosition + gapHeight,
        color: 'red'
    });
}

// Fonction pour vérifier les collisions entre le phytoplancton et les obstacles
function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            phytoX + 20 > obstacle.x &&
            phytoX - 20 < obstacle.x + obstacle.width &&
            (phytoY - 20 < obstacle.top || phytoY + 20 > obstacle.bottom)
        ) {
            return true; // Collision détectée
        }
    }

    // Collision avec les bords du canvas
    if (phytoY - 20 < 0 || phytoY + 20 > canvasHeight) {
        return true;
    }

    return false;
}

// Fonction principale de mise à jour du jeu
function updateGame() {
    if (isGameOver) return;

    if (isStarted) {
        // Mise à jour de la position du phytoplancton avec la gravité
        velocity += gravity;
        phytoY += velocity;
    }

    // Empêche le phytoplancton de sortir de l'écran avant le début du jeu
    if (!isStarted) {
        phytoY = canvasHeight / 2; // Fixe le phytoplancton au centre
    }

    // Génération d'obstacles toutes les x frames
    frameCount++;
    if (isStarted && frameCount % 90 === 0) {
        generateObstacle();
    }

    // Mise à jour des positions des obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 5; // Déplacement vers la gauche

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1); // Supprime l'obstacle s'il sort de l'écran
            score++; // Augmente le score quand un obstacle est évité
            oxygenLevel += Math.min(10, (100 - oxygenLevel)); // Augmente légèrement l'oxygène produit
        }
    }

    // Vérification des collisions
    if (checkCollision()) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'inline-block';
        return;
    }

    // Mise à jour de l'oxygène produit et réduction progressive de l'oxygène disponible
    oxygenLevel -= 0.1;

    if (oxygenLevel <= 0) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'inline-block';
        return;
    }
}

// Fonction d'affichage/dessin sur le canvas
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dessin du phytoplancton
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(phytoX, phytoY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Dessin des obstacles
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;

        // Partie supérieure de l'obstacle
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.top);

        // Partie inférieure de l'obstacle
        ctx.fillRect(obstacle.x, obstacle.bottom, obstacle.width, canvasHeight - obstacle.bottom);

        ctx.fill();
    }
}

// Boucle principale du jeu
function gameLoop() {
    if (isGameOver) return;

    // Mise à jour du jeu
    updateGame();

    // Dessin du jeu
    drawGame();

    // Mise à jour de l'affichage du score et de la barre d'oxygène
    scoreDisplay.innerText = `Oxygène produit : ${score}`;
    oxygenBar.style.width = `${oxygenLevel}%`;
    oxygenBar.setAttribute('aria-valuenow', oxygenLevel);

    // Relance la boucle à la prochaine frame
    requestAnimationFrame(gameLoop);
}

// Lancement initial du jeu
gameLoop();
