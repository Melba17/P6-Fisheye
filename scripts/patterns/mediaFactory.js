////////////////////  CREATIONAL DESIGN PATTERN => dédié à la création d'objets (fabrique) //////////////////
//////////////////////// FACTORY PATTERN POUR PAGE INDIV PHOTOGRAPHE ////////////////////////////////////////

// La classe Media définit les propriétés et les méthodes communes à tous les types de médias. Elle sert de modèle de base pour créer les objets médias, avec des propriétés comme title, photographerId, et photographerName, ainsi qu'une méthode de base display().
// "This", se réfère à l'objet en cours de création permettant d'initialiser ses propres propriétés et de définir ses propres méthodes.
class Media {
    /**
     * Constructeur de la classe Media.
     * @param {Object} data - Les données du média, comme le titre et l'identifiant du photographe.
     * @param {string} photographerName - Le nom complet (au départ) du photographe.
     */
    constructor(data, photographerName) {
        // Ex: Instruction "this.title = data.title;" qui demande à la propriété "title" de l'objet en cours de création avec "this" d'aller récupérer la donnée ("data") concernant le titre ("title") et de la prendre/garder en tant que valeur
        this.title = data.title;  // Récupère le titre du média (image ou vidéo).
        this.photographerId = data.photographerId; // Récupère l'id du photographe
        // photographerName est un paramètre passé au constructeur, contenant le nom complet du photographe sous forme de chaîne de caractères. split(' ')= méthode qui divise la chaîne photographerName en utilisant un espace comme délimiteur pour obtenir un tableau de mots (prénom, nom). [0] = sélectionne le premier mot du tableau
        this.photographerName = photographerName.split(' ')[0]; 
    }

    // Méthode de base pour afficher le média. Cette méthode doit être complétée dans les sous-classes spécifiques (ImageMedia et VideoMedia).
    display() {
        console.log('Méthode display non implémentée dans la classe de base Media.');
    }
}

/// "extends"= Héritage / Classe spécifique pour les médias images ///
class ImageMedia extends Media {
    /**
     * Constructeur de la classe ImageMedia.
     * @param {Object} data - Les données spécifiques à l'image, comme le chemin et les likes.
     * @param {string} photographerName - Le prénom du photographe.
     */
    constructor(data, photographerName) {
        super(data, photographerName); // Appel du constructeur de la classe de base "Media" - La méthode "super" permet de passer les 2 paramètres (id du photographe et son prénom) de la classe de base par héritage
          
        // Puis ajout d'autres fonctionnalités
        // "This", dans le constructeur, se réfère à l'objet en cours de création permettant d'initialiser ses propres propriétés et de définir ses propres méthodes.
        this.image = data.image; // Chemin de l'image.
        this.likes = data.likes ?? 0; // soit nombre de likes du fichier JSON soit valeur par défaut à 0.
        this.liked = false; // variable au départ à false qui prend déjà en compte le nombre de likes prééxistants issus du fichier JSON 
    }

    // Affiche l'image dans la section galerie. Crée les éléments HTML pour le média et les ajoute à la section galerie => redéfinition de la méthode display() pour une implémentation spécifique, ici, à l'affichage des images => donc personnalisation de la façon dont les médias sont présentés tout en utilisant le cadre de base défini dans "Media".
    display() {
        // Création d'un conteneur global pour le média.
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
    
        ////// Création de l'élément image ////////
        const mediaElement = document.createElement('img'); // balise <img>
        mediaElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.image}`); // indique le chemin vers la source/url du contenu à afficher immédiatement
        mediaElement.setAttribute('alt', this.title);  // Texte alternatif pour l'image.
        mediaElement.setAttribute('aria-label', this.title); // Label ARIA pour l'accessibilité / Ce texte est utilisé par les lecteurs d'écrans pour décrire l'élément à l'utilisateur. Rend le site web plus inclusive et accessible à un plus large éventail d'utilisateurs.
        mediaElement.setAttribute('data-src', `assets/photographers/${this.photographerName}/${this.image}`); // Stocke l'url que JavaScript peut utiliser ultérieurement pour des actions telles que le chargement différé des images ou la mise à jour de l'URL sans modifier directement le comportement par défaut du navigateur.
        mediaElement.setAttribute('data-type', 'image'); // Détermine le type de média et applique des traitements spécifiques en conséquence (par exemple, pour les filtres de recherche, la gestion des événements, etc.).
        mediaElement.setAttribute('data-title', this.title); // Cet attribut stocke le titre de l'image. JS pourra notamment l'utiliser pour l'afficher lors d'interactions dynamiques (ex: lightbox).
        mediaElement.setAttribute('tabindex', '0'); // Rend l'élément focusable via la touche Tab, et il sera inclus dans l'ordre de tabulation naturel du document HTML.
        
        // Ajout de l'image au conteneur.
        mediaContainer.appendChild(mediaElement);


        //////// Création d'un conteneur global pour le contenu sous l'image ////////
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper'); 

        // Création du conteneur pour le titre 
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        // Création de l'élément titre.
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);
    
        /////// Création du conteneur pour les likes - 2 éléments interne: nombre et icône ////////
        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');
        likesContainer.setAttribute('tabindex', '0'); // focusable dans le flux naturel du document HTML
        // Création de l'élément pour le nombre de likes.
        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.classList.add('likes-count');
        likesCount.style.color = '#901c1c'; // Couleur principale du nombtre des likes.
        // Création de l'icône de cœur pour les likes.
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'heart-icon');
        heartIcon.style.color = '#901c1c'; // Couleur principale de l'icône.
        heartIcon.setAttribute('aria-hidden', 'true'); // L'icône est cachée des lecteurs d'écran.
        // Ajoute le nombre de likes et l'icône de cœur au conteneur des likes.
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        
        // Ajoute le conteneur de contenu (titre + conteneur likes) au conteneur principal sous le média
        contentWrapper.appendChild(contentContainer);
        contentWrapper.appendChild(likesContainer);

        // Ajoute le conteneur principal (image + contenu sous le média) au conteneur global du média.
        mediaContainer.appendChild(contentWrapper);
    
        // Sélectionne la section galerie dans le document.
        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer); // Ajoute le conteneur global du média à la section galerie.


        // Fonction pour gérer le clic et la touche sur l'icône de cœur.
        const toggleLike = () => {
            const totalLikesElement = document.getElementById('totalLikes'); // On récupère le totalLikes de l'encart.
            let totalLikes = parseInt(totalLikesElement.textContent); // Nombre total de likes sous forme de chaîne de caractères au départ, qui est ensuite convertit en un nombre entier avec parseInt 

            // Si l'image n'est pas encore likée au moment du clic
            if (!this.liked) {
                this.likes++; // ... alors on incrémente les likes du média.
                totalLikes++; // ... et on incrémente le total des likes (encart).
                heartIcon.style.color = '#d3573c'; // Couleur lorsque l'icône est cliquée.
            } else {
                this.likes--; // Décrémente les likes du média.
                totalLikes--; // Décrémente le total des likes (encart).
                heartIcon.style.color = '#901c1c'; // Réinitialisation de la couleur de l'icône.
            }

            this.liked = !this.liked; // Inverse l'état de l'image (donc true ou false) - est à false par défaut au départ
            likesCount.textContent = this.likes; // Met à jour le nombre de likes affiché sous le média
            totalLikesElement.textContent = totalLikes; // Met à jour le total des likes affiché dans l'encart
        };
    
        // Ajoute un événement de clic avec la souris pour l'icône de cœur 
        likesContainer.addEventListener('click', toggleLike);
        
        // Ajoute un événement de clavier pour gérer les touches 'Enter' et ' '.
        likesContainer.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Empêche le défilement automatique de la page lors de l'appui sur la barre d'espace.
                toggleLike();
            }
        });
        
    }  
      
}

// Classe spécifique pour les médias vidéos
class VideoMedia extends Media {
    /**
     * Constructeur de la classe VideoMedia.
     * @param {Object} data - Les données spécifiques à la vidéo, comme le chemin et les likes.
     * @param {string} photographerName - Le nom complet du photographe.
     */
    constructor(data, photographerName) {
        super(data, photographerName); // Appel du constructeur de la classe de base Media par héritage
        this.video = data.video; // Chemin de la vidéo
        this.likes = data.likes ?? 0; // Soit Nombre de likes, soit valeur par défaut 0
        this.liked = false; // // variable au départ à false qui prend déjà en compte le nombre de likes prééxistants issus du fichier JSON 
    }
    // Affiche la vidéo dans la section galerie. Crée les éléments HTML pour le média et les ajoute à la section galerie.
    display() {
        // Création d'un conteneur pour le média.
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
    
        // Création de l'élément vidéo.
        const videoElement = document.createElement('video');
        videoElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.video}`);
        videoElement.setAttribute('alt', this.title); // Texte alternatif pour la vidéo.
        videoElement.setAttribute('aria-label', this.title); // Label ARIA pour l'accessibilité.
        videoElement.setAttribute('data-src', `assets/photographers/${this.photographerName}/${this.video}`);
        videoElement.setAttribute('data-type', 'video');
        videoElement.setAttribute('data-title', this.title);
        videoElement.setAttribute('tabindex', '0'); 
        // Ajout de la vidéo au conteneur.
        mediaContainer.appendChild(videoElement);

        //////// Création d'un conteneur global pour le contenu sous la vidéo ////////
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');
    
        // Création du conteneur pour le titre 
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        // Création de l'élément titre.
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);
        
        // Création du conteneur pour les likes et icône.
        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');
        likesContainer.setAttribute('tabindex', '0'); // Ajout de tabindex.
        // Création de l'élément pour le nombre de likes.
        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.classList.add('likes-count');
        likesCount.style.color = '#901c1c'; // Couleur principale des likes.
        // Création de l'icône de cœur pour les likes.
        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'heart-icon');
        heartIcon.style.color = '#901c1c'; // Couleur principale de l'icône.
        heartIcon.setAttribute('aria-hidden', 'true'); // L'icône est cachée des lecteurs d'écran.
        // Ajoute le nombre de likes et l'icône de cœur au conteneur des likes.
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);

        // Ajoute le conteneur de contenu (titre + conteneur likes) au conteneur principal sous le média
        contentWrapper.appendChild(contentContainer);
        contentWrapper.appendChild(likesContainer);

        // Ajoute le conteneur principal (vidéo + contenu sous le média) au conteneur global du média
        mediaContainer.appendChild(contentWrapper);
    
        // Récupère la section galerie dans le document HTML
        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer); // Ajoute la vidéo à la section galerie


        // Fonction pour gérer le clic et la touche sur l'icône de cœur.
        const toggleLike = () => {
            const totalLikesElement = document.getElementById('totalLikes'); // Élément affichant le total des likes dans l'encart
            let totalLikes = parseInt(totalLikesElement.textContent); // Nombre total de likes

            if (!this.liked) {
                this.likes++; // Incrémente les likes de la vidéo.
                totalLikes++; // Incrémente le total des likes.
                heartIcon.style.color = '#d3573c'; // Couleur lorsque l'icône est cliquée.
            } else {
                this.likes--; // Décrémente les likes de la vidéo.
                totalLikes--; // Décrémente le total des likes.
                heartIcon.style.color = '#901c1c'; // Réinitialisation de la couleur de l'icône.

            }

            this.liked = !this.liked; // Inverse l'état de l'image (donc true ou false) - est à false par défaut au départ
            likesCount.textContent = this.likes; // Met à jour le nombre de likes affiché sous le média en question
            totalLikesElement.textContent = totalLikes; // Met à jour le total des likes affiché dans l'encart
        };
    
        // Ajoute un événement de clic pour l'icône de cœur.
        likesContainer.addEventListener('click', toggleLike);
    
        // Ajoute un événement de clavier pour gérer les touches 'Enter' et ' '.
        likesContainer.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Empêche le défilement de la page lors de l'appui sur la barre d'espace.
                toggleLike();
            }
        });
    
    }
      
}

// Classe finale ou "fabrique" pour créer des instances des sous-classes (ImageMedia et VideoMedia) / Centralisation de la logique de création pour choisir entre ImageMedia et VideoMedia ce qui simplifie la gestion des objets (et permettrait éventuellement d'ajouter de nouveaux types de médias sans modifier le code de base).
// "Export" de la classe MediaFactory pour utilisation dans photographer.js
export class MediaFactory {
    /**
     * Crée une instance de média spécifique (image ou vidéo) en fonction des données fournies.
     * @param {Object} data - Les données du média comme : le chemin, le titre, et le nombre de likes.
     * @param {string} photographerName - Le prénom du photographe.
     * @returns {Media} Une instance de ImageMedia ou VideoMedia selon les données fournies.
     */
    // "static" fait référence à la classe de base et non aux instances de celle-ci. Cela signifie aussi qu'on peut accéder directement à ses propriétés (ditent "static") sans avoir à créer une instance de cette classe. 
    // Centralisation de la logique de création des instances de ImageMedia et VideoMedia
    static createMedia(data, photographerName) {
        console.log("MediaFactory")
        // Vérifie si les données contiennent un chemin pour une image.
        if (data.image) {
            // Instanciation/Création d'objets Images ou Vidéos
            return new ImageMedia(data, photographerName); 
        } else if (data.video) {
            return new VideoMedia(data, photographerName); 
        } else {
            throw new Error('Type de média inconnu.'); // Lance une erreur si le type de média est inconnu.
        }
        
    }
}



