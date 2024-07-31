////////////////////// FORMULAIRE DE CONTACT/MODALE ////////////////////////////////////
export function createModal() {
    // Crée un conteneur pour la modale
    const modalContainer = document.createElement('div');
    
    // Assigne un identifiant unique pour le conteneur de la modale
    modalContainer.id = "contact_modal";
    
    // Définit le rôle de la modale pour les technologies d'assistance
    modalContainer.role = "dialog";
    
    // Ajoute une classe CSS pour le style de fond de la modale
    modalContainer.className = "bckg_modal";
    
    // Décrit le titre de la modale pour les technologies d'assistance
    modalContainer.setAttribute('aria-labelledby', "Contactez-moi");
    
    // Cache la modale par défaut
    modalContainer.style.display = "none";

    // Définit le contenu HTML de la modale
    modalContainer.innerHTML = `
    <div class="modal">
        <header>
            <div class="modal-header-content">
                <h2 id="Contactez-moi">Contactez-moi</h2>
                <div class="photographer-name"></div> 
            </div>
            <button class="modal_close" aria-label="bouton de fermeture" type="button"></button>
        </header>
        <form name="contactForm" action="" method="get" novalidate>
            <div>
                <label for="first" id="label-first">Prénom</label>
                <input class="text-control" type="text" id="first" name="first" aria-labelledby="label-first" />
                <span class="error-message"></span>
            </div>
            <div>
                <label for="last" id="label-last">Nom</label>
                <input class="text-control" type="text" id="last" name="last" aria-labelledby="label-last" />
                <span class="error-message"></span>
            </div>
            <div>
                <label for="email" id="label-email">E-mail</label>
                <input class="text-control" type="email" id="email" name="email" aria-labelledby="label-email" />
                <span class="error-message"></span>
            </div>
            <div>
                <label for="message" id="label-message">Votre message</label>
                <textarea name="message" id="message" class="text-control" aria-labelledby="label-message"></textarea>
                <span class="error-message"></span>
            </div>
            <button class="submit_button" type="submit" aria-label="envoyer">Envoyer</button>
        </form>
    </div>
`;

    // Ajoute le conteneur de la modale au body du document
    document.body.appendChild(modalContainer);

    // Ajoute des gestionnaires d'événements aux champs du formulaire pour la validation et le logging
    const fields = ['first', 'last', 'email', 'message'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Ajoute un écouteur d'événement pour la perte de focus (blur)
            field.addEventListener('blur', () => {
                validateField(fieldId); // Valide le champ
                logFieldValue(fieldId); // Logge la valeur du champ
            });
        }
    });

    // Ajoute un gestionnaire d'événements pour la soumission du formulaire
    document.querySelector("form").addEventListener("submit", function(event) {
        if (!validateForm()) {
            // Si le formulaire n'est pas valide, empêche la soumission
            event.preventDefault();
        } else {
            // Si le formulaire est valide
            event.preventDefault(); // Empêche la soumission réelle
            const photographerId = new URLSearchParams(window.location.search).get('id');
            if (photographerId) {
                // Redirige vers la page du photographe avec l'ID dans l'URL
                window.location.href = `photographer.html?id=${photographerId}`;
                // Réinitialise le formulaire après un petit délai pour permettre la redirection
                setTimeout(() => {
                    resetForm(); // Réinitialise les champs du formulaire
                }, 100);
            }
        }
    });

    // Assure que le bouton de fermeture a un gestionnaire d'événement pour fermer la modale
    const closeButton = document.querySelector('.modal_close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
}

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

export function closeModal() {
    toggleModal(false); // Masque la modale

    // Retire le gestionnaire de la navigation avec les flèches du clavier lorsqu'elle est fermée
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
            // Assure que le focus reste dans la modale
            trapFocus(modal);
            // Ajoute un gestionnaire pour fermer la modale avec la touche Échap
            document.addEventListener('keydown', handleEscKey);
        } else {
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
        if (activeElementIndex < focusableElements.length - 1) {
            // Passe au prochain élément focusable
            focusableElements[activeElementIndex + 1].focus();
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Empêche le comportement par défaut
        if (activeElementIndex > 0) {
            // Passe à l'élément focusable précédent
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

    // Ajoute un gestionnaire d'événements pour capturer la touche Tab. Le "9" est un code de touche (ou keyCode) correspondant à la touche Tabulation (Tab) du clavier
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

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return false;

    // Utilise trim() pour les champs 'first' et 'last' afin d'éliminer les espaces superflus
    let value = field.value;
    if (fieldId === 'first' || fieldId === 'last') {
        value = value.trim();
    }

    // Définit les fonctions de validation pour chaque champ
    const validators = {
        // {2,} => le groupe de caractères précédent doit apparaître au moins 2 fois et le fait de ne pas spécifier une valeur maximale après la virgule signifie qu'il n'y a pas de limite supérieure sur le nombre d'occurrences
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
    const errorSpan = field.nextElementSibling;

    if (!condition) {
        // Affiche le message d'erreur si la validation échoue
        field.setAttribute('data-error-visible', 'true');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.setAttribute('data-error-visible', 'true');
        }
    } else {
        // Masque le message d'erreur si la validation réussit
        field.removeAttribute('data-error-visible');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.setAttribute('data-error-visible', 'false');
        }
    }

    return condition;
}

function logFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Utilise trim() pour les champs 'first' et 'last' afin d'éliminer les espaces superflus
    let value = field.value;
    if (fieldId === 'first' || fieldId === 'last') {
        value = value.trim();
    }

    // Affiche les valeurs des champs 'first', 'last' et 'email' dans la console
    if (fieldId === 'first' || fieldId === 'last' || fieldId === 'email') {
        console.log(`${fieldId}: ${value}`);
    }
}

function resetForm() {
    // Sélectionne le formulaire
    const form = document.querySelector("form");
    if (form) {
        form.reset(); // Réinitialise les champs du formulaire
        // Réinitialise les messages d'erreur
        document.querySelectorAll('.error-message').forEach(span => {
            span.textContent = '';
            span.setAttribute('data-error-visible', 'false');
        });
    }
}

export function validateForm() {
    // Valide chaque champ et retourne vrai si tous les champs sont valides
    return ['first', 'last', 'email', 'message'].every(validateField);
}
