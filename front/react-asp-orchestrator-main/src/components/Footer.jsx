import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-cc">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4">Community Catalyst</h4>
            <p className="text-gray-300 mb-4">
              Connecting community members to build stronger neighborhoods through service, 
              volunteerism, and donations.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-cc-primary" />
                <span className="text-gray-300">123 Community Square, City, Country</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-cc-primary" />
                <span className="text-gray-300">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-cc-primary" />
                <span className="text-gray-300">info@communitycatalyst.org</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="text-xl font-bold mb-4">FAQ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq#volunteer" className="text-gray-300 hover:text-white transition-colors">How to volunteer?</Link>
              </li>
              <li>
                <Link to="/faq#donations" className="text-gray-300 hover:text-white transition-colors">How donations work?</Link>
              </li>
              <li>
                <Link to="/faq#request" className="text-gray-300 hover:text-white transition-colors">Requesting help</Link>
              </li>
              <li>
                <Link to="/faq#account" className="text-gray-300 hover:text-white transition-colors">Account management</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Community Catalyst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 