
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-muted-foreground">Last updated: November 20, 2025</p>


                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>1. Introduction</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                Welcome to HairTryOn. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>2. Data We Collect</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address.</li>
                                <li><strong>Image Data:</strong> includes photos you upload for the virtual try-on feature.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>3. How We Use Your Data</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
                                to provide the AI hair try-on service, manage your account, and improve our services.
                                <strong>Note:</strong> Uploaded images are processed for the purpose of generating the hairstyle preview and are not permanently stored or shared with third parties without your consent.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>4. Data Security</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                                used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal
                                data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>5. Contact Us</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
                            </p>
                        </CardContent>
                    </Card>

            </div>
        </div>
    );
};

export default PrivacyPolicy;
