import React, { useState, useMemo } from "react";
import careersData from "../data/careers.json";

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  applyLink: string;
}

const Careersjobs: React.FC = () => {
  const jobs = careersData.jobs as Job[];

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const departments = useMemo(() => {
    return Array.from(new Set(jobs.map((job) => job.department))).sort();
  }, [jobs]);

  const types = useMemo(() => {
    return Array.from(new Set(jobs.map((job) => job.type))).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = departmentFilter
        ? job.department === departmentFilter
        : true;

      const matchesType = typeFilter ? job.type === typeFilter : true;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [jobs, searchTerm, departmentFilter, typeFilter]);

  return (
    <main className="pt-20 pb-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <section className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Careers at CallFairy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join our team and help us build the future of AI-powered customer support!
          </p>
        </header>


      {/* Filters */}
      <section className="mb-8 flex flex-wrap gap-4 items-center">
        <input
          type="search"
          placeholder="Search jobs by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 flex-[1_1_300px] rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-gray-400"
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex-[1_1_180px]"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex-[1_1_180px]"
        >
          <option value="">All Job Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>

      {/* Job Listings */}
      <section>
        {filteredJobs.length === 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-300">No jobs found matching your criteria.</p>
        ) : (
          filteredJobs.map((job) => (
            <article
              key={job.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8 shadow-sm hover:shadow-md transition-transform hover:scale-[1.01] bg-white dark:bg-slate-900"
            >
              <header className="mb-3">
                <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{job.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.department} • {job.type} • {job.location} • Posted: {new Date(job.postedDate).toLocaleDateString()}
                </p>
              </header>

              <p className="mb-4 text-gray-700 dark:text-gray-300">{job.description}</p>

              <div className="mb-4">
                <strong className="text-gray-900 dark:text-white">Responsibilities:</strong>
                <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-gray-900 dark:text-white">Requirements:</strong>
                <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => window.open(job.applyLink, "_blank", "noopener")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  aria-label={`Apply for ${job.title}`}
                >
                  Apply Now
                </button>
              </div>
            </article>
          ))
        )}
      </section>
      </section>
    </main>
  );
};

export default Careersjobs;
