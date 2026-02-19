import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useGLTF, Center, Html } from "@react-three/drei";

// Simple error boundary as a function component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Error in Model:', error);
      setHasError(true);
      return false;
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <Html center>
        <div style={{
          color: '#ff6b6b',
          background: 'rgba(0,0,0,0.8)',
          padding: '10px',
          borderRadius: '4px'
        }}>
          Failed to load model
        </div>
      </Html>
    );
  }

  return children;
};

// Loading component
const Loader = () => (
  <Html center>
    <div style={{ color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>
      Loading entity...
    </div>
  </Html>
);

// Model component
const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  const copiedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  if (!copiedScene) return null;

  return <primitive object={copiedScene} scale={1.5} castShadow receiveShadow />;
};

// Main ModelItem component
const ModelItem = ({ url }) => {
  return (
    <Center>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Model url={url} />
        </Suspense>
      </ErrorBoundary>
    </Center>
  );
};

// Preload function
export const preloadGLTF = (url) => {
  if (typeof useGLTF.preload === 'function') {
    useGLTF.preload(url);
  }
};

export default React.memo(ModelItem);
