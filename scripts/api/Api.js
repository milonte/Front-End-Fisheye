class Api {
    /**
     * 
     * @param {string} url 
     */
    constructor(url) {
        this._url = url
    }

    async get() {
        return fetch(this._url)
            .then(res => res.json())
            .catch(err => console.log('an error occurs', err))
    }
}

class PhotographerApi extends Api {
    /**
     * 
     * @param {string} url 
     */
    constructor(url) {
        super(url)
    }

    async getPhotographers() {
        const response = await this.get()
        return response.photographers
    }

    async getPhotographer(id) {
        const response = await this.get()
        const photographer = response.photographers.find(photo => photo.id == id)
        return photographer
    }

}

class MediaApi extends Api {
    constructor(url) {
        super(url)
    }

    async getMedias(id) {
        const response = await this.get()
        const medias = response.media.filter(med => med.photographerId == id)
        return medias
    }
}