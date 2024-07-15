////////////////////// PAGE INDIVIDUELLE PHOTOGRAPHE ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

////// GALERIE/MEDIAS //////

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
    return parseInt(urlParams.get('id'));
}

// Fonction principale pour gérer l'affichage des médias et du prix par jour
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
        photographerMedias.forEach(mediaData => {
            try {
                const media = MediaFactory.createMedia(mediaData, photographerName);
                media.display();
            } catch (error) {
                console.error('Erreur lors de la création et de l\'affichage du média :', error);
            }
        });

        displayDailyPrice(photographer.price);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Fonction pour afficher le prix par jour
function displayDailyPrice(price) {
    const insertSection = document.querySelector('.photograph-insert');
    if (!insertSection) {
        console.error("La div .photograph-insert n'existe pas dans le DOM.");
        return;
    }

    const priceElement = document.createElement('div');
    priceElement.classList.add('daily-price');
    priceElement.textContent = `${price}€ / jour`;

    insertSection.appendChild(priceElement);

    // Ajouter l'attribut tabindex
    insertSection.setAttribute('tabindex', '0');
    // Ajouter l'attribut aria-label pour décrire la fonction de l'encart
    insertSection.setAttribute('aria-label', 'Prix par jour du photographe');
}

// Appeler la fonction principale pour gérer l'affichage de la page du photographe
document.addEventListener('DOMContentLoaded', displayPhotographerPage);
