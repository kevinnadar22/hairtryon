import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import logoVideo from '@/assets/logo.mp4';
import logotext from '@/assets/logotext.png';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
    className = '',
    showText = true,
    size = 'md',
    onClick
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };



    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/');
        }
    };

    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer transition-transform duration-200  ${className}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`relative ${sizeClasses[size]}`}>
                <img
                    src={logo}
                    alt="HairTryOn Logo"
                    className={`${sizeClasses[size]} transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                />
                <video
                    ref={videoRef}
                    src={logoVideo}
                    className={`absolute top-0 left-0 ${sizeClasses[size]} object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    loop={false}
                    muted
                />
            </div>
            {showText && (
                // show lof
                <img
                    src={logotext}
                    alt="HairTryOn Logo Text"
                    className={`h-10 transition-opacity duration-300`}
                />
            )}
        </div>
    );
};

export default Logo;
