////////////////////// FORMULAIRE DE CONTACT/MODALE ////////////////////////////////////
export function createModal() {
    // Crée un conteneur pour la modale
    const modalContainer = document.createElement('div');
    
    // Assigne un identifiant unique pour le conteneur de la modale qui sert à ouvrir/fermer la modale
    modalContainer.id = "contact_modal";
    
    // Définit le rôle de la modale pour les technologies d'assistance
    modalContainer.setAttribute('role', 'dialog');
    
    // Ajoute une classe CSS pour le style de fond de la modale
    modalContainer.className = "bckg_modal";
    
    // Cache la modale par défaut
    modalContainer.style.display = "none";

    // Définit le contenu HTML de la modale
    modalContainer.innerHTML = `
    <div class="modal">
        <header>
            <div>
                <h2 id="contact_modal_title">Contactez-moi</h2>
                <div id="photographer_name" class="photographer-name"></div> 
            </div>
            <button class="modal_close" type="button"></button>
        </header>
        <form name="contactForm" action="" method="get" novalidate>
            <div>
                <label for="first">Prénom</label>
                <input class="text-control" type="text" id="first" name="first" autocomplete="first"/>
                <span id="first-error" class="error-message"></span>
            </div>
            <div>
                <label for="last">Nom</label>
                <input class="text-control" type="text" id="last" name="last" autocomplete="last"/>
                <span id="last-error" class="error-message"></span>
            </div>
            <div>
                <label for="email">E-mail</label>
                <input class="text-control" type="email" id="email" name="email" autocomplete="email"/>
                <span  id="email-error" class="error-message"></span>
            </div>
            <div>
                <label for="message">Votre message</label>
                <textarea name="message" id="message" class="text-control"></textarea>
                <span  id="message-error" class="error-message"></span>
            </div>
            <button class="submit_button" type="submit">Envoyer</button>
        </form>
    </div>
    `;

    // Ajoute le conteneur de la modale au body du document
    document.body.appendChild(modalContainer);

    // Configure l'attribut aria-labelledby pour indiquer quel photographe peut être contacté
    const modal = document.getElementById('contact_modal');
    modal.setAttribute('aria-labelledby', 'contact_modal_title photographer_name');
    
    
    // Ajoute un gestionnaire d'événements pour la croix de fermeture de la modale
    const closeButton = document.querySelector('.modal_close');
    if (closeButton) {
        // Ajoute l'aria-label 
        closeButton.setAttribute('aria-label', 'Bouton de fermeture');
        closeButton.addEventListener('click', closeModal);
    }

    // Ajoute l'aria-label au bouton submit 
    const submitButton = document.querySelector('.submit_button');
    if (submitButton) {
        submitButton.setAttribute('aria-label', 'Envoyer le formulaire');
    }
    

    // Gestionnaires d'événements pour chaque champ du formulaire en validation immédiate et le logging
    const fields = ['first', 'last', 'email', 'message'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) { 
            // L'événement blur se déclenche lorsque l'élément perd le focus
            field.addEventListener('blur', () => {
                validateField(fieldId);
                logFieldValue(fieldId);
            });
        }
    });

    // Gestionnaire d'événements pour la soumission du formulaire lors de la soumission avec le bouton "envoyer"
    modal.querySelector("form").addEventListener("submit", function(event) {
        // Empêche la soumission par défaut du formulaire
        event.preventDefault();
        // Si le formulaire n'est pas valide, rester sur le formulaire jusqu'à ce qu'il soit correctement rempli
        if (!validateForm()) {
            return; 
        }
        // Continue seulement si la validation réussit 
        // window.location.search renvoie à la fin de la chaîne de requête de l'URL actuelle
        // new URLSearchParams(...) crée un objet URLSearchParams représentant cette chaîne
        const photographerId = new URLSearchParams(window.location.search).get('id');

        if (photographerId) {
            // Redirige vers la page du photographe en question
            window.location.href = `photographer.html?id=${photographerId}`;
    
            // Réinitialise le formulaire après un délai mais ne sera pas visible car la redirection se produit presque immédiatement
            setTimeout(() => {
                resetForm();
            }, 100);
        } else {
            console.error("L'identifiant du photographe est manquant dans l'URL.");
        }
    });
    
    
}

// Pour afficher la modale depuis la page Photographe
export function openModal() {
    toggleModal(true); // Affiche la modale

    // Utilise setTimeout pour garantir que le focus est appliqué après que la modale soit complètement affichée
    setTimeout(() => {
        const firstFocusableElement = document.querySelector('#contact_modal .text-control');
        if (firstFocusableElement) {
            // Met le focus sur le premier champ de formulaire de la modale
            firstFocusableElement.focus();
        }
    }, 0); // Le délai de 0 assure que le code s'exécute juste après la visibilité de la modale

    // Ajoute un gestionnaire pour la navigation avec les flèches du clavier lorsqu'elle est ouverte
    document.addEventListener('keydown', handleArrowKeyNavigation);
}


    function closeModal() {
    toggleModal(false); // Masque la modale

    // Retire le gestionnaire de la navigation avec les flèches du clavier lorsque la modale est fermée
    document.removeEventListener('keydown', handleArrowKeyNavigation);
}

function toggleModal(show) {
    // Sélectionne le conteneur de la modale
    const modal = document.getElementById("contact_modal");
    // Sélectionne l'encart du photographe pour le masquer lors de l'affichage de la modale
    const photographerInsert = document.querySelector('.photographer_insert');

    if (modal) {
        // Change la visibilité de la modale
        modal.style.display = show ? "block" : "none";
        // Active ou désactive le défilement du body en fonction de la visibilité de la modale
        document.body.classList.toggle('no-scroll', show);

        if (show) {
            // Cache le contenu de la page html principale
            document.body.setAttribute('aria-hidden', 'true');
            // Assure que le focus reste dans la modale
            trapFocus(modal);
            // Ajoute un gestionnaire pour fermer la modale avec la touche Échap
            document.addEventListener('keydown', handleEscKey);
        } else {
            // Affiche le contenu de la page principale
            document.body.removeAttribute('aria-hidden');
            // Retire le gestionnaire pour fermer la modale avec la touche Échap
            document.removeEventListener('keydown', handleEscKey);
        }
    }
    
    if (photographerInsert) {
        // Masque ou affiche l'encart du photographe
        photographerInsert.classList.toggle('hidden', show);
    }
}

/**
 * Gère la fermeture de la modale lorsque la touche Échap est pressée
 * @param {KeyboardEvent} event - L'événement de touche qui déclenche la fermeture de la modale avec la touche Échap
 */
function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeModal(); // Ferme la modale
    }
}

/**
 * Gère la navigation avec les flèches du clavier dans la modale
 * @param {KeyboardEvent} event - L'événement de touche qui déclenche la navigation avec les flèches du clavier
 */
function handleArrowKeyNavigation(event) {
    // Sélectionne tous les éléments focusables dans la modale
    const focusableElements = document.querySelectorAll('#contact_modal .text-control, #contact_modal textarea, #contact_modal button');
    const activeElementIndex = Array.from(focusableElements).indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
        event.preventDefault(); // Empêche le comportement par défaut
        // La condition if (activeElementIndex < focusableElements.length - 1) vérifie si l'élément focalisé n'est pas déjà le dernier élément de la liste...
        if (activeElementIndex < focusableElements.length - 1) {
            // ... si ce n'est pas le cas, le code passe au prochain élément en incrémentant
            focusableElements[activeElementIndex + 1].focus();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Empêche le comportement par défaut
        // Si l'élément focalisé n'est pas déjà le premier élément de la liste..
        if (activeElementIndex > 0) {
            // ... passe à l'élément focusable précédent
            focusableElements[activeElementIndex - 1].focus();
        }
    }
}

/**
 * Gère la navigation avec la touche Tab dans la modale pour maintenir le focus à l'intérieur
 * @param {KeyboardEvent} e - L'événement de clavier qui déclenche la gestion de la touche Tab
 */
function trapFocus(element) {
    // Sélectionne tous les éléments focusables dans la modale
    const focusableElements = element.querySelectorAll(
        'button, input, textarea'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Ajoute un gestionnaire d'événements pour capturer la touche Tab. Le "9" est le code de cette touche (ou keyCode) 
    element.addEventListener('keydown', (e) => {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault(); // Empêche le comportement par défaut
                lastFocusableElement.focus(); // Passe au dernier élément focusable
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault(); // Empêche le comportement par défaut
                firstFocusableElement.focus(); // Passe au premier élément focusable
            }
        }
    });

    // Initialise le focus sur le premier élément focusable
    if (focusableElements.length) {
        firstFocusableElement.focus();
    }
}

// Fonction pour nettoyer les champs
function getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    // Si le champ n'existe pas retourne une chaîne vide donc rien à afficher
    if (!field) return '';
    // Applique trim() aux champs spécifiques
    let value = field.value;
    if (fieldId === 'first' || fieldId === 'last' || fieldId === 'email') {
        value = value.trim();
    }
    return value;
}

// Fonction qui affiche les valeurs des champs 'first', 'last' et 'email' dans la console
function logFieldValue(fieldId) {
    const value = getFieldValue(fieldId);
    if (fieldId === 'first' || fieldId === 'last' || fieldId === 'email') {
        console.log(`${fieldId}: ${value}`);
    }
}

// Fonction de test pour les champs
function validateField(fieldId) {
    // Utilise getFieldValue pour obtenir la valeur du champ
    const value = getFieldValue(fieldId);

    // Sélectionne l'élément du DOM correspondant au champ
    const field = document.getElementById(fieldId);
    if (!field) return false; // Retourne false si le champ n'existe pas

    // Définit les fonctions de validation pour chaque champ
    const validators = {
        // {2,} => le groupe de caractères précédent doit apparaître au moins 2 fois et le fait de ne pas spécifier une valeur maximale après la virgule signifie qu'il n'y a pas de limite supérieure sur le nombre d'occurrences
        // .test() = méthode des objets RegExp (expressions régulières) / "value" la valeur rentrée par l'utilisateur
        'first': value => /^[a-zA-Z]{2,}$/.test(value),
        'last': value => /^[a-zA-Z]{2,}$/.test(value),
        'email': value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9._-]+$/.test(value),
        'message': value => value.trim() !== ""
    };

    // Messages d'erreur pour chaque champ
    const errorMessages = {
        'first': "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!",
        'last': "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!",
        'email': "!! L'adresse email n'est pas valide !!",
        'message': "!! Le champ du message ne doit pas être vide !!"
    };

    // Valide le champ et récupère le message d'erreur correspondant
    const condition = validators[fieldId](value);
    const errorMessage = errorMessages[fieldId];
    // Sélectionne l'élément span pour le message d'erreur par ID
    const errorSpan = document.getElementById(`${fieldId}-error`);

    if (!condition) {
        // Affiche le message d'erreur si la validation échoue
        field.setAttribute('data-error-visible', 'true');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.setAttribute('data-error-visible', 'true');
            field.setAttribute('aria-describedby', `${fieldId}-error`);
        }
    } else {
        // Masque le message d'erreur si la validation réussit
        field.removeAttribute('data-error-visible');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.setAttribute('data-error-visible', 'false');
            field.setAttribute('aria-describedby', `${fieldId}-error`);
        }
    }

    return condition;
}

// Fonction de validation finale
function validateForm() {
    // Valide chaque champ et retourne vrai si tous les champs sont valides 
    return ['first', 'last', 'email', 'message'].every(validateField);
}


function resetForm() {
    // Sélectionne le formulaire
    const form = document.querySelector("form");
    if (form) {
        form.reset(); // Réinitialise les champs du formulaire
        // Réinitialise les messages d'erreur
        document.querySelectorAll('.error-message').forEach(span => {
            span.textContent = ''; // chaîne vide
            span.setAttribute('data-error-visible', 'false');
        });
    }
}


