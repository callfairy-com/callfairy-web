import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import blogData from '../data/blog.json';


type Post = {
  id: number; // <- was string, change to number
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featured: boolean;
};


const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const filteredPosts = useMemo(() => {
    return blogData.posts.filter((post: Post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const featuredPost = blogData.posts.find((post: Post) => post.featured);
  const regularPosts = filteredPosts.filter((post: Post) => !post.featured);

  const openPost = (post: Post, el?: HTMLElement) => {
    setActivePost(post);
    setIsOpen(true);
    if (el) setTriggerEl(el);
    document.body.style.overflow = 'hidden';  // lock scroll
    setTimeout(() => closeBtnRef.current?.focus(), 50);
  };

  const closeViewer = () => {
    setIsOpen(false);
    setTimeout(() => setActivePost(null), 300);
    document.body.style.overflow = '';
    setTimeout(() => triggerEl?.focus(), 50);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeViewer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter((el) => el.offsetParent !== null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    panel.addEventListener('keydown', handleKeyDown);
    return () => panel.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navigate = (dir: 'prev' | 'next') => {
    if (!activePost) return;
    const all = filteredPosts;
    const idx = all.findIndex((p) => p.id === activePost.id);
    const newIdx = dir === 'prev' ? Math.max(0, idx - 1) : Math.min(all.length - 1, idx + 1);
    const next = all[newIdx];
    if (next) setActivePost(next);
  };

  const renderContent = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.split('\n').every((line) => line.trim().startsWith('- '))) {
        const items = trimmed.split('\n').map((l) => l.replace('- ', '').trim());
        return (
          <ul key={i} className="list-disc list-inside mt-2 mb-2 space-y-1">
            {items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>
        );
      }
      const lines = trimmed.split('\n').map((ln, idx) => (
        <React.Fragment key={idx}>
          {ln}
          {idx < trimmed.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
      return (
        <p key={i} className="text-gray-700 leading-relaxed mt-2">
          {lines}
        </p>
      );
    });
  };

  return (
    <div className="pt-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Insights & Updates</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Stay updated with the latest trends, tips, and insights in AI-powered customer experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-12 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-300" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Categories</option>
                {blogData.categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'All' && !searchTerm && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden text-white"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="text-sm font-medium mb-4 text-blue-200">Featured Article</div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-blue-200 mb-6">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author.name}
                    <Calendar className="w-4 h-4 ml-4 mr-2" />
                    {new Date(featuredPost.publishDate).toLocaleDateString()}
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    {featuredPost.readTime}
                  </div>
                  <button
                    onClick={(e) => openPost(featuredPost, e.currentTarget)}
                    className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-fit"
                  >
                    Read Article
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/20"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Grid of Other Posts */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-slate-800"
                >
                  <div className="relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        {post.author.name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <button
                        onClick={(e) => openPost(post, e.currentTarget)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-300 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Slide-over Viewer */}
      <AnimatePresence>
        {isOpen && activePost && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              onClick={closeViewer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black dark:bg-gray-900"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative ml-auto w-full md:max-w-3xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4">
                  <button onClick={() => navigate('prev')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700" aria-label="Previous">
                    <ChevronLeft />
                  </button>
                  <button onClick={() => navigate('next')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700" aria-label="Next">
                    <ChevronRight />
                  </button>
                  <div className="ml-2 text-sm text-gray-600 dark:text-gray-300">{activePost.category}</div>
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{activePost.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(activePost.publishDate).toLocaleDateString()}
                      <Clock className="w-3 h-3 ml-3" />
                      {activePost.readTime}
                    </div>
                  </div>
                  <button
                    ref={closeBtnRef}
                    onClick={closeViewer}
                    aria-label="Close viewer"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <X />
                  </button>
                </div>
              </div>

              <div className="px-6 py-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{activePost.title}</h1>
                <img
                  src={activePost.featuredImage}
                  alt={activePost.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="prose dark:prose-invert max-w-none">{renderContent(activePost.content)}</div>

                <div className="mt-8 flex items-center justify-between border-t pt-6 border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    {activePost.tags.map((t) => (
                      <span key={t} className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{activePost.readTime}</div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
