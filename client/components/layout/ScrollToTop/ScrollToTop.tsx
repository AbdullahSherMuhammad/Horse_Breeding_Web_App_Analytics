import React, { useState, useEffect } from 'react';
import { FaLongArrowAltUp } from "react-icons/fa";


const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show or hide the button based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[50px] right-6 border-2 border-white bg-black text-white text-2xl p-2 rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-110"
        >
          <FaLongArrowAltUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
