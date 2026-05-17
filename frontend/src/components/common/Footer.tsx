import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);

    // TODO: Connect newsletter API
    setEmail('');
  };

  return (
    <footer className="bg-[#0B1120] text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Expanzia Properties"
                className="h-10 w-auto brightness-0 invert"
              />
              <span className="font-fraunces text-2xl font-bold">
                Expanzia Properties
              </span>
            </Link>

            <p className="font-manrope text-[#9CA3AF] text-sm leading-relaxed mb-6">
              Premium real estate solutions designed for modern living.
              Discover luxury homes, investment opportunities, and commercial
              spaces with trusted guidance and smart property solutions.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                {
                  icon: <Facebook className="w-5 h-5" />,
                  link: 'https://facebook.com',
                },
                {
                  icon: <Instagram className="w-5 h-5" />,
                  link: 'https://instagram.com',
                },
                {
                  icon: <Linkedin className="w-5 h-5" />,
                  link: 'https://linkedin.com',
                },
                {
                  icon: <Youtube className="w-5 h-5" />,
                  link: 'https://youtube.com',
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:bg-[#C89B6D] hover:text-white transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-syne  text-lg font-bold mb-6 text-white">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Properties', path: '/properties' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Investment', path: '/investment' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-[#9CA3AF] text-sm hover:text-white hover:pl-2 transition-all inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-syne text-lg font-bold mb-6 text-white">
              Contact Info
            </h4>

            <ul className="space-y-5">
              <li>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 text-[#9CA3AF] text-sm hover:text-white transition-colors"
                >
                  <MapPin className="w-5 h-5 text-[#C89B6D] flex-shrink-0 mt-1" />

                  <span className="leading-relaxed">
                    Office No. 502, Business Tower,
                    <br />
                    SG Highway,
                    <br />
                    Ahmedabad, Gujarat
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+919368644903"
                  className="flex items-center gap-3 text-[#9CA3AF] text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#C89B6D]" />
                  <span>+91 93686 44903</span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:info@expanziaproperties.com"
                  className="flex items-center gap-3 text-[#9CA3AF] text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#C89B6D]" />
                  <span>info@expanziaproperties.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-syne text-lg font-bold mb-6 text-white">
              Stay Connected
            </h4>

            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
              Get the latest property listings, investment opportunities, and
              real estate insights directly in your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#C89B6D] transition-colors"
              />

              <button
                type="submit"
                className="w-full bg-[#C89B6D] hover:bg-[#B88350] text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Subscribe Now
              </button>
            </form>

            <p className="text-[#6B7280] text-xs mt-3">
              No spam. Only valuable property updates.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#6B7280] text-sm text-center md:text-left">
              © 2026 Expanzia Properties. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <a
                href="#"
                className="text-[#6B7280] text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-[#6B7280] text-sm hover:text-white transition-colors"
              >
                Terms & Conditions
              </a>

              <a
                href="#"
                className="text-[#6B7280] text-sm hover:text-white transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;