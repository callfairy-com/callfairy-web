import React from 'react';
import Helmet from '../components/SEO/Helmet';
import data from '../data/Terms.json';
import TableOfContents from '../components/Legal/TableOfContents';
import { toSlug } from '../utils/slug';

type Section = { heading: string; content: string[] };
type Doc = { title: string; description: string; sections: Section[] };

const Terms: React.FC = () => {
  const doc = data as Doc;
  return (
    <>
      <Helmet title={`${doc.title} • CallFairy`} description={doc.description} />
      <main className="pt-20 pb-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <section className="max-w-3xl mx-auto px-4">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            <a href="/" className="hover:underline">Home</a>
            <span className="mx-1">/</span>
            <span className="font-medium">{doc.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{doc.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{doc.description}</p>
          <TableOfContents headings={doc.sections?.map(s => s.heading) || []} />

          <div className="space-y-8">
            {doc.sections?.map((s, idx) => (
              <section key={idx}>
                <h2 id={toSlug(s.heading)} className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{s.heading}</h2>
                {s.content?.map((para, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300 mb-3">{para}</p>
                ))}
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Terms;
