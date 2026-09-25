import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerLayout from '../../components/layout/SellerLayout';
import * as Sellerapi from '../../api/endpoint/Sellerapi';
import { FiArrowRight, FiPlus, FiClock, FiFileText, FiCheckCircle } from 'react-icons/fi';

export default function SellerDashboard({ data, isLoading }) {
  const {
    total_projects = 0,
    pending_projects = 0,
    credits_issued = 0,
    credits_sold = 0
  } = data || {};

  const [recentProjects, setRecentProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoadingProjects(true);
        // Using limit to get the most recent projects
        const response = await Sellerapi.getMyProjects({ limit: 5 });
        setRecentProjects(response.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch recent projects', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  const latestProject = recentProjects.length > 0 ? recentProjects[0] : null;

  const getLifecycleStage = (status) => {
    switch (status) {
      case 'draft': return 0;
      case 'pending': return 1;
      case 'assigned':
      case 'flagged':
      case 'in_progress': return 2;
      case 'verified': return 3;
      case 'approved': return 4;
      case 'minted': return 5;
      default: return -1;
    }
  };

  const currentStage = latestProject ? getLifecycleStage(latestProject.status) : -1;

  const STAGES = [
    { label: 'DRAFT', desc: 'Project created' },
    { label: 'SUBMITTED', desc: 'Awaiting review' },
    { label: 'UNDER REVIEW', desc: 'Admin & Agent review' },
    { label: 'FIELD VERIFICATION', desc: 'Agent inspection' },
    { label: 'APPROVED', desc: 'Ready for issuance' },
    { label: 'CREDITS ISSUED', desc: 'Available to sell' }
  ];

  return (
    <SellerLayout title="Seller Dashboard" subtitle="Manage your projects, verification progress and carbon credits.">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* KEY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col p-4 rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Total Projects</p>
            {isLoading ? (
              <div className="h-10 md:h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-3xl font-semibold tracking-tight text-gray-900 leading-none">{total_projects}</span>
            )}
          </div>
          
          <div className="bg-[#173d25] border border-[#173d25] shadow-sm flex flex-col p-4 rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#bbf7d0] mb-2">Pending Verification</p>
            {isLoading ? (
              <div className="h-10 md:h-12 w-20 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="text-3xl font-semibold tracking-tight text-white leading-none">{pending_projects}</span>
            )}
          </div>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col p-4 rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Credits Issued</p>
            {isLoading ? (
              <div className="h-10 md:h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-3xl font-semibold tracking-tight text-gray-900 leading-none">{credits_issued.toLocaleString()}</span>
            )}
          </div>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col p-4 rounded-lg">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Credits Sold</p>
            {isLoading ? (
              <div className="h-10 md:h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-3xl font-semibold tracking-tight text-gray-900 leading-none">{credits_sold.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* MAIN WORKSPACE: 2 COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Project Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">Project Overview</h2>
              <Link to="/seller/projects" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                View All
              </Link>
            </div>
            
            <div className="flex-1">
              {loadingProjects ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <FiFolder className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm">Create your first carbon project to begin the verification process.</p>
                  <Link to="/seller/projects/new" className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                    <FiPlus /> Create Project
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px] px-6 py-3 text-xs font-semibold font-mono tracking-wider text-gray-500 uppercase bg-gray-50">
                    <span>Project</span>
                    <span>ID</span>
                    <span>Status</span>
                    <span />
                  </div>
                  {recentProjects.map(p => (
                    <Link
                      key={p.id}
                      to={`/seller/projects/${p.id}/edit`}
                      className="flex flex-col md:grid md:grid-cols-[1fr_120px_100px_80px] md:items-center px-6 py-4 hover:bg-gray-50 transition-colors group gap-3 md:gap-0 border-b md:border-b-0 border-gray-100"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                          {p.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 truncate uppercase text-[11px] tracking-wider">
                          {p.project_type?.replace('_', ' ')} {p.country ? `· ${p.country}` : ''}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between md:contents">
                        <div className="text-sm text-gray-500 font-mono text-[11px]">
                          CXP-{String(p.id).substring(0,6).toUpperCase()}
                        </div>

                        <div>
                          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            p.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                            p.status === 'pending' || p.status === 'under_review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            p.status === 'approved' || p.status === 'minted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {p.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:flex justify-end">
                        <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-600 flex items-center gap-1 transition-colors">
                          Open <FiArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Verification Progress */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">Verification Progress</h2>
            </div>
            <div className="p-6 flex-1 bg-gray-50/30">
              {recentProjects.length === 0 ? (
                <div className="text-center text-sm text-gray-500 mt-10">
                  <FiCheckCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p>Submit a project to track its progress.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {latestProject && (
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <p className="text-xs font-semibold font-mono text-gray-500 uppercase tracking-wider mb-1">Tracking Latest Project</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{latestProject.title}</p>
                    </div>
                  )}
                  
                  <div className="relative pl-3 space-y-6">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-2 bottom-4 w-px bg-gray-200"></div>
                    
                    {STAGES.map((stage, index) => {
                      const isCompleted = index < currentStage;
                      const isCurrent = index === currentStage;
                      const isPending = index > currentStage;
                      
                      return (
                        <div key={stage.label} className="relative flex items-start gap-4">
                          <div className={`relative z-10 w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            isCompleted ? 'bg-emerald-500' :
                            isCurrent ? 'bg-amber-500 ring-4 ring-amber-500/20' :
                            'bg-gray-300'
                          }`} />
                          <div>
                            <p className={`text-sm font-semibold font-mono tracking-wide ${
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {stage.label}
                            </p>
                            <p className="text-xs font-mono text-gray-500 mt-0.5">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION AREA & CREDITS SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/50 border border-emerald-100 rounded-lg shadow-sm p-5">
            <div className="flex-1">
              <h3 className="text-[13px] md:text-sm font-bold uppercase text-emerald-900 tracking-tight">Start a new project</h3>
              <p className="text-[12px] text-emerald-700 mt-1">Register your carbon offset initiative to begin verification and minting.</p>
            </div>
            <Link to="/seller/projects/new" className="shrink-0 bg-[#173d25] hover:bg-[#0f2f1b] text-white px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors shadow-sm rounded flex items-center gap-2">
              <FiPlus /> Create New Project
            </Link>
          </div>
          
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h3 className="text-[12px] font-semibold text-gray-900 uppercase tracking-wider mb-4">Credits Overview</h3>
            {credits_issued === 0 ? (
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900 mb-1">No credits issued yet</p>
                <p className="text-xs text-gray-500">Approved projects become eligible for credit issuance.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Issued</span>
                  <span className="font-semibold text-gray-900">{credits_issued.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sold</span>
                  <span className="font-semibold text-gray-900">{credits_sold.toLocaleString()}</span>
                </div>
                <div className="w-full h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-semibold">Available</span>
                  <span className="font-bold text-emerald-600">{(credits_issued - credits_sold).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </SellerLayout>
  );
}
