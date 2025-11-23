import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import bobLanding from '@/assets/boblanding.jpg';
import buzzcutLanding from '@/assets/buzzcutlanding.jpg';
import longshagLanding from '@/assets/longshaglanding.jpg';

const CAROUSEL_IMAGES = [
  {
    url: bobLanding,
    style: "Classic Bob",
    color: "bg-red-100 text-red-700"
  },
  {
    url: buzzcutLanding,
    style: "Buzz Cut",
    color: "bg-slate-100 text-slate-700"
  },
  {
    url: longshagLanding,
    style: "Long Shag",
    color: "bg-orange-100 text-orange-700"
  }
];

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextCard = () => {
    setActiveIndex((current) => (current + 1) % CAROUSEL_IMAGES.length);
  };

  const prevCard = () => {
    setActiveIndex((current) => (current - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  // Auto-move carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextCard();
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="relative pt-15 pb-10 lg:pt-15 lg:pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-32 -z-10 hidden lg:block" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 z-10">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1] flex flex-col">
              <div className="flex gap-3 lg:gap-4">
                <TextAnimate animation="blurInUp" as="span">Find</TextAnimate>
                <TextAnimate animation="blurInUp" as="span" delay={0.1}>Your</TextAnimate>
              </div>
              <TextAnimate animation="blurInUp" as="span" delay={0.2}>Perfect</TextAnimate>
              <TextAnimate
                animation="blurInUp"
                as="span"
                delay={0.3}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 pb-1"
              >
                Hairstyle
              </TextAnimate>
              <TextAnimate animation="blurInUp" as="span" delay={0.4}>Instantly.</TextAnimate>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Upload a selfie and try on hundreds of salon-grade hairstyles and colors with our ultra-realistic AI engine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/try">
                <Button size="lg" icon={<ArrowRight size={20} />}>
                  Get Started Now
                </Button>
              </Link>

              <Link to="/history">
                <Button size="lg" variant="outline">
                  View Gallery
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm text-slate-500 font-medium">

            </div>
          </div>

          {/* Hero Deck of Cards Carousel */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:-translate-x-12 transition-transform">
            <div
              className="relative h-[550px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {CAROUSEL_IMAGES.map((image, index) => {
                const offset = (index - activeIndex + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
                const isFront = offset === 0;
                const isSecond = offset === 1;
                const isThird = offset === 2;

                if (!isFront && !isSecond && !isThird) return null;

                let zIndex = 0;
                let transform = '';
                let opacity = 0;

                if (isFront) {
                  zIndex = 30;
                  // Tilted to the left initially as requested
                  transform = 'translateY(0) translateX(0) rotate(-6deg) scale(1)';
                  opacity = 1;
                } else if (isSecond) {
                  zIndex = 20;
                  // Spaced out
                  transform = 'translateY(45px) translateX(45px) rotate(2deg) scale(0.95)';
                  opacity = 0.75;
                } else if (isThird) {
                  zIndex = 10;
                  // Spaced out
                  transform = 'translateY(90px) translateX(90px) rotate(10deg) scale(0.9)';
                  opacity = 0.5;
                }

                return (
                  <div
                    key={index}
                    className="absolute w-[320px] md:w-[380px] aspect-4/5 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border-4 border-white transition-all duration-500 ease-in-out select-none"
                    style={{
                      zIndex,
                      transform,
                      opacity,
                      left: '50%',
                      top: '35%',
                      marginLeft: '-160px',
                      marginTop: '-200px'
                    }}
                    onClick={() => {
                      // Allow clicking the next card (visually behind) to bring it forward
                      if (isSecond) nextCard();
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.style}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Floating Badge only on front card */}
                    {isFront && (
                      <div className="absolute bottom-6 left-6 right-6 mx-auto bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in-up">

                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Style Applied</p>
                          <p className="font-serif font-bold text-slate-900 leading-tight">{image.style}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Decorative Background Blob behind cards */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-primary/20 to-primary/10 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            </div>

            {/* Manual Controls */}
            <div className="flex items-center gap-4 z-40">
              <button
                onClick={prevCard}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm"
                aria-label="Previous Style"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Swipe</span>
              <button
                onClick={nextCard}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm"
                aria-label="Next Style"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};