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
        this.likes = data.likes ?? 0;
        this.liked = false;
    }

    display() {
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');

        const mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.image}`);
        mediaElement.setAttribute('alt', this.title);
        mediaElement.setAttribute('aria-label', this.title);
        mediaElement.classList.add('media-element');

        mediaContainer.appendChild(mediaElement);

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');

        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');

        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.classList.add('likes-count');
        likesCount.style.color = '#901c1c'; // Couleur principale des likes

        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'heart-icon');
        heartIcon.style.color = '#901c1c'; // Couleur principale de l'icône

        heartIcon.addEventListener('click', () => {
            if (!this.liked) {
                this.likes++;
                likesCount.textContent = this.likes;
                heartIcon.style.color = '#d3573c'; // Couleur lorsqu'icône est cliquée
                this.liked = true;
            } else {
                this.likes--;
                likesCount.textContent = this.likes;
                heartIcon.style.color = '#901c1c'; // Couleur principale
                this.liked = false;
            }
        });

        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        contentContainer.appendChild(likesContainer);

        mediaContainer.appendChild(contentContainer);

        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer);
    }
}


// Classe spécifique pour les médias vidéos
class VideoMedia extends Media {
    constructor(data, photographerName) {
        super(data, photographerName);
        this.video = data.video;
        this.likes = data.likes ?? 0;
        this.liked = false;
    }

    display() {
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');

        // Ajoutez ici la logique pour afficher la vidéo
        const videoElement = document.createElement('video');
        videoElement.setAttribute('src', `assets/photographers/${this.photographerName}/${this.video}`);
        videoElement.setAttribute('alt', this.title);
        videoElement.setAttribute('aria-label', this.title);
        videoElement.classList.add('media-element');

        mediaContainer.appendChild(videoElement);

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');

        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        contentContainer.appendChild(titleElement);

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');

        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.classList.add('likes-count');
        likesCount.style.color = '#901c1c'; // Couleur principale des likes

        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fa-solid', 'fa-heart', 'heart-icon');
        heartIcon.style.color = '#901c1c'; // Couleur principale de l'icône

        heartIcon.addEventListener('click', () => {
            if (!this.liked) {
                this.likes++;
                likesCount.textContent = this.likes;
                heartIcon.style.color = '#d3573c'; // Couleur lorsqu'icône est cliquée
                this.liked = true;
            } else {
                this.likes--;
                likesCount.textContent = this.likes;
                heartIcon.style.color = '#901c1c'; // Couleur principale
                this.liked = false;
            }
        });

        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        contentContainer.appendChild(likesContainer);

        mediaContainer.appendChild(contentContainer);

        const gallerySection = document.querySelector('.gallery_section');
        gallerySection.appendChild(mediaContainer);
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
