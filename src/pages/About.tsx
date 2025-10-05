import React from "react";
import aboutData from "../data/about.json";
import { FaUsers, FaGlobe, FaRobot, FaUsersCog } from "react-icons/fa";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

interface Stats {
  customersServed: number;
  aiInteractionsPerMonth: number;
  countries: number;
  teamSize: number;
}

interface AboutData {
  company: {
    name: string;
    tagline: string;
    founded: string;
    headquarters: string;
    website: string;
  };
  mission: {
    text: string;
    image: string;
  };
  vision: {
    text: string;
    image: string;
  };
  whatWeDo: {
    text: string;
    image: string;
  };
  values: {
    list: string[];
    image: string;
  };
  team: TeamMember[];
  stats: Stats;
}

const About: React.FC = () => {
  const data = aboutData as AboutData;

  return (
    <main className="max-w-6xl mx-auto p-8 pt-20 space-y-20 text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">
          About {data.company.name}
        </h1>
        <p className="text-center italic text-lg text-gray-600 dark:text-gray-300">
          {data.company.tagline}
        </p>
      </header>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-semibold border-b-4 border-blue-600 inline-block pb-1 mb-4 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{data.mission.text}</p>
        </div>
        <img
          src={data.mission.image}
          alt="Our Mission"
          className="rounded-lg shadow-lg object-cover w-full max-h-60"
          loading="lazy"
        />
      </section>

      {/* Vision Section */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <img
          src={data.vision.image}
          alt="Our Vision"
          className="rounded-lg shadow-lg object-cover w-full max-h-60 order-last md:order-first"
          loading="lazy"
        />
        <div>
          <h2 className="text-2xl font-semibold border-b-4 border-purple-600 inline-block pb-1 mb-4 text-gray-900 dark:text-white">
            Our Vision
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{data.vision.text}</p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-semibold border-b-4 border-indigo-600 inline-block pb-1 mb-4 text-gray-900 dark:text-white">
            What We Do
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{data.whatWeDo.text}</p>
        </div>
        <img
          src={data.whatWeDo.image}
          alt="What We Do"
          className="rounded-lg shadow-lg object-cover w-full max-h-60"
          loading="lazy"
        />
      </section>

      {/* Core Values Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-semibold border-b-4 border-green-600 inline-block pb-1 mb-4 text-gray-900 dark:text-white">
            Core Values
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
            {data.values.list.map((value) => (
              <li
                key={value}
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-default"
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={data.values.image}
          alt="Core Values"
          className="rounded-lg shadow-lg object-cover w-full max-h-60"
          loading="lazy"
        />
      </section>

      {/* Meet the Team Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.team.map((member) => (
            <article
              key={member.name}
              className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-slate-900"
              tabIndex={0}
              aria-label={`Team member: ${member.name}, ${member.title}`}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-36 h-36 rounded-full mx-auto object-cover"
                loading="lazy"
              />
              <h3 className="mt-4 text-xl font-semibold text-center text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-center text-indigo-600 dark:text-indigo-400 font-medium">
                {member.title}
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-snug">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-slate-900 dark:to-slate-900 rounded-xl p-8 max-w-5xl mx-auto shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <FaUsers className="text-blue-600 text-4xl" aria-hidden={true} focusable={false} />
            <p className="text-3xl font-extrabold">
              {data.stats.customersServed.toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Customers Served</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaRobot className="text-purple-600 text-4xl" aria-hidden={true} focusable={false} />
            <p className="text-3xl font-extrabold">
              {data.stats.aiInteractionsPerMonth.toLocaleString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">AI Interactions/Month</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaGlobe className="text-green-600 text-4xl" aria-hidden={true} focusable={false} />
            <p className="text-3xl font-extrabold">
              {data.stats.countries}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Countries</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FaUsersCog className="text-indigo-600 text-4l" aria-hidden={true} focusable={false} />
            <p className="text-3xl font-extrabold">
              {data.stats.teamSize}
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Team Members</p>
          </div>
        </div>
      </section>


    </main>
  );
};

export default About;
