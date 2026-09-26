import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { FiArrowRight } from 'react-icons/fi';
import { Lottie } from 'lottie-react';
import catAnimation from '../../assets/animations/404 error page with cat.json';

export default function NotFoundPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="pt-24 flex-grow flex">
        <main className="flex-grow flex flex-col items-center justify-center p-6 pt-12 pb-24 text-center w-full">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col items-center max-w-lg w-full relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

        <div className="w-48 h-48 md:w-56 md:h-56 relative z-10 -mt-4 mb-2">
          <Lottie src={catAnimation} loop autoplay />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight relative z-10">
          Page Not Found
        </h2>

        <p className="text-gray-500 text-sm md:text-base mb-6 max-w-xs relative z-10">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#173d25] hover:bg-[#122e1b] text-white font-bold py-2.5 px-6 transition-colors rounded-xl shadow-sm relative z-10 text-sm"
        >
          Return to Dashboard <FiArrowRight />
        </Link>
      </div>
        </main>
      </div>
    </div>
  );
}
