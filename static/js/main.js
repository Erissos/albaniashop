document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("hidden");
    });
  }

  var galleryTargets = document.querySelectorAll("[data-gallery-target]");
  var galleryMain = document.querySelector("[data-gallery-main]");
  var galleryOpen = document.querySelector("[data-gallery-open]");
  var galleryModal = document.querySelector("[data-gallery-modal]");
  var galleryModalImage = document.querySelector("[data-gallery-modal-image]");
  var galleryClose = document.querySelector("[data-gallery-close]");

  function syncGalleryImage(source, altText) {
    if (galleryMain) {
      galleryMain.src = source;
      galleryMain.alt = altText || "Product";
    }

    if (galleryModalImage) {
      galleryModalImage.src = source;
      galleryModalImage.alt = altText || "Product";
    }
  }

  galleryTargets.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      if (!galleryMain) {
        return;
      }
      syncGalleryImage(thumb.dataset.galleryTarget, thumb.alt || "Product");
    });
  });

  if (galleryOpen && galleryModal) {
    galleryOpen.addEventListener("click", function () {
      galleryModal.classList.remove("hidden");
      galleryModal.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
  }

  if (galleryClose && galleryModal) {
    galleryClose.addEventListener("click", function () {
      galleryModal.classList.add("hidden");
      galleryModal.classList.remove("flex");
      document.body.style.overflow = "";
    });
  }

  if (galleryModal) {
    galleryModal.addEventListener("click", function (event) {
      if (event.target === galleryModal) {
        galleryModal.classList.add("hidden");
        galleryModal.classList.remove("flex");
        document.body.style.overflow = "";
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && galleryModal && !galleryModal.classList.contains("hidden")) {
      galleryModal.classList.add("hidden");
      galleryModal.classList.remove("flex");
      document.body.style.overflow = "";
    }
  });
});
