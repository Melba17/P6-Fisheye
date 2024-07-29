// Import de la Factory pour les médias
import { MediaFactory } from '../patterns/mediaFactory.js';
import { Lightbox } from '../utils/lightbox.js';

// Fonction pour récupérer les données des photographes et des médias
async function getData() {
    try {
        const response = await fetch("../../data/photographers.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Données récupérées :', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return { media: [], photographers: [] };
    }
}

// Fonction pour obtenir le paramètre d'URL contenant l'ID du photographe
function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Fonction pour créer et insérer dynamiquement le bouton de tri
function createSortButton(medias, photographerName) {
    const sortButtonDiv = document.querySelector('.sort_button');
    if (!sortButtonDiv) {
        console.error("La div .sort_button n'existe pas dans le DOM.");
        return;
    }

    // Créer le texte "Trier par"
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Trier par';
    sortButtonDiv.appendChild(textSpan);

    // Créer le conteneur pour le menu déroulant
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    // Créer le bouton du menu déroulant
    const dropdownButton = document.createElement('button');
    dropdownButton.type = 'button';
    dropdownButton.id = 'orderByButton';
    dropdownButton.setAttribute('aria-haspopup', 'listbox');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.setAttribute('aria-label', 'Menu de tri');

    // Ajouter le texte au bouton
    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.textContent = 'Popularité';
    dropdownButton.appendChild(buttonTextSpan);

    // Ajouter l'icône de la flèche
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-angle-down dropdown-icon';
    dropdownButton.appendChild(icon);

    // Ajouter le bouton au conteneur dropdown
    dropdown.appendChild(dropdownButton);

    // Créer le contenu du menu déroulant
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    dropdownContent.setAttribute('role', 'listbox');
    dropdownContent.setAttribute('aria-labelledby', 'orderByButton');

    // Ajouter le contenu au conteneur dropdown
    dropdown.appendChild(dropdownContent);

    // Ajouter le conteneur dropdown au conteneur principal
    sortButtonDiv.appendChild(dropdown);

    // Appeler sortButtonDOM avec les données réelles
    sortButtonDOM(medias, photographerName);
}

// Ajoutez ou modifiez la fonction sortButtonDOM
function sortButtonDOM(originalMedias, photographerName) {
    const dropdown = document.querySelector(".dropdown");
    const dropdownButton = document.getElementById("orderByButton");
    const dropdownContent = dropdown.querySelector(".dropdown-content");
    const icon = dropdownButton.querySelector(".dropdown-icon");

    const options = [
        { id: 'populariteOption', value: 'popularite', text: 'Popularité' },
        { id: 'dateOption', value: 'date', text: 'Date' },
        { id: 'titreOption', value: 'titre', text: 'Titre' }
    ];

    function rearrangeOptions(selectedValue) {
        const selectedOption = options.find(option => option.value === selectedValue);
        dropdownButton.querySelector('span').textContent = selectedOption.text;
        dropdownButton.setAttribute("aria-label", `Menu de tri, option actuelle : ${selectedOption.text}`);

        dropdownContent.innerHTML = '';

        options.forEach(option => {
            if (option.value !== selectedValue) {
                const button = document.createElement("button");
                button.type = "button";
                button.role = "option";
                button.id = option.id;
                button.setAttribute("aria-selected", "false");
                button.setAttribute("data-value", option.value);
                button.setAttribute("aria-label", `Tri par ${option.text.toLowerCase()}`);
                button.className = "dropdown-item";
                button.textContent = option.text;
                dropdownContent.appendChild(button);

                button.addEventListener("click", () => {
                    rearrangeOptions(option.value);

                    const sortedMedias = [...originalMedias];
                    if (option.value === "popularite") {
                        sortedMedias.sort((a, b) => b.likes - a.likes);
                    } else if (option.value === "date") {
                        sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
                    } else if (option.value === "titre") {
                        sortedMedias.sort((a, b) => a.title.localeCompare(b.title));
                    }

                    const gallerySection = document.querySelector('.gallery_section');
                    gallerySection.innerHTML = '';
                    sortedMedias.forEach(mediaData => {
                        const media = MediaFactory.createMedia(mediaData, photographerName);
                        media.display();
                    });

                    
                });
            }
        });

        dropdownButton.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("show");
        icon.style.transform = 'rotate(0deg)';
    }

    dropdownButton.addEventListener("click", () => {
        const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true";
        dropdownButton.setAttribute("aria-expanded", !isExpanded);
        dropdown.classList.toggle("show");
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    rearrangeOptions('popularite');
}

// Fonction pour afficher le prix par jour
function displayDailyPrice(price, totalLikes) {
    const insertSection = document.querySelector('.photographer_insert');
    if (!insertSection) {
        console.error("La div .photographer_insert n'existe pas dans le DOM.");
        return;
    }

    insertSection.innerHTML = '';

    // Créer une nouvelle div pour les likes et l'icône de cœur
    const likesContainer = document.createElement('div');
    likesContainer.classList.add('likes_insert_container'); // Ajouter une classe pour le style

    const likesElement = document.createElement('div');
    likesElement.classList.add('total-likes');
    likesElement.textContent = `${totalLikes}`;
    likesElement.id = 'totalLikes'; // Ajout d'un id pour faciliter la mise à jour

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fa-solid', 'fa-heart');
    heartIcon.style.color = 'black'; // Couleur principale de l'icône
    heartIcon.setAttribute('aria-hidden', 'true');

    // Ajouter les éléments likes et icône dans la nouvelle div
    likesContainer.appendChild(likesElement);
    likesContainer.appendChild(heartIcon);

    const priceElement = document.createElement('div');
    priceElement.classList.add('daily-price');
    priceElement.textContent = `${price}€ / jour`;

    insertSection.appendChild(likesContainer); // Ajouter la nouvelle div à la section
    insertSection.appendChild(priceElement);

    // Ajouter l'attribut tabindex
    insertSection.setAttribute('tabindex', '0');
    // Ajouter l'attribut aria-label pour décrire la fonction de l'encart
    insertSection.setAttribute('aria-label', 'Prix par jour du photographe');
}

// Fonction principale pour afficher le corps de la page photographe
async function displayPhotographerPage() {
    try {
        // Obtenir l'ID du photographe depuis l'URL
        const photographerId = getPhotographerIdFromURL();
        if (!photographerId) {
            console.error("Aucun ID de photographe spécifié dans l'URL.");
            return;
        }

        // Récupérer les données
        const data = await getData();
        const medias = data.media;
        const photographers = data.photographers;
        const photographer = photographers.find(p => p.id === photographerId);
        
        if (!photographer) {
            console.error("Photographe non trouvé.");
            return;
        }
        
        const photographerName = photographer.name;

        // Sélectionner la section de la galerie
        const gallerySection = document.querySelector('.gallery_section');
        if (!gallerySection) {
            console.error("La div .gallery_section n'existe pas dans le DOM.");
            return;
        }
        gallerySection.innerHTML = '';

        // Filtrer les médias du photographe et calculer le nombre total de likes
        const photographerMedias = medias.filter(media => media.photographerId === photographerId);
        const originalPhotographerMedias = [...photographerMedias]; // Copie des médias originaux

        let totalLikes = 0;
        photographerMedias.forEach(mediaData => {
            totalLikes += mediaData.likes;
            try {
                // INSTANCIATION
                const media = MediaFactory.createMedia(mediaData, photographerName);
                media.display();
            } catch (error) {
                console.error('Erreur lors de la création et de l\'affichage du média :', error);
            }
        });

        // Appeler createSortButton pour insérer le contenu de tri
        createSortButton(originalPhotographerMedias, photographerName);
        
        // ENCART
        displayDailyPrice(photographer.price, totalLikes);

        // Initialisation de la lightbox
        const photographerInsert = document.querySelector('.photographer_insert');
        if (!photographerInsert) {
            console.error("La div .photographer_insert n'existe pas dans le DOM.");
            return;
        }
        const lightbox = new Lightbox(photographerInsert);
        lightbox.init();

    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Appeler la fonction principale pour gérer l'affichage de la page du photographe
document.addEventListener('DOMContentLoaded', displayPhotographerPage);
