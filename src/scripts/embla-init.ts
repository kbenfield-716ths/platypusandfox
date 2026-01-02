import EmblaCarousel from "embla-carousel";

function init(root: HTMLElement) {
  const viewport = root.querySelector(".embla__viewport") as HTMLElement | null;
  if (!viewport) return;

  const prevBtn = root.querySelector("[data-prev]") as HTMLButtonElement | null;
  const nextBtn = root.querySelector("[data-next]") as HTMLButtonElement | null;
  const dotsWrap = root.querySelector("[data-dots]") as HTMLElement | null;

  const embla = EmblaCarousel(viewport, { loop: true });

  prevBtn?.addEventListener("click", () => embla.scrollPrev());
  nextBtn?.addEventListener("click", () => embla.scrollNext());

  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    const snaps = embla.scrollSnapList();
    const dots = snaps.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "embla__dot";
      b.setAttribute("aria-label", `Go to card ${i + 1}`);
      b.addEventListener("click", () => embla.scrollTo(i));
      dotsWrap.appendChild(b);
      return b;
    });

    const syncDots = () => {
      const selected = embla.selectedScrollSnap();
      dots.forEach((d, i) => d.classList.toggle("is-active", i === selected));
    };

    embla.on("select", syncDots);
    syncDots();
  }
}

document.querySelectorAll<HTMLElement>("[data-embla]").forEach(init);
