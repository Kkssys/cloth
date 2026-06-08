import React, { useState, useEffect } from 'react';

const TextRotator = ({ texts, interval = 3000, typingSpeed = 100, deletingSpeed = 50 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, interval);
      return () => clearTimeout(timeout);
    }

    const currentFullText = texts[currentIndex];

    if (isDeleting) {
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        timeout = setTimeout(() => {}, 500);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText.length === currentFullText.length) {
        setIsPaused(true);
        timeout = setTimeout(() => {}, interval);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentIndex, texts, interval, typingSpeed, deletingSpeed]);

  const styles = {
    container: {
      display: 'inline-block',
      minWidth: '250px',
    },
    text: {
      fontSize: '1.25rem',
      fontWeight: '500',
      display: 'inline-block',
      borderRight: '2px solid white',
      paddingRight: '10px',
      animation: 'blink 0.7s step-end infinite',
    },
  };

  // Add animation to index.css
  return (
    <div style={styles.container}>
      <span style={styles.text}>
        {currentText}
      </span>
    </div>
  );
};

export default TextRotator;