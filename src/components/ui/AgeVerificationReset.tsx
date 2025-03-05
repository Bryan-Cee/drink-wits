'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AgeVerificationReset() {
  const [clicks, setClicks] = useState(0);
  
  // Reset age verification after 5 clicks
  const handleClick = () => {
    setClicks(prevClicks => {
      const newClicks = prevClicks + 1;
      
      if (newClicks >= 5) {
        localStorage.removeItem('age-verified');
        toast.success('Age verification reset. Refresh the page to verify again.');
        return 0;
      }
      
      return newClicks;
    });
  };
  
  return (
    <span 
      onClick={handleClick} 
      className="cursor-default text-opacity-0 hover:text-opacity-10 text-white transition-opacity"
      title="Click 5 times to reset age verification"
    >
      •
    </span>
  );
} 