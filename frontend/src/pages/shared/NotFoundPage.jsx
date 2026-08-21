import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SellerLayout from '../../components/layout/SellerLayout';
import AgentLayout from '../../components/layout/AgentLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { FiAlertCircle, FiArrowRight, FiTool } from 'react-icons/fi';

export default function NotFoundPage() {
  const { user } = useAuthStore();

  const notFoundContent = (
    <main className="flex-grow flex flex-col items-center justify-center p-6 pt-12 pb-24 text-center w-full">
        <div className="bg-white border border-gray-200 p-12 shadow-sm flex flex-col items-center max-w-2xl w-full relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-8 border border-gray-100 relative z-10">
            <FiAlertCircle size={40} />
          </div>
          
          <h1 className="text-[120px] font-black uppercase text-gray-900 leading-none tracking-tighter mb-4 relative z-10 wise-font opacity-20">
            404
          </h1>
          
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight relative z-10">
            Page Not Found
          </h2>
          
          <p className="text-gray-500 text-lg mb-10 max-w-md relative z-10">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-[#c2ed6d] hover:bg-[#a3e635] text-[#0c0c0c] font-mono font-bold py-3 px-8 transition-colors border-[2px] border-[#0c0c0c] relative z-10 uppercase tracking-wider"
          >
            Return to Dashboard <FiArrowRight />
          </Link>
        </div>
      </main>
  );

  if (user?.is_seller) {
    return (
      <SellerLayout title="Page Not Found" subtitle="This section is currently unavailable or under construction.">
        {notFoundContent}
      </SellerLayout>
    );
  }

  if (user?.role === 'agent') {
    return (
      <AgentLayout title="Page Not Found" subtitle="This section is currently unavailable or under construction.">
        {notFoundContent}
      </AgentLayout>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="pt-24 flex-grow flex">
        {notFoundContent}
      </div>
      <Footer />
    </div>
  );
}
