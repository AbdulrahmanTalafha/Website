'use client';

import { useEffect } from 'react';

/**
 * Mounts once and wires up a single IntersectionObserver that
 * toggles `.is-visible` on every [data-reveal] and [data-reveal-stagger]
 * element in the page.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const selectors = '[data-reveal], [data-reveal-stagger]';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve so the animation only plays once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const attach = () => {
      document.querySelectorAll(selectors).forEach((el) => {
        observer.observe(el);
      });
    };

    attach();

    // Re-attach on soft navigations (Next.js App Router swaps DOM)
    const mutationObserver = new MutationObserver(attach);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
