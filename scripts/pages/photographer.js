let userId = new URL(window.location).searchParams.get('userid');

const mediasSection = document.querySelector(".photograph-medias");;
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

/**
 * Display Photographer Header
 * @param {Object} photographer 
 */
async function displayPhotographer(photographer) {
    const photographerModel = photographerFactory("photographer", photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
};

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
 * 
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
}

async function init() {

    if (!userId) {
        displayPageError();
    } else {
        const { photographer } = await getPhotographer(userId);

        if (!photographer) {
            displayPageError();
        } else {
            const { medias } = await getMedias(userId);

            displayPhotographer(photographer);

            medias.forEach(media => {
                displayMedia(media);
            });

            displayTotalLikes(medias);
            displayPrice(photographer);

            document.querySelectorAll(".likes-btn").forEach(like => {
                like.addEventListener("click", () => {
                    updateLikes(like);
                })
            });

            filtersSelect.addEventListener("change", () => {
                filterMedias();
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


    }
};

init();

