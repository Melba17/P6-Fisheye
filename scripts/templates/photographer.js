////////// SQUELETTE DES VIGNETTES PAGE ACCUEIL ///////////////
// La fonction photographerTemplate(data) retourne un objet contenant les informations du photographe ainsi que des méthodes pour créer des éléments DOM.
// Cela permet de créer des vignettes pour chaque photographe sur la page d'accueil et de générer des éléments spécifiques pour la page du photographe de manière modulaire.

export function photographerTemplate(data) {
    // Extraction des propriétés nécessaires du photographe à partir des données JSON
    const { id, name, portrait, city, country, tagline, price } = data;
    
    // Définition du chemin vers l'image du photographe dans le dossier assets
    const picture = `assets/photographers/Photographers ID Photos/${portrait}`;

    /// FONCTION POUR CRÉER LA VIGNETTE DE L'ACCUEIL ///
    function getUserCardDOM() {
        // Création de la balise <article> pour contenir la vignette du photographe
        const article = document.createElement('article');

        // Création du lien <a> qui entoure l'image et le titre du photographe
        const link = document.createElement('a');
        // Définition du lien vers la page du photographe en utilisant son ID
        link.setAttribute("href", `photographer.html?id=${id}`);
        // Rendre le lien focusable pour les utilisateurs utilisant la navigation au clavier
        link.setAttribute("tabindex", "0");
        // Ajouter un label ARIA pour améliorer l'accessibilité en décrivant le lien
        link.setAttribute("aria-label", `Lien vers la page du photographe ${name}`);

        // Création de l'image du photographe
        const img = document.createElement('img');
        // Définition de l'attribut src de l'image avec le chemin de l'image du photographe
        img.setAttribute("src", picture);
        // Définition de l'attribut alt de l'image avec le nom du photographe pour l'accessibilité
        img.setAttribute("alt", name);

        // Création du titre du photographe
        const h2 = document.createElement('h2');
        // Définition du texte du titre avec le nom du photographe
        h2.textContent = name;

        // Ajout de l'image et du titre dans le lien <a>
        link.appendChild(img);
        link.appendChild(h2);

        ///// AJOUT DES AUTRES INFORMATIONS DU PHOTOGRAPHE /////
        // Création de l'élément <h3> pour afficher la localisation
        const location = document.createElement('h3');
        // Définition du texte de la localisation avec la ville et le pays
        location.textContent = `${city}, ${country}`;
        
        // Création de l'élément <strong> pour afficher la tagline du photographe
        const p = document.createElement('strong');
        // Définition d'un ID unique pour l'élément <strong> en utilisant l'ID du photographe
        p.id = `photographer-tagline-${id}`;
        // Définition du texte de la tagline
        p.textContent = tagline;
        
        
        // Création de l'élément <span> pour afficher le prix par jour
        const span = document.createElement('span');
        // Définition du texte du prix
        span.textContent = `${price}€/jour`;

        // Ajout de tous les éléments créés à la balise <article>
        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(p);
        article.appendChild(span);

        // Affichage de l'article dans la console (utilisé pour le débogage)
        console.log(article); 
        // Retourne l'élément DOM <article> qui représente la vignette complète du photographe
        return article;
    }

    /////// FONCTION POUR LA BANNIÈRE DE PRÉSENTATION SUR LA PAGE DU PHOTOGRAPHE ////////
    function getSpecificElements() {
        // Création de l'élément <h2> pour le nom du photographe sur la page spécifique
        const h2 = document.createElement('h2');
        // Définition d'un ID unique pour l'élément <h2> en utilisant l'ID du photographe
        h2.id = `photographer-name-specific-${id}`;
        // Définition du texte du titre avec le nom du photographe
        h2.textContent = name;

        // Création de l'élément <h3> pour afficher la localisation sur la page spécifique
        const h3 = document.createElement('h3');
        // Définition du texte de la localisation avec la ville et le pays
        h3.textContent = `${city}, ${country}`;

        // Création de l'élément <strong> pour afficher la tagline sur la page spécifique
        const strong = document.createElement('strong');
        // Définition d'un ID unique pour l'élément <strong> en utilisant l'ID du photographe
        strong.id = `photographer-tagline-specific-${id}`;
        // Définition du texte de la tagline
        strong.textContent = tagline;

        // Création de l'image du photographe
        const img = document.createElement('img');
        // Définition de l'attribut src de l'image avec le chemin de l'image du photographe
        img.setAttribute("src", picture);
        // Définition de l'attribut alt de l'image avec le nom du photographe pour l'accessibilité
        img.setAttribute("alt", name);

        // Création d'un objet contenant tous les éléments spécifiques à la page du photographe
        const elements = { h2, h3, strong, img };
        // Affichage de l'objet dans la console (utilisé pour le débogage)
        console.log(elements);
        // Retourne l'objet contenant les éléments spécifiques à la page du photographe
        return elements;
    }

    // Création d'un objet résultat contenant les informations du photographe et les méthodes de création des éléments DOM
    const result = { name, picture, getUserCardDOM, getSpecificElements };
    // Affichage de l'objet résultat dans la console (utilisé pour le débogage)
    console.log(result);
    // Retourne l'objet résultat pour permettre l'accès aux informations et méthodes depuis d'autres parties du code
    return result;
}
