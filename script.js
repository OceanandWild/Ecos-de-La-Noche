document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const levelTitle = document.getElementById("level-title");
    const message = document.getElementById("message");
    const nextButton = document.getElementById("next-button");
    const bossSection = document.getElementById("boss-section");
    const bossName = document.getElementById("boss-name");
    const bossImage = document.getElementById("boss-image");
    const healthBar = document.getElementById("health-bar");
    const healthFill = document.getElementById("health-fill");
    const escapeButton = document.getElementById("escape-button");
    const screamerSound = document.getElementById("screamer-sound");
    const creditsScreen = document.getElementById("credits-screen");
    const creditsContent = document.getElementById("credits-content");
    const creditsButton = document.getElementById("credits-button");
    const backToMenuButton = document.getElementById("back-to-menu");
    const credits = [
        "Programador: Ocean and Wild",
        "Ilustradora de Ideas: LuzmilaGatita",
        "Ilustraciones y Sonido: Ocean and Wild"
    ];
    let currentCredit = 0; // Índice del crédito actual
    let creditInterval; // Intervalo para mostrar los créditos

    let currentLevel = 0;
    let currentMessage = 0;
    let playerHealth = 100;
    let bossActive = false;
    let escapeTimer;

     // Mostrar la pantalla de créditos y comenzar la secuencia
     creditsButton.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        creditsScreen.classList.remove("hidden");
        nextButton.classList.add("hidden");
        currentCredit = 0; // Reiniciar el índice
        creditsContent.innerHTML = ""; // Limpiar los créditos anteriores

        // Mostrar créditos uno por uno
        creditInterval = setInterval(() => {
            if (currentCredit < credits.length) {
                const p = document.createElement("p");
                p.textContent = credits[currentCredit];
                p.style.animation = "fadeInOut 3s infinite"; // Aplicar la animación
                creditsContent.appendChild(p);
                currentCredit++;
            } else {
                // Reiniciar cuando terminen los créditos
                creditsContent.innerHTML = "";
                currentCredit = 0;
            }
        }, 3000); // Mostrar cada crédito cada 3 segundos
    });

    // Volver al menú principal desde los créditos
    backToMenuButton.addEventListener("click", () => {
        creditsScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
        clearInterval(creditInterval); // Detener el intervalo al volver al menú
    });

    // Configuración de niveles con jefes y acertijos
    const levels = [
        {
            name: "Nivel 1: La Entrada",
            scares: ["Un susurro rompe el silencio...", "Sientes frío en la nuca..."],
            riddle: "Tengo raíces que nunca tocan el suelo y hojas que nunca se marchitan. ¿Qué soy?",
            answer: "Un libro"
        },
        {
            name: "Nivel 2: El Pasillo",
            scares: ["Ves una sombra moverse rápidamente...", "Algo cae detrás de ti..."],
            riddle: "Siempre corro pero nunca me canso. ¿Quién soy?",
            answer: "El río"
        },
        {
            name: "Nivel 3: La Habitación Roja",
            scares: ["Un grito helado llena el aire...", "Las paredes parecen cerrarse..."],
            riddle: "Mientras más me quitas, más grande me hago. ¿Qué soy?",
            answer: "Un agujero"
        },
        {
            name: "Nivel 4: El Refugio",
            scares: ["Los susurros se multiplican...", "Una puerta se cierra sola..."],
            riddle: "Vuelo sin alas, lloro sin ojos. Donde voy, la oscuridad sigue. ¿Qué soy?",
            answer: "Una nube"
        },
        {
            name: "Nivel 5: El Encuentro",
            scares: ["Te sientes observado...", "El suelo cruje bajo tus pies..."],
            boss: true,
            bossName: "El Espectro",
            bossImage: "espectro_image.png"
        }
    ];

    // Iniciar el juego
    startButton.addEventListener("click", () => {
        startScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        startLevel(currentLevel);
    });

    // Manejar el botón de siguiente nivel
    nextButton.addEventListener("click", () => {
        if (!nextButton.classList.contains("unlocked")) return;
        currentLevel++;
        currentMessage = 0;

        if (currentLevel < levels.length) {
            startLevel(currentLevel);
        } else {
            levelTitle.textContent = "¡Has completado todos los niveles!";
            message.textContent = "";
            nextButton.classList.add("hidden");
        }
    });

    // Mostrar mensajes del nivel (sustos incluidos)
function showMessages(messages, onComplete = () => {}) {
    if (currentMessage < messages.length) {
        message.textContent = messages[currentMessage];

        // Si es un susto, reproducir sonido o mostrar animación
        if (currentLevel < levels.length && levels[currentLevel].scares.includes(messages[currentMessage])) {
            screamerSound.play(); // Reproduce un sonido de susto
            flashScreen(); // Opcional: pantalla parpadea para mayor impacto
        }

        setTimeout(() => {
            currentMessage++;
            showMessages(messages, onComplete);
        }, 5000); // Intervalo de 5 segundos entre sustos
    } else {
        onComplete(); // Llamar a la función después de que todos los mensajes se muestren
    }
}

// Efecto de susto visual
function flashScreen() {
    document.body.classList.add("flash-effect");
    setTimeout(() => {
        document.body.classList.remove("flash-effect");
    }, 500); // Parpadeo de 0.5 segundos
}

// Iniciar el nivel
function startLevel(levelIndex) {
    clearDynamicElements(); // Limpia los elementos dinámicos previos
    const level = levels[levelIndex];
    levelTitle.textContent = level.name;
    message.textContent = "";
    nextButton.textContent = "🔒";
    nextButton.classList.add("locked");
    nextButton.classList.remove("unlocked");
    nextButton.classList.remove("hidden"); // Asegurarse de que el botón esté visible
    bossSection.classList.add("hidden");

    if (level.boss) {
        activateBoss(level.bossName, level.bossImage);
    } else if (level.scares && level.scares.length > 0) {
        showMessages(level.scares, () => {
            if (level.riddle) {
                showRiddle(level.riddle, level.answer);
            } else {
                unlockNextButton();
            }
        });
    } else if (level.riddle) {
        showRiddle(level.riddle, level.answer);
    } else {
        unlockNextButton();
    }
}

// Cambios al CSS para efecto de susto


    // Mostrar acertijo del nivel
    function showRiddle(riddle, answer) {
        message.textContent = `Acertijo: ${riddle}`;
        const answerInput = createInputElement("Escribe tu respuesta...", "riddle-input");
        const submitButton = createButtonElement("Responder", "riddle-submit-button");

        gameScreen.appendChild(answerInput);
        gameScreen.appendChild(submitButton);

        submitButton.addEventListener("click", () => {
            if (answerInput.value.toLowerCase() === answer.toLowerCase()) {
                message.textContent = "¡Correcto! Has resuelto el acertijo.";
                clearDynamicElements();
                unlockNextButton();
            } else {
                message.textContent = "Respuesta incorrecta. Intenta de nuevo.";
            }
        });
    }

    


    // Desbloquear botón de siguiente nivel
    function unlockNextButton() {
        nextButton.textContent = "Siguiente Nivel";
        nextButton.classList.remove("locked");
        nextButton.classList.add("unlocked");
    }

    // Activar jefe
    function activateBoss(bossNameText, bossImageSrc) {
        bossActive = true;
        bossName.textContent = bossNameText;
        bossImage.src = bossImageSrc;
        bossImage.classList.remove("hidden");
        bossSection.classList.remove("hidden");
        escapeButton.classList.remove("hidden");
        healthFill.style.width = playerHealth + "%";

        triggerEscapeButton();
    }

    // Mostrar botón de escapar
    function triggerEscapeButton() {
        escapeButton.textContent = "¡Escapa!";
        escapeTimer = setTimeout(() => {
            showScreamer();
        }, 2000);
    }

    // Manejar clic en el botón de escapar
    escapeButton.addEventListener("click", () => {
        clearTimeout(escapeTimer);
        escapeButton.classList.add("hidden");
        unlockNextButton();
        hideBossElements();
    });

    function showScreamer() {
        screamerSound.play();
        healthFill.style.width = "0%";
        setTimeout(() => {
            healthBar.classList.add("hidden");
            levelTitle.textContent = "Has sido derrotado...";
            message.textContent = "";
            
            // Ocultar botón "Siguiente Nivel"
            nextButton.classList.add("hidden");
            
            hideBossElements();
            showRestartButton(); // Mostrar el botón de reinicio
        }, 500);
    }
    
    
        // Mostrar botón de reinicio
        function showRestartButton() {
            const restartButton = document.createElement("button");
            restartButton.textContent = "Reiniciar";
            restartButton.classList.add("restart-button"); // Clase para estilos
            gameScreen.appendChild(restartButton);
    
            restartButton.addEventListener("click", () => {
                resetGame(); // Reiniciar el juego al hacer clic
            });
        }
    
        function resetGame() {
            // Resetear variables
            currentLevel = 0;
            currentMessage = 0;
            playerHealth = 100;
            bossActive = false;
            clearTimeout(escapeTimer);
        
            // Resetear elementos HTML
            startScreen.classList.remove("hidden"); // Mostrar la pantalla de inicio
            gameScreen.classList.add("hidden");    // Ocultar la pantalla de juego
            levelTitle.textContent = "";           // Limpiar el título del nivel
            message.innerHTML = "";                // Limpiar los mensajes del nivel
        
            bossSection.classList.add("hidden");   // Ocultar la sección del jefe
            bossName.textContent = "";             // Limpiar el nombre del jefe
            bossImage.src = "";                    // Limpiar la imagen del jefe
            bossImage.classList.add("hidden");     // Ocultar la imagen del jefe
            healthFill.style.width = "100%";       // Reiniciar la barra de salud
            escapeButton.classList.add("hidden");  // Ocultar el botón de escapar
        
            // Resetear botón "Siguiente Nivel"
            nextButton.classList.add("locked");
            nextButton.classList.remove("unlocked");
            nextButton.textContent = "🔒";         // Mostrar icono de bloqueo
            nextButton.classList.remove("hidden"); // Asegurarse de que esté visible
        
            // Eliminar cualquier botón de reinicio existente
            const restartButton = document.querySelector(".restart-button");
            if (restartButton) {
                restartButton.remove();
            }
        
            // Detener sonidos si están activos
            screamerSound.pause();
            screamerSound.currentTime = 0;
        
            // Limpia elementos dinámicos
            clearDynamicElements();
        }
        

    // Función para ocultar los elementos del jefe después de la batalla (ganar o perder)
    function hideBossElements() {
        bossSection.classList.add("hidden");
        bossName.textContent = "";
        bossImage.classList.add("hidden");
        healthBar.classList.add("hidden");
    }
});

   // Limpiar elementos dinámicos
   function clearDynamicElements() {
    const inputs = document.querySelectorAll(".riddle-input, .riddle-submit-button");
    inputs.forEach((el) => el.remove());
}

// Crear elementos dinámicos reutilizables
function createInputElement(placeholder, className) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.classList.add(className);
    return input;
}

function createButtonElement(text, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    return button;
}