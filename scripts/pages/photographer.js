//Mettre le code JavaScript lié à la page photographer.html

let userId = new URL(window.location).searchParams.get('userid');
const photographersSection = document.querySelector(".photograph-header");

async function getPhotographer(photographerId = null) {

    if (null === photographerId) {
        return false;
    }

    const photographer = await new PhotographerApi('data/photographers.json').getPhotographer(photographerId);

    return ({
        photographer: photographer
    })
}

async function displayData(photographer) {

    const photographerModel = photographerFactory("photographer", photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);

};

function displayError() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
        Un erreur est survenue.
        <a href="index.html">Retour à l'accueuil</a>
    `
    photographersSection.appendChild(divElement);
}

async function init() {

    if (!userId) {
        displayError();
    } else {
        const { photographer } = await getPhotographer(userId);
        if (!photographer) {
            displayError();
        } else {
            displayData(photographer);
        }
    }
};

init();