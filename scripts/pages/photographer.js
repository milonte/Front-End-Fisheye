import { PhotographerApi, MediaApi } from "../api/Api.js";
import { photographerFactory } from "../factories/photographerFactory.js";
import { mediaFactory } from "../factories/mediaFactory.js";

let userId = new URL(window.location).searchParams.get('userid');

const mediasSection = document.querySelector(".photograph-medias");

const filtersSelect = document.getElementById("filters-select");
filtersSelect.value = "popular";

const photographersSection = document.querySelector(".photograph-header");
const photographTotalLikes = document.querySelector(".photograph-likes");
const photographPrice = document.querySelector(".photograph-price");

const closeModalBtn = document.querySelector(".close_modal_btn"); // close modal button

var allMedias = null;

async function init() {

    if (!userId) {
        displayPageError();
    } else {
        const { photographer } = await getPhotographer(userId);

        if (!photographer) {
            displayPageError();
        } else {

            document.title = 'Fisheye - ' + photographer.name;

            allMedias = await getMedias(photographer.id).then(resp => resp.medias);

            displayPhotographer(photographer);

            allMedias.forEach(media => {
                displayMedia(media);
            });

            displayTotalLikes(allMedias);
            displayPrice(photographer);

            document.querySelectorAll(".likes-btn").forEach(like => {
                like.addEventListener("click", () => {
                    updateLikes(like);
                })
            });

            filtersSelect.addEventListener("change", () => {
                sortMedias();
                const allOptions = filtersSelect.querySelectorAll('option');
                allOptions.forEach(option => {
                    option.removeAttribute("selected")
                })

                const currentOption = filtersSelect.querySelector(`option[value='${filtersSelect.value}']`);
                currentOption.setAttribute("selected");
            })

            /* Display contact Form */
            document.querySelector(".contact_button").addEventListener("click", () => {
                displayModal(photographer.name);
            });

            closeModalBtn.addEventListener("click", closeModal);

        }
    }
}

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

/**
 * Display Photographer Header
 * @param {Object} photographer 
 */
async function displayPhotographer(photographer) {
    const photographerModel = photographerFactory("photographer", photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
}

/**
 * Display photographer error page
 * if photographer is not found
 */
function displayPageError() {
    const div = document.createElement("div");
    div.classList.add("page_error");
    div.innerHTML = "Cette page n'existe pas.";
    const link = document.createElement("a");
    link.innerHTML = "Retour à l'accueil";
    link.setAttribute("href", "index.html");
    div.appendChild(link);
    photographersSection.appendChild(div);
}

/**
 * Enable / disable tabindex for some elements in main page content
 * Used for media Lightbox and contact modal
 * @param {boolean} show 
 */
function enableFocusMainElements(show = true) {

    const logo = document.querySelector("header a");
    const mediaContainers = mediasSection.querySelectorAll('.media_container');
    const contactBtn = document.querySelector(".contact_button");
    const likedBtns = document.querySelectorAll(".likes-btn");

    if (show) {
        logo.removeAttribute("aria-disabled", "true");
        logo.removeAttribute("tabindex", "-1");
        mediaContainers.forEach(container => {
            container.removeAttribute("aria-disabled");
            container.removeAttribute("tabindex", "-1");
            container.setAttribute("tabindex", "0");
        })
        contactBtn.removeAttribute("aria-disabled");
        contactBtn.removeAttribute("tabindex", "-1");
        likedBtns.forEach(btn => {
            btn.removeAttribute("aria-disabled", "true");
            btn.removeAttribute("tabindex", "-1");
        })
        filtersSelect.removeAttribute("aria-disabled", "true");
        filtersSelect.removeAttribute("tabindex", "-1");
        document.querySelector("body").style.overflow = "scroll";
    } else {
        logo.setAttribute("aria-disabled", "true");
        logo.setAttribute("tabindex", "-1");

        mediaContainers.forEach(container => {
            container.setAttribute("aria-disabled", "true");
            container.setAttribute("tabindex", "-1");
        })
        contactBtn.setAttribute("aria-disabled", "true");
        contactBtn.setAttribute("tabindex", "-1");
        likedBtns.forEach(btn => {
            btn.setAttribute("aria-disabled", "true");
            btn.setAttribute("tabindex", "-1");
        })
        filtersSelect.setAttribute("aria-disabled", "true");
        filtersSelect.setAttribute("tabindex", "-1");
        document.querySelector("body").style.overflow = "hidden";
    }
}

const mediaLightbox = document.getElementById("medias-lightbox");

/**
 * Display medias lightbox
 * @param {Object} media 
 */
async function displayLightBox(media) {

    mediaLightbox.setAttribute("aria-hidden", "false");
    enableFocusMainElements(false);

    const mediaLightboxDOM = new mediaFactory(media).getMediaLightboxDOM();
    mediaLightbox.appendChild(mediaLightboxDOM.lightbox);

    /*
    Enable Keydown Listeners
    Left / Right Arrow to navigate previous / next media
    Espace to close Lightbox
    Space to play video
    */
    document.addEventListener("keydown", lightboxKeyboardEvent);

    /*
    Lightbox navigation click buttons listeners
    */
    mediaLightboxDOM.prevBtn.addEventListener("click", () => {
        changeLightBox("prev");
    })
    mediaLightboxDOM.nextBtn.addEventListener("click", () => {
        changeLightBox("next");
    })
    mediaLightboxDOM.closeBtn.addEventListener("click", () => {
        closeLightBox();
    })
}

/**
 * Close medias lightbox
 */
function closeLightBox() {
    // hide lightbox
    mediaLightbox.setAttribute("aria-hidden", "true");
    // Restore focuseable elements on main page
    enableFocusMainElements()
    // Remove Lightbox HTML content
    clearLightBox();
    // Remove Keyboard listenet for Lightbox
    document.removeEventListener("keydown", lightboxKeyboardEvent)
}

/**
 * Display prev / next media
 * @param {string} direction - "prev" or "next"
 */
async function changeLightBox(direction) {


    let directionIndex = 0;
    if ("prev" == direction) {
        directionIndex = -1;
    } else if ("next" == direction) {
        directionIndex = 1;
    }

    let currentMediaId = document.querySelector(".current-media").attributes.id.value.split("_")[1];
    let currentIndex = allMedias.findIndex((media) => media.id == currentMediaId);
    let targetIndex = currentIndex + directionIndex;

    if (targetIndex > allMedias.length - 1) {
        targetIndex = 0;
    } else if (targetIndex < 0) {
        targetIndex = allMedias.length - 1;
    }
    // Remove Lightbox HTML content
    clearLightBox();
    // Display Prev / Next media on Lightbox
    displayLightBox(allMedias[targetIndex]);

}

/**
 * Clear Lightbox
 */
function clearLightBox() {
    mediaLightbox.innerHTML = "";
}

/**
 * Keyboard Events used for LightBox
 * @param {Event} event 
 */
async function lightboxKeyboardEvent(event) {
    const currentMedia = document.querySelector(".current-media");

    if ("ArrowLeft" == event.key) {
        changeLightBox("prev")
    } else if ("ArrowRight" == event.key) {
        changeLightBox("next")
    } else if ("Escape" == event.key) {
        closeLightBox();
    }

    // Play video on press "Space" key (if media is video)
    if (" " == event.key) {
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

/**
 * Display Media Card
 * @param {Object} media 
 */
async function displayMedia(media) {
    const mediaModel = new mediaFactory(media);
    const mediaCardDOM = mediaModel.getMediaCardDOM();

    /* display Lightbox Listeners */
    mediaCardDOM.container.addEventListener("click", event => {
        event.preventDefault();
        displayLightBox(media);
    });
    mediaCardDOM.container.addEventListener("keydown", event => {
        if ('Enter' == event.key) {
            event.preventDefault();
            displayLightBox(media);
        }
    });

    mediasSection.appendChild(mediaCardDOM.card);

}

/**
 * Clear all medias
 */
function clearMedias() {
    mediasSection.innerHTML = "";
}

/**
 * Sort medias by filter select value
 */
async function sortMedias() {
    let sortedMedias;
    await (getMedias(userId, filtersSelect.value))
        .then(response => sortedMedias = response.medias);

    clearMedias();
    sortedMedias.forEach(media => {
        displayMedia(media)
    })
}

/**
 * Display total likes
 * @param {Array} medias 
 */
async function displayTotalLikes(medias) {
    let likes = 0;

    medias.forEach(media => {
        likes += media.likes;
    })

    photographTotalLikes.innerHTML = likes;
}

async function displayPrice(photographer) {
    photographPrice.innerHTML = photographer.price;
}

/**
 * udpate likes counter on click
 * @param {HTMLElement} like 
 */
function updateLikes(like) {
    if (like.classList.contains("liked")) {
        like.value--;
        like.classList.remove('liked');
        photographTotalLikes.innerHTML--;
    } else {
        like.value++;
        like.classList.add('liked');
        photographTotalLikes.innerHTML++;
    }
    like.querySelector(".likes").innerHTML = like.value;
    like.setAttribute("aria-label", like.value + "like");
}

/**
 * Display contact form modal
 * @param {string} name - Name of Photographer
 * @return {void}
 */
function displayModal(name) {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.removeAttribute("aria-hidden");
    const contactNameSpan = document.querySelector(".contact-name");
    contactNameSpan.innerHTML = name;
    enableFocusMainElements(false);
    document.addEventListener("keydown", contactKeyboardEvent);
}

/**
 * Close contact form modal
 * @return {void}
 */
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    enableFocusMainElements()
    document.removeEventListener("keydown", contactKeyboardEvent);
}

/**
 * Keyboard Events used for Contact Modal
 * @param {Event} event 
 */
async function contactKeyboardEvent(event) {
    if ("Escape" == event.key) {
        closeModal();
    }
}

init();

