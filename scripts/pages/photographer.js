/////////////////////////// PAGE PHOTOGRAPHE /////////////////////////////////////////////////////////
// Import de la Factory pour les médias
import { MediaFactory } from '../patterns/mediaFactory.js'; // Importation de la classe MediaFactory pour la création des objets média
import { Lightbox } from '../utils/lightbox.js'; // Importation de la classe Lightbox pour gérer l'affichage des images en mode lightbox

// Fonction pour récupérer les données des photographes et des médias dans le fichier JSON //
// La fonction getData utilise la méthode fetch pour effectuer une requête HTTP au fichier JSON situé à l'URL "./data/photographers.json". Cette requête est envoyée par le navigateur au "serveur" c'est à dire ici l'environnement local (Live Server) pour obtenir les données du fichier JSON.
async function getData() {
    try {
        // Effectue une requête HTTP pour obtenir les données des photographes
        const response = await fetch("./data/photographers.json");

        // Vérifie si la réponse est correcte 
        if (!response.ok) {
            // Lance une erreur si la réponse n'est pas correcte
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Convertit la réponse en format JSON et la retourne
        return await response.json();
    } catch (error) {
        // Affiche une erreur en cas de problème avec la requête ou la conversion
        console.error('Erreur lors de la récupération des données :', error);

        // Retourne des tableaux vides pour éviter des erreurs ultérieures
        return { media: [], photographers: [] };
    }
}

/**
 * Fonction pour obtenir le paramètre d'URL contenant l'ID du photographe
 * @returns {number|null} - L'ID du photographe ou null si l'ID n'existe pas
 */
function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search); // Crée un objet URLSearchParams pour analyser les paramètres de l'URL
    const id = urlParams.get('id'); // Récupère la valeur du paramètre 'id'
    return id ? parseInt(id) : null; // Retourne l'ID sous forme de nombre ou null si l'ID n'existe pas
}

/**
 * Fonction pour créer et insérer dynamiquement le bouton de tri
 * @param {Array} medias - La liste des médias du photographe
 * @param {string} photographerName - Le nom du photographe
 */
function createSortButton(medias, photographerName) {
    const sortButtonDiv = document.querySelector('.sort_button'); // Sélectionne la div contenant le bouton de tri
    if (!sortButtonDiv) {
        console.error("La div .sort_button n'existe pas dans le DOM."); // Affiche une erreur si la div n'existe pas
        return;
    }

    // Créer le texte "Trier par"
    const textSpan = document.createElement('span'); // Crée un élément span pour le texte
    textSpan.textContent = 'Trier par'; // Définit le texte du span
    sortButtonDiv.appendChild(textSpan); // Ajoute le span à la div du bouton de tri

    // Créer le conteneur pour le menu déroulant
    const dropdown = document.createElement('div'); // Crée un conteneur div pour le menu déroulant
    dropdown.className = 'dropdown'; // Ajoute une classe CSS pour le style

    // Créer le bouton du menu déroulant
    const dropdownButton = document.createElement('button'); // Crée un bouton pour le menu déroulant
    dropdownButton.type = 'button'; // Définit le type du bouton
    dropdownButton.id = 'orderByButton'; // Définit un ID unique pour le bouton
    dropdownButton.setAttribute('aria-haspopup', 'listbox'); // Ajoute un attribut ARIA pour l'accessibilité
    dropdownButton.setAttribute('aria-expanded', 'false'); // Définit l'état d'expansion du menu
    dropdownButton.setAttribute('aria-label', 'Menu de tri'); // Ajoute une étiquette ARIA pour l'accessibilité

    // Ajouter le texte au bouton
    const buttonTextSpan = document.createElement('span'); // Crée un span pour le texte du bouton
    buttonTextSpan.textContent = 'Popularité'; // Définit le texte du span
    dropdownButton.appendChild(buttonTextSpan); // Ajoute le texte au bouton

    // Ajouter l'icône de la flèche
    const icon = document.createElement('i'); // Crée un élément i pour l'icône
    icon.className = 'fa-solid fa-angle-down dropdown-icon'; // Ajoute les classes CSS pour l'icône de flèche
    dropdownButton.appendChild(icon); // Ajoute l'icône au bouton

    // Ajouter le bouton au conteneur dropdown
    dropdown.appendChild(dropdownButton); // Ajoute le bouton au conteneur du menu déroulant

    // Créer le contenu du menu déroulant
    const dropdownContent = document.createElement('div'); // Crée un conteneur pour le contenu du menu
    dropdownContent.className = 'dropdown-content'; // Ajoute une classe CSS pour le style
    dropdownContent.setAttribute('role', 'listbox'); // Ajoute un rôle ARIA pour l'accessibilité
    dropdownContent.setAttribute('aria-labelledby', 'orderByButton'); // Associe le contenu au bouton par ARIA

    // Ajouter le contenu au conteneur dropdown
    dropdown.appendChild(dropdownContent); // Ajoute le contenu au conteneur du menu déroulant

    // Ajouter le conteneur dropdown au conteneur principal
    sortButtonDiv.appendChild(dropdown); // Ajoute le menu déroulant à la div principale du bouton de tri

    // Appeler sortButtonDOM avec les données réelles
    sortButtonDOM(medias, photographerName); // Initialise le menu déroulant avec les options de tri
}

// Fonction pour initialiser la lightbox
function initializeLightbox() {
    // Supprimer l'ancienne lightbox s'il en existe une
    const existingLightbox = document.querySelector('.lightbox'); // Sélectionne la lightbox existante
    if (existingLightbox) {
        existingLightbox.remove(); // Supprime la lightbox si elle existe
    }

    // Créer et initialiser une nouvelle instance de lightbox
    const lightbox = new Lightbox(); // Crée une nouvelle instance de Lightbox
    lightbox.init(); // Initialise la lightbox
}

/**
 * Fonction pour gérer les options de tri dans le menu déroulant
 * @param {Array} originalMedias - La liste des médias d'origine
 * @param {string} photographerName - Le nom du photographe
 */
function sortButtonDOM(originalMedias, photographerName) {
    const dropdown = document.querySelector(".dropdown"); // Sélectionne le conteneur du menu déroulant
    const dropdownButton = document.getElementById("orderByButton"); // Sélectionne le bouton du menu déroulant
    const dropdownContent = dropdown.querySelector(".dropdown-content"); // Sélectionne le contenu du menu déroulant
    const icon = dropdownButton.querySelector(".dropdown-icon"); // Sélectionne l'icône du bouton

    const options = [ // Définition des options de tri
        { id: 'populariteOption', value: 'popularite', text: 'Popularité' },
        { id: 'dateOption', value: 'date', text: 'Date' },
        { id: 'titreOption', value: 'titre', text: 'Titre' }
    ];

    /**
     * Fonction pour réorganiser les options de tri
     * @param {string} selectedValue - La valeur de l'option sélectionnée pour le tri
     */
    function rearrangeOptions(selectedValue) {
        const selectedOption = options.find(option => option.value === selectedValue); // Trouve l'option sélectionnée
        dropdownButton.querySelector('span').textContent = selectedOption.text; // Met à jour le texte du bouton
        dropdownButton.setAttribute("aria-label", `Menu de tri, option actuelle : ${selectedOption.text}`); // Met à jour l'étiquette ARIA du bouton

        dropdownContent.innerHTML = ''; // Vide le contenu du menu déroulant

        options.forEach(option => {
            if (option.value !== selectedValue) {
                const button = document.createElement("button"); // Crée un bouton pour chaque option de tri
                button.type = "button"; // Définit le type du bouton
                button.role = "option"; // Définit le rôle ARIA pour l'accessibilité
                button.id = option.id; // Définit un ID pour le bouton
                button.setAttribute("aria-selected", "false"); // Ajoute un attribut ARIA pour l'accessibilité
                button.setAttribute("data-value", option.value); // Ajoute une valeur de donnée pour le tri
                button.setAttribute("aria-label", `Tri par ${option.text.toLowerCase()}`); // Ajoute une étiquette ARIA pour l'accessibilité
                button.className = "dropdown-item"; // Ajoute une classe CSS pour le style
                button.textContent = option.text; // Définit le texte du bouton
                dropdownContent.appendChild(button); // Ajoute le bouton au contenu du menu

                /**
                 * Gestionnaire d'événement pour le clic sur une option de tri
                 * @param {Event} event - L'événement de clic
                 */
                button.addEventListener("click", () => { // Ajoute un gestionnaire d'événement pour le clic sur le bouton
                    rearrangeOptions(option.value); // Met à jour les options de tri sélectionnées

                    // Tri des médias
                    const sortedMedias = [...originalMedias]; // Crée une copie des médias originaux
                    if (option.value === "popularite") {
                        sortedMedias.sort((a, b) => b.likes - a.likes); // Trie les médias par popularité
                    } else if (option.value === "date") {
                        sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trie les médias par date
                    } else if (option.value === "titre") {
                        sortedMedias.sort((a, b) => a.title.localeCompare(b.title)); // Trie les médias par titre
                    }

                    // Réinitialiser la galerie avec les médias triés
                    const gallerySection = document.querySelector('.gallery_section'); // Sélectionne la section de la galerie
                    gallerySection.innerHTML = ''; // Vide le contenu de la galerie
                    sortedMedias.forEach(mediaData => { // Affiche les médias triés
                        try {
                            const media = MediaFactory.createMedia(mediaData, photographerName); // Crée un média avec MediaFactory
                            media.display(); // Affiche le média
                            
                        } catch (error) {
                            console.error('Erreur lors de la création et de l\'affichage du média :', error); // Affiche les erreurs éventuelles
                        }
                    });

                    // Réinitialiser la lightbox
                    initializeLightbox(); // Initialise la lightbox pour les nouveaux médias
                });
            }
        });

        dropdownButton.setAttribute("aria-expanded", "false"); // Réduit le menu déroulant
        dropdown.classList.remove("show"); // Retire la classe qui affiche le menu
        icon.style.transform = 'rotate(0deg)'; // Réinitialise la rotation de l'icône
    }

    // Gestionnaire d'événement pour le clic sur le bouton du menu déroulant
    dropdownButton.addEventListener("click", () => { // Ajoute un gestionnaire d'événement pour le clic sur le bouton du menu déroulant
        const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true"; // Vérifie si le menu est déjà ouvert
        dropdownButton.setAttribute("aria-expanded", !isExpanded); // Alterne l'état d'expansion du menu
        dropdown.classList.toggle("show"); // Alterne la classe pour afficher ou masquer le menu
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)'; // Alterne la rotation de l'icône
    });

    rearrangeOptions('popularite'); // Initialise le menu avec l'option de tri par popularité
}

/**
 * Fonction pour afficher le prix par jour
 * @param {number} price - Le prix par jour du photographe
 * @param {number} totalLikes - Le nombre total de likes
 */
function displayDailyPrice(price, totalLikes) {
    const insertSection = document.querySelector('.photographer_insert'); // Sélectionne la section où afficher le prix
    if (!insertSection) {
        console.error("La div .photographer_insert n'existe pas dans le DOM."); // Affiche une erreur si la div n'existe pas
        return;
    }

    insertSection.innerHTML = ''; // Vide le contenu de la section

    // Créer une nouvelle div pour les likes et l'icône de cœur
    const likesContainer = document.createElement('div'); // Crée un conteneur pour les likes
    likesContainer.classList.add('likes_insert_container'); // Ajoute une classe CSS pour le style

    const likesElement = document.createElement('div'); // Crée un élément div pour le nombre de likes
    likesElement.classList.add('total-likes'); // Ajoute une classe CSS pour le style
    likesElement.textContent = `${totalLikes}`; // Définit le texte avec le nombre total de likes
    likesElement.id = 'totalLikes'; // Ajoute un ID pour faciliter la mise à jour

    const heartIcon = document.createElement('i'); // Crée un élément i pour l'icône de cœur
    heartIcon.classList.add('fa-solid', 'fa-heart'); // Ajoute les classes CSS pour l'icône
    heartIcon.style.color = 'black'; // Définit la couleur de l'icône
    heartIcon.setAttribute('aria-hidden', 'true'); // Ajoute un attribut ARIA pour cacher l'icône des lecteurs d'écran

    // Ajouter les éléments likes et icône dans la nouvelle div
    likesContainer.appendChild(likesElement); // Ajoute le nombre de likes au conteneur
    likesContainer.appendChild(heartIcon); // Ajoute l'icône au conteneur

    const priceElement = document.createElement('div'); // Crée un élément div pour le prix
    priceElement.classList.add('daily-price'); // Ajoute une classe CSS pour le style
    priceElement.textContent = `${price}€ / jour`; // Définit le texte avec le prix par jour

    insertSection.appendChild(likesContainer); // Ajoute le conteneur des likes à la section
    insertSection.appendChild(priceElement); // Ajoute le prix à la section

    // Ajouter l'attribut tabindex
    insertSection.setAttribute('tabindex', '0'); // Ajoute un attribut tabindex pour permettre la navigation au clavier
    // Ajouter l'attribut aria-label pour décrire la fonction de l'encart
    insertSection.setAttribute('aria-label', 'Prix par jour du photographe'); // Ajoute une étiquette ARIA pour l'accessibilité
}

// Fonction principale pour afficher le corps de la page photographe 
async function displayPhotographerPage() {
    try {
        // Obtenir l'ID du photographe depuis l'URL
        const photographerId = getPhotographerIdFromURL(); // Récupère l'ID du photographe depuis l'URL
        if (!photographerId) {
            console.error("Aucun ID de photographe spécifié dans l'URL."); // Affiche une erreur si l'ID n'est pas spécifié
            return;
        }

        // Récupérer les données
        const data = await getData(); // Récupère les données des photographes et des médias
        const medias = data.media; // Récupère les médias
        const photographers = data.photographers; // Récupère les photographes
        const photographer = photographers.find(p => p.id === photographerId); // Trouve le photographe correspondant à l'ID
        
        if (!photographer) {
            console.error("Photographe non trouvé."); // Affiche une erreur si le photographe n'est pas trouvé
            return;
        }
        
        const photographerName = photographer.name; // Récupère le nom du photographe

        // Sélectionner la section de la galerie
        const gallerySection = document.querySelector('.gallery_section'); // Sélectionne la section de la galerie
        if (!gallerySection) {
            console.error("La div .gallery_section n'existe pas dans le DOM."); // Affiche une erreur si la div n'existe pas
            return;
        }
        gallerySection.innerHTML = ''; // Vide le contenu de la galerie

        // Filtrer les médias du photographe et calculer le nombre total de likes
        const photographerMedias = medias.filter(media => media.photographerId === photographerId); // Filtre les médias pour le photographe
        const originalPhotographerMedias = [...photographerMedias]; // Crée une copie des médias originaux

        let totalLikes = 0; // Initialise le compteur de likes
        photographerMedias.forEach(mediaData => {
            totalLikes += mediaData.likes; // Additionne les likes
            try {
                const media = MediaFactory.createMedia(mediaData, photographerName); // Crée un média avec MediaFactory
                media.display(); // Affiche le média
            } catch (error) {
                console.error('Erreur lors de la création et de l\'affichage du média :', error); // Affiche les erreurs éventuelles
            }
        });

        // Appelle createSortButton pour insérer le contenu de tri
        createSortButton(originalPhotographerMedias, photographerName); // Crée le bouton de tri avec les médias du photographe
        
        // ENCART
        displayDailyPrice(photographer.price, totalLikes); // Affiche le prix par jour et le total des likes

        // Réinitialise la lightbox
        initializeLightbox(); // Initialise la lightbox pour les nouveaux médias
    } catch (error) {
        console.error('Une erreur est survenue :', error); // Affiche les erreurs éventuelles
    }
}

// Appeler la fonction principale pour gérer l'affichage de la page du photographe
document.addEventListener('DOMContentLoaded', displayPhotographerPage); // Ajoute un gestionnaire d'événement pour appeler displayPhotographerPage lorsque le DOM est chargé
