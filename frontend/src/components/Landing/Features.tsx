import React from 'react';
import { image3d, image360, imageCeleb } from '@/app/images';

export const Features: React.FC = () => {
  const features = [
    {
      image: image3d,
      title: "Realistic 3D Depth",
      description: "Our engine maps hair strands individually, respecting lighting and face geometry for results that look genuinely real."
    },
    {
      image: imageCeleb,
      title: "Iconic Celebrity Styles",
      description: "Instantly recreate looks from your favorite stars. Our AI analyzes and adapts celebrity hairstyles to perfectly frame your unique face shape."
    },
    {
      image: image360,
      title: "Full 360° Visualization",
      description: "Don't just guess—know. Generate comprehensive front, side, and back views to ensure your new look is flawless from every single angle."
    }
  ];

  return (
    <section id="features" className="py-12 bg-background border-b border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Why <span className="text-primary">Choose Us?</span></h2>
          <p className="text-muted-foreground text-lg">Advanced AI technology meeting professional styling in a single platform.</p>
        </div>

        <div className="flex flex-col gap-20 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20`}
            >
              <div className="w-full md:w-1/3">
                <div className="relative rounded-4xl overflow-hidden  aspect-5/5 group">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};