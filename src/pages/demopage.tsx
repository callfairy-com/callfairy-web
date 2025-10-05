// src/pages/DemoPage.tsx
import React from 'react';
import Helmet from '../components/SEO/Helmet';

const products = [
  {
    name: 'Fairybots | AI Chatbots use chatbot on callfairy website to get demo and mock up',
    description: 'AI bots for customer support (WhatsApp, other channels, web chatbot)',
    keyFeatures: [
      {
        title: 'Custom Branding',
        description: 'Customize avatar, colors, logo, and theme to match your brand.',
      },
      {
        title: 'Directive & Greeting',
        description: 'Set instructions for the bot’s behavior and create custom greetings.',
      },
    ],
  },
  {
    name: 'AI Calling Agent',
    status: 'Coming soon',
    description:
      'AI-powered calling agent that automates outbound and inbound customer calls with natural language understanding.',
    keyFeatures: [
      {
        title: 'NLP',
        description:
          'Understands and responds to customer queries in real time with human-like conversation.',
      },
      {
        title: 'Lead Qualification',
        description:
          'Engage prospects, ask qualifying questions, and update CRM records based on responses.',
      },
    ],
  },
];

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 px-4 py-12">
      <Helmet
        title="Demo Page – Product Preview"
        description="A preview page showcasing Fairybots and AI Calling Agent features."
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Demo</h1>

        <div className="space-y-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                {product.status === 'Coming soon' && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{product.description}</p>

              {product.keyFeatures && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Key Features:</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    {product.keyFeatures.map((feature) => (
                      <li key={feature.title}>
                        <span className="font-semibold">{feature.title}:</span>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
