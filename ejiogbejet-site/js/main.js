(function () {
  "use strict";

  var heroVideo = document.getElementById("hero-video");
  if (heroVideo) {
    heroVideo.playbackRate = 1.5;
    heroVideo.addEventListener("loadedmetadata", function () {
      heroVideo.playbackRate = 1.5;
    });
  }

  var header = document.getElementById("site-header");
  var carouselSection = document.getElementById("carousel");
  var hideThreshold = Infinity;
  var lastScrollY = window.scrollY;

  function updateHideThreshold() {
    if (carouselSection) {
      hideThreshold = carouselSection.getBoundingClientRect().top + window.scrollY;
    }
  }

  var onScroll = function () {
    var scrollY = window.scrollY;

    if (scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    if (scrollY >= hideThreshold && scrollY > lastScrollY) {
      header.classList.add("is-hidden");
    } else if (scrollY < lastScrollY || scrollY < hideThreshold) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = scrollY;
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateHideThreshold);
  updateHideThreshold();
  onScroll();

  var navMobile = document.getElementById("nav-mobile");
  var navOpenBtn = document.getElementById("nav-open");
  var navCloseBtn = document.getElementById("nav-close");

  function openNav() {
    header.classList.remove("is-hidden");
    navMobile.classList.add("is-open");
    navOpenBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    navMobile.classList.remove("is-open");
    navOpenBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navOpenBtn.addEventListener("click", openNav);
  navCloseBtn.addEventListener("click", closeNav);
  navMobile.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeNav();
      closeLightbox();
    }
  });

  // Generic "scroll to" buttons
  document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Lightbox for cabin gallery
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var full = btn.getAttribute("data-full");
      var img = btn.querySelector("img");
      openLightbox(full, img ? img.alt : "");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Back to top
  var backToTop = document.getElementById("back-to-top");
  var contactSection = document.getElementById("contact");
  if (backToTop) {
    var updateBackToTop = function () {
      var pastHero = window.scrollY > window.innerHeight;
      var reachingContact = contactSection && contactSection.getBoundingClientRect().top < window.innerHeight;
      backToTop.classList.toggle("is-visible", pastHero && !reachingContact);
    };
    document.addEventListener("scroll", updateBackToTop, { passive: true });
    window.addEventListener("resize", updateBackToTop);
    updateBackToTop();
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll-driven plane carousel with side progress bar
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var slides = carousel.querySelectorAll(".scroll-carousel-slide");
    var progressFill = document.getElementById("carousel-progress");
    var countEl = document.getElementById("carousel-count");
    var titleEl = document.getElementById("carousel-title");
    var copyEl = document.getElementById("carousel-copy");

    var captions = [
      { title: "You request your charter", copy: "Tell us your route, dates, and party size — our desk confirms the right aircraft fast." },
      { title: "We confirm your aircraft", copy: "The right jet or helicopter is secured and readied for your schedule." },
      { title: "Welcomed planeside by our team", copy: "Personally escorted from arrival to aircraft at Executive Jets Centre, Lagos or Abuja." },
      { title: "Settle into the cabin", copy: "Every detail on board is arranged for comfort, discretion, and ease." },
      { title: "Moving you to your preferred destination in luxury and comfort", copy: "Every flight is planned for comfort, discretion, and a seamless arrival." },
      { title: "Arrive ready, right on time", copy: "Ground arrangements are handled end-to-end, so you land ready for what's next." }
    ];

    var activeIndex = -1;

    function setActive(index) {
      if (index === activeIndex) return;
      activeIndex = index;
      slides.forEach(function (slide, i) {
        slide.style.opacity = i === index ? "1" : "0";
      });
      countEl.textContent = String(index + 1).padStart(2, "0");
      titleEl.textContent = captions[index].title;
      copyEl.textContent = captions[index].copy;
    }

    function updateCarousel() {
      var rect = carousel.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;

      var index = Math.min(slides.length - 1, Math.floor(progress * slides.length));
      setActive(index);

      progressFill.style.transform = "translateY(" + (progress * 100 * (slides.length - 1)) + "%)";
    }

    setActive(0);
    document.addEventListener("scroll", updateCarousel, { passive: true });
    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  }

  // GSAP scroll-triggered section reveals ("moving into next page")
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    var revealSections = document.querySelectorAll("main > section:not(#hero):not(#carousel)");
    revealSections.forEach(function (section) {
      gsap.fromTo(
        section,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 55%",
            scrub: false,
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    gsap.utils.toArray(".service-card, .fleet-card, .trust-card, .departure-card").forEach(function (card, i) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: (i % 4) * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
})();
