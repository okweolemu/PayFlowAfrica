// Fade sections in as they scroll into view. Elements already on screen are left
// alone (no flash), and nothing is hidden for reduced-motion users or if this
// script never runs.
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (items.length && !reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.replace('reveal-pending', 'is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  for (const item of items) {
    if (item.getBoundingClientRect().top > window.innerHeight) {
      item.classList.add('reveal-pending');
      observer.observe(item);
    }
  }
}
