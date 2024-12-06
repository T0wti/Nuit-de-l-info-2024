const image = document.getElementById("dynamic-image");
const canvas = document.getElementById("wave-canvas");
const ctx = canvas.getContext("2d");

// Ajuster le canvas à la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let wave = { 
    phase: 0, 
    amplitude: 50, 
    frequency: 0.02, 
    speed: 0.05,
    drawingProgress: 0 // Contrôle de l'avancement du dessin
};

// Fonction pour dessiner une onde qui arrive progressivement
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    // Dessiner l'onde progressivement en fonction du dessin progressif
    for (let x = 0; x < canvas.width * wave.drawingProgress; x++) {
        let y =
            canvas.height / 2 +
            Math.sin(wave.phase + x * wave.frequency) * wave.amplitude;
        ctx.lineTo(x, y);
    }

    // Changer la couleur de la vague ici
    ctx.strokeStyle = "green"; // Changez "green" par la couleur que vous souhaitez
    ctx.lineWidth = 2;
    ctx.stroke();

    // Augmenter le progrès du dessin au fur et à mesure
    wave.drawingProgress += 0.005; // Contrôle la vitesse à laquelle l'onde se dessine

    // L'onde continue de se déplacer de droite à gauche
    wave.phase += wave.speed; // Décrémenter la phase pour faire entrer l'onde

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
    }, 2000); // Attendre la fin de l'animation de zoom
});

// Ajustement dynamique de la taille du canvas
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
