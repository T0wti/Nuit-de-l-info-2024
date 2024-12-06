// Écouteur de l'événement pour le changement de température
document.getElementById("ocean-temperature").addEventListener("input", (e) => {
    const value = e.target.value;
    const waveHeight = value / 10;
    const waveSpeed = value / 100;
    const heartScale = 1 + (value / 200);

    // Mise à jour de l'animation des vagues
    gsap.to("#ocean-waves path", {
        y: `+=${waveHeight}`, 
        duration: waveSpeed, 
        ease: "sine.inOut"
    });

    // Mise à jour de l'animation du cœur
    gsap.to("#human-heart", {
        scale: heartScale,
        duration: 0.5,
        ease: "power1.inOut"
    });

    // Mise à jour de l'explication en temps réel
    let explanationText = "";

    if (value < 30) {
        explanationText = "<p><strong>Température trop basse :</strong> Les courants océaniques sont ralentis, ce qui perturbe l'écosystème global. Le cœur humain peut également souffrir d'une baisse de circulation sanguine.</p>";
    } else if (value >= 30 && value <= 70) {
        explanationText = "<p><strong>Température optimale :</strong> Le système climatique fonctionne normalement, et le cœur humain est dans un état optimal de circulation et de pression.</p>";
    } else {
        explanationText = "<p><strong>Température trop élevée :</strong> La température élevée perturbe les courants océaniques, ce qui entraîne une accélération du réchauffement climatique. Le cœur humain subit un stress, entraînant une hypertension.</p>";
    }

    // Afficher l'explication
    document.getElementById("explanation").innerHTML = explanationText;
});

// Démarre la crise en fonction de l'entrée de la température
document.getElementById("start-crisis").addEventListener("click", () => {
    gsap.to("#ocean-waves path", {
        duration: 2,
        y: "+=10",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

    gsap.to("#human-heart", {
        scale: 1.2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
});


document.getElementById("stop-crisis").addEventListener("click", () => {
    // Arrêter l'animation des vagues
    gsap.killTweensOf("#ocean-waves path");

    // Arrêter l'animation du cœur
    gsap.killTweensOf("#human-heart");

    // Réinitialiser les animations
    gsap.set("#ocean-waves path", { y: 0 });
    gsap.set("#human-heart", { scale: 1 });

    // Réactiver le bouton "Démarrer la Crise" et désactiver "Arrêter la Crise"
    document.getElementById("start-crisis").disabled = false;
    document.getElementById("stop-crisis").disabled = false;
});
