import EmblaCarousel from "embla-carousel";

function init(root: HTMLElement) {
  // Prevent double-init (can happen with client-side navigation/HMR)
  if (root.dataset.emblaInitialized === "true") return;
  root.dataset.emblaInitialized = "true";

  const viewport = root.querySelector(".embla__viewport") as HTMLElement | null;
  if (!viewport) return;

  // FAILSAFE: ensure 1 slide per view even if some CSS overrides it on mobile
  root.querySelectorAll<HTMLElement>(".embla__slide").forEach((slide) => {
    slide.style.flex = "0 0 100%";
  });

  const prevBtn = root.querySelector("[data-prev]") as HTMLButtonElement | null;
  const nextBtn = root.querySelector("[data-next]") as HTMLButtonElement | null;
  const dotsWrap = root.querySelector("[data-dots]") as HTMLElement | null;

  const embla = EmblaCarousel(viewport, {
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "keepSnaps", // prevents “only 2 snaps” behavior
  });

  prevBtn?.addEventListener("click", () => embla.scrollPrev());
  nextBtn?.addEventListener("click", () => embla.scrollNext());

  // Dots (rebuild on reInit so dot count matches snap count)
  let dots: HTMLButtonElement[] = [];

  const buildDots = () => {
    if (!dotsWrap) return;

    dotsWrap.innerHTML = "";
    dots = embla.scrollSnapList().map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "embla__dot";
      b.setAttribute("aria-label", `Go to card ${i + 1}`);
      b.addEventListener("click", () => embla.scrollTo(i));
      dotsWrap.appendChild(b);
      return b;
    });

    syncDots();
  };

  const syncDots = () => {
    if (!dots.length) return;
    const selected = embla.selectedScrollSnap();
    dots.forEach((d, i) => d.classList.toggle("is-active", i === selected));
  };

  embla.on("select", syncDots);
  embla.on("reInit", () => {
    buildDots();
  });

  buildDots();

  // Re-init on resize/orientation changes (helps mobile Safari)
  const onResize = () => embla.reInit();
  window.addEventListener("resize", onResize);

  // Optional: if you ever remove carousels dynamically, you’d also remove this listener.
}

function boot() {
  document.querySelectorAll<HTMLElement>("[data-embla]").forEach(init);
}

// Ensure DOM exists before we query
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
