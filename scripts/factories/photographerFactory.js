export function photographerFactory(page, data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    const article = document.createElement('article');

    let card = ``;

    if ("home" == page) {
        card = `<a href="photographer.html?userid=${id}" role="link"
                    aria-label="${name}. ${city} ${country}. ${tagline}. ${price} € par jour">
                    <img alt="${name}" src="${picture}" width="320px" height="240px" />
                    <h2>${name}</h2>
                </a>
                <aside>
                    <p class="city">${city}, ${country}</p>
                    <p class="tagline">${tagline}</p>
                    <p class="price">${price}€/jour</p>
                </aside>`;

    } else if ("photographer" == page) {
        card = `
            <div class="infos">
                <h1>${name}</h2>
                <p class="city">${city}, ${country}</p>
                <p class="tagline">${tagline}</p>
            </div>
            <button class="contact_button">Contactez-moi</button>
            <img alt="${name}" src="${picture}" width="320px" height="240px" />
        `
    } else {
        card = `<div>
                Un erreur est survenue.
                < a href="index.html"> Retour à l'accueuil</a>
                </div >`
    }

    function getUserCardDOM() {
        article.innerHTML = card;

        return (article);
    }

    return { name, picture, getUserCardDOM }
}