////////// SQUELETTE DE CHAQUE VIGNETTE ///////////////
export function photographerTemplate(data) {
    // Nom du photographe et nom de l'image = données JSON
    const { id,name, portrait, city, country, tagline, price } = data;
    // Chemin vers l'image selon son Nom dans dossier img
    const picture = `assets/photographers/Photographers ID Photos/${portrait}`;
    console.log('Chemin de l\'image :', picture); // Debugging

    function getUserCardDOM() {
        // Création de la vignette avec la balise <article>...
        const article = document.createElement( 'article' );


        // Création du lien qui entoure et encapsule l'img et le h2
        const link = document.createElement('a');
        link.setAttribute("href", `photographer.html?id=${id}`);
        // Rendre focusable via la navigation au clavier
        // L'attribut "tabindex" est utilisé pour contrôler l'ordre de tabulation des éléments focusables dans la page web. L'ordre de tabulation est la séquence dans laquelle les éléments reçoivent le focus lorsque l'utilisateur navigue dans la page en utilisant la touche Tab. "0" c'est à dire focusable dans l'ordre naturel du document donc inclus dans l'ordre de tabulation par défaut de la page => améliore l'accessibilité et l'interactivité du site
        link.setAttribute("tabindex", "0"); 

        // Création de l'image
        const img = document.createElement( 'img' );
        // .. ajout à l'img d'un attribut src contenant le nom de l'image
        img.setAttribute("src", picture)
        // l'attribut alt de l'image est défini avec le nom du photographe pour améliorer l'accessibilité
        img.setAttribute("alt", name); 
        // Création du titre h2
        const h2 = document.createElement( 'h2' );
        // .. qui prend le nom du photographe en valeur
        h2.textContent = name;

        // Ajout de l'image et du titre h2 dans le lien
        link.appendChild(img);
        link.appendChild(h2);

        // Ajout des autres éléments
        const location = document.createElement( 'h3' );
        location.textContent = `${city}, ${country}`;
        
        const p = document.createElement( 'strong' );
        p.textContent = tagline;
        
        const span = document.createElement( 'span' );
        span.textContent = `${price}€/jour`;

        // Ajout à la balise <article> de l'ensemble des infos
        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(p);
        article.appendChild(span);
        
        // Retourne l'ensemble du contenu de la vignette
        return (article);
    }
    // Affiche le tout sur la page web lorsqu'appelé
    return { name, picture, getUserCardDOM }
}