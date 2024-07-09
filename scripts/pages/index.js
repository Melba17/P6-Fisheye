// Instruction qui importe la fonction "photographerTemplate" à partir du module/fichier "photographer.js" pour pouvoir l'utiliser ici
import { photographerTemplate } from "../templates/photographer.js";

// RECUPERATION DES DONNEES JSON 
// opération asynchrone avec "async" et "await" pour traiter la réponse du serveur: c'est à dire permet au navigateur d'afficher normalement les infos à l'écran en attendant la réponse du serveur
async function getPhotographers() {
    try {
        // Requête "fetch" contenant le chemin vers fichier JSON (chemin relatif) pour récupérer les données du fichier
        const response = await fetch("../../data/photographers.json");
        
        // Vérifie que la réponse est correcte sinon on signale un problème
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Stockage de la réponse du serveur dans la variable "data" avec désérialisation du fichier JSON - ici réponse sous forme d'objet lisible par le navigateur
        const data = await response.json();
         // Debugging
        console.log('Données récupérées :', data); 
        // Retourne le tableau des photographes
        return data.photographers;
    } catch (error) {
        console.error('Erreur lors de la récupération des photographes :', error);
    }
}
// "try/catch" ou "throw new error" pour centraliser et gérer nous-même les erreurs si il y en a. Donc la console ne pourra plus afficher "uncaught".


/////// INSERTION DES ELEMENTS VIGNETTES DANS LE DOM ///////////
async function displayData(photographers) {
    // Récupération de la section où l'on veut insérer les vignettes
    const photographersSection = document.querySelector(".photographer_section");
    // On parcours le tableau pour ajouter le squelette des vignettes représentant chaque photographe / Méthode "forEach" qui itère la fonction fléchée (photographer)=>{} sur chaque objet(photographes) du tableau
    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        // Ajout des vignette à la section html DOM
        photographersSection.appendChild(userCardDOM);
    });
}

//// AFFICHAGE FINAL DES VIGNETTES SUR LA PAGE WEB /////
async function init() {
    // Récupère les datas des photographes..
    const photographers = await getPhotographers();
    if (photographers) {
        //.. et l'affiche
        displayData(photographers);
    }
}
// Ici, un écouteur d'évènement qui permet l'activation de la fonction finale lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', init);
