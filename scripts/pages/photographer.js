/////////////////////////// PAGE PHOTOGRAPHE /////////////////////////////////////////////////////////
import { MediaFactory } from '../patterns/mediaFactory.js'; // Importation de la classe MediaFactory pour la création des objets média
import { ReinitializeLightbox } from '../patterns/lightbox.js'; // Importation de la classe Lightbox pour gérer l'affichage des images ou vidéos en mode lightbox

// Fonction pour récupérer toutes les données des photographes et des médias dans le fichier JSON = tout le fichier //
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
        // Désérialisation des données JSON pour pouvoir être affichées par le navigateur/DOM
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
    const urlParams = new URLSearchParams(window.location.search); // Crée un objet URLSearchParams pour analyser les paramètres de l'URL / "window.location.search" = propriété qui renvoie la partie de l'URL actuelle qui suit le caractère "?" (en fin d'URL)
    const id = urlParams.get('id'); // Récupère/extrait la valeur du paramètre 'id' provenant de l'URL sous forme de chaîne de caractères
    return id ? parseInt(id) : null; // Retourne l'ID convertit sous forme de nombre ou null si l'ID n'existe pas
}


//////////////////////////////////////// BOUTON DE TRI //////////////////////////////////////////////////////
/**
 * Fonction pour créer et insérer dynamiquement le bouton de tri
 * @param {Array} medias - La liste des médias du photographe
 * @param {string} photographerName - Le nom du photographe
 */
function createSortButton(medias, photographerName) {
    const sortButtonDiv = document.querySelector('.sort_button'); // Récupère la div contenant le bouton de tri
    if (!sortButtonDiv) {
        console.error("La div .sort_button n'existe pas dans le DOM."); // Affiche une erreur si la div n'existe pas
        return;
    }

    // Créer le texte "Trier par"
    const textSpan = document.createElement('span'); // Crée un élément span pour le texte
    textSpan.textContent = 'Trier par'; // Définit le texte du span
    sortButtonDiv.appendChild(textSpan); // Ajoute le span à la div du bouton de tri

    ///////////// SQUELETTE DU BOUTON DE TRI ////////////////
    // Créer le conteneur pour le menu déroulant
    const dropdown = document.createElement('div'); // Crée un conteneur div pour le menu déroulant
    dropdown.className = 'dropdown'; // Ajoute une classe CSS pour le style

    // Créer le bouton du menu déroulant
    const dropdownButton = document.createElement('button'); // Crée un bouton pour le menu déroulant
    dropdownButton.type = 'button'; // Définit le type du bouton
    dropdownButton.id = 'orderByButton'; // Définit un ID unique pour référencer le bouton (sert au aria-labelledby plus bas)
    dropdownButton.setAttribute('aria-haspopup', 'listbox'); // L'attribut ARIA indique que le bouton déclenche l'affichage d'un menu. Ici, 'listbox' signifie que le menu déroulant qui sera affiché est une liste d'options. Cet attribut aide les technologies d'assistance, comme les lecteurs d'écran, à comprendre la relation entre le bouton et le menu déroulant.
    dropdownButton.setAttribute('aria-expanded', 'false'); //  Définit l'état d'expansion du menu. 'false' indique que le menu est actuellement replié. Lorsque le menu sera ouvert, cet attribut sera mis à jour pour refléter l'état 'true'. Cela permet aux utilisateurs de technologies d'assistance de savoir si le menu est actuellement ouvert ou fermé.
    dropdownButton.setAttribute('aria-label', 'Menu de tri'); // Ajoute une étiquette ARIA qui décrit la fonction du bouton. 'Menu de tri' est une description accessible qui aide les utilisateurs de technologies d'assistance à comprendre la fonctionnalité du bouton = offre une meilleure accessibilité. 

    // Ajouter le texte à l'intérieur du bouton
    const buttonTextSpan = document.createElement('span'); // Crée un span pour le texte du bouton
    buttonTextSpan.textContent = 'Popularité'; // Définit le texte par défaut du span
    dropdownButton.appendChild(buttonTextSpan); // Ajoute le texte au bouton

    // Ajouter l'icône de la flèche
    const icon = document.createElement('i'); // Crée un élément i pour l'icône
    icon.className = 'fa-solid fa-angle-down dropdown-icon'; // Ajoute les classes CSS pour l'icône de flèche
    dropdownButton.appendChild(icon); // Ajoute l'icône au bouton

    // Ajouter l'ensemble bouton au conteneur dropdown
    dropdown.appendChild(dropdownButton); 

    /////// Créer le contenu/l'intérieur du menu déroulant ///////////
    const dropdownContent = document.createElement('div'); // Crée un conteneur pour le contenu du menu/des options
    dropdownContent.className = 'dropdown-content'; // Ajoute une classe CSS pour le style
    dropdownContent.setAttribute('role', 'listbox'); // définit le rôle de l'élément, c'est à dire le comportement attendu, dans l'interface utilisateur / Définit le rôle de l'élément lui-même
    dropdownContent.setAttribute('aria-labelledby', 'orderByButton'); // L'attribut aria-labelledby est utilisé pour lier un élément à un ou plusieurs autres éléments qui fournissent une description ou un label pour cet élément. Ici, pointe vers l'id de dropdownButton et en prend la valeur 

    // Ajouter le contenu au conteneur dropdown
    dropdown.appendChild(dropdownContent); 
    // Ajouter le conteneur dropdown au conteneur principal/bouton de tri
    sortButtonDiv.appendChild(dropdown); 

    // Appelle/initialise sortButtonDOM avec les données réelles
    sortButtonDOM(medias, photographerName); 
}


/**
 * Fonction pour déterminer et gérer les options de tri dans le menu déroulant
 * @param {Array} originalPhotographerMedias - La liste des médias d'origine
 * @param {string} photographerName - Le nom du photographe
 */
// Les 2 paramètres proviennent de la fonction displayPhotographerPage plus bas
function sortButtonDOM(originalPhotographerMedias, photographerName) {
    /// les 4 variables suivantes récupèrent l'ensemble du bouton de tri ///
    const dropdown = document.querySelector(".dropdown"); // Sélectionne le conteneur du menu déroulant créé plus haut
    const dropdownButton = document.getElementById("orderByButton"); // Sélectionne le bouton du menu déroulant
    const dropdownContent = dropdown.querySelector(".dropdown-content"); // Sélectionne le contenu du menu déroulant
    const icon = dropdownButton.querySelector(".dropdown-icon"); // Sélectionne l'icône du bouton

    // Constante nommée "options" qui est un tableau d'objets. Chaque objet représente une option de tri dans le menu déroulant. "id" : utilisé pour identifier chaque bouton dans le menu déroulant, ce qui facilite la sélection et le traitement de l'option choisie / "valeur" : détermine le critère de tri lorsque l'utilisateur sélectionne cette option / "text" : Texte affiché pour l'option dans le menu déroulant.
    const options = [ 
        { id: 'populariteOption', value: 'popularite', text: 'Popularité' },
        { id: 'dateOption', value: 'date', text: 'Date' },
        { id: 'titreOption', value: 'titre', text: 'Titre' }
    ];

    /**
     * Fonction pour réorganiser les options de tri
     * @param {string} selectedValue - La valeur de l'option sélectionnée pour le tri
     */
    function rearrangeOptions(selectedValue) {
        // Trouve l'option sélectionnée dans la liste des options en utilisant la valeur sélectionnée
        const selectedOption = options.find(option => option.value === selectedValue);
        // Met à jour le texte affiché sur le bouton du menu déroulant avec le texte de l'option sélectionnée
        dropdownButton.querySelector('span').textContent = selectedOption.text;
        // Met à jour l'étiquette ARIA du bouton pour refléter l'option actuellement sélectionnée
        dropdownButton.setAttribute("aria-label", `Menu de tri, option actuelle : ${selectedOption.text}`);
        // Vide le contenu actuel du menu déroulant pour le mettre à jour avec les nouvelles options = affichage dynamique
        dropdownContent.innerHTML = '';
        
        //////////////// CE QUI SE PASSE DANS LA GALERIE ET LE BOUTON DE TRI QUAND UNE OPTION EST SELECTIONNEE /////////////
        // Crée les boutons pour chaque option restante, c'est-à-dire celles qui ne sont pas actuellement sélectionnées
        options.forEach(option => {
            if (option.value !== selectedValue) {
                // Crée un nouveau bouton pour l'option
                const button = document.createElement("button");
                // Définit le type du bouton 
                button.type = "button";
                // Définit le rôle ARIA pour indiquer que ce bouton est une option dans une liste au lecteur d'écran
                button.role = "option";
                // Assigne l'attribut ID au bouton basé sur l'id de l'option (définit plus haut). Il peut être utilisé pour sélectionner, manipuler ou référencer cet élément spécifique dans le DOM.
                button.id = option.id;
                // Définit l'attribut ARIA "aria-selected" à "false" pour indiquer que ce bouton n'est pas sélectionné
                button.setAttribute("aria-selected", "false");
                // Ajoute un attribut de données personnalisé "data-value" avec la valeur de l'option pour stocker les informations associées à l’élément qu'on peut utiliser pour diverses logiques, comme ici l'action de filtrage, sans interférer avec les attributs standard HTML. Les infos stockées ne sont pas destinées à être affichées directement mais utilisées dans le script JS.
                
                button.setAttribute("data-value", option.value);
                // Définit l'attribut ARIA "aria-label" pour une meilleure accessibilité en fournissant une étiquette descriptive / toLowerCase() normalise le format de l'aria en convertissant tout en minuscules, ce qui peut éviter des incohérences dans la façon dont elles sont interprétées par les lecteurs d'écran. 
                button.setAttribute("aria-label", `Tri par ${option.text.toLowerCase()}`);
                // Ajoute une classe CSS pour styliser le bouton dans le menu déroulant
                button.className = "dropdown-item";
                // Définit le texte du bouton comme le texte de l'option
                button.textContent = option.text;
                // Ajoute le bouton au contenu du menu déroulant
                dropdownContent.appendChild(button);
    
                // Ajoute un gestionnaire d'événement pour le clic sur le bouton
                button.addEventListener("click", () => {
                    // Appelle la fonction pour réorganiser les options restantes en fonction de la valeur du bouton cliqué/selectedValue
                    rearrangeOptions(option.value);
    
                    // Crée une copie de la copie des médias originaux (située dans la function displayPhotographerPage plus bas) à chaque fois qu'on choisit une option. La méthode sort() est destructive car elle réorganise les éléments du tableau d'origine en place. On manipule donc la copie créée lors du triage mais pas la copie initiale de sauvegarde de la liste/tableau d'origine.
                    const sortedMedias = [...originalPhotographerMedias];
                    // Trie les médias selon la valeur de l'option sélectionnée
                    if (option.value === "popularite") {
                        // Trie les médias par nombre de likes (popularité) en ordre décroissant. Si le résultat est positif (c'est à dire si il plus de likes), b sera trié/positionné avant a donc par ordre décroissant. Si le résultat est négatif, a sera trié/positionné avant b. Si le résultat est zéro, les positions de a et b resteront inchangées. Fonction de comparaison.
                        sortedMedias.sort((a, b) => b.likes - a.likes);
                    } else if (option.value === "date") {
                        // Trie les médias par date (les plus récents en premier donc décroissant là encore) / new Date() convertit les chaînes de caractères représentant des dates (b.date et a.date) en objets Date JS (donne un nombre en millisecondes qui est un mécanisme sous-jacent invisible, utilisé par JavaScript pour gérer et comparer les dates) pour permettre de les manipuler dans une opération
                        sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
                    } else if (option.value === "titre") {
                        // Trie les médias par titre en ordre alphabétique. localeCompare() est une méthode utilisée pour comparer deux chaînes de caractères. Elle aide à déterminer leur ordre relatif, ici dans l'ordre alphabétique.
                        sortedMedias.sort((a, b) => a.title.localeCompare(b.title));
                    }
    
                    // Sélectionne la section de la galerie pour mettre à jour son contenu
                    const gallerySection = document.querySelector('.gallery_section');
                    // Vide le contenu actuel de la section de la galerie
                    gallerySection.innerHTML = '';
                    // Affiche les médias triés dans la galerie à l'aide du Factory Pattern
                    sortedMedias.forEach(mediaData => {
                        try {
                            // Appel de la méthode "createMedia" de la classe MediaFactory pour créer un objet média à partir des données mediaData, photographerName et l'affiche / mediaData provient de "const photographerMedias" et photographerName de "const photographer" dans la fonction displayPhotographerPage() plus bas
                            const media = MediaFactory.createMedia(mediaData, photographerName);
                            media.display();
                        } catch (error) {
                            // Affiche les erreurs éventuelles lors de la création ou de l'affichage du média
                            console.error('Erreur lors de la création et de l\'affichage du média :', error);
                        }
                    });
    
                    // Réinitialise la lightbox pour prendre en compte les nouveaux médias affichés
                    ReinitializeLightbox();
                });
            }
        });
    
        // Ferme le menu déroulant et réinitialise l'icône 
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("show");
        icon.style.transform = 'rotate(0deg)';
    }
    
    // Gestionnaire d'événement pour le clic sur le bouton du menu déroulant
    dropdownButton.addEventListener("click", () => { // Ajoute un gestionnaire d'événement pour le clic sur le bouton du menu déroulant
        const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true"; // Vérifie si le menu est déjà ouvert...
        dropdownButton.setAttribute("aria-expanded", !isExpanded); // ... et indique maintenant que le menu doit être fermé avec !isExpanded 
        dropdown.classList.toggle("show"); // Alterne la classe pour afficher ou masquer le menu
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)'; // Alterne la rotation de l'icône / "0deg" correspond à l'icône vers le haut et 180deg à l'icône vers le bas
    });

    rearrangeOptions('popularite'); // La fonction de tri est active pour les sélections faites via le menu, mais elle ne se déclenche pas automatiquement au chargement initial de la page pour trier les médias. Donc lorsque la page est chargée, la galerie est affichée avec les médias dans leur ordre d'origine (JSON), et non triés par Popularité. 'popularite' étant juste la 1ère valeur par défaut.
}

//////////////////////////////////////////////// ENCART //////////////////////////////////////////////////////////////////
/**
 * Fonction pour afficher, dans l'encart du photographe, le prix par jour et le nombre total de Likes
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
    const likesContainer = document.createElement('div'); // Crée un conteneur global likes et coeur
    likesContainer.classList.add('likes_insert_container'); // Ajoute une classe CSS pour le style

    const likesElement = document.createElement('div'); // Crée un élément div pour le nombre de likes
    likesElement.classList.add('total-likes'); // Ajoute une classe CSS pour le style
    likesElement.textContent = `${totalLikes}`; // Affiche le texte avec le nombre total de likes (le calcul se fait plus bas)
    likesElement.id = 'totalLikes'; // Ajoute un ID pour faciliter la mise à jour

    const heartIcon = document.createElement('i'); // Crée un élément i pour l'icône de cœur à côté de la div "likes_insert_container"
    heartIcon.classList.add('fa-solid', 'fa-heart'); // Ajoute les classes CSS pour l'icône
    heartIcon.style.color = 'black'; // Définit la couleur de l'icône
    heartIcon.setAttribute('aria-hidden', 'true'); // Ajoute un attribut ARIA pour cacher l'icône des lecteurs d'écran

    // Ajouter les éléments likes et icône dans la nouvelle div
    likesContainer.appendChild(likesElement); // Ajoute le nombre de likes au conteneur
    likesContainer.appendChild(heartIcon); // Ajoute l'icône au conteneur


    const priceElement = document.createElement('div'); // Crée un élément div pour le prix
    priceElement.classList.add('daily-price'); // Ajoute une classe CSS pour le style
    priceElement.textContent = `${price}€ / jour`; // Définit le texte avec le prix par jour

    ////////////// Ajout de l'ensemble des éléments dans l'encart //////////////////////////////////////
    insertSection.appendChild(likesContainer); // Ajoute le conteneur des likes/icône à la section de l'encart
    insertSection.appendChild(priceElement); // Ajoute le prix à la section de l'encart

    // Ajouter l'attribut tabindex
    insertSection.setAttribute('tabindex', '0'); // Ajoute un attribut tabindex pour permettre la navigation au clavier
    // Ajouter l'attribut aria-label pour décrire la fonction de l'encart
    insertSection.setAttribute('aria-label', 'Affiche le nombre total de likes pour le travail du photographe et son prix par jour'); // Ajoute une étiquette ARIA pour l'accessibilité
}

/////////////////////// FONCTION PRINCIPALE POUR AFFICHER LE CORPS DE LA PAGE PHOTOGRAPHE ///////////////////////////////////////////

export async function displayPhotographerPage() {
    try {
        // Obtenir l'ID du photographe depuis l'URL
        const photographerId = getPhotographerIdFromURL(); // Récupère l'ID du photographe depuis l'URL
        if (!photographerId) {
            // Utilisation de throw new Error pour les erreurs, permettant au bloc catch (en bas) de capturer et gérer ces erreurs de manière centralisée.
            throw new Error("Aucun ID de photographe spécifié dans l'URL.");
        }

        // Récupérer les données
        const data = await getData(); // On appelle la fonction getData()...
        const medias = data.media; // ... pour récupèrer spécifiquement les médias du fichier JSON...
        const photographers = data.photographers; // ... et aussi récupèrer spécifiquement les photographes du fichier JSON
        const photographer = photographers.find(p => p.id === photographerId); // Trouve le photographe correspondant à l'id / p.id = données JSON, provient indirectement de la fonction getData() et photographerId = est récupéré par la fonction getPhotographerIdFromURL()
        
        if (!photographer) {
            throw new Error("Photographe non trouvé.");
        }
        
        const photographerName = photographer.name; // Récupère le nom du photographe

        // Sélectionner la section de la galerie
        const gallerySection = document.querySelector('.gallery_section'); // Sélectionne la section de la galerie
        if (!gallerySection) {
            throw new Error("La div .gallery_section n'existe pas dans le DOM.");
        }
        gallerySection.innerHTML = ''; // Vide le contenu de la galerie ou on part d'une galerie vide

        // Filtre les médias du photographe en question grâce à l'id...
        const photographerMedias = medias.filter(media => media.photographerId === photographerId); 

        const originalPhotographerMedias = [...photographerMedias]; // Crée une copie des médias originaux du photographe avant tout tri ou manipulation. En stockant cette copie initiale ça garantit que les données utilisées pour les tris ultérieurs sont toujours basées sur l'état initial des médias pour le photographe en question.
        
        let totalLikes = 0; // Initialise le compteur de totalLikes à 0
        
        photographerMedias.forEach(mediaData => {
            totalLikes += mediaData.likes; // Additionne les likes du média courant au total des likes accumulés "totalLikes" au moment ou la page du photographe en question est créée = calcul et stockage
            try {
                const media = MediaFactory.createMedia(mediaData, photographerName); // Crée un média avec MediaFactory... 
                media.display(); // et l'affiche 
            } catch (error) {
                console.error('Erreur lors de la création et de l\'affichage du média :', error); // Affiche les erreurs éventuelles
            }
        });

        // Crée le bouton de tri avec les médias du photographe
        createSortButton(originalPhotographerMedias, photographerName); 
        
        // ENCART
        displayDailyPrice(photographer.price, totalLikes); // Affiche le prix par jour et le total des likes

        // Initialise ou réinitialise la lightbox
        ReinitializeLightbox(); 
    } catch (error) {
        console.error('Une erreur est survenue :', error); // Centralise et affiche les erreurs éventuelles de throw new Error
    }
}

