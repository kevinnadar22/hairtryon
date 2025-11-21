

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                        Terms of <span className="text-primary">Service</span>
                    </h1>
                    <p className="text-muted-foreground">Last updated: November 20, 2025</p>



                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>1. Acceptance of Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                By accessing and using HairTryOn, you accept and agree to be bound by the terms and provision of this agreement.
                                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable
                                to such services.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>2. Description of Service</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                HairTryOn provides users with an AI-powered tool to visualize different hairstyles on their uploaded photos.
                                You understand and agree that the Service is provided "AS-IS" and that HairTryOn assumes no responsibility for
                                the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>3. User Conduct</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                You agree to not use the Service to upload, post, email, transmit or otherwise make available any content that is
                                unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of
                                another's privacy, hateful, or racially, ethnically or otherwise objectionable.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>4. Intellectual Property</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other
                                matters related to the Site are protected under applicable copyrights, trademarks and other proprietary
                                (including but not limited to intellectual property) rights.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle>5. Termination</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground leading-relaxed">
                            <p>
                                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason
                                whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </CardContent>
                    </Card>

            </div>
        </div>
    );
};

export default TermsOfService;
