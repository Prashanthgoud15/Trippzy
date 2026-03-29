import { Plane, Compass, MapPin } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Loader = ({ text = "Generating your dream itinerary..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Orbiting Plane */}
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border-2 border-dashed border-brand-300"
        >
          <div className="absolute -top-3 left-1/2 -ml-3 text-brand-600 bg-white rounded-full">
            <Plane size={24} className="transform rotate-45" />
          </div>
        </Motion.div>
        
        {/* Center icon pulsating */}
        <Motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-brand-500 bg-brand-50 p-4 rounded-full"
        >
          <Compass size={40} className="animate-spin-slow" />
        </Motion.div>
      </div>
      
      {/* Typewriter text or pulse text */}
      <Motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-8 text-xl font-medium text-brand-800 text-center"
      >
        {text}
      </Motion.p>
      
      <div className="mt-4 flex gap-2 space-x-1 text-sm text-gray-500">
        <MapPin size={16} /> Exploring small towns and big cities
      </div>
    </div>
  );
};

export default Loader;
