// Importer le tableau des mots possibles à partir du fichier words.js
import { WORDS } from "./words.js"; 

// Définir le nombre total de tentatives autorisées dans le jeu
const NUMBER_OF_GUESSES = 6; 

// Initialiser le compteur de tentatives restantes au maximum défini ci-dessus
let guessesRemaining = NUMBER_OF_GUESSES; 

// Tableau pour stocker les lettres de la tentative actuelle
let currentGuess=[]; 

// Index pour suivre la position de la prochaine lettre dans la tentative actuelle
let nextLetter = 0; 

// Sélectionner un mot aléatoire à partir du tableau WORDS pour être le mot cible du jeu actuel
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]

// Afficher le mot correct dans la console pour le débogage
console.log(rightGuessString)

// Fonction pour initialiser le plateau de jeu
function initBoard() {
    // Récupérer le conteneur du plateau de jeu par son identifiant d'élément
    let board = document.getElementById("game-board"); 
    
    // Créer des lignes pour le nombre de tentatives autorisées
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        // Créer un nouvel élément div pour chaque ligne de tentatives
        let row = document.createElement("div")
        row.className = "letter-row" // Attribuer une classe pour des raisons de style

        // Créer cinq cases par ligne pour contenir chaque lettre de la tentative
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box" // Attribuer une classe pour des raisons de style
            row.appendChild(box) // Ajouter la case à la ligne courante
        }
        board.appendChild(row) // Ajouter la ligne complétée au plateau
    }
}


initBoard(); 
    document.getElementById('definition-button').addEventListener('click', function() {
        const word = rightGuessString;  // Supposons que cette variable contienne le mot à deviner
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.title === "No Definitions Found") {
                    toastr.error("No definition found for this word.");
                } else {
                    const definition = data[0].meanings[0].definitions[0].definition;
                    toastr.info(`${definition}`);
                }
            })
            .catch(error => {
                console.error("Error fetching the definition:", error);
                toastr.error("Failed to fetch definition.");
            });
    });
    



// Ajout d'un écouteur d'événement sur l'objet document pour capter les relâchements de touches
document.addEventListener("keyup", (e) => {
    // Vérifie si le nombre de tentatives restantes est égal à 0, si oui, arrête la fonction
    if (guessesRemaining === 0) {
        return
    }

    // Récupère la touche pressée et la convertit en chaîne de caractères
    let pressedKey = String(e.key)

    // Si la touche "Backspace" est pressée et qu'il reste des lettres à effacer, appelle la fonction deleteLetter
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    // Si la touche "Enter" est pressée, vérifie la supposition actuelle avec la fonction checkGuess
    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    // Vérifie si la touche pressée est une lettre de l'alphabet (ignore la casse avec le flag 'i')
    let found = pressedKey.match(/[a-z]/gi)
    // Si la touche n'est pas une lettre ou si plusieurs lettres sont détectées, arrête la fonction
    if (!found || found.length > 1) {
        return
    } else {
        // Si c'est une lettre valide et unique, insère la lettre dans la supposition en cours
        insertLetter(pressedKey)
    }
})


function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return 
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent=pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1

}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    // Obtient la ligne courante où afficher la supposition basée sur les tentatives restantes
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString) // Convertit le mot correct en un tableau pour manipulation

    // Construit la chaîne représentant la supposition actuelle
    for (const val of currentGuess) {
        guessString += val
    }

    // Vérifie si la longueur de la supposition est de 5 lettres, sinon alerte l'utilisateur
    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    // Vérifie si la supposition est dans la liste des mots autorisés, sinon alerte l'utilisateur
    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    // Compare chaque lettre de la supposition avec le mot correct
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i]) // Trouve la position de la lettre dans le mot correct

        // Si la lettre n'est pas dans le mot correct, colorie la case en gris
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // Si la lettre est dans le mot, vérifie si elle est à la bonne place
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green' // Bonne place: vert
            } else {
                letterColor = 'yellow' // Mauvaise place: jaune
            }

            // Marque la lettre traitée pour éviter les doublons
            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    // Si la supposition est correcte, termine le jeu
    if (guessString === rightGuessString) {
        toastr.success("You guessed right!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1; // Décrémente le nombre de tentatives restantes
        currentGuess = []; // Réinitialise la supposition courante
        nextLetter = 0; // Réinitialise l'indice de la prochaine lettre à ajouter

        // Si plus de tentatives ne restent, alerte que le jeu est terminé
        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

function shadeKeyBoard(letter, color) {
    // Parcourt toutes les touches du clavier virtuel
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        // Vérifie si le texte de l'élément correspond à la lettre fournie
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor // Stocke la couleur actuelle de la touche

            // Si la touche est déjà verte, elle ne change pas de couleur (la verte est prioritaire)
            if (oldColor === 'green') {
                return
            }

            // Si la touche est jaune et la nouvelle couleur n'est pas verte, ne change pas la couleur
            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            // Applique la nouvelle couleur à la touche
            elem.style.backgroundColor = color
            break // Sort de la boucle une fois la touche trouvée et colorée
        }
    }
}

// Ajoute un écouteur d'événement de clic sur le conteneur du clavier virtuel identifié par "keyboard-cont"
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target // Obtient l'élément sur lequel le clic a été effectué
    
    // Vérifie si l'élément cliqué est une touche du clavier virtuel
    if (!target.classList.contains("keyboard-button")) {
        return // Si ce n'est pas une touche, interrompt l'exécution
    }
    let key = target.textContent // Récupère le texte de l'élément cliqué

    // Si la touche cliquée est "Del", change la valeur en "Backspace"
    if (key === "Del") {
        key = "Backspace"
    } 

    // Déclenche un événement de relâchement de touche avec la touche qui a été cliquée ou modifiée
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// Définition de la fonction animateCSS qui prend un élément, le nom de l'animation, et un préfixe optionnel
const animateCSS = (element, animation, prefix = 'animate__') =>
  // Création d'une promesse qui sera résolue ou rejetée à la fin de l'animation
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`; // Construction du nom complet de la classe d'animation
    // const node = document.querySelector(element); // Sélection de l'élément via un sélecteur CSS
    const node = element // Utilisation directe de l'élément passé en paramètre
    node.style.setProperty('--animate-duration', '0.3s'); // Définition de la durée de l'animation
    
    // Ajout des classes nécessaires pour l'animation
    node.classList.add(`${prefix}animated`, animationName);

    // Fonction de nettoyage appelée à la fin de l'animation
    function handleAnimationEnd(event) {
      event.stopPropagation(); // Empêche la propagation de l'événement
      // Nettoyage des classes d'animation de l'élément
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended'); // Résolution de la promesse avec un message
    }

    // Écouteur pour l'événement de fin d'animation, appelant handleAnimationEnd une seule fois
    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

// ecouteur d'event pour recharger la page
document.getElementById('reset-button').addEventListener('click', function() {
    window.location.reload(); // Cette commande recharge la page
});
