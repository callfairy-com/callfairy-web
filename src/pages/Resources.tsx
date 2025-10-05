import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Video, FileText, Users, Lightbulb } from 'lucide-react';

interface Resource {
  icon: string;
  title: string;
  description: string;
  items: string[];
  cta: string;
  color: string;
}

interface BlogPost {
  id: number;
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
}

interface ResourcesData {
  resources: Resource[];
  blogPosts: BlogPost[];
}

const Resources: React.FC = () => {
  const [data, setData] = useState<ResourcesData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const resourcesResponse = await import('../data/resources.json');
      const blogResponse = await import('../data/blog.json');
      
      setData({
        resources: resourcesResponse.default.resources,
        blogPosts: blogResponse.default.posts,
      });
    };

    loadData();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      green: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
      purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
      indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      red: 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white',
    };
    return colors[color as keyof typeof colors];
  };

  if (!data) return <div>Loading...</div>;

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Resources & Support</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed with CallFairy. From getting started guides to advanced automation strategies.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {data.resources.map((resource, index) => (
            <div
              key={index}
              className="group bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(resource.color)}`}>
                {resource.icon === 'BookOpen' && <BookOpen className="w-8 h-8" />}
                {resource.icon === 'Calculator' && <Calculator className="w-8 h-8" />}
                {resource.icon === 'Video' && <Video className="w-8 h-8" />}
                {resource.icon === 'FileText' && <FileText className="w-8 h-8" />}
                {resource.icon === 'Users' && <Users className="w-8 h-8" />}
                {resource.icon === 'Lightbulb' && <Lightbulb className="w-8 h-8" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>
              <div className="space-y-2 mb-6">
                {resource.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {item}
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {resource.cta}
              </button>
            </div>
          ))}
        </div>
{/* Blog Section */}
<div className="bg-gray-50 rounded-2xl p-8">
  <div className="text-center mb-12">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest from Our Blog</h3>
    <p className="text-gray-600">
      Stay updated with the latest AI automation trends, tips, and insights.
    </p>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {data.blogPosts.slice(0, 3).map((post) => (
      <a
        key={post.id}
        href={`/blog/${post.slug}`}
        className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        aria-label={`Read blog post titled ${post.title}`}
      >
        <img
          src={post.featuredImage}
          alt={`Image for blog post titled ${post.title}`}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{post.category}</span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h4>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <time className="text-sm text-gray-500" dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">Read More →</span>
          </div>
        </div>
      </a>
    ))}
  </div>
  <div className="text-center mt-8">
    <a
      href="/blog"
      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold"
      aria-label="View all blog articles"
    >
      View All Articles
    </a>
  </div>

        </div>
      </div>
    </section>
  );
};

export default Resources;
