import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lightbulb } from 'lucide-react';
import siteConfig from '../../data/siteConfig.json';
import navigationJson from '../../data/navigation.json';

// Define types for navigation items
interface NavItem {
  id: string;
  label: string;
  path?: string;
  order?: number;
  children?: NavItem[];
}

interface Navigation {
  mainNav: NavItem[];
  footerNav: {
    title: string;
    links: { label: string; path: string }[];
  }[];
}

// Cast imported JSON to Navigation type
const navigation: Navigation = navigationJson;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false); // New state for Products dropdown
  const [dark, setDark] = useState<boolean>(false);
  
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null); // New ref for Products dropdown

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check Products dropdown
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target as Node)
      ) {
        setProductsDropdownOpen(false);
      }
      
      // Check More dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
    setProductsDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll state
  useEffect(() => {
    window.scrollTo(0,0)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProductsDropdown = () => setProductsDropdownOpen(!productsDropdownOpen);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={siteConfig.site.logo}
              alt={siteConfig.site.name}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {siteConfig.site.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            {/* Products submenu - FIXED VERSION */}
            <div
              className="relative"
              ref={productsDropdownRef}
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                onClick={toggleProductsDropdown}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  productsDropdownOpen
                    ? 'text-blue-600 dark:text-blue-400'
                    : scrolled
                    ? 'text-gray-700 dark:text-gray-200'
                    : 'text-gray-800 dark:text-gray-100'
                }`}
                aria-haspopup="true"
                aria-expanded={productsDropdownOpen}
              >
                <span>Products</span>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform ${
                    productsDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              
              <AnimatePresence>
                {productsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-[28rem] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                    role="menu"
                    aria-label="CallFairy AI Platform products"
                  >
                    <div className="p-4">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">CallFairy AI Platform</h3>
                      <ul className="space-y-2" role="none">
                        {/* EchoFairy */}
                        <li role="none">
                          <a href="/echofairy" role="menuitem" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="mt-0.5" aria-hidden>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                <circle cx="12" cy="12" r="9"></circle>
                                <path d="M8 12h8"></path>
                              </svg>
                            </span>
                            <span className="flex-1">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                EchoFairy
                                <span className="text-[10px] tracking-wide uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">Coming soon</span>
                              </span>
                              <span className="block text-sm text-gray-600 dark:text-gray-300">AI-powered CRM — smarter leads, better business</span>
                            </span>
                          </a>
                        </li>
                        {/* Migsheet */}
                        <li role="none">
                          <a href="/migsheet" role="menuitem" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="mt-0.5" aria-hidden>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                                <path d="M8 4v16M16 4v16"></path>
                              </svg>
                            </span>
                            <span className="flex-1">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                Migsheet
                                <span className="text-[10px] tracking-wide uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">Coming soon</span>
                              </span>
                              <span className="block text-sm text-gray-600 dark:text-gray-300">AI-powered spreadsheet workflows</span>
                            </span>
                          </a>
                        </li>
                        {/* Fairybots */}
                        <li role="none">
                          <a href="/fairybots" role="menuitem" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="mt-0.5" aria-hidden>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                                <rect x="3" y="11" width="18" height="8" rx="2"></rect>
                                <circle cx="8" cy="15" r="1"></circle>
                                <circle cx="12" cy="15" r="1"></circle>
                                <circle cx="16" cy="15" r="1"></circle>
                              </svg>
                            </span>
                            <span className="flex-1">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">Fairybots</span>
                              <span className="block text-sm text-gray-600 dark:text-gray-300">AI bots for customer support (WhatsApp, other channels, web chatbot)</span>
                            </span>
                          </a>
                        </li>
                        {/* Fairygentic Agents */}
                        <li role="none">
                          <a href="/fairygentic-agents" role="menuitem" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="mt-0.5" aria-hidden>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400">
                                <path d="M12 2v20M2 12h20"></path>
                              </svg>
                            </span>
                            <span className="flex-1">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                              Fairygentic Agents
                                <span className="text-[10px] tracking-wide uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">Coming soon</span>
                              </span>
                              <span className="block text-sm text-gray-600 dark:text-gray-300">Create AI assistants for any task</span>
                            </span>
                          </a>
                        </li>
                        {/* AI-Calling-Agent */}
                        <li role="none">
                          <a href="/ai-calling-agent" role="menuitem" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="mt-0.5" aria-hidden>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 dark:text-orange-400">
                                <path d="M4 12h16M4 6h10M4 18h6"></path>
                              </svg>
                            </span>
                            <span className="flex-1">
                              <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                AI Calling Agent
                                <span className="text-[10px] tracking-wide uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">Coming soon</span>
                              </span>
                              <span className="block text-sm text-gray-600 dark:text-gray-300">AI-powered calling agent that automates outbound and inbound customer calls with natural language understanding.</span>
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* Footer actions */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex flex-wrap gap-3" role="group" aria-label="Products footer">
                      <a href="/templates" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Explore templates</a>
                      <a href="/use-cases" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Explore N8N Solutions</a>
                      <a href="/early-access" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Join CallFairy Early Access</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navigation.mainNav.map((item) =>
              item.children ? (
                <div
                  key={item.id}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      item.path && location.pathname.startsWith(item.path)
                        ? 'text-blue-600 dark:text-blue-400'
                        : scrolled
                        ? 'text-gray-700 dark:text-gray-200'
                        : 'text-gray-800 dark:text-gray-100'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${
                        dropdownOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-50"
                      >
                        <ul className="py-2">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                to={child.path!}
                                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path || '#'}
                  className={`relative pb-1 text-sm font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
                    location.pathname === item.path
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : scrolled
                      ? 'text-gray-700 dark:text-gray-200 border-b-2 border-transparent hover:border-blue-300 dark:hover:border-blue-400'
                      : 'text-gray-800 dark:text-gray-100 border-b-2 border-transparent hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          
          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setDark((v) => !v)}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700 transition-colors"
              aria-pressed={dark}
              aria-label="Toggle dark mode"
            >
              <Lightbulb className="w-4 h-4" /> {dark ? 'Light' : 'Dark'}
            </button>
            <Link
              to="/roi-calculator"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ROI Calculator
            </Link>
            <Link
              to="/demo"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - unchanged */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-t border-gray-200 py-4"
            >
              <nav className="flex flex-col space-y-4">
                {navigation.mainNav.map((item) =>
                  item.children ? (
                    <div key={item.id} className="flex flex-col space-y-2 px-4">
                      <span className="text-gray-900 font-semibold">
                        {item.label}
                      </span>
                      <div className="flex flex-col ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={child.path!}
                            className="text-sm font-medium px-4 py-2 rounded transition-colors text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.path || '#'}
                      className={`text-sm font-medium px-4 py-2 rounded transition-colors ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/roi-calculator"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ROI Calculator
                  </Link>
                  <Link
                    to="/demo"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Demo
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;