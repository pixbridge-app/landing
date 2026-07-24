const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.querySelector("[data-year]");
const tabRoot = document.querySelector("[data-tabs]");
const koBanner = document.querySelector("[data-ko-banner]");
const koBannerClose = document.querySelector("[data-ko-banner-close]");
const carouselRoots = document.querySelectorAll("[data-carousel]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (koBanner && document.body.dataset.pageLang === "en") {
  const browserLanguage = navigator.language || "";
  const languages = navigator.languages || [browserLanguage];
  const prefersKorean = languages.some((language) => language.toLowerCase().startsWith("ko"));
  const storageKey = "pixbridge-ko-banner-dismissed";
  let dismissed = false;

  try {
    dismissed = localStorage.getItem(storageKey) === "true";
  } catch (error) {
    dismissed = false;
  }

  if (prefersKorean && !dismissed) {
    koBanner.hidden = false;
  }

  if (koBannerClose) {
    koBannerClose.addEventListener("click", () => {
      koBanner.hidden = true;

      try {
        localStorage.setItem(storageKey, "true");
      } catch (error) {
        dismissed = true;
      }
    });
  }
}

if (tabRoot) {
  const buttons = tabRoot.querySelectorAll("[data-tab]");
  const panels = tabRoot.querySelectorAll("[data-panel]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === target);
      });
    });
  });
}

carouselRoots.forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector("[data-carousel-track]");
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsRoot = carousel.querySelector("[data-carousel-dots]");
  const status = carousel.querySelector("[data-carousel-status]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isKorean = document.body.dataset.pageLang === "ko";
  let activeIndex = 0;
  let trackPosition = 1;
  let autoplayId = null;
  let isAnimating = false;
  let isHovering = false;
  let hasFocus = false;
  let activePointerId = null;
  let pointerStartX = 0;
  let pointerDeltaX = 0;
  let pointerStartedAt = 0;

  if (!slides.length || !viewport || !track || !previousButton || !nextButton || !dotsRoot) {
    return;
  }

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.classList.remove("is-active");
    clone.removeAttribute("data-carousel-slide");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("img").forEach((image) => {
      image.alt = "";
      image.removeAttribute("fetchpriority");
      image.removeAttribute("loading");
    });
  });

  track.prepend(lastClone);
  track.append(firstClone);

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", isKorean ? `${index + 1}번 화면 보기` : `Show screenshot ${index + 1}`);
    dotsRoot.appendChild(dot);
    return dot;
  });

  const updateUi = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      if (dotIndex === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (status) {
      status.textContent = isKorean
        ? `화면 ${activeIndex + 1}/${slides.length}`
        : `Screenshot ${activeIndex + 1} of ${slides.length}`;
    }
  };

  const setTrackPosition = (animate, offset = 0) => {
    track.classList.toggle("is-dragging", !animate);
    const basePosition = -trackPosition * 100;
    track.style.transform =
      offset === 0
        ? `translate3d(${basePosition}%, 0, 0)`
        : `translate3d(calc(${basePosition}% + ${offset}px), 0, 0)`;
  };

  const normalizeTrackPosition = () => {
    let normalized = false;

    if (trackPosition === 0) {
      trackPosition = slides.length;
      normalized = true;
    } else if (trackPosition === slides.length + 1) {
      trackPosition = 1;
      normalized = true;
    }

    if (normalized) {
      setTrackPosition(false);
      window.requestAnimationFrame(() => {
        track.classList.remove("is-dragging");
      });
    }
  };

  const moveBy = (direction) => {
    if (isAnimating) {
      return;
    }

    trackPosition += direction;
    updateUi(activeIndex + direction);
    isAnimating = !prefersReducedMotion;
    setTrackPosition(true);

    if (prefersReducedMotion) {
      normalizeTrackPosition();
    }
  };

  const moveTo = (index) => {
    if (isAnimating || index === activeIndex) {
      return;
    }

    trackPosition = index + 1;
    updateUi(index);
    isAnimating = !prefersReducedMotion;
    setTrackPosition(true);
  };

  const stopAutoplay = () => {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || autoplayId !== null || document.hidden || isHovering || hasFocus) {
      return;
    }

    autoplayId = window.setInterval(() => {
      moveBy(1);
    }, 4800);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      moveTo(index);
      restartAutoplay();
    });
  });

  previousButton.addEventListener("click", () => {
    moveBy(-1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    moveBy(1);
    restartAutoplay();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
      restartAutoplay();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
      restartAutoplay();
    }
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (isAnimating || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }

    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerDeltaX = 0;
    pointerStartedAt = performance.now();
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
    track.classList.add("is-dragging");
    stopAutoplay();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    pointerDeltaX = event.clientX - pointerStartX;
    setTrackPosition(false, pointerDeltaX);
  });

  const finishPointerInteraction = (event, cancelled = false) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    const elapsed = Math.max(performance.now() - pointerStartedAt, 1);
    const velocity = Math.abs(pointerDeltaX) / elapsed;
    const threshold = Math.min(64, viewport.clientWidth * 0.16);
    const shouldMove =
      !cancelled &&
      (Math.abs(pointerDeltaX) >= threshold || (Math.abs(pointerDeltaX) >= 20 && velocity >= 0.45));

    activePointerId = null;
    viewport.classList.remove("is-dragging");
    track.classList.remove("is-dragging");

    if (shouldMove) {
      moveBy(pointerDeltaX < 0 ? 1 : -1);
    } else if (Math.abs(pointerDeltaX) > 0.5) {
      isAnimating = !prefersReducedMotion;
      setTrackPosition(true);
    } else {
      isAnimating = false;
      setTrackPosition(true);
    }

    pointerDeltaX = 0;
    restartAutoplay();
  };

  viewport.addEventListener("pointerup", (event) => {
    finishPointerInteraction(event);
  });

  viewport.addEventListener("pointercancel", (event) => {
    finishPointerInteraction(event, true);
  });

  viewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  carousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      isHovering = true;
      stopAutoplay();
    }
  });

  carousel.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      isHovering = false;
      startAutoplay();
    }
  });

  carousel.addEventListener("focusin", () => {
    hasFocus = true;
    stopAutoplay();
  });

  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      hasFocus = false;
      startAutoplay();
    }
  });

  track.addEventListener("transitionend", (event) => {
    if (event.target !== track || event.propertyName !== "transform") {
      return;
    }

    isAnimating = false;
    normalizeTrackPosition();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  updateUi(0);
  setTrackPosition(false);
  window.requestAnimationFrame(() => {
    track.classList.remove("is-dragging");
  });
  startAutoplay();
});
