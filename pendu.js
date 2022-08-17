//references
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("userInputSection");
const newGameContainer = document.getElementById("newGameContainer");
const newGameButton = document.getElementById("newGameButton");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("resultText");
//valeurs des options pour les boutons
let options = {
	HTML: [
		"Header",
		"Footer",
		"Body",
		"Navbar",
		"Section",
		"Textarea"
	],
	CSS: ["Background", "Padding", "Margin", "Bottom", "Style", "Animation"],
	JAVASCRIPT: [
		"String",
		"Boolean",
		"Concatenation",
		"Queryselector",
		"Else",
		"While"
	]
};
//compteur
let winCount = 0;
let count = 0;
let chosenWord = "";
// Afficher l'option bouton
const displayOptions = () => {
	optionsContainer.innerHTML += `<h3>Veuillez choisir un sujet: </h3>`;
	let buttonCon = document.createElement("div");
	for (let value in options) {
		buttonCon.innerHTML += `
        <button class="options" onclick="generateWord('${value}')">${value}</button>
        `;
	}
	optionsContainer.appendChild(buttonCon);
};
//Bloquer tous les boutons
const blocker = () => {
	let optionsButtons = document.querySelectorAll(".options");
	let letterButtons = document.querySelectorAll(".letters");
	//désactiver toutes les options
	optionsButtons.forEach((button) => {
		button.disabled = true;
	});
	//desactiver toutes les lettres
	letterButtons.forEach((button) => {
		button.disabled = true;
	});
	newGameContainer.classList.remove("hide");
};

//Générateur de mot
const generateWord = (optionValue) => {
	let optionsButtons = document.querySelectorAll(".options");
	//si la valeur de l'option (valeur du bouton cliqué) correspond à l'innerText du bouton, alors le bouton est mis en évidence.
	optionsButtons.forEach((button) => {
		if (button.innerText.toLowerCase() === optionValue) {
			button.classList.add("active");
		}
		button.disabled = true;
	});
	//cacher d'abord les lettres, effacer le mot précédent
	letterContainer.classList.remove("hide");
	userInputSection.innerText = "";
	//référence au tableau des options utilisateur sélectionnées
	let optionArray = options[optionValue];
	//choix du mot en random
	chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
	chosenWord = chosenWord.toUpperCase();
	//remplacez chaque lettre contenant un span
	let displayItem = chosenWord.replace(/./g, '<span class="dashes">_ </span>');
	// console.log(chosenWord);
	// Afficher chaque élément comme span
	userInputSection.innerHTML = displayItem;
};
//fonction initiale (appelée lorsque la page se charge/que l'utilisateur appuie sur nouveau jeu)
const initializer = () => {
	winCount = 0;
	count = 0;
	//effacer tout le contenu et cacher les lettres et le bouton de nouveau jeu
	userInputSection.innerHTML = "";
	optionsContainer.innerHTML = "";
	letterContainer.classList.add("hide");
	newGameContainer.classList.add("hide");
	letterContainer.innerHTML = "";
	//pour créer les lettres
	for (let i = 65; i < 91; i++) {
		let button = document.createElement("button");
		button.classList.add("letters");
		//charcode[A-Z]
		button.innerText = String.fromCharCode(i);
		//clic sur le bouton de caractère
		button.addEventListener("click", () => {
			let charArray = chosenWord.split("");
			let dashes = document.getElementsByClassName("dashes");
			//si le tableau contient une valeur cliquée, remplacez le tiret correspondant par une lettre sinon faites le canvas
			if (charArray.includes(button.innerText)) {
				charArray.forEach((char, index) => {
					//si le caractère dans le tableau est le même que le bouton cliqué
					if (char === button.innerText) {
						//remplacer le tiret par une lettre
						dashes[index].innerText = char;
						//incrementation du compteur
						winCount += 1;
						//si winCount est égal à la longueur du mot
						if (winCount == charArray.length) {
							resultText.innerHTML = `<h2 class='win-msg'>Super!!</h2><p>tu as trouvé le mot <span>${chosenWord}</span></p>`;
							//bloquer tout les boutons
							blocker();
						}
					}
				});
			} else {
				//lose compteur
				count += 1;
				//pour dessiner le bonhomme
				drawMan(count);
				/*
            count==6 because
            head,
            body,
            leftArm,
            rightArm,
            leftLeg,
            rightLeg,
            */
				if (count == 6) {
					resultText.innerHTML = `<h2 class='lose-msg'>Perdu!!</h2><p>Le mot était <span>${chosenWord}</span></p>`;

					blocker();
				}
			}
			//desactiver les lettres
			button.disabled = true;
		});
		letterContainer.appendChild(button);
	}
	//Création bouton option
	displayOptions();
	//appel à canvasCreator (pour effacer le canvas précédent et créer le canvas initial)
	let { initialDrawing } = canvasCreator();
	//initialDrwaing dessine le cadre
	initialDrawing();
};
// Canvas
const canvasCreator = () => {
	let context = canvas.getContext("2d");
	context.beginPath();
	context.strokeStyle = "#000";
	context.lineWidth = 2;
	//pour dessiner les lignes
	const drawLine = (fromX, fromY, toX, toY) => {
		context.moveTo(fromX, fromY);
		context.lineTo(toX, toY);
		context.stroke();
	};
	//head
	const head = () => {
		context.beginPath();
		context.arc(70, 30, 10, 0, Math.PI * 2, true);
		context.stroke();
	};
	//body 
	const body = () => {
		drawLine(70, 40, 70, 80);
	};

	const leftArm = () => {
		drawLine(70, 50, 50, 70);
	};

	const rightArm = () => {
		drawLine(70, 50, 90, 70);
	};

	const leftLeg = () => {
		drawLine(70, 80, 50, 110);
	};

	const rightLeg = () => {
		drawLine(70, 80, 90, 110);
	};
	//cadre initial
	const initialDrawing = () => {
		//éffacer le canvas
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		// ligne du bas
		drawLine(10, 130, 130, 130);
		//ligne de gauche
		drawLine(10, 10, 10, 131);
		//ligne d'en haut
		drawLine(10, 10, 70, 10);
		//petite ligne en haut
		drawLine(70, 10, 70, 20);
	};
	// initialDrawing();
	return {
		initialDrawing,
		head,
		body,
		leftArm,
		rightArm,
		leftLeg,
		rightLeg
	};
};

//dessin bonhomme
const drawMan = (count) => {
	let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
	switch (count) {
		case 1:
			head();
			break;
		case 2:
			body();
			break;
		case 3:
			leftArm();
			break;
		case 4:
			rightArm();
			break;
		case 5:
			leftLeg();
			break;
		case 6:
			rightLeg();
			break;
		default:
			break;
	}
};
// Réessayer
newGameButton.addEventListener("click", initializer);
window.onload = initializer;
