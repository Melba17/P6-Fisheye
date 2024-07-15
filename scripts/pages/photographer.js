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
        const originalPhotographerMedias = [...photographerMedias]; // Copie des médias originaux

        photographerMedias.forEach(mediaData => {
            try {
                const media = MediaFactory.createMedia(mediaData, photographerName);
                media.display();
            } catch (error) {
                console.error('Erreur lors de la création et de l\'affichage du média :', error);
            }
        });

        displayDailyPrice(photographer.price);

        // Appeler sortButtonDOM et passer les médias et le nom du photographe
        sortButtonDOM(originalPhotographerMedias, photographerName);
    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

// Fonction pour afficher le prix par jour
function displayDailyPrice(price) {
    const insertSection = document.querySelector('.photographer_insert');
    if (!insertSection) {
        console.error("La div .photographer_insert n'existe pas dans le DOM.");
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

// Créer le select pour trier les médias
function sortButtonDOM(originalMedias, photographerName) {
    const select = document.querySelector(".sort_button");
    if (!select) {
        console.error("La div .sort_button n'existe pas dans le DOM.");
        return;
    }

    select.innerHTML = "";

    const label = document.createElement("label");
    label.setAttribute("for", "filter");
    label.innerHTML = "Trier par";
    select.appendChild(label);

    const photographerSelect = document.createElement("select");
    photographerSelect.classList.add("photographer_select");
    photographerSelect.setAttribute("name", "filter");
    photographerSelect.setAttribute("id", "filter");
    // Utilisation de aria-label
    photographerSelect.setAttribute("aria-label", "listbox"); 
    // Liaison avec l'élément label
    select.setAttribute("aria-labelledby", "order by"); 

    const option1 = document.createElement("option");
    option1.classList.add("select_option");
    option1.setAttribute("id", "popularite");
    // Option comme sélectionnée par défaut dans l'élément <select>
    option1.setAttribute("selected", "selected");
    option1.value = "popularite";
    option1.text = "Popularité";
    option1.setAttribute("role", "option");
    photographerSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.classList.add("select_option");
    option2.setAttribute("id", "date");
    option2.value = "date";
    option2.text = "Date";
    option2.setAttribute("role", "option");
    photographerSelect.appendChild(option2);

    const option3 = document.createElement("option");
    option3.classList.add("select_option");
    option3.setAttribute("id", "titre");
    option3.value = "titre";
    option3.text = "Titre";
    option3.setAttribute("role", "option");
    photographerSelect.appendChild(option3);

    select.appendChild(photographerSelect);

    photographerSelect.addEventListener("change", (event) => {
        let sortedMedias = [...originalMedias]; // Créer une nouvelle copie à chaque tri 

        if (event.target.value === "popularite") {
            sortedMedias.sort((a, b) => b.likes - a.likes);
        } else if (event.target.value === "date") {
            sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (event.target.value === "titre") {
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
