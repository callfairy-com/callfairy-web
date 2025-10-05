import React from 'react';
import { Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import siteConfig from '../../data/siteConfig.json';
import navigation from '../../data/navigation.json';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-700 dark:bg-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={siteConfig.site.logo}
                alt={siteConfig.site.name}
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold">{siteConfig.site.name}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {siteConfig.site.description}
            </p>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-slate-900 dark:hover:text-white transition">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-slate-900 dark:hover:text-white transition">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{siteConfig.contact.address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {navigation.footerNav.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{section.title}</h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay in the loop</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get updates on new features and industry insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 flex-1 md:w-64"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} {siteConfig.site.name}. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
            <a href="/terms-of-service" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookie Policy</a>
            <a href="/security" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80 dark:opacity-60">
            {[ 
              { label: 'SOC 2 Type II', color: 'bg-green-500' },
              { label: 'GDPR Compliant', color: 'bg-blue-500' },
              { label: 'HIPAA Ready', color: 'bg-purple-500' },
              { label: 'ISO 27001', color: 'bg-orange-500' }
            ].map((badge, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${badge.color} rounded-full flex items-center justify-center`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-400">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
