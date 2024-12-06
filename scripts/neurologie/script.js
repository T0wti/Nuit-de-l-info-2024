const image = document.getElementById("dynamic-image");
const canvas = document.getElementById("wave-canvas");
const ctx = canvas.getContext("2d");

// Ajuster le canvas à la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let wave = { 
    phase: 0, 
    amplitude: 50, // Amplitude initiale
    frequency: 0.02, 
    speed: 0.05,
    drawingProgress: 0, // Contrôle de l'avancement du dessin
    color: "#FF6F61", // Rouge pastel initial
    targetColor: "#1E90FF", // Bleu de mer cible
    colorTransitionProgress: 0, // Pour suivre le progrès de la transition
    transitionCompleted: false, // Indicateur pour savoir si la transition est terminée
    linearTransitionStarted: false, // Indicateur pour démarrer la transition linéaire
    linearAmplitudeTransitionProgress: 0 // Contrôle la transition de l'amplitude
};

// Fonction pour dessiner une onde qui arrive progressivement
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    // Dessiner l'onde progressivement en fonction du dessin progressif
    for (let x = canvas.width; x > canvas.width * (1 - wave.drawingProgress); x--) {
        let y =
            canvas.height / 2 +
            Math.sin(wave.phase + x * wave.frequency) * wave.amplitude;
        ctx.lineTo(x, y);
    }

    // Appliquer la couleur actuelle de l'onde
    ctx.strokeStyle = wave.color; // Utilisation de la couleur définie
    ctx.lineWidth = 2;
    ctx.stroke();

    // Augmenter le progrès du dessin au fur et à mesure
    wave.drawingProgress += 0.005; // Contrôle la vitesse à laquelle l'onde se dessine

    // L'onde continue de se déplacer de droite à gauche
    wave.phase += wave.speed; // Décrémenter la phase pour faire entrer l'onde

    // Si la transition de couleur est en cours et non terminée
    if (!wave.transitionCompleted && wave.colorTransitionProgress < 1) {
        // Calculer la progression de la transition
        wave.colorTransitionProgress += 0.002; // Vitesse de transition
        let r = Math.round((1 - wave.colorTransitionProgress) * parseInt("FF", 16) + wave.colorTransitionProgress * parseInt("1E", 16));
        let g = Math.round((1 - wave.colorTransitionProgress) * parseInt("6F", 16) + wave.colorTransitionProgress * parseInt("90", 16));
        let b = Math.round((1 - wave.colorTransitionProgress) * parseInt("61", 16) + wave.colorTransitionProgress * parseInt("FF", 16));
        wave.color = `rgb(${r}, ${g}, ${b})`; // Appliquer la nouvelle couleur calculée
    }

    // Si la transition est terminée, marquer comme complète
    if (wave.colorTransitionProgress >= 1 && !wave.transitionCompleted) {
        wave.transitionCompleted = true; // Marquer la transition comme terminée
    }

    // Si la transition linéaire est démarrée, réduire progressivement l'amplitude
    if (wave.linearTransitionStarted && wave.linearAmplitudeTransitionProgress < 1) {
        wave.linearAmplitudeTransitionProgress += 0.01; // Vitesse de la transition linéaire
        wave.amplitude = 50 * (1 - wave.linearAmplitudeTransitionProgress); // Réduire progressivement l'amplitude
    }

    requestAnimationFrame(drawWave); // Recommencer l'animation
}

// Événement de zoom sur l'image
image.addEventListener("click", () => {
    image.classList.add("zoom"); // Ajouter la classe zoom pour démarrer l'animation
    document.body.style.backgroundColor = "#000000"; // Changer la couleur du fond du body
    setTimeout(() => {
        image.style.display = "none"; // Masquer l'image après le zoom
        canvas.style.display = "block"; // Afficher le canvas
        drawWave(); // Démarrer l'animation des vagues

        // Démarrer la transition de couleur après 5 secondes
        setTimeout(() => {
            wave.colorTransitionProgress = 0; // Réinitialiser la progression de la transition
        }, 5000); // Attendre 5 secondes avant de commencer la transition

        // Après 5 secondes, démarrer la transition linéaire de l'amplitude
        setTimeout(() => {
            wave.linearTransitionStarted = true; // Démarrer la transition linéaire
        }, 5000); // Attendre 5 secondes avant de commencer la transition linéaire
    }, 2000); // Attendre la fin de l'animation de zoom
});

// Ajustement dynamique de la taille du canvas
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
