import { Suspense, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';

let webgl2Available;
function hasWebGL2() {
  if (webgl2Available === undefined) {
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      webgl2Available = Boolean(context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      webgl2Available = false;
    }
  }
  return webgl2Available;
}

// Probe after mount so the page and Home poster can paint before GPU setup.
export default function RendererBoundary({ children, needsWebGL2 = true, fallback = null, loading = null }) {
  const [available, setAvailable] = useState(needsWebGL2 ? null : true);
  useEffect(() => {
    setAvailable(!needsWebGL2 || hasWebGL2());
  }, [needsWebGL2]);

  const observeCanvas = useCallback(host => {
    if (!host) return;
    const onLoss = () => setAvailable(false);
    // Canvas context-loss events do not bubble. Capture them at this renderer only.
    host.addEventListener('webglcontextlost', onLoss, true);
    return () => host.removeEventListener('webglcontextlost', onLoss, true);
  }, []);

  if (available === null) return loading;
  if (!available) return fallback;
  return (
    <ErrorBoundary fallback={fallback}>
      <div className="renderer-host" ref={observeCanvas}>
        <Suspense fallback={loading}>{children}</Suspense>
      </div>
    </ErrorBoundary>
  );
}
