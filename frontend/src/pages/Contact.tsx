
import { Mail, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Contact = () => {
    const contactLinks = [
        {
            href: "https://www.linkedin.com/in/kvnn/",
            icon: Linkedin,
            color: "text-[#0077b5]",
            title: "LinkedIn",
            description: "Connect professionally",
            isExternal: true
        },
        {
            href: "https://x.com/kvnn22",
            icon: Twitter,
            color: "text-foreground",
            title: "Twitter",
            description: "Follow for updates",
            isExternal: true
        },
        {
            href: "mailto:jesikamaraj@gmail.com",
            icon: Mail,
            color: "text-red-500",
            title: "Email",
            description: "jesikamaraj@gmail.com",
            isExternal: false
        }
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full space-y-12 text-center"
            >
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                        Get in <span className="text-primary">Touch</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you. Connect with us on social media or drop us an email directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {contactLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            target={link.isExternal ? "_blank" : undefined}
                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                            className="group block h-full"
                        >
                            <Card className="h-full flex flex-col items-center justify-center border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <CardHeader className="flex flex-col items-center pb-2">
                                    <div className="p-5 bg-primary/5 rounded-2xl mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                                        <link.icon className={`w-8 h-8 ${link.color}`} />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-foreground">{link.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pb-6">
                                    <CardDescription className={`text-muted-foreground text-base ${link.title === 'Email' ? 'break-all' : ''}`}>
                                        {link.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
