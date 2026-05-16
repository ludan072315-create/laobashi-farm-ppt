const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const videos = document.querySelectorAll("video");

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
}

const revealables = document.querySelectorAll(
  ".section-kicker, .section-title, .section-copy, .gallery-tile, .plan-card, .feature-copy, .feature-media, .visit-card"
);

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  revealables.forEach((item) => observer.observe(item));
} else {
  revealables.forEach((item) => item.classList.add("is-visible"));
}

videos.forEach((video) => {
  video.addEventListener("loadedmetadata", () => {
    video.classList.add("is-ready");
  });
});

const lazyVideos = document.querySelectorAll("video[data-src]");

const loadVideo = (video) => {
  const src = video.dataset.src;
  if (!src || video.getAttribute("src")) return;
  video.setAttribute("src", src);
  video.load();
  if (video.hasAttribute("autoplay")) {
    video.play().catch(() => {});
  }
};

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target);
        videoObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "640px 0px", threshold: 0.01 }
  );

  lazyVideos.forEach((video) => videoObserver.observe(video));
} else {
  lazyVideos.forEach(loadVideo);
}

const videoModal = document.querySelector("[data-video-modal]");
const videoPlayer = document.querySelector("[data-video-player]");
const videoClose = document.querySelector("[data-video-close]");
const videoPreviews = document.querySelectorAll("[data-video-src]");

const closeVideoModal = () => {
  if (!videoModal || !videoPlayer) return;
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  videoModal.hidden = true;
  document.body.classList.remove("has-video-modal");
};

const openVideoModal = (src) => {
  if (!videoModal || !videoPlayer || !src) return;
  videoPlayer.src = src;
  videoModal.hidden = false;
  document.body.classList.add("has-video-modal");
  videoPlayer.focus();
  videoPlayer.play().catch(() => {});
};

videoPreviews.forEach((preview) => {
  const open = () => openVideoModal(preview.dataset.videoSrc);

  preview.addEventListener("click", open);
  preview.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    open();
  });
});

if (videoClose) {
  videoClose.addEventListener("click", closeVideoModal);
}

if (videoModal) {
  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal();
  }
});
