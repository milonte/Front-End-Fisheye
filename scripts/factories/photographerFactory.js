function photographerFactory(data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {


        const article = document.createElement('article');

        article.innerHTML = `<a href="photographer.html?userid=${id}" role="link"
                                aria-label="${name}. ${city} ${country}. ${tagline}. ${price} € par jour">
                                <img alt="${name}" src="${picture}" width="320px" height="240px" />
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