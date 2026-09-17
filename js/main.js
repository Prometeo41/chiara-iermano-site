// Chiara Iermano — main.js
// Piccole interazioni: header su scroll, menu mobile, reveal on scroll, anno footer.

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const yearEl = document.getElementById("year");
  const contactForm = document.getElementById("contact-form");

  // Anno corrente nel footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header che cambia stile allo scroll
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }

  // Reveal on scroll (disabilitato se l'utente preferisce meno animazioni,
  // e con una rete di sicurezza che rende comunque visibile tutto entro pochi
  // secondi, per non rischiare contenuti "invisibili" in nessun contesto).
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealTargets = document.querySelectorAll(
    ".about-grid, .service-card, .portfolio-item, .contact-grid, .press-list"
  );

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));

    // Rete di sicurezza: se per qualsiasi motivo l'observer non scatta
    // (browser insoliti, contenuto già in viewport al caricamento, ecc.)
    // rendiamo comunque tutto visibile dopo un breve ritardo.
    window.setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    }, 2500);
  }

  // Form di contatto: al momento statico (nessun backend collegato)
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Il form non è ancora collegato a un servizio di invio. " +
        "Per ora scrivi direttamente a info@chiaraiermano.com oppure su Instagram @c_iermano."
      );
    });
  }
});
