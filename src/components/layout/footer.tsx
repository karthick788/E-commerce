// src/components/layout/footer.tsx
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'Dresses', href: '/dresses' },
        { name: 'Mobiles', href: '/mobiles' },
        { name: 'Shoes', href: '/shoes' },
        { name: 'Furniture', href: '/furniture' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook className="h-5 w-5" />, href: 'https://facebook.com' },
    { icon: <FaTwitter className="h-5 w-5" />, href: 'https://twitter.com' },
    { icon: <FaInstagram className="h-5 w-5" />, href: 'https://instagram.com' },
    { icon: <FaLinkedin className="h-5 w-5" />, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Shop</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your one-stop shop for the latest fashion, electronics, and home essentials, powered by AI to bring you personalized shopping experiences.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  <span className="sr-only">Social media</span>
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <div className="mt-4 flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 block w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {currentYear} AI Shop. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;