// Import de la Factory pour les médias
import { MediaFactory } from '../patterns/mediaFactory.js';

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

// Fonction pour gérer le tri des médias
function sortButtonDOM(originalMedias, photographerName) {
    const selectContainer = document.querySelector(".sort_button");
    if (!selectContainer) {
        console.error("La div .sort_button n'existe pas dans le DOM.");
        return;
    }

    // Fonction pour créer les options
    function createOption(value, text, isSelected = false) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        option.setAttribute("role", "option");
        if (isSelected) option.setAttribute("selected", "selected");
        return option;
    }

    // Nettoyer le contenu existant
    selectContainer.innerHTML = "";

    // Créer et ajouter le label
    const label = document.createElement("label");
    label.setAttribute("for", "filter");
    label.textContent = "Trier par";
    selectContainer.appendChild(label);

    // Créer le select
    const photographerSelect = document.createElement("select");
    photographerSelect.classList.add("photographer_select");
    photographerSelect.name = "filter";
    photographerSelect.id = "filter";
    photographerSelect.setAttribute("aria-label", "listbox");
    
    // Ajouter les options
    photographerSelect.appendChild(createOption("popularite", "Popularité", true));
    photographerSelect.appendChild(createOption("date", "Date"));
    photographerSelect.appendChild(createOption("titre", "Titre"));

    selectContainer.appendChild(photographerSelect);

    // Gestion du tri
    photographerSelect.addEventListener("change", (event) => {
        const sortedMedias = [...originalMedias];
        const value = event.target.value;

        if (value === "popularite") {
            sortedMedias.sort((a, b) => b.likes - a.likes);
        } else if (value === "date") {
            sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (value === "titre") {
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
        const photographerId = getPhotographerIdFromURL();
        if (!photographerId) {
            console.error("Aucun ID de photographe spécifié dans l'URL.");
            return;
        }

        const data = await getData();
        const medias = data.media;
        const photographers = data.photographers;
        const photographer = photographers.find(p => p.id === photographerId);
        
        if (!photographer) {
            console.error("Photographe non trouvé.");
            return;
        }
        
        const photographerName = photographer.name;

        const gallerySection = document.querySelector('.gallery_section');
        if (!gallerySection) {
            console.error("La div .gallery_section n'existe pas dans le DOM.");
            return;
        }
        gallerySection.innerHTML = '';

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

        // Appelle sortButtonDOM et passe les médias et le nom du photographe
        sortButtonDOM(originalPhotographerMedias, photographerName);
        
        // ENCART
        displayDailyPrice(photographer.price, totalLikes);

    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Appeler la fonction principale pour gérer l'affichage de la page du photographe
document.addEventListener('DOMContentLoaded', displayPhotographerPage);
