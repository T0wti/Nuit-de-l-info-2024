const image = document.getElementById("dynamic-image");
const canvas = document.getElementById("wave-canvas");
const ctx = canvas.getContext("2d");

// Ajuster le canvas à la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let wave = { phase: 0, amplitude: 50, frequency: 0.02 };

// Fonction pour dessiner une onde
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let x = 0; x < canvas.width; x++) {
        let y =
            canvas.height / 2 +
            Math.sin(wave.phase + x * wave.frequency) * wave.amplitude;
        ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    wave.phase += 0.05;
    requestAnimationFrame(drawWave);
}

// Événement de zoom sur l'image
image.addEventListener("click", () => {
    image.classList.add("zoom"); // Ajouter la classe zoom pour démarrer l'animation
    document.body.style.backgroundColor = "#0077BE"; // Changer la couleur du fond du body
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
