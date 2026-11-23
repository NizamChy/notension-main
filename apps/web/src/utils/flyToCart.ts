// "Fly to cart" animation: a copy of the product photo flies from where the
// shopper clicked into the cart button, which then gives a little bump.
//
// Cart buttons opt in with a `data-cart-target` attribute; the first visible
// one is used. The photo is the largest visible <img> in the closest
// ancestor of the clicked element that has one (the product card, the
// details modal or the product page), so call sites only pass the button.

const FLIGHT_MS = 750;
const MAX_SIZE = 160;

const isVisible = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.width > 8 && rect.height > 8;
};

const findSourceImage = (from: Element): HTMLImageElement | null => {
  let el: Element | null = from;
  for (let depth = 0; el && depth < 12; depth += 1, el = el.parentElement) {
    let best: HTMLImageElement | null = null;
    let bestArea = 0;
    el.querySelectorAll?.("img").forEach((img) => {
      if (!img.currentSrc && !img.src) return;
      if (!isVisible(img)) return;
      const { width, height } = img.getBoundingClientRect();
      if (width * height > bestArea) {
        best = img;
        bestArea = width * height;
      }
    });
    if (best) return best;
  }
  return null;
};

const findCartTarget = () =>
  Array.from(document.querySelectorAll("[data-cart-target]")).find((el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }) || null;

const bump = (target: Element) => {
  // `scale` (not `transform`) so the button keeps its own translate.
  target.animate?.(
    [{ scale: "1" }, { scale: "1.18" }, { scale: "0.95" }, { scale: "1" }],
    { duration: 420, easing: "ease-out" },
  );
};

/**
 * @param from  the clicked element
 * @returns resolves when the photo has landed (right away if there is
 *   nothing to animate), so callers can open the cart afterwards.
 */
export function flyToCart(from: Element | null | undefined): Promise<void> {
  if (typeof window === "undefined" || !from?.getBoundingClientRect) {
    return Promise.resolve();
  }
  const target = findCartTarget();
  if (!target) return Promise.resolve();

  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const image = reduceMotion ? null : findSourceImage(from);
  if (!image || typeof document.body.animate !== "function") {
    bump(target);
    return Promise.resolve();
  }

  const src = image.getBoundingClientRect();
  const dst = target.getBoundingClientRect();
  const size = Math.min(MAX_SIZE, src.width, src.height);
  const startX = src.left + src.width / 2;
  const startY = src.top + src.height / 2;
  const dx = dst.left + dst.width / 2 - startX;
  const dy = dst.top + dst.height / 2 - startY;
  // Lift the photo a little first so it travels along an arc.
  const lift = Math.min(120, Math.max(40, Math.abs(dx) * 0.15));

  const flyer = document.createElement("div");
  flyer.setAttribute("aria-hidden", "true");
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${startX - size / 2}px`,
    top: `${startY - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    zIndex: "9999",
    pointerEvents: "none",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 12px 30px rgba(12, 63, 142, 0.35)",
    willChange: "transform, opacity",
  });
  const copy = document.createElement("img");
  copy.src = image.currentSrc || image.src;
  copy.alt = "";
  Object.assign(copy.style, {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  });
  flyer.appendChild(copy);
  document.body.appendChild(flyer);

  const animation = flyer.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "16px" },
      {
        offset: 0.35,
        transform: `translate(${dx * 0.3}px, ${dy * 0.3 - lift}px) scale(0.7)`,
        opacity: 1,
        borderRadius: "24px",
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.1)`,
        opacity: 0.4,
        borderRadius: "50%",
      },
    ],
    { duration: FLIGHT_MS, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
  );

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      flyer.remove();
      bump(target);
      resolve();
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
    // Safety net in case the animation never reports back.
    setTimeout(finish, FLIGHT_MS + 300);
  });
}

export default flyToCart;
