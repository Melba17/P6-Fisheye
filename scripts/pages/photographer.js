import { getPhotographers } from './index.js';
import '../patterns/FactoryGallery.js'; // Importer le script qui gère la galerie avec le Constructor Pattern


// Appel à getPhotographers() pour récupérer les données des travaux des photographes
getPhotographers().then(photographers => {
    const gallerySection = document.querySelector('.gallery_section');

    photographers.forEach(photographer => {
        photographer.media.forEach(mediaData => {
            try {
                const media = new MediaFactory(mediaData); // Utilisation de MediaFactory pour créer l'objet média
                // Création de l'élément média
                const mediaElement = document.createElement('div');
                mediaElement.classList.add('media-item');

                // Ajout de l'image ou de la vidéo avec le titre en dessous
                if (media instanceof Image) {
                    mediaElement.innerHTML = `
                        <img src="${media.url}" alt="${media.title}">
                        <div class="media-title">${media.title}</div>
                    `;
                } else if (media instanceof Video) {
                    mediaElement.innerHTML = `
                        <video src="${media.url}" controls></video>
                        <div class="media-title">${media.title}</div>
                    `;
                }

                // Ajout de l'élément média à la galerie
                gallerySection.appendChild(mediaElement);
            } catch (error) {
                console.error('Erreur lors de la création de l\'objet média :', error);
            }
        });
    });
}).catch(error => {
    console.error('Erreur lors de la récupération des photographes :', error);
});