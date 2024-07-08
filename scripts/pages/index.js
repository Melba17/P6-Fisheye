import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {
    try {
        // Chemin vers votre fichier JSON 
        const response = await fetch("../../data/photographers.json");
        
        // Vérifiez que la réponse est correcte
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Désérialisation du fichier JSON - réponse en tableau
        const data = await response.json();
        console.log('Données récupérées :', data);  // Debugging

        // Retourne le tableau des photographes
        return data.photographers;
    } catch (error) {
        console.error('Erreur lors de la récupération des photographes :', error);
    }
}


async function displayData(photographers) {
    // Récupération de la section où l'on veut insérer les vignettes
    const photographersSection = document.querySelector(".photographer_section");
    // On parcours le tableau pour ajouter le squelette modèle de présentation à chaque photographe
    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        // Ajout des vignette à la section html DOM
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes..
    const photographers = await getPhotographers();
    if (photographers) {
        //.. et l'affiche
        displayData(photographers);
    }
}
// Activation de la fonction
init();
