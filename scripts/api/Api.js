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

    async getMedias(id, sortBy = null) {
        const response = await this.get()
        const medias = response.media.filter(med => med.photographerId == id)

        if (null !== sortBy) {
            medias.sort((a, b) => {
                if ("popular" == sortBy) {
                    return b.likes - a.likes
                } else if ("date" == sortBy) {
                    return b.date - a.date
                } else if ("title" == sortBy) {
                    return a.title.localeCompare(b.title)
                }
            })
        }
        return medias
    }
}