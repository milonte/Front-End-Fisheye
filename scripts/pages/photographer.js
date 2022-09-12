let userId = new URL(window.location).searchParams.get('userid');
const mainSection = document.querySelector("main");
const headerSection = document.querySelector("header");;
const photographersSection = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".photograph-medias");
const mediaLightbox = document.getElementById("medias-lightbox");
const formModal = document.getElementById("contact_modal");
const filtersSelect = document.getElementById("filters-select");
filtersSelect.value = "popular";

async function getPhotographer(photographerId = null) {

    if (null === photographerId) {
        return false;
    }

    const photographer = await new PhotographerApi('data/photographers.json').getPhotographer(photographerId);

    return ({
        photographer: photographer
    })
}

async function getMedias(photographerId = null, sortBy = "popular") {

    if (null === photographerId) {
        return false;
    }

    const medias = await new MediaApi('data/photographers.json').getMedias(photographerId, sortBy);

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

function clearMedias() {
    mediaSection.innerHTML = "";
}

async function filterMedias() {
    const { medias } = await (getMedias(userId, filtersSelect.value));
    clearMedias();
    medias.forEach(media => {
        displayMedia(media)
    })
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

    mediaLightbox.setAttribute("aria-hidden", "false");
    enableFocusMainElements(false)

    const mediaLightboxDOM = media.getMediaLightboxDOM();
    mediaLightbox.appendChild(mediaLightboxDOM);

    document.addEventListener("keydown", keyboardEvent)

}

async function displayLikes(photographer, medias) {
    let likes = 0;

    medias.forEach(media => {
        likes += media.likes;
    })

    document.querySelector(".photograph-likes").innerHTML = likes;
    document.querySelector(".photograph-price").innerHTML = photographer.price;

}

function closeLightBox() {

    mediaLightbox.setAttribute("aria-hidden", "true");
    enableFocusMainElements()

    clearLightBox();

    document.removeEventListener("keydown", keyboardEvent)
}

async function changeLightBox(direction) {

    let directionIndex = 0;

    if ("prev" == direction) {
        directionIndex = -1;
    } else if ("next == direction") {
        directionIndex = 1;
    }
    const allMedias = await getMedias(userId);

    let currentMediaId = document.querySelector(".current-media").attributes.id.value.split("_")[1];

    let currentIndex = allMedias.medias.findIndex((media) => media.id == currentMediaId);
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

function keyboardEvent(event) {
    const currentMedia = document.querySelector(".current-media");
    if ("ArrowLeft" == event.key) {
        changeLightBox("prev")
    } else if ("ArrowRight" == event.key) {
        changeLightBox("next")
    } else if ("Escape" == event.key) {
        closeLightBox();
    }

    if ("Enter" == event.key) {
        event.preventDefault();
        if ("VIDEO" == currentMedia.tagName) {
            if (currentMedia.paused) {

                currentMedia.play()
            } else {
                currentMedia.pause()
            }
        }
    }
}

function enableFocusMainElements(bool = true) {

    const headerLink = headerSection.querySelector('a');
    const contactBtn = document.querySelector(".contact_button");
    const mediaCards = document.querySelectorAll("article a");
    const likedBtns = document.querySelectorAll(".likes-btn");

    if (bool) {
        headerLink.removeAttribute("aria-disabled");
        headerLink.removeAttribute("tabindex", "-1");
        contactBtn.removeAttribute("aria-disabled");
        contactBtn.removeAttribute("tabindex", "-1");
        mediaCards.forEach(card => {
            card.removeAttribute("aria-disabled");
            card.removeAttribute("tabindex", "-1");
        })
        likedBtns.forEach(btn => {
            btn.removeAttribute("aria-disabled", "true");
            btn.removeAttribute("tabindex", "-1");
        })
        filtersSelect.removeAttribute("aria-disabled", "true");
        filtersSelect.removeAttribute("tabindex", "-1");
        document.querySelector("body").style.overflow = "scroll";
    } else {
        headerLink.setAttribute("aria-disabled", "true");
        headerLink.setAttribute("tabindex", "-1");
        contactBtn.setAttribute("aria-disabled", "true");
        contactBtn.setAttribute("tabindex", "-1");
        mediaCards.forEach(card => {
            card.setAttribute("aria-disabled", "true");
            card.setAttribute("tabindex", "-1");
        })
        likedBtns.forEach(btn => {
            btn.setAttribute("aria-disabled", "true");
            btn.setAttribute("tabindex", "-1");
        })
        filtersSelect.setAttribute("aria-disabled", "true");
        filtersSelect.setAttribute("tabindex", "-1");
        document.querySelector("body").style.overflow = "hidden";
    }
}

async function init() {

    if (!userId) {
        displayError();
    } else {
        const { photographer } = await getPhotographer(userId);
        const { medias } = await getMedias(userId);

        if (!photographer) {
            displayError();
        } else {
            const { medias } = await getMedias(userId);

            displayPhotographer(photographer);
            displayLikes(photographer, medias);

            medias.forEach(media => {
                displayMedia(media);
            });
        }

        document.querySelectorAll(".likes-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                if (btn.classList.contains("liked")) {
                    btn.value--;
                    btn.classList.remove('liked');
                    document.querySelector(".photograph-likes").innerHTML--;
                } else {
                    btn.value++;
                    btn.classList.add('liked');
                    document.querySelector(".photograph-likes").innerHTML++;
                }
                btn.querySelector(".likes").innerHTML = btn.value;
            })

        });

        filtersSelect.addEventListener("change", () => {
            const allOptions = filtersSelect.querySelectorAll('option');
            allOptions.forEach(option => {
                option.removeAttribute("selected")
            })

            const currentOption = filtersSelect.querySelector(`option[value='${filtersSelect.value}']`);
            currentOption.setAttribute("selected", true);
        })

        document.querySelector(".contact_button").addEventListener("click", () => {
            displayModal(photographer.name);
        });

    }


};

init();

