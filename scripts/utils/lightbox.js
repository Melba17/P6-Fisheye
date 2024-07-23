export class Lightbox {
  constructor() {
      this.currentIndex = 0;
      this.mediaElements = [];
      this.photographerInsert = document.querySelector('.photographer_insert');

      // Création dynamique de la lightbox
      this.lightbox = document.createElement('div');
      this.lightbox.className = 'lightbox';
      this.lightbox.id = 'lightbox';
      this.lightbox.style.display = 'none';
      this.lightbox.setAttribute('role', 'dialog'); 
      this.lightbox.setAttribute('aria-label', 'Média en plein écran'); 
      this.lightbox.innerHTML = `
          <button class="lightbox_close" aria-label="Fermer la fenêtre"></button>
          <button class="lightbox_prev" aria-label="Média précédent"></button>
          <div class="lightbox_container">
              <div class="lightbox_content">
                  <img id="lightbox_img" alt="">
                  <video id="lightbox_video" controls></video>
                  <p class="lightbox_title" id="lightbox_title"></p>
              </div>
          </div>
        <button class="lightbox_next" aria-label="Média suivant"></button>
      `;
      document.body.appendChild(this.lightbox);

      this.lightboxImage = document.getElementById('lightbox_img');
      this.lightboxImage.setAttribute('role', 'document'); 
      this.lightboxVideo = document.getElementById('lightbox_video');
      this.lightboxVideo.setAttribute('role', 'document'); 
      this.lightboxTitle = document.getElementById('lightbox_title');

      this.addEventListeners();
  }

  addEventListeners() {
      document.querySelector('.lightbox_close').addEventListener('click', () => this.closeLightbox());
      document.querySelector('.lightbox_next').addEventListener('click', () => this.showNext());
      document.querySelector('.lightbox_prev').addEventListener('click', () => this.showPrev());

      // Gestion de la navigation au clavier
      document.addEventListener('keydown', (event) => {
          if (this.lightbox.style.display === 'block') {
              if (event.key === 'Escape') {
                  this.closeLightbox();
              } else if (event.key === 'ArrowRight') {
                  this.showNext();
              } else if (event.key === 'ArrowLeft') {
                  this.showPrev();
              } // Vérifie si la touche pressée est soit 'Enter' (Entrée) soit ' ' (Espace) 
              else if (event.key === 'Enter' || event.key === ' ') {
                // Récupère l'élément actuellement focalisé (sélectionné) dans le document
                  const focusedElement = document.activeElement;
                  // Vérifie si l'élément focalisé a la classe 'lightbox_close'
                  if (focusedElement.classList.contains('lightbox_close')) {
                    // Si c'est le cas, appelle la méthode 'closeLightbox' pour fermer la lightbox
                      this.closeLightbox();
                  } // Si ce n'est pas le bouton de fermeture, vérifie si l'élément focalisé a la classe 'lightbox_next'
                  else if (focusedElement.classList.contains('lightbox_next')) {
                    // Si c'est le cas, appelle la méthode 'showNext' pour afficher le média suivant
                      this.showNext();
                  } // Si ce n'est pas le bouton suivant, vérifie si l'élément focalisé a la classe 'lightbox_prev'
                  else if (focusedElement.classList.contains('lightbox_prev')) {
                     // Si c'est le cas, appelle la méthode 'showPrev' pour afficher le média précédent 
                    this.showPrev();
                  }
              }
          }
      });
  }

  closeLightbox() {
      this.lightbox.style.display = 'none';
      this.lightboxImage.style.display = 'none';
      this.lightboxVideo.style.display = 'none';
      document.body.classList.remove('no-scroll');
      if (this.photographerInsert) {
          this.photographerInsert.classList.remove('hidden');
      }
  }

  openLightbox(index) {
      const media = this.mediaElements[index];
      if (!media) return;

      this.currentIndex = index;

      const src = media.getAttribute('data-src');
      const type = media.getAttribute('data-type');
      const title = media.getAttribute('data-title');

      if (type === 'image') {
          this.lightboxImage.src = src;
          this.lightboxImage.style.display = 'block';
          this.lightboxVideo.style.display = 'none';
      } else if (type === 'video') {
          this.lightboxVideo.src = src;
          this.lightboxVideo.style.display = 'block';
          this.lightboxImage.style.display = 'none';
      }

      this.lightboxTitle.textContent = title;
      this.lightbox.style.display = 'block';
      document.body.classList.add('no-scroll');
      if (this.photographerInsert) {
          this.photographerInsert.classList.add('hidden');
      }
  }

  showNext() {
      if (this.currentIndex < this.mediaElements.length - 1) {
          this.openLightbox(this.currentIndex + 1);
      } else {
        this.openLightbox(0);
      }
  }

  showPrev() {
      if (this.currentIndex > 0) {
          this.openLightbox(this.currentIndex - 1);
      } else {
        this.openLightbox(this.mediaElements.length - 1);
      }
  }

  init() {
        document.querySelectorAll('.media_container img, .media_container video').forEach((media, index) => {
            media.dataset.index = index;
            media.setAttribute('tabindex', '0'); // Ajout de tabindex pour rendre le média focusable dans la gallerie du photographe
            media.addEventListener('click', () => this.openLightbox(index));
            media.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    this.openLightbox(index);
                }
            });
            this.mediaElements.push(media);
        });
    }

}
