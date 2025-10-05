import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // honor user motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePref = () => setReducedMotion(!!mq.matches);
    updatePref();
    mq.addEventListener?.('change', updatePref);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      mq.removeEventListener?.('change', updatePref);
    };
  }, []);

  // don't render if hidden or user prefers reduced motion
  if (!isVisible || reducedMotion) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 16,
          height: 16,
          borderRadius: 9999,
          background: 'rgba(0,0,0,0.7)',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.6) inset',
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;