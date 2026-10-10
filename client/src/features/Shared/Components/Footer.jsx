import { MapPin, Phone, Mail, User } from 'lucide-react';

const InstagramIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <title>Instagram</title>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const WhatsAppIcon = ({ size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
    >
        <title>WhatsApp</title>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const GoogleIcon = ({ size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
    >
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
)

const FacebookIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <title>Facebook</title>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const Footer = () => {
    return (
        <footer
            id="footer"
            className="bg-black text-gray-400 border-t border-gray-800 pt-12 md:pt-16"
        >
            <div className="container mx-auto px-4">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] gap-10 md:gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="text-white text-3xl font-black tracking-tight mb-4">
                            NiCe <span className="text-[#2a8ce9]">SoftServ</span>
                        </div>

                        <p className="mb-6 leading-relaxed">
                            Discover exclusive fashion collections designed to elevate your wardrobe and showcase your unique personality.
                        </p>

                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300"
                            >
                                <InstagramIcon size={20} />
                            </a>

                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300"
                            >
                                <FacebookIcon size={20} />
                            </a>
                            <a
                                href="https://wa.me/9313252534"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white hover:bg-green-500 hover:-translate-y-1 transition-all duration-300"
                            >
                                <WhatsAppIcon size={20} />
                            </a>
                            <a
                                href="https://www.google.com/maps"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Google Maps"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white hover:bg-[#e13023] hover:-translate-y-1 transition-all duration-300"
                            >
                                <GoogleIcon size={20} />
                            </a>

                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-xl uppercase mb-6">
                            Contact Us
                        </h4>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin
                                    size={20}
                                    className="text-blue-500 shrink-0 mt-1"
                                />
                                <span>
                                    Maple Oasis Karamsad Anand, Gujarat 388325
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <User
                                    size={20}
                                    className="text-blue-500 shrink-0 mt-1"
                                />
                                <span>
                                    Managing Director: Mr. Zeel Patel
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <Phone
                                    size={20}
                                    className="text-blue-500 shrink-0 mt-1"
                                />
                                <span>+91 9313252534</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <Mail
                                    size={20}
                                    className="text-blue-500 shrink-0 mt-1"
                                />
                                <span>zeelnp06@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div>
                        <h4 className="text-white text-xl uppercase mb-6">
                            Find Us
                        </h4>

                        <div className="w-full h-[250px] lg:h-[200px] rounded-lg overflow-hidden border border-gray-800">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7369.600068371764!2d72.9291496!3d22.549162299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e71ef666cf1%3A0xaf3e5d0366dacf7c!2zU2hyZWUgQ3JlYXRpb24gKOCqtuCrjeCqsOCrgCDgqpXgq43gqrDgqr_gqo_gqrbgqqgp!5e0!3m2!1sen!2sin!4v1780138278080!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Maps Location"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="text-center py-6 border-t border-gray-800 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} NiCeSoftServ Inc. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;