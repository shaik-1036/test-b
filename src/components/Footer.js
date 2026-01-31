import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '#' },
        { label: 'Browse Professionals', to: '#' },
        { label: 'Opportunities', to: '#' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Donate to Homes', to: '/old-age-homes' },
        { label: 'Donate to Orphans', to: '/orphans' },
        { label: 'Events', to: '#' },
        { label: 'Blog', to: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '#' },
        { label: 'Contact', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Skill Connect
                </div>
                <div className="text-xs text-gray-400 font-medium">Professional Network</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connect with professionals, grow your skills, and build meaningful relationships in your field.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail size={18} />
                <a href="mailto:contact@skillconnect.com">contact@skillconnect.com</a>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
              >
                <Phone size={18} />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-gray-400" whileHover={{ x: 5 }}>
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <h3 className="text-lg font-bold mb-6 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8" />

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Copyright */}
          <motion.div variants={itemVariants} className="text-gray-400 text-sm text-center md:text-left">
            <p>
              &copy; {currentYear} Skill Connect. All rights reserved. | Built with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                ❤️
              </motion.span>
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  <IconComponent size={20} />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </footer>
  );
}

export default Footer;
