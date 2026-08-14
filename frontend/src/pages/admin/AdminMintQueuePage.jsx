import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as mintApi from '../../api/endpoint/mintApi';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import AdminHeader from '../../components/layout/AdminHeader';

export default function AdminMintQueuePage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    try {
      const { data } = await mintApi.retryMint(id);
      alert(data.message);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Retry failed — check the reason shown and resolve it first');
    }
  }

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="Minting Queue" />

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          <div className="flex flex-col gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pending Mint Tasks</h2>
            <p className="text-sm text-gray-500">
              Approved projects still waiting to mint — usually because the seller hasn't connected a wallet yet.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Project Title</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-10 text-center text-gray-400">
                      Nothing pending.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link to={`/admin/projects/${p.id}`} className="hover:text-blue-600 hover:underline transition-colors">{p.title}</Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button onClick={() => handleRetry(p.id)}>Retry Mint</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}