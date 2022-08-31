class mediaFactory {
    constructor(data) {
        this._id = data.id;
        this._photographerId = data.photographerId;
        this._title = data.title;
        this._likes = data.likes;
        this._date = data.date;
        this._price = data.price;
        this._media = ``;

        if (data.image) {
            this._media = `<img src="assets/images/${data.image}" witdh="300px" height="300px" />`;
        } else if (data.video) {
            this._media = `
                <video src="assets/videos/${data.video}" tabindex="-1" width="300" height="300">
                </video>
                `
        }

    }

    getMediaCardDOM() {
        const article = document.createElement('article');

        article.innerHTML = `<a href="">${this._media}</a>
                            <aside>
                                <span class="title">${this._title}</span>
                                <div class="likes-container">
                                    <span class="likes">${this._likes}</span>
                                    <span class="hearth"><i class="fa-solid fa-heart"></i></span>
                                </div>
                            </aside>`

        return article;
    }

}