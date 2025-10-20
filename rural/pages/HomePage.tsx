
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 mb-12" style={{backgroundImage: "url('https://picsum.photos/1200/400?image=1054')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="bg-black bg-opacity-50 p-8 rounded-lg">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              Find Your Niche in Agriculture
              </h1>
              <p className="text-lg md:text-xl text-brand-cream max-w-3xl mx-auto">
              Cultivating careers in rural communities. Explore diverse opportunities from farm management to agritech and find a job that grows with you.
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          to="/full-time"
          className="group block bg-brand-green p-8 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Full-Time Jobs</h2>
          <p className="text-brand-brown group-hover:text-brand-cream transition-colors">
            Discover stable, long-term career opportunities in the heart of agriculture.
          </p>
        </Link>
        <Link
          to="/part-time"
          className="group block bg-brand-green p-8 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Part-Time Jobs</h2>
          <p className="text-brand-brown group-hover:text-brand-cream transition-colors">
            Find flexible, seasonal, or supplementary roles that fit your schedule.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
