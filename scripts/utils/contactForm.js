const form = document.querySelector("form");
const formInputs = document.querySelectorAll(".text-control"); // All inputs form
const firstNameInput = document.getElementById("first"); // 1st form input (firstName)
const lastNameInput = document.getElementById("last"); // 2nd form input (lastName)
const emailInput = document.getElementById("email"); // 3rd form input (email)
const messageInput = document.getElementById("message"); // 4th form input (message)

/**
 * Display error message & border error after input
 * @param  {HTMLElement} input - Display message will be display after this element
 * @param  {string} message - Message to display
 * @return {void}
 */
function displayError(form, message) {
    form.setAttribute('data-error', message);
    form.setAttribute("data-error-visible", "true");
    form.removeAttribute("data-success");
}

/**
 * Remove error messages & display success border
 * @param {HTMLElement} form 
 * @return {void}
 */
function displaySuccess(form) {
    form.removeAttribute('data-error');
    form.removeAttribute("data-error-visible");
    form.setAttribute("data-success", "true");
}

/**
 * Check if value have minimum length
 * @param {string} value - string to check length
 * @param {int} length - minimum length wanted
 * @return {bool}
 */
function hasMinimimLength(value, length) {
    return length <= value.length;
}

/**
 * Check name format
 * @param {string} value 
 * @returns 
 */
function isName(value) {
    // source https://stackoverflow.com/questions/275160/regex-for-names#2044909
    return (/^[a-zA-Z][a-zA-Z '&-]*[A-Za-z]$/.test(value));
}

/**
 * Check email format with regex
 * @param {string} value - string to check format
 * @returns {bool}
 */
function isEmail(value) {
    // source https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html
    return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value));
}

function isValid(inputName) {

    switch (inputName) {

        // FirstName Input
        case 'first': {
            // check first name length
            if (!hasMinimimLength(firstNameInput.value, 2)) {
                displayError(firstNameInput.parentElement, "Nécéssite 2 caractères minimum");
                return false;
            } else if (!isName(firstNameInput.value)) {
                displayError(firstNameInput.parentElement, "Le format du prénom n'est pas valide");
                return false;
            } else {
                displaySuccess(firstNameInput.parentElement);
                return true;
            }
        }

        // LastName Input
        case 'last': {
            // check last name length
            if (!hasMinimimLength(lastNameInput.value, 2)) {
                displayError(lastNameInput.parentElement, "Nécéssite 2 caractères minimum");
                return false;
            } else if (!isName(lastNameInput.value)) {
                displayError(lastNameInput.parentElement, "Le format du prénom n'est pas valide");
                return false;
            } else {
                displaySuccess(lastNameInput.parentElement);
                return true;
            }
        }

        // Email Input
        case 'email': {
            // check email format
            if (!isEmail(emailInput.value)) {
                displayError(emailInput.parentElement, "Le format de l'email n'est pas valide");
                return false;
            } else {
                displaySuccess(emailInput.parentElement);
                return true;
            }
        }

        // Message Input
        case 'message': {
            if (!hasMinimimLength(messageInput.value, 10)) {
                displayError(messageInput.parentElement, "Nécéssite 10 caractères minimum");
                return false;
            } else {
                displaySuccess(messageInput.parentElement);
                return true;
            }
        }
    }
}

form.addEventListener("submit", event => {
    // prevent reload page after form validation
    event.preventDefault();

    // if no errors, can send form
    let validation = true;

    // on submit, verify all inputs
    // if error detected, set validation to false
    // and don"t send form

    // all text control inputs
    formInputs.forEach(input => {
        if (!isValid(input.id)) { validation = false }
    })

    // if form is valid
    if (validation) {
        // send response to ...
        const jsonResponse = {
            'firstname': firstNameInput.value,
            'lastname': lastNameInput.value,
            'email': emailInput.value,
            'message': messageInput.value
        };

        // this console.log is wanted, don't remove it !!
        console.log(jsonResponse);

        // reset modal form after send request
        form.reset();
    }

    // return true and valid form if no errors
    // return false and don't valid form if error detected
    return validation;
});

// check all text inputs
formInputs.forEach(input => {
    input.addEventListener('input', event => {
        isValid(event.target.id)
    })
})