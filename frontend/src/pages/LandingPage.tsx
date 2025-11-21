
import React from 'react';
import { Hero, Features, HowItWorks, Pricing } from '@/components/Landing';
import { FadeInTransition } from '@/components';

const LandingPage: React.FC = () => {
    return (
        <div className='"bg-white text-slate-900 antialiased selection:bg-brand-200 selection:text-brand-900"'>
            <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-brand-200 selection:text-brand-900">
                <FadeInTransition >
                    <main>
                        <Hero />
                        <Features />
                        <HowItWorks />
                        <Pricing />
                    </main>
                </FadeInTransition>

            </div>
        </div>
    );
};

export default LandingPage;
