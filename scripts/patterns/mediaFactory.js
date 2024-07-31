//////////////////////// FACTORY PATTERN POUR PAGE INDIV PHOTOGRAPHE ////////////////////////////////////////

// Classe de base pour les médias
// Cette classe sert de modèle pour les médias (images et vidéos) avec des propriétés et des méthodes de base communes.
class Media {
    /**
     * Constructeur de la classe Media.
     * @param {Object} data - Les données du média, comme le titre et l'identifiant du photographe.
     * @param {string} photographerName - Le nom complet du photographe.
     */
    constructor(data, photographerName) {
        this.title = data.title; // Le titre du média (image ou vidéo).
        this.photographerId = data.photographerId;
        // Utilise uniquement le prénom du photographe en supposant que le nom complet est constitué du prénom suivi du nom de famille.
        this.photographerName = photographerName.split(' ')[0]; 
    }

    // Méthode de base pour afficher le média. Cette méthode doit être surchargée dans les sous-classes spécifiques (ImageMedia et VideoMedia).
    display() {
        console.log('Méthode display non implémentée dans la classe de base Media.');
    }
}

/// Classe spécifique pour les médias images ///
class ImageMedia extends Media {
    /**
     * Constructeur de la classe ImageMedia.
     * @param {Object} data - Les données spécifiques à l'image, comme le chemin et les likes.
     * @param {string} photographerName - Le nom complet du photographe.
     */
    constructor(data, photographerName) {
        super(data, photographerName); // Appel du constructeur de la classe de base Media.
        this.image = data.image; // Chemin de l'image.
        this.likes = data.likes ?? 0; // Nombre de likes, valeur par défaut 0.
        this.liked = false; // Etat de l'image (si elle est aimée ou non).
    }

    // Affiche l'image dans la section galerie. Crée les éléments HTML pour le média et les ajoute à la section galerie. 
    display() {
        // Création d'un conteneur pour le média.
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
    
        // Création de l'élément image.
        const mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.image}`);
        mediaElement.setAttribute('alt', this.title);  // Texte alternatif pour l'image.
        mediaElement.setAttribute('aria-label', this.title); // Label ARIA pour l'accessibilité.
        mediaElement.setAttribute('data-src', `assets/photographers/${this.photographerName}/${this.image}`);
        mediaElement.setAttribute('data-type', 'image');
        mediaElement.setAttribute('data-title', this.title);
        mediaElement.setAttribute('tabindex', '0'); // Ajoute tabindex pour rendre l'image focusable.
        
        // Ajout de l'image au conteneur.
        mediaContainer.appendChild(mediaElement);

        // Création d'un conteneur pour le contenu sous l'image.
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper'); 

        // Création du conteneur pour le titre et les likes.
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
    
        // Création de l'élément titre.
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);
    
        // Création du conteneur pour les likes.
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

        // Fonction pour gérer le clic et la touche sur l'icône de cœur.
        const toggleLike = () => {
            const totalLikesElement = document.getElementById('totalLikes'); // Élément affichant le total des likes.
            let totalLikes = parseInt(totalLikesElement.textContent); // Nombre total de likes.

            if (!this.liked) {
                this.likes++; // Incrémente les likes du média.
                totalLikes++; // Incrémente le total des likes.
                heartIcon.style.color = '#d3573c'; // Couleur lorsque l'icône est cliquée.
            } else {
                this.likes--; // Décrémente les likes du média.
                totalLikes--; // Décrémente le total des likes.
                heartIcon.style.color = '#901c1c'; // Réinitialisation de la couleur de l'icône.
            }

            this.liked = !this.liked; // Inverse l'état de l'image (aimée ou non).
            likesCount.textContent = this.likes; // Met à jour le nombre de likes affiché.
            totalLikesElement.textContent = totalLikes; // Met à jour le total des likes affiché.
        };
    
        // Ajoute un événement de clic pour l'icône de cœur.
        likesContainer.addEventListener('click', toggleLike);
        
        // Ajoute un événement de clavier pour gérer les touches 'Enter' et ' '.
        likesContainer.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Empêche le défilement automatique de la page lors de l'appui sur la barre d'espace.
                toggleLike();
            }
        });
    
        // Ajoute le nombre de likes et l'icône de cœur au conteneur des likes.
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        
        // Ajoute le conteneur de contenu (titre + likes) au conteneur principal.
        contentWrapper.appendChild(contentContainer);
        contentWrapper.appendChild(likesContainer);

        // Ajouter le conteneur principal (image + contenu) à la section galerie.
        mediaContainer.appendChild(contentWrapper);
    
        // Sélectionne la section galerie dans le document.
        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer); // Ajoute le média à la section galerie.
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
        super(data, photographerName); // Appel du constructeur de la classe de base Media.
        this.video = data.video; // Chemin de la vidéo.
        this.likes = data.likes ?? 0; // Nombre de likes, valeur par défaut 0.
        this.liked = false; // Etat de la vidéo (si elle est aimée ou non).
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
        videoElement.setAttribute('tabindex', '0'); // Ajoute tabindex.
        
        // Ajout de la vidéo au conteneur.
        mediaContainer.appendChild(videoElement);

        // Création d'un conteneur pour le contenu sous la vidéo.
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');
    
        // Création du conteneur pour le titre et les likes.
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
    
        // Création de l'élément titre.
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);
        
        // Création du conteneur pour les likes.
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

        // Fonction pour gérer le clic et la touche sur l'icône de cœur.
        const toggleLike = () => {
            const totalLikesElement = document.getElementById('totalLikes'); // Élément affichant le total des likes.
            let totalLikes = parseInt(totalLikesElement.textContent); // Nombre total de likes.

            if (!this.liked) {
                this.likes++; // Incrémente les likes de la vidéo.
                totalLikes++; // Incrémente le total des likes.
                heartIcon.style.color = '#d3573c'; // Couleur lorsque l'icône est cliquée.
            } else {
                this.likes--; // Décrémente les likes de la vidéo.
                totalLikes--; // Décrémente le total des likes.
                heartIcon.style.color = '#901c1c'; // Réinitialisation de la couleur de l'icône.

            }

            this.liked = !this.liked; // Inverse l'état de la vidéo (aimée ou non).
            likesCount.textContent = this.likes; // Met à jour le nombre de likes affiché.
            totalLikesElement.textContent = totalLikes; // Met à jour le total des likes affiché.
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
    
        // Ajoute le nombre de likes et l'icône de cœur au conteneur des likes.
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);

        // Ajoute le conteneur de contenu (titre + likes) au conteneur principal.
        contentWrapper.appendChild(contentContainer);
        contentWrapper.appendChild(likesContainer);

        // Ajoute le conteneur principal (vidéo + contenu) à la section galerie.
        mediaContainer.appendChild(contentWrapper);
    
        // Sélectionne la section galerie dans le document.
        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer); // Ajoute la vidéo à la section galerie.
    }
    
    
}

//// Factory final pour créer les médias en fonction des données ////
// La classe MediaFactory utilise le Factory Pattern pour créer des instances de Media appropriées (ImageMedia ou VideoMedia).
class MediaFactory {
    /**
     * Crée une instance de média spécifique (image ou vidéo) en fonction des données fournies.
     * @param {Object} data - Les données du média, comme le chemin, le titre, et le nombre de likes.
     * @param {string} photographerName - Le nom complet du photographe.
     * @returns {Media} Une instance de ImageMedia ou VideoMedia selon les données fournies.
     */
    static createMedia(data, photographerName) {
        // Vérifie si les données contiennent un chemin pour une image.
        if (data.image) {
            return new ImageMedia(data, photographerName); // Crée et retourne une instance de ImageMedia.
        } else if (data.video) {
            return new VideoMedia(data, photographerName); // Crée et retourne une instance de VideoMedia.
        } else {
            throw new Error('Type de média inconnu.'); // Lance une erreur si le type de média est inconnu.
        }
        
    }
}

// Exporte la classe MediaFactory pour utilisation dans d'autres fichiers (comme photographer.js).
export { MediaFactory };
