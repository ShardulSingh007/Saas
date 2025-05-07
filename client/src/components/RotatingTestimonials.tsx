import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  pic: string;
  quote: string;
  rating: number;
}

export const RotatingTestimonials: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const t = testimonials[index];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center bg-white/80 dark:bg-[#232336] rounded-xl shadow p-6 transition-all duration-500">
      <img src={t.pic} alt={t.name} className="w-14 h-14 rounded-full mb-2 border-2 border-indigo-400 object-cover" />
      <div className="flex mb-1">
        {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400" />)}
      </div>
      <p className="text-base italic mb-2 text-center">“{t.quote}”</p>
      <span className="font-semibold text-indigo-600 dark:text-indigo-300">{t.name}</span>
    </div>
  );
}; 