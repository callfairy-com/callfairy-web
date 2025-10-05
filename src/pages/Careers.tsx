import React from "react";
import { Link } from "react-router-dom"; // Make sure you import Link for navigation

const Careers: React.FC = () => {
  return (
    <main className="pt-20 pb-16 px-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <section className="max-w-3xl mx-auto text-center">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Join Our Team & Culture</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">
            At CallFairy, our people are the heart of everything we do. We're on a
            mission to build a positive, inclusive, and inspiring team culture —
            and we’d love to have you be part of it.
          </p>
        </header>

        <Link to="/careers/openings" aria-label="View job openings" className="inline-block">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            See Our Openings
          </button>
        </Link>
      </section>
    </main>
  );
};

export default Careers;
