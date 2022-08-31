let userId = new URL(window.location).searchParams.get('userid');
const photographersSection = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".photograph-medias");
const mediaLightbox = document.getElementById("medias-lightbox");

async function getPhotographer(photographerId = null) {

    if (null === photographerId) {
        return false;
    }

    const photographer = await new PhotographerApi('data/photographers.json').getPhotographer(photographerId);

    return ({
        photographer: photographer
    })
}

async function getMedias(photographerId = null) {

    if (null === photographerId) {
        return false;
    }

    const medias = await new MediaApi('data/photographers.json').getMedias(photographerId);

    return ({
        medias: [...medias]
    })
}

async function displayPhotographer(photographer) {

    const photographerModel = photographerFactory("photographer", photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);

};

async function displayMedia(media) {
    const mediaModel = new mediaFactory(media);
    const mediaCardDOM = mediaModel.getMediaCardDOM();
    mediaSection.appendChild(mediaCardDOM);
}

function displayError() {
    const divElement = document.createElement("div");
    divElement.innerHTML = `
        Un erreur est survenue.
        <a href="index.html">Retour à l'accueuil</a>
    `
    photographersSection.appendChild(divElement);
}

async function displayLightBox(media) {
    mediaLightbox.style.display = "block";
    const mediaLightboxDOM = media.getMediaLightboxDOM();

    mediaLightbox.appendChild(mediaLightboxDOM);

}

function closeLightBox() {
    mediaLightbox.style.display = "none";
    clearLightBox();
}

async function changeLightBox(currentMedia, direction) {

    let directionIndex = 0;

    if ("prev" == direction) {
        directionIndex = -1;
    } else if ("next == direction") {
        directionIndex = 1;
    }
    const allMedias = await getMedias(userId);

    let currentIndex = allMedias.medias.findIndex((media) => media.id == currentMedia._id);
    let targetIndex = currentIndex + directionIndex;

    if (targetIndex > allMedias.medias.length - 1) {
        targetIndex = 0;
    } else if (targetIndex < 0) {
        targetIndex = allMedias.medias.length - 1;
    }


    const targetMediaModel = new mediaFactory(allMedias.medias[targetIndex]);
    const mediaLightboxDOM = targetMediaModel.getMediaLightboxDOM();
    clearLightBox();
    mediaLightbox.appendChild(mediaLightboxDOM);
}

function clearLightBox() {
    mediaLightbox.innerHTML = "";
}

async function init() {

    if (!userId) {
        displayError();
    } else {
        const { photographer } = await getPhotographer(userId);

        if (!photographer) {
            displayError();
        } else {
            const { medias } = await getMedias(userId);

            displayPhotographer(photographer);

            medias.forEach(media => {
                displayMedia(media);
            });
        }
    }
};

init();