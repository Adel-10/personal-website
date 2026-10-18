import useReveal from '../useReveal.js';
import Hero from '../sections/Hero.jsx';

export default function Home() {
  useReveal();
  return (
    <main id="main-content" tabIndex="-1">
      <Hero />
    </main>
  );
}
