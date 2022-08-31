class mediaFactory {
    constructor(data) {
        this._id = data.id;
        this._photographerId = data.photographerId;
        this._title = data.title;
        this._likes = data.likes;
        this._date = data.date;
        this._price = data.price;
        this._mediaUrl = ``;
        this._mediaType = "image";

        if (data.image) {
            this._mediaUrl = `assets/images/${data.image}`;
        } else if (data.video) {
            this._mediaUrl = `assets/videos/${data.video}`;
            this._mediaType = "video";
        }

    }

    getMediaCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement("a");
        link.setAttribute("href", "#");

        link.addEventListener("click", event => {
            event.preventDefault();
            displayLightBox(this);
        })

        let media = ``;
        if ("image" == this._mediaType) {
            media = document.createElement("img");
        } else if ("video" == this._mediaType) {
            media = document.createElement("video");
            media.setAttribute("aria-disabled", "true");
            media.setAttribute("tabindex", "-1");
        }

        media.setAttribute("src", this._mediaUrl);
        media.setAttribute("witdh", "300px");
        media.setAttribute("height", "300px");

        link.appendChild(media)
        article.appendChild(link);

        const aside = document.createElement("aside");
        aside.innerHTML = ` 
                            <span class="title">${this._title}</span>
                            <div class="likes-container">
                                <span class="likes">${this._likes}</span>
                                <span class="hearth"><i class="fa-solid fa-heart"></i></span>
                            </div>
                            `

        article.appendChild(aside);

        return article;
    }

    getMediaLightboxDOM() {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("lightbox-btn", "lightbox-close");
        closeBtn.innerHTML = `<i class="fa-solid fa-2x fa-close"></i>`;
        closeBtn.addEventListener("click", () => {
            closeLightBox();
        })

        const prevBtn = document.createElement("button");
        prevBtn.classList.add("lightbox-btn", "lightbox-prev");
        prevBtn.innerHTML = `<i class="fa-solid fa-2x fa-chevron-left"></i>`;
        prevBtn.addEventListener("click", () => {
            changeLightBox("prev");
        })

        const nextBtn = document.createElement("button");
        nextBtn.classList.add("lightbox-btn", "lightbox-next");
        nextBtn.innerHTML = `<i class="fa-solid fa-2x fa-chevron-right"></i>`;
        nextBtn.addEventListener("click", () => {
            changeLightBox("next");
        })

        let media = ``;
        if ("image" == this._mediaType) {
            media = document.createElement("img");
        } else if ("video" == this._mediaType) {
            media = document.createElement("video");
            media.setAttribute("controls", true);
        }

        media.setAttribute("id", `media_${this._id}`)
        media.classList.add("current-media");
        media.setAttribute("src", this._mediaUrl);
        media.setAttribute("witdh", "300px");
        media.setAttribute("height", "300px");

        const title = document.createElement("p");
        title.classList.add("title");
        title.innerHTML = this._title;

        modal.appendChild(prevBtn);
        modal.appendChild(media);
        modal.appendChild(closeBtn);
        modal.appendChild(nextBtn);
        modal.appendChild(title);

        return modal;
    }

}