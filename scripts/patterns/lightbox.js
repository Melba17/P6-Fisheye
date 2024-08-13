////////////////////////  CREATIONAL DESIGN PATTERN => dédié à la création d'objets //////////////////////////////
////////////////////////////// LIGHTBOX /////////////////////////////////////////////////
// Classe représentant une lightbox pour afficher des médias en plein écran = Modèle/Plan pour créer un objet Lightbox 
class Lightbox {
    // "Constructor" = Initialisation des propriétés de l'objet Lightbox et crée les éléments nécessaires à l'affichage de la lightbox.
    // "This", dans le constructeur, se réfère à l'objet en cours de création permettant d'initialiser ses propres propriétés et de définir ses propres méthodes.
    // Ces propriétés et méthodes permettent à chaque instance de Lightbox de maintenir son propre état et de manipuler son propre DOM sans interférer avec d'autres instances si on appelle la classe Lightbox plusieurs fois.
    constructor() { 
        this.currentIndex = 0; // Initialisation à 0 par défaut qui sera ensuite modifié lorsque nécessaire
        this.mediaElements = []; // Initialisation d'un tableau vide pour stocker les médias à afficher
        this.photographerInsert = document.querySelector('.photographer_insert'); // Élément à masquer (encart) lors de l'ouverture de la lightbox
        this.createLightbox(); // Crée la lightbox
        this.addEventListeners(); // Ajoute les écouteurs d'événements
    }

     /////////// Différentes méthodes de l'objet Lightbox qui définissent les actions que celle-ci peut réaliser /////////////
    // Création dynamique de la lightbox - structure HTML/squelette ajouté au DOM
    createLightbox() {
        this.lightbox = document.createElement('div'); // Crée un nouvel élément <div> pour la lightbox
        this.lightbox.className = 'lightbox'; // Assigne la classe CSS pour la lightbox
        this.lightbox.id = 'lightbox'; // Assigne l'ID pour la lightbox pour permettre ensuite sa manipulation par diverses méthodes (afficher, la fermer, etc...)
        this.lightbox.style.display = 'none'; // Cache la lightbox par défaut
        this.lightbox.setAttribute('role', 'dialog'); // Définit le rôle ARIA pour la lightbox 
        this.lightbox.setAttribute('aria-label', 'Média ouvert en plein écran'); // Définit l'étiquette ARIA pour la lightbox
        // Contenu HTML de la lightbox
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
        `; 
        document.body.appendChild(this.lightbox); // Ajoute la lightbox au corps du document ou DOM

        // Sert à manipuler ces éléments plus facilement et de manière plus ciblée dans le reste du code
        this.lightboxImage = document.getElementById('lightbox_img'); // On récupère l'élément <img> 
        this.lightboxVideo = document.getElementById('lightbox_video'); // On récupère l'élément <video> 
        this.lightboxTitle = document.getElementById('lightbox_title'); // On récupère l'élément <p> pour le titre 
        
    }


    // Ajoute les écouteurs d'événements pour les boutons et les événements clavier à l'intérieur de la lightbox
    addEventListeners() {
        const closeButton = this.lightbox.querySelector('.lightbox_close');
        const prevButton = this.lightbox.querySelector('.lightbox_prev');
        const nextButton = this.lightbox.querySelector('.lightbox_next');
        // Écouteurs pour les boutons de la lightbox
        closeButton.addEventListener('click', () => this.closeLightbox()); // Écouteur pour fermer la lightbox
        nextButton.addEventListener('click', () => this.showNext()); // Écouteur pour afficher le média suivant
        prevButton.addEventListener('click', () => this.showPrev()); // Écouteur pour afficher le média précédent

        // Ajoute un écouteur d'événements pour les touches du clavier
        // @param {KeyboardEvent} event - L'événement clavier
        this.lightbox.addEventListener('keydown', (event) => this.handleKeyDown(event)); 
    }

    /**
     * Gère les événements clavier pour la lightbox.
     * @param {KeyboardEvent} event - L'événement clavier
     */
    ///////////////// Gestion de la navigation clavier ///////////////////
    // Combinaison de structures conditionnelles if-else et de switch-case = test
    handleKeyDown(event) {
        // Vérifie si la lightbox est ouverte avant de gérer les événements clavier
        if (this.lightbox.style.display === 'block') {
            switch (event.key) {
                case 'Escape':
                    this.closeLightbox(); // Ferme la lightbox lorsqu'Escape est pressé
                    break;
                // Flèches du clavier
                case 'ArrowRight':
                    event.preventDefault(); // Empêche le défilement par défaut
                    this.showNext(); // Affiche le média suivant
                    this.lightbox.querySelector('.lightbox_next').focus(); // Focalise le bouton "suivant"
                    break;

                case 'ArrowLeft':
                    event.preventDefault(); // Empêche le défilement par défaut
                    this.showPrev(); // Affiche le média précédent
                    this.lightbox.querySelector('.lightbox_prev').focus(); // Focalise le bouton "précédent"
                    break;

                case 'ArrowDown':
                case 'ArrowUp':
                    event.preventDefault(); // Empêche le défilement par défaut
                    this.trapFocus(this.lightbox); // Piège le focus dans la lightbox
                    break;
                
                default:
                    // Gère les actions spécifiques pour les boutons avec les touches "Enter"
                    if (event.target.classList.contains('lightbox_close') && event.key === 'Enter') {
                        event.preventDefault(); // Empêche l'action par défaut
                        this.closeLightbox(); // Ferme la lightbox
                    }
                    if (event.target.classList.contains('lightbox_prev') && event.key === 'Enter') {
                        event.preventDefault(); // Empêche l'action par défaut
                        this.showPrev(); // Affiche le média précédent
                        event.target.focus(); // Focalise le bouton "précédent"
                    }
                    if (event.target.classList.contains('lightbox_next') && event.key === 'Enter') {
                        event.preventDefault(); // Empêche l'action par défaut
                        this.showNext(); // Affiche le média suivant
                        event.target.focus(); // Focalise le bouton "suivant"
                    }
                    break;
            }
        }
    }

        /**
     * Ouvre la lightbox avec le média à l'index spécifié.
     * @param {number} index - L'index du média à afficher / indique que la méthode openLightbox attend un paramètre nommé index de type number
     */
        // Création effective du média dans la lightbox (image ou vidéo)
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
    

        // Ferme la lightbox et restaure le défilement du corps du document 
        closeLightbox() {
            this.lightbox.style.display = 'none'; // Cache la lightbox
            this.lightboxImage.style.display = 'none'; // Cache l'image dans la lightbox
            this.lightboxVideo.style.display = 'none'; // Cache la vidéo dans la lightbox
            document.body.classList.remove('no-scroll'); // Restaure le défilement du corps du document
            if (this.photographerInsert) {
                this.photographerInsert.classList.remove('hidden'); // Affiche l'élément du photographe
            }
        }

    // Actions des boutons chevrons de la lightbox
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

    /**
     * Gère le focus dans la lightbox pour éviter de sortir en utilisant la touche Tab.
     * @param {HTMLElement} element - contenant les éléments focusables.
     */
    trapFocus(element) {
        // Sélectionne tous les éléments focusables dans la lightbox
        const focusableElements = element.querySelectorAll(
            '.lightbox_close, .lightbox_prev, .lightbox_next'
        ); 
        const firstFocusableElement = focusableElements[0]; // Premier élément focusable dans la liste des éléments focusables
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
        // Met le focus sur le premier élément focusable à l'ouverture qui est la croix de fermeture dans le flux naturel du DOM
        firstFocusableElement.focus(); 
    }

    //// Initialise les éléments médias et les écouteurs d'événements dans la galerie du photographe pour pouvoir ouvrir la lightbox /////
    init() {
        document.querySelectorAll('.media_container img, .media_container video').forEach((media, index) => {
            media.dataset.index = index; // Assigne une valeur index à l'attribut data-index de l'élément media pour savoir quel élément a été sélectionné et pouvoir le manipuler   
            media.addEventListener('click', () => this.openLightbox(index)); // Ouvre la lightbox lors d'un clic sur un média
            // @param {KeyboardEvent} event - L'événement clavier
            media.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { // Si la touche "Enter" ou "Espace" est enfoncée
                    event.preventDefault(); // Empêche l'action par défaut
                    this.openLightbox(index); // Ouvre la lightbox pour le média cliqué
                }
            }); 
            this.mediaElements.push(media); // Ajoute le média à la liste des éléments médias
        });
    }

}

/////////////// Fonction pour initialiser ou réinitialiser la lightbox (si il y en a déjà une de créée) ////////////////////////////////////
export function ReinitializeLightbox() {
    // Ancienne Lightbox
    const existingLightbox = document.querySelector('.lightbox'); // Sélectionne la lightbox existante
    if (existingLightbox) {
        existingLightbox.remove(); // Supprime la lightbox si elle existe
    }

    // Nouvelle Lightbox
    const lightbox = new Lightbox(); // Crée une nouvelle instance de Lightbox
    lightbox.init(); // Initialise la lightbox
}

