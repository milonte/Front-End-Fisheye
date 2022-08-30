function photographerFactory(data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {


        const article = document.createElement('article');

        article.innerHTML = `<a href="photographer.html?userid=${id}">
                                <img src="${picture}" alt="${name}" />
                                <h2>${name}</h2>
                            </a>
                            <aside>
                                <p class="city">${city}, ${country}</p>
                                <p class="tagline">${tagline}</p>
                                <p class="price">${price}€/jour</p>
                            </aside>`;


        return (article);
    }

    return { name, picture, getUserCardDOM }
}