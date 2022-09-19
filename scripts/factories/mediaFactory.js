export class mediaFactory {
    constructor(data) {
        this._id = data.id;
        this._photographerId = data.photographerId;
        this._title = data.title;
        this._likes = data.likes;
        this._date = data.date;
        this._price = data.price;
        this._mediaUrl = ``;
        this._mediaUrlThumbnail = ``;
        this._mediaType = "image";


        if (data.image) {
            const imageThumbnailName = data.image.split(".")[0] + "_thumbnail." + data.image.split(".")[1];

            this._mediaUrlThumbnail = `assets/images/${imageThumbnailName}`;
            this._mediaUrl = `assets/images/${data.image}`;
        } else if (data.video) {
            this._mediaUrl = `assets/videos/${data.video}`;
            this._mediaType = "video";
        }
    }

    /**
     * Get media card template
     * Differences between images / videos
     * @returns {HTMLElement} 
     */
    getMediaCardDOM() {
        const card = document.createElement('article');
        card.setAttribute("aria-hidden", "false");
        card.setAttribute("aria-controls", "merde");
        const container = document.createElement("div");
        container.classList.add("media_container");
        container.setAttribute("role", "button");
        container.setAttribute("tabIndex", '0');
        container.setAttribute("aria-label", this._title + ", vue agrandie");

        let media = ``;
        if ("image" == this._mediaType) {
            media = document.createElement("img");
            media.setAttribute("src", this._mediaUrlThumbnail);
        } else if ("video" == this._mediaType) {
            media = document.createElement("video");
            media.setAttribute("src", this._mediaUrl);
            media.setAttribute("aria-disabled", "true");
            media.setAttribute("tabindex", "-1");
        }

        media.setAttribute("witdh", "300px");
        media.setAttribute("height", "300px");
        media.setAttribute("alt", this._title);

        container.appendChild(media)
        card.appendChild(container);

        const aside = document.createElement("aside");
        aside.innerHTML = `<span class="title">${this._title}</span>`;

        const likeBtn = document.createElement("button");
        likeBtn.classList.add("likes-btn");
        likeBtn.setAttribute("value", this._likes);
        likeBtn.setAttribute("aria-label", this._likes + "like");
        likeBtn.innerHTML = `<span class="likes">${this._likes}</span>
                             <span class="hearth"><i class="fa-solid fa-heart"></i></span>`;

        aside.appendChild(likeBtn);
        card.appendChild(aside);

        return { card, container, likeBtn };
    }

    /**
     * Get Medai lightbox lightbox template
     * @returns {HTMLElement}
     */
    getMediaLightboxDOM() {
        const lightbox = document.createElement("div");
        lightbox.classList.add("modal");
        lightbox.setAttribute("id", "merde");
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-label", this._title);

        const closeBtn = document.createElement("button");
        closeBtn.setAttribute("tabindex", "3");
        closeBtn.setAttribute("aria-label", "Fermer Modale");
        closeBtn.classList.add("lightbox-btn", "lightbox-close");
        closeBtn.innerHTML = `<i class="fa-solid fa-2x fa-close"></i>`;

        const prevBtn = document.createElement("button");
        prevBtn.setAttribute("tabindex", "1");
        prevBtn.setAttribute("aria-label", "Image précédente");
        prevBtn.classList.add("lightbox-btn", "lightbox-prev");
        prevBtn.innerHTML = `<i class="fa-solid fa-2x fa-chevron-left"></i>`;

        const nextBtn = document.createElement("button");
        nextBtn.setAttribute("tabindex", "2");
        nextBtn.setAttribute("aria-label", "Image suivante");
        nextBtn.classList.add("lightbox-btn", "lightbox-next");
        nextBtn.innerHTML = `<i class="fa-solid fa-2x fa-chevron-right"></i>`;

        let media = ``;
        if ("image" == this._mediaType) {
            media = document.createElement("img");
        } else if ("video" == this._mediaType) {
            media = document.createElement("video");
            media.setAttribute("controls", true);
        }

        media.setAttribute("id", `media_${this._id}`);
        media.setAttribute("aria-label", this._title);
        media.classList.add("current-media");
        media.setAttribute("src", this._mediaUrl);
        media.setAttribute("witdh", "300px");
        media.setAttribute("height", "300px");

        const title = document.createElement("p");
        title.classList.add("title");
        title.innerHTML = this._title;

        lightbox.appendChild(prevBtn);
        lightbox.appendChild(media);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(title);

        return { lightbox, prevBtn, nextBtn, closeBtn };
    }

}