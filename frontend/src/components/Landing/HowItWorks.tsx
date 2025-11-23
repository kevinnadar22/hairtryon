import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Wand2, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/5 px-3 py-1 rounded-full">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-4 mb-4">How It Works</h2>
          <p className="text-slate-600">Transform your look in three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0">
            <div className="absolute inset-0 bg-primary/20 w-1/2 animate-pulse"></div>
          </div>

          {/* Step 1 */}
          <div className="relative z-10 text-center group">
            <Link to="/try" className="block">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8 border border-slate-100 group-hover:border-primary/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 relative cursor-pointer">
                <Upload className="text-primary" size={32} />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50">1</div>
              </div>
            </Link>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Photo</h3>
            <p className="text-slate-600 px-4 text-sm leading-relaxed">Take a selfie or upload a clear photo. Good lighting ensures the best results.</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 text-center group">
            <Link to="/try" className="block">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8 border border-slate-100 group-hover:border-primary/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 relative cursor-pointer">
                <Wand2 className="text-primary" size={32} />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50">2</div>
              </div>
            </Link>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Style</h3>
            <p className="text-slate-600 px-4 text-sm leading-relaxed">Select from our trending presets to define your new look.</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 text-center group">
            <Link to="/try" className="block">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-8 border border-slate-100 group-hover:border-primary/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 relative cursor-pointer">
                <Download className="text-primary" size={32} />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50">3</div>
              </div>
            </Link>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Get Results</h3>
            <p className="text-slate-600 px-4 text-sm leading-relaxed">Download your transformed photo in HD instantly. Share or save for later.</p>
          </div>
        </div>
      </div>
    </section>
  )
}