import React, { useState, useEffect, useRef } from 'react';

const MarqueeTextRotator = ({ texts, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const styles = {
    container: {
      display: 'inline-block',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
    },
    textWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: '50px',
      overflow: 'hidden',
    },
    text: {
      position: 'absolute',
      whiteSpace: 'nowrap',
      fontSize: '1.25rem',
      fontWeight: '500',
      animation: isAnimating ? 'slideFromRight 0.5s ease-in-out' : 'none',
      animationFillMode: 'forwards',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.textWrapper}>
        <div
          key={currentIndex}
          style={styles.text}
          className="marquee-text"
        >
          {texts[currentIndex]}
        </div>
      </div>
      <style>
        {`
          @keyframes slideFromRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MarqueeTextRotator;