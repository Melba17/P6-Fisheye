/**
 * Classe représentant une lightbox pour afficher des médias en plein écran.
 */
export class Lightbox {
    /**
     * Initialise la lightbox, les éléments média, et les écouteurs d'événements.
     */
    constructor() {
        this.currentIndex = 0; // Index du média actuellement affiché
        this.mediaElements = []; // Liste des éléments médias à afficher dans la lightbox
        this.photographerInsert = document.querySelector('.photographer_insert'); // Élément à masquer lors de l'ouverture de la lightbox

        // Création dynamique de la lightbox
        this.lightbox = document.createElement('div'); // Crée un nouvel élément <div> pour la lightbox
        this.lightbox.className = 'lightbox'; // Assigne la classe CSS pour la lightbox
        this.lightbox.id = 'lightbox'; // Assigne l'ID pour la lightbox
        this.lightbox.style.display = 'none'; // Cache la lightbox par défaut
        this.lightbox.setAttribute('role', 'dialog'); // Définit le rôle ARIA pour la lightbox
        this.lightbox.setAttribute('aria-label', 'Média en plein écran'); // Définit l'étiquette ARIA pour la lightbox
        this.lightbox.innerHTML = `
            <button class="lightbox_close" aria-label="Fermer la fenêtre" tabindex="0"></button>
            <button class="lightbox_prev" aria-label="Média précédent" tabindex="0"></button>
            <div class="lightbox_container">
                <div class="lightbox_content">
                    <img id="lightbox_img" alt="" aria-label="">
                    <video id="lightbox_video" controls aria-label=""></video>
                    <p class="lightbox_title" id="lightbox_title"></p>
                </div>
            </div>
            <button class="lightbox_next" aria-label="Média suivant" tabindex="0"></button>
        `; // Contenu HTML de la lightbox
        document.body.appendChild(this.lightbox); // Ajoute la lightbox au corps du document

        this.lightboxImage = document.getElementById('lightbox_img'); // Référence à l'élément <img> dans la lightbox
        this.lightboxVideo = document.getElementById('lightbox_video'); // Référence à l'élément <video> dans la lightbox
        this.lightboxTitle = document.getElementById('lightbox_title'); // Référence à l'élément <p> pour le titre dans la lightbox

        this.addEventListeners(); // Ajoute les écouteurs d'événements
    }

    /**
     * Ajoute les écouteurs d'événements pour les boutons et les événements clavier.
     */
    addEventListeners() {
        const prevButton = document.querySelector('.lightbox_prev'); // Référence au bouton précédent
        const nextButton = document.querySelector('.lightbox_next'); // Référence au bouton suivant
        const closeButton = document.querySelector('.lightbox_close'); // Référence au bouton de fermeture

        closeButton.addEventListener('click', () => this.closeLightbox()); // Écouteur pour fermer la lightbox
        nextButton.addEventListener('click', () => this.showNext()); // Écouteur pour afficher le média suivant
        prevButton.addEventListener('click', () => this.showPrev()); // Écouteur pour afficher le média précédent

        // Ajoute un écouteur d'événements pour les touches du clavier
        document.addEventListener('keydown', (event) => this.handleKeyDown(event)); // @param {KeyboardEvent} event - L'événement clavier

        // Gestion des touches pour les boutons
        prevButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.showPrev(); // Affiche le média précédent
                prevButton.focus(); // Garde le focus sur le bouton gauche
            }
        });

        nextButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.showNext(); // Affiche le média suivant
                nextButton.focus(); // Garde le focus sur le bouton droit
            }
        });

        closeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.closeLightbox(); // Ferme la lightbox
            }
        });
    }

    /**
     * Ferme la lightbox et restaure le défilement du corps du document.
     */
    closeLightbox() {
        this.lightbox.style.display = 'none'; // Cache la lightbox
        this.lightboxImage.style.display = 'none'; // Cache l'image dans la lightbox
        this.lightboxVideo.style.display = 'none'; // Cache la vidéo dans la lightbox
        document.body.classList.remove('no-scroll'); // Restaure le défilement du corps du document
        if (this.photographerInsert) {
            this.photographerInsert.classList.remove('hidden'); // Affiche l'élément du photographe
        }
    }

    /**
     * Ouvre la lightbox avec le média à l'index spécifié.
     * @param {number} index - L'index du média à afficher.
     */
    openLightbox(index) {
        const media = this.mediaElements[index]; // Récupère le média à l'index spécifié
        if (!media) return; // Si aucun média n'est trouvé, retourne

        this.currentIndex = index; // Met à jour l'index actuel

        const src = media.getAttribute('data-src'); // Récupère la source du média
        const type = media.getAttribute('data-type'); // Récupère le type de média (image ou vidéo)
        const title = media.getAttribute('data-title'); // Récupère le titre du média

        if (type === 'image') {
            this.lightboxImage.src = src; // Définit la source de l'image
            this.lightboxImage.alt = title; // Définit le texte alternatif pour l'image
            this.lightboxImage.setAttribute('aria-label', title); // Définit l'étiquette ARIA pour l'image
            this.lightboxImage.style.display = 'block'; // Affiche l'image
            this.lightboxVideo.style.display = 'none'; // Cache la vidéo
        } else if (type === 'video') {
            this.lightboxVideo.src = src; // Définit la source de la vidéo
            this.lightboxVideo.setAttribute('aria-label', title); // Définit l'étiquette ARIA pour la vidéo
            this.lightboxVideo.style.display = 'block'; // Affiche la vidéo
            this.lightboxImage.style.display = 'none'; // Cache l'image
        }

        this.lightboxTitle.textContent = title; // Définit le titre du média
        this.lightbox.style.display = 'block'; // Affiche la lightbox
        document.body.classList.add('no-scroll'); // Empêche le défilement du corps du document
        if (this.photographerInsert) {
            this.photographerInsert.classList.add('hidden'); // Cache l'élément du photographe
        }

        // Met le focus sur la flèche de gauche
        document.querySelector('.lightbox_prev').focus();

        // Trap focus dans la lightbox
        this.trapFocus(this.lightbox);
    }

    /**
     * Affiche le média suivant dans la lightbox.
     */
    showNext() {
        const nextIndex = (this.currentIndex + 1 >= this.mediaElements.length) ? 0 : (this.currentIndex + 1); // Calcule l'index du média suivant
        this.openLightbox(nextIndex); // Ouvre la lightbox avec le média suivant
    }

    /**
     * Affiche le média précédent dans la lightbox.
     */
    showPrev() {
        const prevIndex = (this.currentIndex - 1 < 0) ? (this.mediaElements.length - 1) : (this.currentIndex - 1); // Calcule l'index du média précédent
        this.openLightbox(prevIndex); // Ouvre la lightbox avec le média précédent
    }

    /**
     * Initialise les éléments médias et les écouteurs d'événements.
     */
    init() {
        document.querySelectorAll('.media_container img, .media_container video').forEach((media, index) => {
            media.dataset.index = index; // Définit l'index des médias dans les attributs de données
            media.addEventListener('click', () => this.openLightbox(index)); // Ouvre la lightbox lors d'un clic sur un média
            media.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { // Si la touche "Enter" ou "Espace" est enfoncée
                    this.openLightbox(index); // Ouvre la lightbox pour le média cliqué
                }
            }); // @param {KeyboardEvent} event - L'événement clavier
            this.mediaElements.push(media); // Ajoute le média à la liste des éléments médias
        });
    }

    /**
     * Gère le focus dans la lightbox pour éviter de sortir en utilisant la touche Tab.
     * @param {HTMLElement} element - L'élément contenant les éléments focusables.
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            '.lightbox_prev, .lightbox_next, .lightbox_close, #lightbox_img, #lightbox_video'
        ); // Sélectionne tous les éléments focusables dans la lightbox
        const firstFocusableElement = focusableElements[0]; // Premier élément focusable
        const lastFocusableElement = focusableElements[focusableElements.length - 1]; // Dernier élément focusable

        element.addEventListener('keydown', (e) => {
            const isTabPressed = e.key === 'Tab'; // Vérifie si la touche Tab est enfoncée

            if (!isTabPressed) {
                return; // Ignore si ce n'est pas la touche Tab
            }

            if (e.shiftKey) { // Si la touche Shift est enfoncée
                if (document.activeElement === firstFocusableElement) { // Si l'élément focusé est le premier élément focusable
                    e.preventDefault(); // Empêche l'action par défaut
                    lastFocusableElement.focus(); // Met le focus sur le dernier élément focusable
                }
            } else { // Si la touche Shift n'est pas enfoncée
                if (document.activeElement === lastFocusableElement) { // Si l'élément focusé est le dernier élément focusable
                    e.preventDefault(); // Empêche l'action par défaut
                    firstFocusableElement.focus(); // Met le focus sur le premier élément focusable
                }
            }
        });

        firstFocusableElement.focus(); // Met le focus sur le premier élément focusable
    }

    /**
     * Gère les événements clavier pour la lightbox.
     * @param {KeyboardEvent} event - L'événement clavier
     */
    handleKeyDown(event) {
        if (this.lightbox.style.display === 'block') { // Si la lightbox est affichée
            if (event.key === 'Escape') { // Si la touche "Échap" est enfoncée
                this.closeLightbox(); // Ferme la lightbox
            } else if (event.key === 'ArrowRight') { // Si la touche flèche droite est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.showNext(); // Affiche le média suivant
                document.querySelector('.lightbox_next').focus(); // Garde le focus sur la flèche droite
            } else if (event.key === 'ArrowLeft') { // Si la touche flèche gauche est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.showPrev(); // Affiche le média précédent
                document.querySelector('.lightbox_prev').focus(); // Garde le focus sur la flèche gauche
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { // Si la touche flèche bas ou haut est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                const focusableElements = this.lightbox.querySelectorAll(
                    '.lightbox_prev, .lightbox_next, .lightbox_close'
                ); // Sélectionne tous les éléments focusables
                const currentFocusIndex = Array.from(focusableElements).indexOf(document.activeElement); // Trouve l'index de l'élément actuellement focusé
                const nextIndex = (currentFocusIndex + 1 >= focusableElements.length) ? 0 : (currentFocusIndex + 1); // Calcule l'index du prochain élément
                const prevIndex = (currentFocusIndex - 1 < 0) ? (focusableElements.length - 1) : (currentFocusIndex - 1); // Calcule l'index de l'élément précédent
                const targetElement = (event.key === 'ArrowDown') ? focusableElements[nextIndex] : focusableElements[prevIndex]; // Choisit l'élément cible en fonction de la touche enfoncée
                targetElement.focus(); // Met le focus sur l'élément cible
            }
        }
    }
}