////////// SQUELETTE DES VIGNETTES ///////////////
// L'objet retourné par photographerTemplate(data) permet à d'autres parties du code d'accéder aux données du photographe ainsi qu'à la méthode pour créer la vignette, ce qui permet une meilleure modularité et réutilisabilité.
export function photographerTemplate(data) {
    // Infos diverses photographes = données JSON
    const { id,name, portrait, city, country, tagline, price } = data;
    // Chemin vers l'image dans dossier assets selon le nom du photographe en question
    const picture = `assets/photographers/Photographers ID Photos/${portrait}`;

    function getUserCardDOM() {
        // Création de la balise <article> pour L'emplacement de la vignette...
        const article = document.createElement( 'article' );


        // Création du lien avec la balises <a> qui entoure et encapsule l'img et le h2
        const link = document.createElement('a');
        // Lien vers la page de chaque photographe selon leur Id respectif / ?id=${id} étant le paramètre voulu dans l'url
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

        // Ajout de l'image et du titre h2 dans le lien/balise <a>
        link.appendChild(img);
        link.appendChild(h2);

        ///// Ajout des autres éléments /////
        const location = document.createElement( 'h3' );
        // Interpolation
        location.textContent = `${city}, ${country}`;
        
        // Mise en évidence avec <strong>
        const p = document.createElement( 'strong' );
        p.textContent = tagline;
        
        const span = document.createElement( 'span' );
        span.textContent = `${price}€/jour`;

        // Ajout de l'ensemble des infos à la balise <article> 
        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(p);
        article.appendChild(span);

        // Affiche l'article dans la console
        console.log(article); 
        // Retourne l'élément DOM <article> (ensemble du contenu de la vignette ), qui peut être directement utilisé pour afficher le contenu sur la page web.
        return (article);
        
    }
    // Retourne un objet qui contient des données sur le photographe et une méthode pour créer un élément DOM. Cet objet peut être utilisé pour gérer et manipuler les informations et le rendu des vignettes des photographes de manière plus flexible et structurée.
    const result = { name, picture, getUserCardDOM };
    console.log(result); 
    return result;
}