import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import ROICalculator from './pages/ROICalculator';
import Features from './pages/Features';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import Careers from './pages/Careers';
import About from './pages/About';
import Partners from './pages/Partners';
import Careersjobs from './pages/Careersjobs';
import CaseStudies from './pages/Casestudies';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/404page';
import Resources from './pages/Resources';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Security from './pages/Security';

// Products routing
import productsData from './data/products.json';
import { toSlug } from './utils/slug';
import ProductPage from './pages/products/ProductPage';
import ProductsOverview from './pages/products/ProductsOverview';
import DemoPage from './pages/demopage';
import './index.css';

// ✅ Lazy-load the ChatWidget dynamically
const ChatWidget = lazy(() => import('./components/UI/ChatbotScreen'));

// ✅ Helper wrapper to access route-based logic like hiding chat widget
const AppContent: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ✅ Optional: Hide chat widget on some specific routes
  const hideChatOnRoutes = ['/signup', '/404'];
  const shouldHideChat = hideChatOnRoutes.includes(location.pathname);

  const products = (productsData as { products: { name: string }[] }).products || [];

  return (
    <div className="min-h-screen bg-white">
      
      <Header />

      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: 'easeOut' }}
          >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/careers/openings" element={<Careersjobs />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/resources" element={<Resources />} />
          {/* Legal / static pages */}
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/security" element={<Security />} />
          {/* Products overview and dynamic products route */}
          <Route path="/products" element={<ProductsOverview />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/demo" element={<DemoPage />} />
          {/* Top-level product routes derived from product slugs */}
          {products.map((p) => {
            const slug = toSlug(p.name);
            return (
              <Route key={slug} path={`/${slug}`} element={<ProductPage initialSlug={slug} />} />
            );
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* ✅ Dynamically load chatbot only on allowed routes */}
      {!shouldHideChat && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>

 );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
