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



// Gestion du puzzle

// Initial References
const moves = document.getElementById("moves");
const container = document.querySelector(".container");
const startButton = document.getElementById("start-button");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
let currentElement = "";
let movesCount,
  imagesArr = [];
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

// Random number for image
const randomNumber = () => Math.floor(Math.random() * 8) + 1;

// Get row and column value from data-position
const getCoords = (element) => {
  const [row, col] = element.getAttribute("data-position").split("_");
  return [parseInt(row), parseInt(col)];
};

// row1, col1 are image co-ordinates while row2 and col2 are blank image co-ordinates
const checkAdjacent = (row1, row2, col1, col2) => {
  if (row1 == row2) {
    if (col2 == col1 - 1 || col2 == col1 + 1) return true;
  } else if (col1 == col2) {
    if (row2 == row1 - 1 || row2 == row1 + 1) return true;
  }
  return false;
};

// Fill array with random value for images
const randomImages = () => {
  while (imagesArr.length < 8) {
    let randomVal = randomNumber();
    if (!imagesArr.includes(randomVal)) {
      imagesArr.push(randomVal);
    }
  }
  imagesArr.push(9);
};

// Generate Grid
const gridGenerator = () => {
  let count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let div = document.createElement("div");
      div.setAttribute("data-position", `${i}_${j}`);
      div.addEventListener("click", selectImage);
      div.classList.add("image-container");
      div.innerHTML = `<img src="images/image_part_00${imagesArr[count]}.png" class="image ${imagesArr[count] == 9 ? "target" : ""}" data-index="${imagesArr[count]}"/>`;
      count += 1;
      container.appendChild(div);
    }
  }
};

// Click the image
const selectImage = (e) => {
  e.preventDefault();
  currentElement = e.target;
  let targetElement = document.querySelector(".target");
  let currentParent = currentElement.parentElement;
  let targetParent = targetElement.parentElement;
  const [row1, col1] = getCoords(currentParent);
  const [row2, col2] = getCoords(targetParent);

  if (checkAdjacent(row1, row2, col1, col2)) {
    currentElement.remove();
    targetElement.remove();
    let currentIndex = parseInt(currentElement.getAttribute("data-index"));
    let targetIndex = parseInt(targetElement.getAttribute("data-index"));
    currentElement.setAttribute("data-index", targetIndex);
    targetElement.setAttribute("data-index", currentIndex);
    currentParent.appendChild(targetElement);
    targetParent.appendChild(currentElement);

    let currentArrIndex = imagesArr.indexOf(currentIndex);
    let targetArrIndex = imagesArr.indexOf(targetIndex);
    [imagesArr[currentArrIndex], imagesArr[targetArrIndex]] = [
      imagesArr[targetArrIndex],
      imagesArr[currentArrIndex],
    ];

    if (imagesArr.join("") == "123456789") {
      setTimeout(() => {
        coverScreen.classList.remove("hide");
        container.classList.add("hide");
        result.innerText = `Total Moves: ${movesCount}`;
        startButton.innerText = "RestartGame";
      }, 1000);
    }
    movesCount += 1;
    moves.innerText = `Moves: ${movesCount}`;
  }
};

// Start button click should display the container
startButton.addEventListener("click", () => {
  container.classList.remove("hide");
  coverScreen.classList.add("hide");
  container.innerHTML = "";
  imagesArr = [];
  randomImages();
  gridGenerator();
  movesCount = 0;
  moves.innerText = `Moves: ${movesCount}`;
});

// Display start screen first
window.onload = () => {
  coverScreen.classList.remove("hide");
  container.classList.add("hide");
};