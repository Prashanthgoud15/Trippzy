import { Link } from 'react-router-dom';
import { Plane, Compass } from 'lucide-react';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col font-sans">
      <div className="flex-grow flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="relative mb-8 flex justify-center">
            <Compass size={120} className="text-brand-200" />
            <Plane size={48} className="text-brand-600 absolute bottom-0 right-1/4 -rotate-45" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Your trip took a <br/>
            <span className="text-gradient">wrong turn!</span>
          </h1>
          
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved or never existed. Let's get you back on track.
          </p>
          
          <Link to="/" className="inline-block px-8 py-4 bg-brand-500 text-white rounded-full font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
            Return to Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
