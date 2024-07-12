////// GALERIE/MEDIAS //////

import { MediaFactory } from '../patterns/mediaFactory.js';

// Fonction pour récupérer les médias et les photographes
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
        return { media: [], photographers: [] }; // Retourne des tableaux vides en cas d'erreur
    }
}

// Fonction pour afficher les médias d'un photographe
async function displayMediasForPhotographer(photographerId) {
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
            media.display(); // Appeler la méthode display spécifique au type de média
        } catch (error) {
            console.error('Erreur lors de la création et de l\'affichage du média :', error);
        }
    });
}

// Fonction pour obtenir le paramètre d'URL
function getPhotographerIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Appeler la fonction pour afficher les médias du photographe correspondant à l'ID dans l'URL
document.addEventListener('DOMContentLoaded', () => {
    const photographerId = getPhotographerIdFromURL();
    if (photographerId) {
        displayMediasForPhotographer(photographerId);
    } else {
        console.error("Aucun ID de photographe spécifié dans l'URL.");
    }
});
