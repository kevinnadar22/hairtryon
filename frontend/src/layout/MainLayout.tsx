import {Outlet} from 'react-router-dom';
import { Navbar } from '@/components/Header';
import Footer from '@/components/Footer';

export const MainLayout = () => {   
    return (    
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}