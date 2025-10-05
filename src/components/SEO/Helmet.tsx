import React, { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterImage?: string;
}

const Helmet: React.FC<React.PropsWithChildren<HelmetProps>> = ({ title, description, ogTitle, ogDescription, ogImage, twitterCard = 'summary_large_image', twitterImage, children }) => {
  useEffect(() => {
    if (title) document.title = title;

    const ensureMeta = (selector: string, set: (el: HTMLMetaElement) => void) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('name=') ? 'name' : 'property';
        const key = selector.substring(selector.indexOf('[') + 1, selector.indexOf(']')).split('=')[1].replace(/"/g, '');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      set(el);
    };

    if (description) {
      ensureMeta('meta[name="description"]', (el) => el.setAttribute('content', description));
    }
    if (ogTitle || title) {
      ensureMeta('meta[property="og:title"]', (el) => el.setAttribute('content', ogTitle || title || ''));
    }
    if (ogDescription || description) {
      ensureMeta('meta[property="og:description"]', (el) => el.setAttribute('content', ogDescription || description || ''));
    }
    if (ogImage) {
      ensureMeta('meta[property="og:image"]', (el) => el.setAttribute('content', ogImage));
    }
    // Twitter
    if (twitterCard) {
      ensureMeta('meta[name="twitter:card"]', (el) => el.setAttribute('content', twitterCard));
    }
    if (title) {
      ensureMeta('meta[name="twitter:title"]', (el) => el.setAttribute('content', title));
    }
    if (description) {
      ensureMeta('meta[name="twitter:description"]', (el) => el.setAttribute('content', description));
    }
    if (twitterImage || ogImage) {
      ensureMeta('meta[name="twitter:image"]', (el) => el.setAttribute('content', twitterImage || ogImage || ''));
    }
  }, [title, description, ogTitle, ogDescription]);

  return <>{children}</>;
};

export default Helmet;
