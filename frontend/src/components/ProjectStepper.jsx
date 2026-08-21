import React from 'react';
import { FiCheck, FiClock, FiCircle } from 'react-icons/fi';

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
    <div className="w-full bg-white rounded-sm p-6 md:p-8 border-[2px] border-[#0c0c0c] mb-8 overflow-x-auto shadow-none">
      <div className="min-w-[600px]">
        <div className="relative flex justify-between">
          {/* Connecting line background */}
          <div className="absolute top-5 left-0 w-full h-[4px] bg-gray-200 -z-10" />
          
          {/* Active connecting line */}
          <div 
            className="absolute top-5 left-0 h-[4px] bg-[#c2ed6d] border-y-[2px] border-[#0c0c0c] transition-all duration-500 ease-in-out -z-10" 
            style={{ width: `${Math.min((activeStep / (steps.length - 1)) * 100, 100)}%` }}
          />

          {steps.map((step, index) => {
            const isCompleted = activeStep >= index;
            const isCurrent = activeStep === index;
            
            return (
              <div key={index} className="flex flex-col items-center relative z-10 w-32 text-center group">
                <div 
                  className={`w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 mb-3 border-[2px] border-[#0c0c0c]
                    ${isCompleted 
                      ? 'bg-[#c2ed6d] text-[#0c0c0c] shadow-[3px_3px_0_0_#0c0c0c]' 
                      : 'bg-white text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <FiCheck size={20} className="stroke-[3]" />
                  ) : isCurrent ? (
                    <FiClock size={18} className="text-[#0c0c0c]" />
                  ) : (
                    <FiCircle size={14} className="opacity-50" />
                  )}
                </div>
                
                <h4 className={`text-xs font-mono font-bold uppercase tracking-tight mb-1 transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </h4>
                <p className={`text-[11px] font-medium font-mono ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
