import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFolder, FiChevronRight, FiFilter, FiFileText } from 'react-icons/fi';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import AdminLayout from '../../components/layout/AdminLayout';
import PdfViewerModal from '../../components/ui/PdfViewerModal';

const STATUSES = ['pending', 'assigned', 'in_progress', 'verified', 'approved', 'rejected', 'minted'];

const getStatusColor = (status) => {
  const map = {
    pending: 'bg-orange-100 text-orange-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    verified: 'bg-emerald-100 text-emerald-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    minted: 'bg-indigo-100 text-indigo-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

export default function AdminReviewQueuePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
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
        console.error("Failed to load projects", err);
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toString().includes(search)
  );

  return (
    <AdminLayout title="Projects" subtitle="Review and manage carbon projects across the verification pipeline.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          
          {/* Header & Controls */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-hide">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
                    status === s 
                      ? 'bg-[#0f172a] text-white shadow-sm' 
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[35%]">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Seller</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Est. Credits</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-[20%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                      <td className="px-6 py-5 text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                          <FiFolder size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No projects found</p>
                        <p className="text-xs text-gray-500 mt-1">There are no projects currently in the '{status}' state.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(p => (
                    <tr 
                      key={p.id} 
                      onClick={() => navigate(`/admin/projects/${p.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 line-clamp-1">{p.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 font-mono">ID: {p.id}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            {p.project_type || 'Carbon'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-800">
                            {p.seller_name?.charAt(0) || 'S'}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{p.seller_name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{p.total_credits_estimated?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
                          {status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {p.verification_pdf_ipfs_cid && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPdfCid(p.verification_pdf_ipfs_cid);
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <FiFileText /> PDF
                            </button>
                          )}
                          <span className="text-emerald-600 font-medium text-sm flex items-center gap-1 group-hover:underline">
                            Review <FiChevronRight />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      {selectedPdfCid && (
        <PdfViewerModal 
          cid={selectedPdfCid} 
          onClose={() => setSelectedPdfCid(null)} 
        />
      )}
    </AdminLayout>
  );
}
