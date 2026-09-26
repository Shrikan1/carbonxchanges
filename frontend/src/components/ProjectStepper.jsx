import React from 'react';
import { FiCheck, FiChevronRight } from 'react-icons/fi';

export default function ProjectStepper({ status }) {
  // Map project status to a logical numeric step (0-indexed)
  const getActiveStep = () => {
    switch (status) {
      case 'draft': return -1;
      case 'pending': return 0; // Submitted
      case 'assigned': return 1; // Agent Assigned
      case 'in_progress': return 2; // First Verification Done
      case 'verified': return 3; // Second Verification Done
      case 'approved': return 4; // Approved
      case 'minted': return 5; // Minted
      case 'rejected': return -1;
      default: return 0;
    }
  };

  const activeStep = getActiveStep();

  const steps = [
    {
      title: 'Application Submitted',
      description: 'Project registered',
    },
    {
      title: 'Agent Assigned',
      description: 'Waiting for visit',
    },
    {
      title: 'First Verification',
      description: activeStep >= 2 ? 'Completed' : 'Remaining',
    },
    {
      title: 'Second Verification',
      description: activeStep >= 3 ? 'Completed' : 'Remaining',
    },
    {
      title: 'Approved',
      description: activeStep >= 4 ? 'Completed' : 'Pending',
    },
  ];

  if (activeStep === -1) return null; // Don't show stepper for draft or rejected projects

  return (
    <div className="relative w-full mb-8">
      {/* Scrollable Container */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 overflow-x-auto hide-scrollbar">
      <div className="min-w-[500px]">
        <div className="relative flex justify-between">
          {/* Connecting line background */}
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-gray-100 -z-10" />
          
          {/* Active connecting line */}
          <div 
            className="absolute top-4 left-6 h-[2px] bg-emerald-500 transition-all duration-500 ease-in-out -z-10" 
            style={{ width: `calc(${Math.min((activeStep / (steps.length - 1)) * 100, 100)}% - 3rem)` }}
          />

          {steps.map((step, index) => {
            const isCompleted = activeStep >= index;
            const isCurrent = activeStep === index;
            
            return (
              <div key={index} className="flex flex-col items-center relative z-10 w-28 text-center group">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mb-3 border-2 
                    ${isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                      : isCurrent
                      ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm ring-4 ring-emerald-50'
                      : 'bg-white border-gray-200 text-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <FiCheck size={16} className="stroke-[3]" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1 transition-colors ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </h4>
                <p className={`text-[10px] font-medium ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      
      {/* Fade overlay indicating more content on the right (hidden on large screens if not overflowing) */}
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-2xl border-r border-gray-200 lg:hidden" />
      
      {/* Tiny hint text below the stepper on mobile */}
      <div className="absolute -bottom-6 right-2 flex items-center gap-1 text-[10px] text-gray-400 font-medium lg:hidden">
        Swipe for more steps <FiChevronRight size={10} />
      </div>
    </div>
  );
}
