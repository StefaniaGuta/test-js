import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";



const form = document.getElementById("search-form");
const input = document.getElementsByName("searchQuery")[0];
const gallery = document.querySelector(".gallery");
const loadBtn = document.querySelector(".load-more");

loadBtn.style.display = "none";


let page = 1;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  page = 1;
  await searchImages();
});

loadBtn.addEventListener("click", async () => {
  page++;
  await searchImages();
});

async function searchImages() {
  const apiKey = "42434842-2ff460ac30438dd36311e67f2";
  const baseUrl = "https://pixabay.com/api/";

  const params = {
    key: apiKey,
    q: input.value.trim(),
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    page: page,
    per_page: 40,
  };

  try {
    const response = await axios.get(baseUrl, { params });
    const { hits, totalHits } = response.data;

    if (hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      displayImages(hits);
      loadBtn.style.display = hits.length < totalHits ? "block" : "none";

      
      const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      lightbox.refresh();
      
      
      window.scrollBy({
        top: window.innerHeight * 2,
        behavior: "smooth",
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again.");
  }
}

function displayImages(images) {
  const imageCards = images.map((image) => `
    <a href="${image.largeImageURL}" data-lightbox="gallery" data-title="${image.tags}">
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${image.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${image.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${image.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${image.downloads}</span>
          </p>
        </div>
      </div>
    </a>`);

  
  gallery.innerHTML = imageCards.join("");
}
