import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  BarChart,
  Zap,
  Star,
  Check,
  Play,
} from 'lucide-react';
import Button from '../components/UI/Button';
import homepageData from '../data/homepage.json';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { hero, features, stats, testimonials } = homepageData;

  const iconMap = {
    phone: Phone,
    'message-circle': MessageCircle,
    'bar-chart': BarChart,
    zap: Zap,
  };

  return (
    <div className="pt-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
{/* Hero Section */}
  <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 overflow-hidden py-24 lg:py-32">
  {/* Decorative blurred circle */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse dark:bg-slate-800" />
  <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000 dark:bg-slate-700" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 dark:bg-slate-900 dark:text-slate-100">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            {hero.title}
          </span>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
          {hero.subtitle}
        </p>

        {/* Feature Highlights */}
        <div className="mb-10 space-y-3">
          {hero.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-3 group"
            >
              <Check className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" to={hero.cta.primary.action} className="group">
            {hero.cta.primary.text}
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          <Button variant="outline" size="lg" to={hero.cta.secondary.action}>
            {hero.cta.secondary.text}
          </Button>
        </div>
      </motion.div>

      {/* Right Side Image with gradient overlay */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100/40 dark:border-slate-800">
          <img
            src={hero.heroImage}
            alt="CallFairy AI Platform"
            className="w-full h-auto object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-sm rounded-3xl" />
        </div>
      </motion.div>
    </div>
  </div>
</section>
      {/* Stats Section (Enhanced UI like Product Preview) */}
      <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{stats.title}</h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              {/* Header bar */}
              <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">CallFairy Dashboard</div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.items.map((stat, index) => {
                    const gradientClass =
                      index === 0
                        ? 'from-blue-50 to-blue-100 text-blue-600 bg-blue-600'
                        : index === 1
                        ? 'from-purple-50 to-purple-100 text-purple-600 bg-purple-600'
                        : 'from-green-50 to-green-100 text-green-600 bg-green-600';

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-br ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} p-6 rounded-xl`}
                      >
                        <div className={`w-12 h-12 ${gradientClass.split(' ')[2]} rounded-lg flex items-center justify-center mb-4`}>
                          <div className="w-6 h-6 bg-white rounded-full" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{stat.label}</h3>
                        <p className={`text-5xl font-bold ${gradientClass.split(' ')[2]}`}>{stat.number}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating Animated Circles */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{features.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{features.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Mid CTA Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Orchestrate Workflows.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Automate Intelligence.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unified AI platform powering customer support, sales, and operations with intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg flex items-center group shadow-lg hover:shadow-xl"
              role="button"
              aria-label="Start for Free"
            >
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-semibold text-lg flex items-center group"
              role="button"
              aria-label="Watch Demo"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{testimonials.title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.items.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-8 relative shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already using CallFairy to deliver exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                to="/demo"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
