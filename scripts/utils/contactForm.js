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
                <div class="formData">
                    <label id="First" for="first">Prénom</label><br />
                    <input class="text-control" type="text" id="first" name="first" aria-labelledby="First" /><br />
                </div>
                <div class="formData">
                    <label id="Last" for="last">Nom</label><br />
                    <input class="text-control" type="text" id="last" name="last" aria-labelledby="Last" /><br />
                </div>
                <div class="formData">
                    <label id="Email" for="email">E-mail</label><br />
                    <input class="text-control" type="email" id="email" name="email" aria-labelledby="Email" /><br />
                </div>
                <div class="formData">
                    <label id="Message" for="message">Votre message</label><br />
                    <textarea name="message" id="message" rows="10" class="text-control" aria-labelledby="Message"></textarea><br />
                </div>
                <button class="submit_button" type="submit" aria-label="envoyer">Envoyer</button>
            </form>
        </div>
    `;

    document.body.appendChild(modalContainer);

    // Ajout des gestionnaires d'événements pour la validation
    document.getElementById("first").addEventListener("blur", validateFirstName);
    document.getElementById("last").addEventListener("blur", validateLastName);
    document.getElementById("email").addEventListener("blur", validateEmail);
    document.getElementById("message").addEventListener("blur", validateMessage);

    document.querySelector("form").addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault(); // Empêche la soumission du formulaire si les validations échouent
        }
    });
}



export function openModal() {
    const modal = document.getElementById("contact_modal");
    if (modal) {
        modal.style.display = "block";
        document.body.classList.add('no-scroll');
    }
}

export function closeModal() {
    const modal = document.getElementById("contact_modal");
    if (modal) {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
}

function validateField(field, condition, errorMessage) {
    if (!condition) {
        field.setAttribute('data-error', errorMessage);
        field.setAttribute('data-error-visible', 'true');
        return false;
    } else {
        field.removeAttribute('data-error');
        field.removeAttribute('data-error-visible');
        return true;
    }
}

function validateFirstName() {
    const firstNameField = document.getElementById("first");
    const regex = /^[a-zA-Z]+$/;
    const condition = firstNameField.value.length >= 2 && regex.test(firstNameField.value);
    return validateField(firstNameField, condition, "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!");
}

function validateLastName() {
    const lastNameField = document.getElementById("last");
    const regex = /^[a-zA-Z]+$/;
    const condition = lastNameField.value.length >= 2 && regex.test(lastNameField.value);
    return validateField(lastNameField, condition, "!! Le champ doit contenir au moins 2 lettres / Les chiffres ne sont pas autorisés !!");
}

function validateEmail() {
    const emailField = document.getElementById("email");
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+/;
    const condition = regex.test(emailField.value);
    return validateField(emailField, condition, "!! L'adresse email n'est pas valide !!");
}

function validateMessage() {
    const messageField = document.getElementById("message");
    const condition = messageField.value.trim() !== "";
    return validateField(messageField, condition, "!! Le champ du message ne doit pas être vide !!");
}

function validateForm() {
    const isValidFirstName = validateFirstName();
    const isValidLastName = validateLastName();
    const isValidEmail = validateEmail();
    const isValidMessage = validateMessage();

    return isValidFirstName && isValidLastName && isValidEmail && isValidMessage;
}
