export function createModal() {
    const modalContainer = document.createElement('div');
    modalContainer.id = "contact_modal";
    modalContainer.role = "dialog";
    modalContainer.className = "bckg_modal";
    modalContainer.setAttribute('aria-labelledby', "Contactez-moi");
    modalContainer.style.display = "none"; // Modale cachée au départ
    

    modalContainer.innerHTML = `
        <div class="modal">
            <header>
                <div class="modal-header-content">
                    <h2 id="Contactez-moi">Contactez-moi</h2>
                    <div class="photographer-name"></div> 
                </div>
                <span class="modal_close" aria-label="bouton de fermeture"></span>
            </header>
            <form name="contactForm" action="" method="get" novalidate>
                <div>
                    <label for="first">Prénom</label>
                    <input class="text-control" type="text" id="first" name="first" aria-labelledby="first" />
                    <span class="error-message"></span>
                </div>
                <div>
                    <label for="last">Nom</label>
                    <input class="text-control" type="text" id="last" name="last" aria-labelledby="last" />
                    <span class="error-message"></span>
                </div>
                <div>
                    <label for="email">E-mail</label>
                    <input class="text-control" type="email" id="email" name="email" aria-labelledby="email" />
                    <span class="error-message"></span>
                </div>
                <div>
                    <label for="message">Votre message</label>
                    <textarea name="message" id="message" class="text-control" aria-labelledby="message"></textarea>
                    <span class="error-message"></span>
                </div>
                <button class="submit_button" type="submit" aria-label="envoyer">Envoyer</button>
            </form>
        </div>
    `;

    document.body.appendChild(modalContainer);

    // Ajout des gestionnaires d'événements pour la validation
    const fields = ['first', 'last', 'email', 'message'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
        }
    });
    
    // Gestionnaire pour la validation du formulaire
    document.querySelector("form").addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault(); // Empêche le navigateur de gérer la soumission si les validations échouent
        }
    });
}

export function openModal() {
    toggleModal(true);
}


export function closeModal() {
    toggleModal(false);
}

function toggleModal(show) {
    const modal = document.getElementById("contact_modal");
    if (modal) {
        modal.style.display = show ? "block" : "none";
        document.body.classList.toggle('no-scroll', show);
    }
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return false;

    const validators = {
        'first': value => /^[a-zA-Z]{2,}$/.test(value),
        'last': value => /^[a-zA-Z]{2,}$/.test(value),
        'email': value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value),
        'message': value => value.trim() !== ""
    };

    const errorMessages = {
        'first': "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!",
        'last': "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!",
        'email': "!! L'adresse email n'est pas valide !!",
        'message': "!! Le champ du message ne doit pas être vide !!"
    };

    const condition = validators[fieldId](field.value);
    const errorMessage = errorMessages[fieldId];
    const errorSpan = field.nextElementSibling;

    if (!condition) {
        field.setAttribute('data-error-visible', 'true');
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.setAttribute('data-error-visible', 'true');
        }
    } else {
        field.removeAttribute('data-error-visible');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.setAttribute('data-error-visible', 'false');
        }
    }

    return condition;
}

export function validateForm() {
    return ['first', 'last', 'email', 'message'].every(validateField);
}
