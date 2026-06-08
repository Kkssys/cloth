import React, { useEffect, useRef } from 'react';

const ContinuousMarquee = ({ texts }) => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const scrollWidth = marquee.scrollWidth;
      let scrollPos = 0;

      const animate = () => {
        scrollPos -= 1;
        if (Math.abs(scrollPos) >= scrollWidth / 2) {
          scrollPos = 0;
        }
        marquee.style.transform = `translateX(${scrollPos}px)`;
        requestAnimationFrame(animate);
      };

      const animation = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animation);
    }
  }, []);

  // Duplicate texts for seamless loop
  const duplicatedTexts = [...texts, ...texts];

  const styles = {
    container: {
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: '10px 0',
      borderRadius: '8px',
    },
    marquee: {
      display: 'flex',
      whiteSpace: 'nowrap',
      willChange: 'transform',
    },
    textItem: {
      display: 'inline-block',
      padding: '0 30px',
      fontSize: '1rem',
      fontWeight: '500',
      color: 'white',
    },
    separator: {
      display: 'inline-block',
      margin: '0 20px',
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.5',
    },
  };

  return (
    <div style={styles.container}>
      <div ref={marqueeRef} style={styles.marquee}>
        {duplicatedTexts.map((text, index) => (
          <span key={index} style={styles.textItem}>
             <span style={styles.separator}>•</span>
             {text} 
            <span style={styles.separator}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContinuousMarquee;