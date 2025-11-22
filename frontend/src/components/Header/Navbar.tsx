import React from 'react';
import { Menu, Loader2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from '../ui/menubar';
import Logo from './Logo';
import AnimatedButton from '../ui/AnimatedButton';
import IsoImage from '../ui/IsoImage';
import homelogo from '@/assets/homeiso.png';
import contact from '@/assets/contactiso.png';
import historyiso from '@/assets/historyiso.png';
import tryonIcon from '@/assets/3dsiscors.png';
import pricingIcon from '@/assets/pricingiso.png';
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const links = [
    {
        href: '/',
        label: 'Home',
        icon: homelogo,
        type: 'image' as const,
    },
    {
        href: '/try',
        label: 'Try On',
        icon: tryonIcon,
        type: 'image' as const,
    },
    // pricing
    {
        href: '/pricing',
        label: 'Pricing',
        icon: pricingIcon,
        type: 'image' as const,
    },
    {
        href: '/history',
        label: 'History',
        icon: historyiso,
        type: 'image' as const,
    },

    {
        href: '/contact',
        label: 'Contact',
        icon: contact,
        type: 'image' as const,
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const auth = useSelector((state: RootState) => state.auth);

    return (
        <nav className="bg-card border-b border-primary/40 shadow-sm py-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Logo size="lg" />

                    {/* Desktop Navigation with Menubar */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Menubar className="border-none bg-transparent">
                            {links.map((link, index) => (
                                <MenubarMenu key={index}>
                                    <MenubarTrigger asChild>
                                        <Link
                                            to={link.href}
                                            className="cursor-pointer flex flex-col items-center text-foreground font-medium transition-all duration-300 hover:scale-105 px-3"
                                        >
                                            <IsoImage
                                                src={link.icon as string}
                                                alt={link.label}
                                                size="md"
                                                hover={true}
                                            />
                                            <span className="text-sm">{link.label}</span>
                                        </Link>
                                    </MenubarTrigger>
                                </MenubarMenu>
                            ))}
                        </Menubar>

                        {/* Auth area */}
                        {auth.status === 'loading' ? (
                            <div className="flex items-center ml-4">
                                <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : auth.isAuthenticated ? (
                            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={auth.user?.profilePictureUrl || ""}
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {auth.user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-sm font-medium leading-none">{auth.user?.name}</span>
                                    <span className="text-[10px] font-semibold text-primary whitespace-nowrap mt-1">
                                        {auth.user?.credits ?? 0} Credits
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/login" className="ml-4">
                                <InteractiveHoverButton>
                                    <span className="text-md font-semibold">Login</span>
                                </InteractiveHoverButton>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu with Sheet */}
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col space-y-2">
                                {links.map((link, index) => (
                                    <React.Fragment key={index}>
                                        <Link
                                            to={link.href}
                                            className="flex items-center gap-4 px-2 py-3 hover:bg-accent rounded-lg transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <IsoImage
                                                src={link.icon as string}
                                                alt={link.label}
                                                size="md"
                                                hover={true}
                                            />
                                            <span className="text-base font-medium">{link.label}</span>
                                        </Link>
                                    </React.Fragment>
                                ))}

                                <Separator className="my-4" />

                                {auth?.status === 'loading' ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : auth?.isAuthenticated ? (
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-2 py-3 hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={auth.user?.profilePictureUrl || ""}
                                                alt={auth.user?.name}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {auth.user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium">{auth.user?.name}</span>
                                            <span className="text-sm text-muted-foreground">{auth.user?.credits ?? 0} Credits</span>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="px-4">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                            <AnimatedButton
                                                variant='default'
                                                className="w-[200px]"
                                            >
                                                Login
                                            </AnimatedButton>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
