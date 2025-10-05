import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  DollarSign,
  Code,
  BookOpen,
  Plane,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Button from '../components/UI/Button';
import solutionsData from '../data/solutions.json';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Solutions: React.FC = () => {
  const { hero, solutions, customSolution } = solutionsData;

  const iconMap = {
    'shopping-cart': ShoppingCart,
    heart: Heart,
    'dollar-sign': DollarSign,
    code: Code,
    'book-open': BookOpen,
    plane: Plane,
  };

  return (
    <div className="pt-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="show"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {hero.subtitle}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img
                src={hero.image}
                alt="CallFairy Solutions"
                className="w-full h-auto rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {solutions.map((solution, index) => {
            const IconComponent = iconMap[solution.icon as keyof typeof iconMap];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={solution.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={!isEven ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-purple-200/30">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white ml-4">{solution.title}</h2>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Features:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {solution.features.map((feature, i) => (
                        <div key={i} className="flex items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-gray-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg text-center shadow-md">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {solution.metrics.efficiency}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Efficiency Gain</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-lg text-center shadow-md">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {solution.metrics.satisfaction}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction</div>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-lg text-center shadow-md">
                      <div className="text-2xl font-bold text-teal-600 mb-1">
                        {solution.metrics.cost}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Cost Savings</div>
                    </div>
                  </div>

                  {/* Case Study */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 backdrop-blur-md p-6 rounded-xl shadow-md">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Success Story:</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{solution.caseStudy.company}</span> – {solution.caseStudy.result}
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className={!isEven ? 'lg:col-start-1' : ''}>
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-auto rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom Solution Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 p-12 rounded-2xl shadow-lg backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {customSolution.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {customSolution.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {customSolution.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" to={customSolution.cta.action}>
              {customSolution.cta.text}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Industry?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already using CallFairy to deliver exceptional customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" to="/signup">
                Start Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Button>
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

export default Solutions;
