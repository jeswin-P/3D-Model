import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import ModelItem, { preloadGLTF } from './ModelItem';

// Standardized Error Component
const ErrorDisplay = ({ message }) => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0a0a0a',
    color: '#ff6b6b',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #ff6b6b33'
  }}>
    <div>
      <h3 style={{ margin: '0 0 10px 0' }}>SYSTEM ERROR</h3>
      <p>{message || 'Failed to load 3D entity grid.'}</p>
    </div>
  </div>
);

// Simple error boundary as a function component
const CanvasErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Canvas Error:', error);
      setHasError(true);
      return false;
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) return <ErrorDisplay />;

  return children;
};

const LazyModel = React.memo(({ url, isExpanded }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preload the model when in view
  useEffect(() => {
    if (inView || isExpanded) {
      setIsLoading(true);
      try {
        preloadGLTF(url);
      } catch (e) {
        console.error('Failed to preload model:', e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [inView, isExpanded, url]);

  // Sync loader with ModelItem.jsx style
  const Loader = () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0a0a0a',
      color: '#00ffff'
    }}>
      <span style={{ textShadow: '0 0 10px #00ffff' }}>Syncing entity...</span>
    </div>
  );

  // Show placeholder if not in view
  if (!inView && !isExpanded) {
    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(10, 10, 10, 0.8)',
          color: 'rgba(0, 255, 255, 0.5)',
          fontSize: '0.9em',
          borderRadius: '4px',
          border: '1px dashed rgba(0, 255, 255, 0.2)',
          cursor: 'pointer'
        }}
      >
        <span>Grid Entry: Pending...</span>
      </div>
    );
  }

  // Show error message if there was an error
  if (error) return <ErrorDisplay message="Entity preloading failed." />;

  // Show the 3D model
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: isExpanded ? '80vh' : '300px',
        position: 'relative',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <CanvasErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />

            <ModelItem url={url} />
            <Environment preset="city" />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
            <OrbitControls
              makeDefault
              autoRotate={!isExpanded}
              autoRotateSpeed={0.5}
              enableZoom={isExpanded}
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
});

LazyModel.displayName = 'LazyModel';

export default LazyModel;
