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
let gravity = 0.3; // Gravité douce
let lift = -7.5; // Force de remontée douce
let maxVelocity = 5; // Vitesse maximale pour limiter les excès
let damping = 0.9; // Facteur d'amortissement
let obstacles = []; // Liste des obstacles
let frameCount = 0; // Compteur de frames pour générer des obstacles
let score = 0; // Score du joueur
let oxygenLevel = 100; // Niveau d'oxygène
let isGameOver = false;
let isStarted = false; // Nouveau flag pour indiquer si le jeu a commencé

// Écouteur d'événement pour le contrôle du phytoplancton
document.addEventListener('keydown', () => {
    if (!isGameOver) {
        if (!isStarted) {
            isStarted = true; // Démarre le jeu au premier input
        }
        velocity += lift; // Applique une force de remontée
    }
});

// Fonction pour redémarrer le jeu
function restartGame() {
    // Désactive le bouton pour éviter les clics multiples
    restartButton.disabled = true;

    // Réinitialise les variables du jeu
    phytoY = canvasHeight / 2;
    velocity = 0;
    obstacles = [];
    frameCount = 0;
    score = 0;
    oxygenLevel = 100;
    isGameOver = false;
    isStarted = false;

    // Cache le message de fin de jeu et montre le bouton de redémarrage
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'inline-block';

    // Relance la boucle du jeu
    gameLoop();

    // Réactive le bouton après un délai court pour éviter un spam immédiat
    setTimeout(() => {
        restartButton.disabled = false; // Réactive le bouton
    }, 500); // Attends 500ms avant de réactiver
}

// Fonction pour générer des obstacles avec un design global warming
function generateObstacle() {
    const gapHeight = Math.random() * (canvasHeight / 2) + 100; // Plus grand espace
    const gapPosition = Math.random() * (canvasHeight - gapHeight);

    // Color schemes representing global warming impacts
    let obstacleColor = '#f44336'; // Red for pollution or rising temperature
    let secondaryColor = '#ff9800'; // Orange for heatwaves or pollution

    // As oxygen decreases, make obstacles more frequent and larger to reflect worsening global warming
    if (oxygenLevel < 50) {
        obstacleColor = '#ff5722'; // Darker red, indicating worsening conditions
        secondaryColor = '#e64a19'; // Darker orange
    }

    obstacles.push({
        x: canvasWidth,
        width: 60, // Wider obstacles for more danger
        top: gapPosition,
        bottom: gapPosition + gapHeight,
        colorTop: obstacleColor,
        colorBottom: secondaryColor,
        type: Math.random() > 0.5 ? 'oilSpill' : 'heatwave', // Randomly choose the type of obstacle
    });
}

// Fonction pour dessiner l'arrière-plan océanique
function drawBackground() {
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    oceanGradient.addColorStop(0, '#80e0d7'); // Bleu clair pour la surface de l'eau
    oceanGradient.addColorStop(1, '#1e3a5f'); // Bleu foncé pour les profondeurs marines

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Fonction pour vérifier les collisions
function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            phytoX + 15 > obstacle.x &&
            phytoX - 15 < obstacle.x + obstacle.width &&
            (phytoY - 15 < obstacle.top || phytoY + 15 > obstacle.bottom)
        ) {
            isGameOver = true; // Empêche les collisions multiples
            return true;
        }
    }

    if (phytoY - 15 <= 0 || phytoY + 15 >= canvasHeight) {
        isGameOver = true; // Collision avec le haut ou le bas du canvas
        return true;
    }

    return false;
}

// Mise à jour principale du jeu
function updateGame() {
    if (isGameOver) return;

    if (isStarted) {
        // Mise à jour de la position du phytoplancton
        velocity += gravity;
        velocity *= damping;

        // Limiter la vitesse maximale
        velocity = Math.max(-maxVelocity, Math.min(maxVelocity, velocity));

        phytoY += velocity;
    }

    // Empêche le phytoplancton de sortir de l'écran avant le début du jeu
    if (!isStarted) {
        phytoY = canvasHeight / 2;
    }

    // Génération d'obstacles toutes les x frames, ajusté selon le niveau d'oxygène
    frameCount++;
    if (isStarted && frameCount % (150 - Math.floor(oxygenLevel / 10)) === 0) {
        generateObstacle();
    }

    // Mise à jour des positions des obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 2; // Déplacement plus lent

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            oxygenLevel += Math.min(10, (100 - oxygenLevel));
        }
    }

    // Vérification des collisions
    if (checkCollision()) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'inline-block';
        return;
    }

    // Mise à jour de l'oxygène
    oxygenLevel -= 0.03;
    if (oxygenLevel <= 0) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'inline-block';
        return;
    }
}

// Load the image for the circle texture
const phytoImage = new Image();
phytoImage.src = './images/respiration/plant.jpg'; // Path to your image

// Variable to store the pattern for the circle texture
let circlePattern;

// Wait for the image to load before using it
phytoImage.onload = () => {
    circlePattern = ctx.createPattern(phytoImage, 'no-repeat');
};

// Fonction d'affichage/dessin sur le canvas
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw ocean background
    drawBackground();

    // Calculate circle size and scale image to fit the circle
    const circleRadius = 30; // Circle radius
    const diameter = circleRadius * 2;

    // Draw the image inside the circle
    if (circlePattern) {
        ctx.save(); // Save current state before transformation
        ctx.beginPath();
        ctx.arc(phytoX, phytoY, circleRadius, 0, Math.PI * 2); // Draw the circle outline
        ctx.clip(); // Clip the region to the circle's area
        ctx.drawImage(phytoImage, phytoX - circleRadius, phytoY - circleRadius, diameter, diameter); // Draw and scale the image
        ctx.restore(); // Restore the canvas state to not affect the rest of the drawing
    } else {
        // Fallback color in case the image is not loaded yet
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(phytoX, phytoY, circleRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw the obstacles with global warming themes
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.colorTop;
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.top);
        ctx.fillStyle = obstacle.colorBottom;
        ctx.fillRect(obstacle.x, obstacle.bottom, obstacle.width, canvasHeight - obstacle.bottom);
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

// Démarrer le jeu en appuyant sur le bouton de démarrage
document.getElementById('start-button').addEventListener('click', function() {
    this.style.display = 'none'; // Masquer le bouton de démarrage
    gameLoop(); // Démarrer la boucle du jeu
});
