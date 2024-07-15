//////////////////////// FACTORY PATTERN POUR PAGE INDIV PHOTOGRAPHE ////////////////////////////////////////

// Classe de base pour les médias
class Media {
    constructor(data, photographerName) {
        this.title = data.title;
        this.photographerId = data.photographerId;
        // Utiliser uniquement le prénom
        this.photographerName = photographerName.split(' ')[0]; 
    }

    display() {
        console.log('Méthode display non implémentée dans la classe de base Media.');
    }
}

/// Classe spécifique pour les médias images ///
class ImageMedia extends Media {
    constructor(data, photographerName) {
        super(data, photographerName);
        this.image = data.image;
    }

    display() {
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');

        const mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.image}`);
        mediaElement.setAttribute('alt', this.title);
        mediaElement.setAttribute('aria-label', this.title);
        // Ajout de cet attribut pour rendre l'image focusable
        mediaElement.setAttribute('tabIndex', 0);

        mediaContainer.appendChild(mediaElement);

        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;

        mediaContainer.appendChild(titleElement);

        const gallerySection = document.querySelector('.gallery_section');
        if (gallerySection) {
            gallerySection.appendChild(mediaContainer);
        } else {
            console.error("La div .gallery_section n'existe pas dans le DOM.");
        }
    }
}

/// Classe spécifique pour les médias vidéos ////
class VideoMedia extends Media {
    constructor(data, photographerName) {
        super(data, photographerName);
        this.video = data.video;
    }

    display() {
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');

        const mediaElement = document.createElement('video');
        // Ajout de cet attribut pour rendre la miniature de la vidéo focusable
        mediaElement.setAttribute('tabIndex', 0);
        mediaElement.setAttribute('aria-label', this.title);
        mediaElement.setAttribute('title', this.title);


        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.video}`);
        sourceElement.setAttribute('type', 'video/mp4');

        

        mediaElement.appendChild(sourceElement);
        mediaContainer.appendChild(mediaElement);

        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;

        mediaContainer.appendChild(titleElement);

        const gallerySection = document.querySelector('.gallery_section');
        if (gallerySection) {
            gallerySection.appendChild(mediaContainer);
        } else {
            console.error("La div .gallery_section n'existe pas dans le DOM.");
        }
    }
}

//// Factory final pour créer les médias en fonction des données ////
class MediaFactory {
    static createMedia(data, photographerName) {
        if (data.image) {
            return new ImageMedia(data, photographerName);
        } else if (data.video) {
            return new VideoMedia(data, photographerName);
        } else {
            throw new Error('Type de média non supporté.');
        }
    }
}

export { Media, ImageMedia, VideoMedia, MediaFactory };
