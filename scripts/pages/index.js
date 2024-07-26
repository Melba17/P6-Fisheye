///////////////////// PAGE ACCUEIL /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Instruction qui importe la fonction "photographerTemplate" à partir du module/fichier "photographer.js" pour pouvoir l'utiliser ici
import { photographerTemplate } from "../templates/photographer.js";
import { createModal, openModal, closeModal, validateForm } from "../utils/contactForm.js";

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
        
        // Debugging : affichage des données récupérées dans la console
        console.log('Données récupérées :', data);
        
        // Retourne le tableau des photographes
        return data.photographers;
    } catch (error) {
        // Affichage d'une erreur en cas de problème lors de la récupération des données
        console.error('Erreur lors de la récupération des photographes :', error);
    }
}

// "try/catch" ou "throw new error" pour centraliser et gérer nous-même les erreurs si il y en a. Donc la console ne pourra plus afficher "uncaught".

/////////////////// 2 FONCTIONS INTERDEPENDANTES : LA 1ERE EXTRAT l'ID DU PHOTOGRAPHE À PARTIR DE L'URL - LA 2EME UTILISE CET ID POUR AFFICHER LES DETAILS DU PHOTOGRAPHE DANS SA BANNIERE ////////////////////
// Fonction pour récupérer l'ID du photographe à partir de l'URL
function getPhotographerIdFromUrl() {
    // Création de l'objet URL / "new URL" crée un nouvel objet URL basé sur cette URL complète / "window.location.href" récupère l'URL complète actuellement affichée dans la barre d'adresse du navigateur = en facilite la manipulation
    const url = new URL(window.location.href);
    
    // Récupère et retourne l'id du photographe en question situé à la fin de l'url (ex : ?id=243)
    return url.searchParams.get('id');
}

// Fonction asynchrone pour afficher les informations spécifiques d'un photographe dans sa bannière en fonction de son ID
async function displayPhotographerDetails(photographerId) {
    // Récupération des données JSON globales contenant la liste des photographes / fonction getPhotographers() ci-dessus
    const photographers = await getPhotographers();
    
    // Recherche du photographe correspondant à l'ID fourni donc parcourt la liste des photographes et retourne le photographe dont l'ID correspond à photographerId
    const photographer = photographers.find(p => p.id == photographerId);

    // Vérification si le photographe a été trouvé
    if (photographer) {
        // Génération du modèle de photographe en utilisant la fonction template du fichier "photographer.js" dans le dossier "templates"
        const photographerModel = photographerTemplate(photographer);
        
        // Extraction des éléments spécifiques du modèle du photographe
        const { h2, h3, strong, img } = photographerModel.getSpecificElements();

        // Sélection de la section d'information sur le photographe dans le DOM
        const infoSection = document.querySelector(".photograph-info");
        
        // Ajout des éléments d'information (titre, sous-titre, etc.) à la section d'information
        infoSection.appendChild(h2);
        infoSection.appendChild(h3);
        infoSection.appendChild(strong);
        
        // Sélection de la section de l'image du photographe dans le DOM
        const imageSection = document.querySelector(".photograph-image");
        
        // Ajout de l'image du photographe à la section de l'image
        imageSection.appendChild(img);

        // Création de la modale de contact
        createModal();

        // Ajout du nom du photographe dans l'encart prévu de la modale
        const nameElement = document.querySelector(".photographer-name");
        nameElement.textContent = photographer.name; 

        // Gestion de l'ouverture et de la fermeture de la modale
        document.querySelector(".contact_button").addEventListener("click", openModal);
        document.querySelector(".modal_close").addEventListener("click", closeModal);
        
        
        // Validation du formulaire lors de la soumission
        document.querySelector("form").addEventListener("submit", function(event) {
            if (validateForm()) {
                console.log("Le formulaire est envoyé."); // Affichage d'un message de succès
                closeModal(); // Fermeture de la modale après soumission réussie
            } else {
                event.preventDefault(); // Empêche la soumission du formulaire en cas d'erreur
            }
        });

    } else {
        // Affichage d'une erreur dans la console si le photographe n'a pas été trouvé
        console.error("Photographe non trouvé");
    }
}

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

/////// INSERTION DES ELEMENTS VIGNETTES DANS LE DOM POUR LA PAGE D'ACCUEIL ///////////
// Fonction pour insérer les vignettes des photographes dans le DOM pour la page d'accueil
async function displayData(photographers) {
    // Récupération de la section où l'on veut insérer les vignettes
    const photographersSection = document.querySelector(".photographer_section");
    
    // On parcours le tableau pour ajouter le squelette des vignettes représentant chaque photographe / Méthode "forEach" qui itère la fonction fléchée (photographer)=>{} sur chaque objet(photographes) du tableau
    photographers.forEach((photographer) => {
        // Génération du modèle de photographe à l'aide de la fonction template
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        
        // Ajout des vignettes à la section HTML DOM
        photographersSection.appendChild(userCardDOM);
    });
}

//// AFFICHAGES FINAUX /////
async function init() {
    // Récupération de l'ID du photographe depuis l'URL
    const photographerId = getPhotographerIdFromUrl();
    
    // Si un ID est présent, afficher les détails du photographe
    if (photographerId) {
        await displayPhotographerDetails(photographerId);
    } else {
        // Sinon, récupérer et afficher les données des photographes
        const photographers = await getPhotographers();
        if (photographers) {
            displayData(photographers); // Affichage des vignettes des photographes
        }
    }
}

// Activation/Appel de la fonction
init();
