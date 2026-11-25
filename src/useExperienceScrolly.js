import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateRide(pin, panels, hint) {
  const track = pin.querySelector('.xp-track');
  const distance = () => track.scrollWidth - pin.clientWidth;
  const tween = gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: pin, start: 'top top', end: () => '+=' + distance(),
      pin: true, scrub: true, invalidateOnRefresh: true
    }
  });

  panels.forEach(panel => {
    gsap.from(panel.querySelectorAll('.xp-li, .xp-big, .xp-chips'), {
      y: 44, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out',
      scrollTrigger: {
        trigger: panel, containerAnimation: tween,
        start: 'left 65%', toggleActions: 'play none none reverse'
      }
    });
  });
  if (hint) {
    gsap.to(hint, {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top', end: '+=400', scrub: true }
    });
  }
}

export default function useExperienceScrolly(ref) {
  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      const nav = document.querySelector('nav');
      const rides = Array.from(root.querySelectorAll('.xp-pin'), pin => ({
        pin, panels: [...pin.querySelectorAll('.xp-panel')], hint: pin.querySelector('.xp-hint'),
        animation: null
      }));
      let frame;

      function updateLayout() {
        const topSpace = Math.ceil(nav.getBoundingClientRect().bottom) + 12;
        root.style.setProperty('--xp-top-space', topSpace + 'px');
        for (const ride of rides) {
          const { pin, panels, hint, animation } = ride;
          const bottomSpace = hint ? 52 : 16;
          const available = document.documentElement.clientHeight - topSpace - bottomSpace;
          const fits = panels.every(panel => panel.getBoundingClientRect().height <= available);
          if (fits === Boolean(animation)) continue;

          if (fits) {
            pin.style.setProperty('--xp-bottom-space', bottomSpace + 'px');
            pin.classList.add('is-horizontal');
            ride.animation = gsap.context(() => animateRide(pin, panels, hint), pin);
          } else {
            animation.revert();
            ride.animation = null;
            pin.classList.remove('is-horizontal');
          }
        }
        // A resize can recreate the first pin after the second one already exists.
        ScrollTrigger.sort();
        ScrollTrigger.refresh(true);
      }

      function scheduleLayout() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(updateLayout);
      }

      // Font changes, zoom and wrapping can change a card's height at the same viewport size.
      const observer = new ResizeObserver(scheduleLayout);
      for (const { panels } of rides) panels.forEach(panel => observer.observe(panel));
      observer.observe(nav);
      window.addEventListener('resize', scheduleLayout);
      scheduleLayout();

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', scheduleLayout);
        cancelAnimationFrame(frame);
        for (const { pin, animation } of rides) {
          animation?.revert();
          pin.classList.remove('is-horizontal');
          pin.style.removeProperty('--xp-bottom-space');
        }
        root.style.removeProperty('--xp-top-space');
      };
    });
    return () => mm.revert();
  }, [ref]);
}
