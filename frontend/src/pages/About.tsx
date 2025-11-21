
import { ExternalLink, Code2 } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-background px-4 py-16">
            <div className="max-w-6xl mx-auto">

                {/* Profile Card */}
                <div className="max-w-4xl mx-auto">
                    {/* Page Title - Top Left */}
                    <div className="mb-16">
                        <h1 className="text-5xl font-serif font-bold text-foreground text-left">
                            About <span className="text-primary">Us</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mt-4">
                            Meet the developers
                        </p>
                    </div>
                    <div className="border border-border rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
                            {/* Profile Picture */}
                            <div className="mx-auto md:mx-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-border">
                                    <img
                                        src="https://mariakevin.in/me.png"
                                        alt="Maria Kevin"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="text-center md:text-left space-y-6">
                                {/* Name & Title */}
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        Maria Kevin
                                    </h2>
                                    <p className="text-lg text-primary font-semibold flex items-center justify-center md:justify-start gap-2">
                                        <Code2 className="w-6 h-6" />
                                        Full Stack AI Web Developer
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                    I love creating useful things, automating boring stuff, and turning ideas into reality with code.
                                </p>

                                {/* Portfolio Link */}
                                <div className="">
                                    <a
                                        href="https://mariakevin.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        View Portfolio
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
