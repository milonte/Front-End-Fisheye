const mediaLightbox = document.getElementById("medias-lightbox");

/**
 * Display medias lightbox
 * @param {Object} media 
 */
async function displayLightBox(media) {

    mediaLightbox.setAttribute("aria-hidden", "false");
    enableFocusMainElements(false)

    const mediaLightboxDOM = media.getMediaLightboxDOM();
    mediaLightbox.appendChild(mediaLightboxDOM);

    document.addEventListener("keydown", lightboxKeyboardEvent)
}

/**
 * Close medias lightbox
 */
function closeLightBox() {

    mediaLightbox.setAttribute("aria-hidden", "true");
    enableFocusMainElements()

    clearLightBox();

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
function lightboxKeyboardEvent(event) {
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