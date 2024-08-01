////////////////////////  CREATIONAL DESIGN PATTERN => dédié à la création d'objets //////////////////////////////
////////////////////////////// LIGHTBOX /////////////////////////////////////////////////
// Classe représentant une lightbox pour afficher des médias en plein écran = Modèle/Plan pour créer un objet Lightbox 
export class Lightbox {
    // "Constructor" = Initialisation des propriétés de l'objet Lightbox et crée les éléments nécessaires à l'affichage de la lightbox.
    // "This", dans le constructeur, se réfère à l'objet en cours de création permettant d'initialiser ses propres propriétés et de définir ses propres méthodes.
    // Ces propriétés et méthodes permettent à chaque instance de Lightbox de maintenir son propre état et de manipuler son propre DOM sans interférer avec d'autres instances si on appelle la classe Lightbox plusieurs fois.
    constructor() { 
        this.currentIndex = 0; // Index du média actuellement affiché
        this.mediaElements = []; // stockage de la liste des éléments médias à afficher dans la lightbox
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
                    <img id="lightbox_img">
                    <video id="lightbox_video" controls></video>
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


    /////////// Méthodes de l'objet Lightbox qui définissent les actions que celle-ci peut réaliser /////////////
    // Ajoute les écouteurs d'événements pour les boutons et les événements clavier
    addEventListeners() {
        const closeButton = document.querySelector('.lightbox_close'); // Référence au bouton de fermeture
        const prevButton = document.querySelector('.lightbox_prev'); // Référence au bouton précédent
        const nextButton = document.querySelector('.lightbox_next'); // Référence au bouton suivant
        

        // Écouteurs pour les boutons de la lightbox
        closeButton.addEventListener('click', () => this.closeLightbox()); // Écouteur pour fermer la lightbox
        nextButton.addEventListener('click', () => this.showNext()); // Écouteur pour afficher le média suivant
        prevButton.addEventListener('click', () => this.showPrev()); // Écouteur pour afficher le média précédent

        // Ajoute un écouteur d'événements pour les touches du clavier
        document.addEventListener('keydown', (event) => this.handleKeyDown(event)); // @param {KeyboardEvent} event - L'événement clavier

        // Gestion des touches pour les boutons de navigation avec le clavier
        prevButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut du navigateur (soumission de formulaire, etc.)
                this.showPrev(); // Affiche le média précédent
                prevButton.focus(); // Garde le focus sur le bouton précédent
            }
        });

        nextButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.showNext(); // Affiche le média suivant
                nextButton.focus(); // Garde le focus sur le bouton suivant
            }
        });

        closeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Si la touche "Enter" est enfoncée
                event.preventDefault(); // Empêche l'action par défaut
                this.closeLightbox(); // Ferme la lightbox
            }
        });
    }

    // Ferme la lightbox et restaure le défilement du corps du document. 
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
     * @param {number} index - L'index du média à afficher / indique que la méthode openLightbox attend un paramètre nommé index de type number
     */
    openLightbox(index) {
        const media = this.mediaElements[index]; // Récupère le média à l'index spécifié
        if (!media) return; // Si aucun média n'est trouvé, retourne

        this.currentIndex = index; // Met à jour l'index actuel

        const src = media.getAttribute('data-src'); // Récupère la source du média (prédéfinit dans le factory pattern)
        const type = media.getAttribute('data-type'); // Récupère le type de média (image ou vidéo) (prédéfinit dans le factory pattern)
        const title = media.getAttribute('data-title'); // Récupère le titre du média (prédéfinit dans le factory pattern)

        // Affiche le média approprié dans la lightbox
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

        // Trap focus dans la lightbox
        this.trapFocus(this.lightbox);
    }

    // Affiche le média suivant dans la lightbox
    showNext() {
        // Calcule l'index du média suivant, en revenant au début de la liste si nécessaire
        const nextIndex = (this.currentIndex + 1 >= this.mediaElements.length) ? 0 : (this.currentIndex + 1);
        this.openLightbox(nextIndex); // Ouvre la lightbox avec le média suivant
    }

    // Affiche le média précédent dans la lightbox
    showPrev() {
        // Calcule l'index du média précédent, en revenant à la fin de la liste si nécessaire
        const prevIndex = (this.currentIndex - 1 < 0) ? (this.mediaElements.length - 1) : (this.currentIndex - 1);
        this.openLightbox(prevIndex); // Ouvre la lightbox avec le média précédent
    }

    // Initialise les éléments médias et les écouteurs d'événements 
    init() {
        document.querySelectorAll('.media_container img, .media_container video').forEach((media, index) => {
            media.dataset.index = index; // Définit l'index des médias dans les attributs de données
            media.setAttribute('tabindex', '0'); // Rendre le média focusable pour la navigation au clavier
            media.addEventListener('click', () => this.openLightbox(index)); // Ouvre la lightbox lors d'un clic sur un média
            media.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { // Si la touche "Enter" ou "Espace" est enfoncée
                    event.preventDefault(); // Empêche l'action par défaut
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
            '.lightbox_close, .lightbox_prev, .lightbox_next'
        ); // Sélectionne tous les éléments focusables dans la lightbox
        const firstFocusableElement = focusableElements[0]; // Premier élément focusable
        const lastFocusableElement = focusableElements[focusableElements.length - 1]; // Dernier élément focusable

        element.addEventListener('keydown', (e) => {
            const isTabPressed = e.key === 'Tab'; // Vérifie si la touche Tab est enfoncée

            if (!isTabPressed) {
                return; // Ignore si ce n'est pas la touche Tab
            }

            // Gestion du focus circulaire dans la lightbox
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

        firstFocusableElement.focus(); // Met le focus sur le premier élément focusable à l'ouverture
    }

    /**
     * Gère les événements clavier pour la lightbox.
     * @param {KeyboardEvent} event - L'événement clavier
     */
    handleKeyDown(event) {
        // Vérifie si la lightbox est actuellement affichée
        if (this.lightbox.style.display === 'block') {
            
            // Gère les actions basées sur la touche enfoncée
            switch (event.key) {
                
                // Si la touche "Échap" est enfoncée
                case 'Escape':
                    this.closeLightbox(); // Ferme la lightbox
                    break;
    
                // Si la touche flèche droite est enfoncée
                case 'ArrowRight':
                    event.preventDefault(); // Empêche l'action par défaut de la touche (par exemple, défilement)
                    this.showNext(); // Affiche le média suivant dans la lightbox
                    document.querySelector('.lightbox_next').focus(); // Met le focus sur le bouton "suivant"
                    break;
    
                // Si la touche flèche gauche est enfoncée
                case 'ArrowLeft':
                    event.preventDefault(); // Empêche l'action par défaut de la touche (par exemple, défilement)
                    this.showPrev(); // Affiche le média précédent dans la lightbox
                    document.querySelector('.lightbox_prev').focus(); // Met le focus sur le bouton "précédent"
                    break;
    
                // Si la touche flèche bas ou haut est enfoncée
                case 'ArrowDown':
                case 'ArrowUp':
                    event.preventDefault(); // Empêche l'action par défaut de la touche (par exemple, défilement)
                    
                    // Sélectionne tous les éléments focusables dans la lightbox
                    const focusableElements = this.lightbox.querySelectorAll(
                        '.lightbox_close, .lightbox_prev, .lightbox_next'
                    );
                    
                    // Trouve l'index de l'élément actuellement focusé
                    const currentFocusIndex = Array.from(focusableElements).indexOf(document.activeElement);
                    
                    // Nombre total d'éléments focusables
                    const totalElements = focusableElements.length;
                    
                    // Détermine l'index du prochain ou précédent élément focusable en fonction de la touche enfoncée
                    const targetIndex = event.key === 'ArrowDown' 
                        ? (currentFocusIndex + 1 >= totalElements ? 0 : currentFocusIndex + 1) // Pour la flèche bas : passe au suivant ou au premier si c'est le dernier
                        : (currentFocusIndex - 1 < 0 ? totalElements - 1 : currentFocusIndex - 1); // Pour la flèche haut : passe au précédent ou au dernier si c'est le premier
                    
                    // Met le focus sur l'élément cible
                    focusableElements[targetIndex].focus();
                    break;
            }
        }
    }
}
