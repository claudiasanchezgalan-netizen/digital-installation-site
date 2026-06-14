/* ============================================================
   Beyond the Visible — main.js
   Intro flow · White Room · Section Panels · GSAP
   ============================================================ */

(() => {
  "use strict";

  // ----- DOM refs -----
  const body = document.body;
  const intro = document.getElementById("intro");
  const flash = document.getElementById("flash");
  const introGlow = document.getElementById("introGlow");
  const posterImage = document.getElementById("posterImage");
  const introPoster = document.getElementById("introPoster");
  const identityView = document.getElementById("identityView");
  const identityModal = document.getElementById("identityModal");
  const introAccess = document.getElementById("introAccess");
  const identityForm = document.getElementById("identityForm");
  const site = document.getElementById("site");
  const whiteRoom = document.getElementById("whiteRoom");
  const videoView = document.getElementById("videoView");
  const btnProyecto = document.getElementById("btnProyecto");

  const requiredInputs = identityForm
    ? Array.from(identityForm.querySelectorAll("input[required]"))
    : [];

  // ============================================================
  // RESPONSIVE SVG — Switch preserveAspectRatio for mobile
  // ============================================================
  const starsOverlay = document.querySelector(".stars-overlay");
  const updateSVGAspect = () => {
    if (!starsOverlay) return;
    if (window.innerWidth <= 720) {
      starsOverlay.setAttribute("preserveAspectRatio", "xMidYMid meet");
    } else {
      starsOverlay.setAttribute("preserveAspectRatio", "xMidYMid slice");
    }
  };
  updateSVGAspect();
  window.addEventListener("resize", updateSVGAspect);

  // ============================================================
  // INTRO ANIMATIONS (GSAP)
  // ============================================================

  // Poster entrance
  if (posterImage && introAccess) {
    const introTL = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTL
      .fromTo(
        posterImage,
        { opacity: 0, scale: 0.96, filter: "blur(30px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2.2 }
      )
      .fromTo(
        introAccess,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.8"
      );
  }

  // Cursor glow
  if (introGlow) {
    document.addEventListener("mousemove", (e) => {
      if (!intro || intro.classList.contains("is-hidden")) return;
      gsap.to(introGlow, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }

  // ============================================================
  // INTRO FLOW
  // ============================================================

  const unlockScroll = () => {
    body.classList.remove("is-locked");
    document.documentElement.style.overflow = "";
    body.style.overflow = "";
  };

  // Step 1 → Step 2: Show identity modal with camera-flash effect
  const showIdentityModal = () => {
    if (!introPoster || !identityView) return;

    // Full-screen camera flash — bright white burst
    if (flash) {
      gsap.timeline()
        .set(flash, { opacity: 0, display: "block" })
        .to(flash, { opacity: 1, duration: 0.12, ease: "power2.in" })
        .to(flash, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.08 });
    }

    // Switch views while flash is at peak brightness
    setTimeout(() => {
      introPoster.classList.remove("is-active");
      identityView.classList.add("is-active");

      // Modal entrance — appears from the white flash
      if (identityModal) {
        gsap.fromTo(
          identityModal,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: 0.15,
            onComplete: () => requiredInputs[0]?.focus(),
          }
        );
      }
    }, 200);
  };

  // Step 2 → Main site (White Room) — instant switch
  const enterMainSite = () => {
    // Hide intro immediately
    intro.style.display = "none";
    intro.setAttribute("hidden", "true");

    // Show site immediately
    site.removeAttribute("aria-hidden");
    site.classList.add("is-ready");
    site.style.background = "#060608";
    site.style.position = "static";
    site.style.transform = "none";
    site.style.inset = "";
    site.style.willChange = "auto";

    unlockScroll();
    window.scrollTo(0, 0);

    // Animate room objects in
    animateRoomObjects();
  };

  // Step 2 → Step 3: Show video screen
  const showVideoScreen = () => {
    if (!identityView || !videoView) return;

    // Flash transition
    if (flash) {
      gsap.timeline()
        .set(flash, { opacity: 0, display: "block" })
        .to(flash, { opacity: 1, duration: 0.12, ease: "power2.in" })
        .to(flash, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.08 });
    }

    setTimeout(() => {
      identityView.classList.remove("is-active");
      videoView.classList.add("is-active");

      // Animate in video screen
      const videoScreen = videoView.querySelector(".video-screen");
      if (videoScreen) {
        gsap.fromTo(
          videoScreen,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.15 }
        );
      }
    }, 200);
  };

  // Form validation
  const firstEmpty = () =>
    requiredInputs.find((i) => i.value.trim().length === 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    showVideoScreen();
  };

  // Bind events
  introAccess?.addEventListener("click", showIdentityModal);
  identityForm?.addEventListener("submit", handleSubmit);
  btnProyecto?.addEventListener("click", enterMainSite);

  // White Room → Back to intro (video screen)
  const whiteRoomBack = document.getElementById("whiteRoomBack");
  const leaveMainSite = () => {
    // Hide the site / white room
    site.setAttribute("aria-hidden", "true");
    site.classList.remove("is-ready");
    site.style.position = "fixed";
    site.style.transform = "translateX(100%)";
    site.style.inset = "0";

    // Show intro again at the video view
    intro.style.display = "";
    intro.removeAttribute("hidden");

    // Lock scroll
    body.classList.add("is-locked");
    document.documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
  };

  whiteRoomBack?.addEventListener("click", leaveMainSite);

  // ============================================================
  // WHITE ROOM — Object Entrance Animation
  // ============================================================

  function animateRoomObjects() {
    const hotspots = document.querySelectorAll(".star-group");
    const sceneImg = document.querySelector(".stars-scene-bg");
    const elements = sceneImg ? [sceneImg, ...hotspots] : [...hotspots];
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }

  // ============================================================
  // WHITE ROOM — Object Click → Section Panel
  // ============================================================

  let activePanel = null;

  document.querySelectorAll(".hotspot").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.dataset.section;
      const panel = document.getElementById(sectionId);
      if (!panel) return;

      openPanel(panel, btn);
    });
  });

  function openPanel(panel, triggerObj) {
    activePanel = panel;

    // Hide the white room
    if (whiteRoom) {
      gsap.to(whiteRoom, {
        opacity: 0,
        scale: 0.92,
        duration: 0.5,
        ease: "power2.in",
      });
    }

    // Show the panel with a zoom-in effect
    panel.classList.add("is-active");
    panel.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";

    gsap.fromTo(
      panel,
      { opacity: 0, scale: 1.15 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.15,
      }
    );

    // Animate panel content in
    const content = panel.querySelector(".panel-content");
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.35,
        }
      );
    }
  }

  function closePanel() {
    if (!activePanel) return;

    const panel = activePanel;
    activePanel = null;

    // Animate panel out
    gsap.to(panel, {
      opacity: 0,
      scale: 1.08,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => {
        panel.classList.remove("is-active");
        panel.setAttribute("aria-hidden", "true");

        // Close any open book or folder overlays inside the panel
        const bookOv = panel.querySelector(".book-overlay.is-open");
        if (bookOv) {
          bookOv.classList.remove("is-open");
          bookOv.setAttribute("aria-hidden", "true");
        }
        const folderOv = panel.querySelector(".folder-overlay.is-open");
        if (folderOv) {
          folderOv.classList.remove("is-open");
          folderOv.setAttribute("aria-hidden", "true");
        }
      },
    });

    // Bring back the white room
    if (whiteRoom) {
      gsap.to(whiteRoom, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    body.style.overflow = "";
  }

  // Bind back buttons
  document.querySelectorAll(".panel-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      // If this panel has an open folder overlay, close the folder first instead of the whole panel
      const panel = btn.closest(".section-panel");
      if (panel) {
        const folderOv = panel.querySelector(".folder-overlay.is-open");
        if (folderOv) {
          folderOv.classList.remove("is-open");
          folderOv.setAttribute("aria-hidden", "true");
          // Restore the panel-back button visibility
          btn.style.display = "";
          return; // Stay on the folder grid
        }
      }
      closePanel();
    });
  });

  // Escape key closes panel or sub-overlays
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activePanel) {
      // If a sub-overlay is open, close it first
      const bookOv = activePanel.querySelector(".book-overlay.is-open");
      if (bookOv) {
        bookOv.classList.remove("is-open");
        bookOv.setAttribute("aria-hidden", "true");
        return;
      }
      const folderOv = activePanel.querySelector(".folder-overlay.is-open");
      if (folderOv) {
        folderOv.classList.remove("is-open");
        folderOv.setAttribute("aria-hidden", "true");
        // Restore the panel-back button visibility
        const btnVolver = activePanel.querySelector(".panel-back");
        if (btnVolver) btnVolver.style.display = "";
        return;
      }
      closePanel();
    }
  });

  // ============================================================
  // BOOK — Contexto
  // ============================================================

  const bookCover = document.getElementById("bookCover");
  const bookOverlay = document.getElementById("bookOverlay");
  const bookClose = document.getElementById("bookClose");

  const openBook = () => {
    bookOverlay?.classList.add("is-open");
    bookOverlay?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeBook = () => {
    bookOverlay?.classList.remove("is-open");
    bookOverlay?.setAttribute("aria-hidden", "true");
    if (!document.body.classList.contains("is-locked")) {
      document.body.style.overflow = "hidden"; // keep panel scroll locked
    }
  };

  bookCover?.addEventListener("click", openBook);
  bookCover?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBook(); }
  });
  bookClose?.addEventListener("click", closeBook);
  bookOverlay?.addEventListener("click", (e) => {
    if (e.target === bookOverlay) closeBook();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookOverlay?.classList.contains("is-open")) closeBook();
  });

  // ¿Por qué? — alternating font
  const contextoQ = document.getElementById("contextoQuestion");
  if (contextoQ) {
    setInterval(() => {
      contextoQ.classList.toggle("is-helvetica");
    }, 500);
  }

  // ============================================================
  // FOLDER GALLERY
  // ============================================================

  const folderOverlay = document.getElementById("folderOverlay");
  const folderOverlayTitle = document.getElementById("folderOverlayTitle");
  const folderOverlayBody = document.getElementById("folderOverlayBody");
  const folderClose = document.getElementById("folderClose");

  // Folder data
  const folderData = {
    rodaje: {
      title: "Fotos rodaje plató 30.01",
      images: [
        "assets/rodaje/rodaje-06.jpg",
        "assets/rodaje/rodaje-03.jpg",
        "assets/rodaje/rodaje-04.jpg",
        "assets/rodaje/rodaje-01.jpg",
        "assets/rodaje/rodaje-02.jpg",
        "assets/rodaje/rodaje-05.jpg",
      ],
      split: 2,
    },
    instalacion: { 
      title: "Fotos instalación", 
      images: [
        "assets/instalacion/instalacion-01.JPG",
        "assets/instalacion/instalacion-02.JPG",
        "assets/instalacion/instalacion-03.JPG",
        "assets/instalacion/instalacion-04.JPG",
        "assets/instalacion/instalacion-05.JPG",
        "assets/instalacion/instalacion-06.JPG",
        "assets/instalacion/instalacion-07.JPG",
        "assets/instalacion/instalacion-08.JPG",
        "assets/instalacion/instalacion-09.JPG",
        "assets/instalacion/instalacion-10.JPG",
        "assets/instalacion/instalacion-11.JPG",
        "assets/instalacion/instalacion-12.JPG"
      ],
      split: 6
    },
    archivo: {
      title: "Fotos de archivo",
      images: [
        "assets/archivo/archivo-02.jpg",
        "assets/archivo/archivo-01.jpg",
        "assets/archivo/archivo-04.jpg",
        "assets/archivo/archivo-09.jpg",
        "assets/archivo/archivo-06.jpg",
        "assets/archivo/archivo-07.jpg",
        "assets/archivo/archivo-08.jpg",
      ],
      split: 4,
    },
  };

  const openFolder = (folderId) => {
    const folder = folderData[folderId];
    if (!folder || !folderOverlay) return;

    folderOverlayTitle.textContent = folder.title;

    // Populate images or show empty state
    folderOverlayBody.innerHTML = "";
    if (folder.images.length === 0) {
      folderOverlayBody.innerHTML = '<p class="folder-empty">Sin imágenes aún — próximamente</p>';
    } else {
      const splitAt = folder.split || folder.images.length;
      const rowTop = document.createElement("div");
      rowTop.className = "folder-row";
      const rowBottom = document.createElement("div");
      rowBottom.className = "folder-row";

      folder.images.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${folder.title} — ${i + 1}`;
        img.loading = "lazy";
        img.onload = () => {
          if (img.naturalWidth >= img.naturalHeight) {
            img.classList.add("is-landscape");
          } else {
            img.classList.add("is-portrait");
          }
        };
        if (i < splitAt) {
          rowTop.appendChild(img);
        } else {
          rowBottom.appendChild(img);
        }
      });

      folderOverlayBody.appendChild(rowTop);
      if (rowBottom.children.length) folderOverlayBody.appendChild(rowBottom);
    }

    folderOverlay.classList.add("is-open");
    folderOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Ocultar el botón general de volver para que no haya dos
    const btnVolverGaleria = document.querySelector("#secGaleria > .panel-back");
    if (btnVolverGaleria) btnVolverGaleria.style.display = "none";
  };

  const closeFolder = () => {
    if (!folderOverlay) return;
    folderOverlay.classList.remove("is-open");
    folderOverlay.setAttribute("aria-hidden", "true");
    if (!document.body.classList.contains("is-locked")) {
      document.body.style.overflow = "hidden"; // keep panel scroll locked
    }

    // Volver a mostrar el botón general
    const btnVolverGaleria = document.querySelector("#secGaleria > .panel-back");
    if (btnVolverGaleria) btnVolverGaleria.style.display = "";
  };

  // Bind folder clicks
  document.querySelectorAll(".folder-item").forEach((item) => {
    const folderId = item.dataset.folder;
    item.addEventListener("click", () => openFolder(folderId));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFolder(folderId);
      }
    });
  });

  folderClose?.addEventListener("click", closeFolder);
  folderOverlay?.addEventListener("click", (e) => {
    if (e.target === folderOverlay) closeFolder();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && folderOverlay?.classList.contains("is-open")) closeFolder();
  });

  // ============================================================
  // SPARKLE CURSOR TRAIL
  // ============================================================

  let lastSparkle = 0;
  const sparkleChars = ["✦", "✧", "⋆", "✶"];
  const sparkleColors = ["#000000"];

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSparkle < 50) return; // throttle
    lastSparkle = now;

    const spark = document.createElement("span");
    spark.className = "sparkle";
    spark.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    spark.style.left = e.clientX + "px";
    spark.style.top = e.clientY + "px";
    spark.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    spark.style.fontSize = (8 + Math.random() * 10) + "px";
    document.body.appendChild(spark);

    // Remove after animation
    spark.addEventListener("animationend", () => spark.remove());
  });

})();
