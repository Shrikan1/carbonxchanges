import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as mintApi from '../../api/endpoint/mintApi';
import AdminLayout from '../../components/layout/AdminLayout';
import { FiCpu, FiAlertTriangle, FiCheckCircle, FiChevronRight, FiRefreshCw } from 'react-icons/fi';

export default function AdminMintQueuePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryId, setRetryId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await mintApi.getMintableProjects();
      setProjects(data.data || data.projects || []);
    } catch (err) {
      if (err.response?.status === 404) setProjects([]);
      else setError("Failed to load mint queue");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry(id) {
    setError(null);
    setRetryId(id);
    try {
      const { data } = await mintApi.retryMint(id);
      alert(data.message || 'Minting triggered successfully');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Retry failed — please check seller wallet configuration.');
    } finally {
      setRetryId(null);
    }
  }

  return (
    <AdminLayout title="Credit Issuance" subtitle="Review approved projects and trigger on-chain carbon credit minting.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col gap-2 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FiCpu className="text-indigo-600" /> Pending Minting Queue
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl">
              These projects have been fully verified and approved by the platform. They are awaiting smart contract interaction to mint the actual Carbon Credits (CXPT) to the seller's wallet.
            </p>
          </div>

          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm text-sm font-medium">
              <FiAlertTriangle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[40%]">Target Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-right">Credits to Mint</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-64 mb-2"></div><div className="h-3 bg-gray-100 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-5 bg-gray-100 rounded-full w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-5 bg-gray-100 rounded w-20 ml-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-8 bg-gray-100 rounded-lg w-28 ml-auto"></div></td>
                    </tr>
                  ))
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                          <FiCheckCircle size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">All caught up!</p>
                        <p className="text-xs text-gray-500 mt-1">There are no approved projects waiting in the mint queue.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/admin/projects/${p.id}`} className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1">
                          {p.title} <FiChevronRight />
                        </Link>
                        <div className="text-xs text-gray-500 mt-1 font-mono">Project ID: CXP-{p.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Pending Mint
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-black text-gray-900">
                          {p.total_credits_estimated?.toLocaleString() || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleRetry(p.id)}
                          disabled={retryId === p.id}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-wait"
                        >
                          {retryId === p.id ? <FiRefreshCw className="animate-spin" /> : <FiCpu />}
                          Execute Mint
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}