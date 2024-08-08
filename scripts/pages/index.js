///////////////////// PAGE ACCUEIL /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Instruction qui importe la fonction "photographerTemplate" à partir du module/fichier "photographer.js" pour pouvoir l'utiliser ici
import { photographerTemplate } from "../templates/photographers.js";
// Instruction qui importe les fonctions "createModal" et "openModal" à partir du module/fichier "contactForm.js" pour pouvoir l'utiliser ici
import { createModal, openModal } from "../utils/contactForm.js";

// RECUPERATION DES DONNEES JSON 
// opération asynchrone avec "async" et "await" pour traiter la réponse du serveur: c'est à dire permet au navigateur d'afficher normalement les infos à l'écran en attendant la réponse du serveur
// "asynch" mot-clé qui permet à la fonction de s'exécuter même si cela prend du temps, sans bloquer l'exécution du reste du code
async function getPhotographers() {
    try {
        // Méthode/Requête HTTP "fetch" contenant le chemin vers fichier JSON (chemin relatif) pour récupérer les données/ressources du fichier = en bref, simule une API
        // "await" fetch = mot-clé utilisé pour attendre que la promesse/réponse renvoyée par la fonction fetch soit résolue/finie. S'utilise uniquement à l'intérieur des fonctions async
        const response = await fetch("./data/photographers.json");
        
        // Vérifie que l'objet réponse est correcte sinon on signale un problème
        if (!response.ok) {
            // exemples de "status" = 200 : La requête a réussi, et la réponse contient les données demandées / 404 : Le serveur n'a pas trouvé la ressource demandée / 500 : Une erreur s'est produite sur le serveur etc...
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Ensuite, stockage de la réponse du serveur dans la variable "data" avec désérialisation du fichier JSON - ici réponse sous forme d'objet lisible par le navigateur
        const data = await response.json();
        
        // Debugging : affichage des données récupérées dans la console
        console.log('Données récupérées :', data);
        
        // Retourne le tableau des photographes à partir des données JSON récupérées = instruction 
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
        // Crée un nouvel objet URL basé sur l'URL complète actuelle
        const url = new URL(window.location.href);     
        // Récupère la valeur du paramètre 'id' de l'URL sous forme de chaîne de caractères
        const id = url.searchParams.get('id');  
        // Convertit immédiatement la chaîne de caractères en nombre et retourne le résultat donc soit un nombre, soit null
        return id ? parseInt(id) : null; 
    }

//////////////////////////////////// BANNIERE PAGE PHOTOGRAPHE ////////////////////////////////////////////////////////////
// Fonction asynchrone pour afficher les informations spécifiques d'un photographe dans sa bannière en fonction de son ID
// "photographerId" est extrait de "getPhotographerIdFromUrl" au-dessus
async function displayPhotographerDetails(photographerId) {
    // Récupération des données JSON globales contenant la liste des photographes / fonction getPhotographers() ci-dessus
    const photographers = await getPhotographers();
    
    // find() = méthode qui utilise une fonction fléchée pour trouver le photographe 
    // p.id = données JSON, provient indirectement de la fonction getPhotographers() et photographerId = est récupéré par la fonction getPhotographerIdFromURL()
    // La comparaison stricte '===' assure que l'ID est bien un nombre et pas une chaîne de caractères. Comparaison stricte qui vérifie à la fois la valeur et le type 
    // Le photographe trouvé est stocké dans la variable 'photographer'.
    const photographer = photographers.find(p => p.id === photographerId);



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

        ///////// MODALE DE CONTACT ////////////
        createModal();
        // Ajout du nom du photographe dans l'encart prévu de la modale
        const nameElement = document.querySelector(".photographer-name");
        nameElement.textContent = photographer.name; 
        // Gestion de l'ouverture et de la fermeture de la modale
        document.querySelector(".contact_button").addEventListener("click", openModal);

    } else {
        // Affichage d'une erreur dans la console si le photographe n'a pas été trouvé
        console.error("Photographe non trouvé");
    }
}


///////////////// INSERTION DES ELEMENTS VIGNETTES DANS LE DOM POUR LA PAGE D'ACCUEIL /////////////////
// Fonction pour insérer les vignettes des photographes dans le DOM pour la page d'accueil
function displayData(photographers) {
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

//// AFFICHAGES FINALS : PAGE ACCUEIL ET BANNIERE PAGE PHOTOGRAPHE /////
async function init() {
    // Récupération de l'ID du photographe depuis l'URL
    const photographerId = getPhotographerIdFromUrl();
    // Si un ID est présent, afficher les détails du photographe dans sa bannière
    if (photographerId) {
        await displayPhotographerDetails(photographerId);
    } else {
        // Sinon, récupère les données des photographes...
        const photographers = await getPhotographers();
        if (photographers) {
            displayData(photographers); // ... et affiche les vignettes des photographes en page Accueil
        }
    }
}

// Activation/Appel immédiat de la fonction
init();
