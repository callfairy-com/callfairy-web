import React from 'react';

interface GettingStartedStepsProps {
  title: string;
  steps: string[];
}

export const GettingStartedSteps: React.FC<GettingStartedStepsProps> = ({ title, steps }) => {
  if (!steps || steps.length === 0) return null;
  return (
    <section className="py-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {steps.map((s, idx) => (
          <li key={idx} className="pl-1">{s}</li>
        ))}
      </ol>
    </section>
  );
};
