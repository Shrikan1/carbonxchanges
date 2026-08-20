import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import { useAuthStore } from '../../store/useAuthStore';
import AdminHeader from '../../components/layout/AdminHeader';
import PdfViewerModal from '../../components/ui/PdfViewerModal';

const STATUSES = ['assigned', 'pending', 'in_progress', 'verified', 'approved', 'rejected', 'minted'];

export default function AdminReviewQueuePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState('assigned');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPdfCid, setSelectedPdfCid] = useState(null);

  useEffect(() => {
    load();
  }, [status]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminProjectApi.getReviewQueue(status);
      setProjects(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setProjects([]);
      } else {
        console.error("Failed to load review queue", err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="Project Review" />

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          <div className="flex flex-col gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Queue Management</h2>

            <div className="flex items-center overflow-x-auto w-full pb-2 scrollbar-hide">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100 min-w-max">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${status === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                  >
                    {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project List */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col md:flex-row md:items-center bg-white border border-gray-100 rounded-2xl p-5 gap-4 md:gap-8 skeleton-glare">
                  <div className="flex flex-col md:w-1/3 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-5 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded mt-1"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 shrink-0 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <FiSearch size={32} className="opacity-20" />
              <p>No projects found in '{status}' queue.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/projects/${p.id}`)}
                  className="group cursor-pointer flex flex-col md:flex-row md:items-center bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all gap-4 md:gap-8 relative"
                >
                  <div className="flex flex-col md:w-1/3 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded w-fit">
                        {p.project_type || 'Carbon Project'}
                      </div>
                      {p.created_at && (
                        <span className="text-xs font-medium text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{p.title}</h3>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{p.description || "No description provided."}</p>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 shrink-0 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-sm font-bold text-green-800 shrink-0">
                        {p.seller_name?.charAt(0) || 'S'}
                      </div>
                      <span className="text-sm font-medium text-gray-700 line-clamp-1">{p.seller_name || 'Seller'}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0 whitespace-nowrap">{p.total_credits_estimated || 0} Credits</span>
                    
                    {p.verification_pdf_ipfs_cid && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPdfCid(p.verification_pdf_ipfs_cid);
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded transition-colors"
                      >
                        PDF
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
      {selectedPdfCid && (
        <PdfViewerModal 
          cid={selectedPdfCid} 
          onClose={() => setSelectedPdfCid(null)} 
        />
      )}
    </div>
  );
}
