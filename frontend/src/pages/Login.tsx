
import { FadeInTransition } from '@/components/ui/FadeInTransition';
import loginbg from '@/assets/loginbg.png';
import { Meteors } from '@/components/ui/meteors';
import { TextAnimate } from '@/components/ui/text-animate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginForm from '@/components/Auth/Login';
import SignupForm from '@/components/Auth/Signup';
import React from 'react';
import { logout } from '@/features';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';



const Login: React.FC = () => {
    const dispatch = useDispatch();
    
    // use effect to remove any existing auth tokens on mount
    React.useEffect(() => {
        dispatch(logout());
    }, []);


    return (
        <div className="min-h-screen w-full relative">
            {/* Cotton Candy Sky Gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(45deg, #ff9898ff 0%, #fec4c4ff 20%, #ffc7c7ff 40%, #ffe6e6ff 60%, #f6c6c6ff 80%, #fea5a5ff 100%)`,
                }}
            />
            <Meteors />

            <div className="w-full relative">
                {/* Mobile Background Image */}

                <div className="grid md:grid-cols-2 gap-10 min-h-screen relative max-w-5xl mx-auto px-4 md:px-0">
                    <div className="hidden md:flex items-center justify-center">
                        <img
                            src={loginbg}
                            alt="Login Background"
                            className="max-w-sm h-auto object-contain select-none"
                            draggable="false"
                        />
                    </div>

                    {/* Login Form Column */}
                    <div className="flex items-center justify-center">
                        <Card className="w-full max-w-md shadow-lg">
                            <FadeInTransition>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-3xl font-bold text-foreground mb-2">
                                        <TextAnimate animation="blurInUp">Welcome Back</TextAnimate>
                                    </CardTitle>

                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <Tabs defaultValue="login" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="login">Login</TabsTrigger>
                                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="login">
                                            <LoginForm />
                                        </TabsContent>

                                        <TabsContent value="signup">
                                            <SignupForm />
                                        </TabsContent>
                                    </Tabs>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-foreground/70">
                                            By continuing, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                        </p>
                                    </div>
                                </CardContent>
                            </FadeInTransition>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
