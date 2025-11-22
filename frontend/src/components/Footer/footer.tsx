import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';
import Logo from '../Header/Logo';
import IsoImage from '../ui/IsoImage';
import homelogo from '@/assets/homeiso.png';
import contact from '@/assets/contactiso.png';
import historyiso from '@/assets/historyiso.png';
import tryon from '@/assets/3dsiscors.png';
import pricing from '@/assets/pricingiso.png';

// Footer links configuration
const links = {
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
    resources: [
        { label: 'How it Works', href: '/#how-it-works' },
        { label: 'Help Center', href: '#' },
    ],
    social: [
        { label: 'Home', href: '/', icon: homelogo },
        { label: 'Try On', href: '/try', icon: tryon },
        { label: 'Pricing', href: '/pricing', icon: pricing },
        { label: 'History', href: '/history', icon: historyiso },
        { label: 'Contact', href: '/contact', icon: contact },
    ],
};

const FooterSection = ({ title, items }: { title: string; items: Array<{ label: string; href: string; icon?: string }> }) => (
    <nav className="flex flex-col space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {title}
        </h3>
        <ul className="space-y-2">
            {items.map((item) => (
                <li key={item.label}>
                    <Link
                        to={item.href}
                        className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                    >
                        {item.icon && (
                            <IsoImage
                                src={item.icon}
                                alt={item.label}
                                size="sm"
                                hover={true}
                            />
                        )}
                        <span className="text-sm">{item.label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
);

const Footer: React.FC = () => {
    return (
        <footer className="relative mt-auto w-full">
            <Card className="border-t border-primary/40 rounded-none shadow-none">
                {/* <TextureOverlay texture="dots" opacity={0.3} /> */}

                <div className="relative z-10">
                    <div className="mx-auto max-w-6xl px-4 py-12">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                            {/* Logo and Description */}
                            <div className="flex flex-col space-y-4">
                                <Logo showText size="lg" />
                                <p className="text-sm text-muted-foreground">
                                    Transform your look with AI-powered virtual hair try-on. Visualize your perfect hairstyle before making a change.
                                </p>
                            </div>

                            {/* Links Sections */}
                            <FooterSection title="Company" items={links.company} />
                            {/* <FooterSection title="Resources" items={links.resources} /> */}
                            <FooterSection title="Social" items={links.social} />
                        </div>

                        <Separator className="my-8 bg-primary/20" />

                        {/* Bottom Section */}
                        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()} HairTryOn.{' '}
                                All rights reserved.
                            </p>
                            <nav className="flex items-center space-x-4">
                                <Link
                                    to="/privacy"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <Link
                                    to="/terms"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </Card>
        </footer>
    );
};

export default Footer;
