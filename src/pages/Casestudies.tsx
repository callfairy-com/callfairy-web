import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import caseStudiesData from "../data/case-studies.json";
import Breadcrumbs from "../components/UI/Breadcrumbs";

interface CaseStudy {
  id: number;
  company: string;
  logo: string;
  summary: string;
  result: string;
  details: string;
}

const Casestudies: React.FC = () => {
  const caseStudies = caseStudiesData.caseStudies as CaseStudy[];
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (


    <main
    className="
        max-w-[5000px]
        mx-auto
        px-4
        sm:px-6
        md:px-8
        py-8
        bg-gradient-to-r from-indigo-50 via-white to-indigo-50
        "
    >
     <div className="max-w-7xl mx-auto">
       <Breadcrumbs items={[
         { label: 'Home', to: '/' },
         { label: 'Resources', to: '/resources' },
         { label: 'Case Studies' }
       ]} />
     </div>
     <h1 className="mt-8 text-5xl font-extrabold mb-8 text-center text-indigo-900 tracking-tight drop-shadow-md">
     Case Studies
     </h1>
      <p className="text-center max-w-3xl mx-auto mb-16 text-indigo-700 text-lg font-medium leading-relaxed">
        Discover how industry leaders have transformed their customer support with CallFairy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {caseStudies.map(({ id, company, logo, summary, result, details }) => {
          const isExpanded = expandedIds.includes(id);
          return (
            <motion.div
              key={id}
              layout
              initial={{ borderColor: "#e0e7ff" }}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(99, 102, 241, 0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="border border-indigo-200 rounded-xl bg-white p-8 flex flex-col shadow-sm"
            >
              <img
                src={logo}
                alt={`${company} logo`}
                className="h-20 w-auto object-contain mb-6 mx-auto"
                loading="lazy"
              />
              <h2 className="text-3xl font-semibold mb-4 text-center text-indigo-900">
                {company}
              </h2>
              <p className="text-gray-800 font-semibold mb-2">
                <span className="text-indigo-600">Summary:</span> {summary}
              </p>
              <p className="text-green-600 font-semibold mb-6">
                <span className="font-bold">Result:</span> {result}
              </p>

              <button
                onClick={() => toggleExpand(id)}
                className="mt-auto self-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-full font-semibold shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
                aria-expanded={isExpanded}
                aria-controls={`details-${id}`}
              >
                {isExpanded ? "Show Less ▲" : "Show More ▼"}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.p
                    id={`details-${id}`}
                    className="mt-6 text-gray-700 leading-relaxed select-text"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {details}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
};

export default Casestudies;
