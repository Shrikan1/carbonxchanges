import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as oversightApi from '../../api/endpoint/oversightApi';
import AdminLayout from '../../components/layout/AdminLayout';
import { FiBox, FiMapPin, FiUser, FiChevronRight, FiSearch } from 'react-icons/fi';

const STATUS_COLORS = {
  pending:     'bg-orange-50 text-orange-700 border-orange-200',
  assigned:    'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  verified:    'bg-purple-50 text-purple-700 border-purple-200',
  approved:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  minted:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  rejected:    'bg-red-50 text-red-700 border-red-200',
  draft:       'bg-gray-100 text-gray-600 border-gray-200',
};

export default function AdminOversightProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    oversightApi.getAllProjects()
      .then((r) => setProjects(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setProjects([]);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  return (
    <AdminLayout title="All Projects" subtitle="Full oversight view of every registered carbon project.">
      <div className="p-6 lg:p-8 w-full max-w-[1200px] mx-auto space-y-5">

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, seller or ID..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['pending', 'assigned', 'verified', 'approved'].map((st) => {
            const count = projects.filter((p) => p.status === st).length;
            const color = STATUS_COLORS[st] || 'bg-gray-100 text-gray-600 border-gray-200';
            return (
              <div key={st} className={`rounded-xl border px-4 py-3 ${color}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">{st.replace('_', ' ')}</p>
                <p className="text-2xl font-black">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Project List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_140px_48px] px-6 py-3 bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Project</span>
            <span>Location</span>
            <span>Seller / Agent</span>
            <span>Status</span>
            <span></span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FiBox size={40} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium text-sm">No projects found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const sc = STATUS_COLORS[p.status] || STATUS_COLORS.draft;
                return (
                  <Link
                    key={p.id}
                    to={`/admin/projects/${p.id}`}
                    className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_140px_48px] items-start md:items-center gap-3 md:gap-0 px-6 py-4 hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* Project info */}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                        {p.title || 'Untitled Project'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        CXP-{p.id} · {p.project_type?.replace(/_/g, ' ')} · {p.project_scale}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {(p.country || p.state_region) ? (
                        <>
                          <FiMapPin size={11} className="text-gray-300 shrink-0" />
                          <span className="truncate">{[p.city, p.state_region, p.country].filter(Boolean).join(', ')}</span>
                        </>
                      ) : (
                        <span className="text-gray-300 italic">—</span>
                      )}
                    </div>

                    {/* Seller / Agent */}
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiUser size={10} className="text-gray-300" />
                        <span className="truncate font-medium">{p.seller_name || '—'}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Agent: {p.agent_name || 'Unassigned'}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div>
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${sc}`}>
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-end">
                      <FiChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer count */}
          {!loading && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''} {search ? `matching "${search}"` : 'total'}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}