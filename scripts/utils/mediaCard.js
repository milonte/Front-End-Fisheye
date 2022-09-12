const photographersSection = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".photograph-medias");
const photographTotalLikes = document.querySelector(".photograph-likes");
const photographPrice = document.querySelector(".photograph-price");



/**
 * Display Media Card
 * @param {Object} media 
 */
async function displayMedia(media) {
    const mediaModel = new mediaFactory(media);
    const mediaCardDOM = mediaModel.getMediaCardDOM();
    mediaSection.appendChild(mediaCardDOM);
}

/**
 * Clear all medias
 */
function clearMedias() {
    mediaSection.innerHTML = "";
}

/**
 * Filter medias by filter select value
 * 
 */
async function filterMedias() {
    const { medias } = await (getMedias(userId, filtersSelect.value));
    clearMedias();
    medias.forEach(media => {
        displayMedia(media)
    })
}
