import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getFormStepsNumbered,
  getInitialFormData,
  validateStep,
  separateFormData,
} from '../../components/seller/projectFormConfig';
import FormField from '../../components/seller/FormField';
import { useSellerStore } from '../../store/useSellerStore';
import * as sellerApi from '../../api/endpoint/Sellerapi';
import { Button } from '../../components/ui/Button';
import { FiArrowLeft, FiArrowRight, FiSave,FiCheck , FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import SellerLayout from '../../components/layout/SellerLayout';

// ─── LocalStorage key helpers ─────────────────────────────────────────────────

function getDraftKey(projectId) {
  return projectId ? `project_draft_${projectId}` : 'project_draft_new';
}

function saveDraftToStorage(projectId, formData) {
  try {
    localStorage.setItem(getDraftKey(projectId), JSON.stringify(formData));
  } catch { /* quota exceeded – ignore */ }
}

function loadDraftFromStorage(projectId) {
  try {
    const raw = localStorage.getItem(getDraftKey(projectId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearDraftFromStorage(projectId) {
  try {
    localStorage.removeItem(getDraftKey(projectId));
  } catch { /* ignore */ }
}

// ─── Helpers: flatten a project record back to the form shape ─────────────────
function flattenProjectToFormData(project) {
  const initial = getInitialFormData();
  if (!project) return initial;

  const merged = { ...initial };

  for (const key of Object.keys(initial)) {
    if (project[key] !== undefined && project[key] !== null) {
      merged[key] = project[key];
    }
  }

  if (project.methodology_specific_data && typeof project.methodology_specific_data === 'object') {
    for (const [k, v] of Object.entries(project.methodology_specific_data)) {
      if (v !== null && v !== undefined) {
        merged[k] = v;
      }
    }
  }

  const DB_TO_FORM = {
    aadhaar_doc_path: 'aadhaar_doc',
    land_deed_path: 'land_deed',
    live_verification_photo_path: 'live_verification_photo',
  };
  for (const [dbKey, formKey] of Object.entries(DB_TO_FORM)) {
    if (project[dbKey]) merged[formKey] = project[dbKey];
  }

  return merged;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEditMode = Boolean(projectId);

  const { createProject, updateProject, projects, fetchProjects } = useSellerStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(isEditMode);
  const [savedProjectId, setSavedProjectId] = useState(projectId ? Number(projectId) : null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const steps = useMemo(
    () => getFormStepsNumbered(formData.project_type),
    [formData.project_type]
  );

  const stepConfig = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  // ── On mount: load existing data ──────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode) {
      // New project: restore any in-progress draft from localStorage
      const stored = loadDraftFromStorage(null);
      if (stored) setFormData(stored);
      return;
    }

    // Edit mode: always fetch full project data from API so no fields are missing.
    // localStorage is only used as a cache for mid-session edits — we clear it
    // first so stale partial data never overrides fresh server data.
    const loadFullProject = async () => {
      try {
        const { data } = await sellerApi.getProjectById(projectId);
        const project = data.project || data;
        const flattened = flattenProjectToFormData(project);

        // Merge with any in-progress localStorage edits on top of the server data
        const stored = loadDraftFromStorage(projectId);
        const merged = stored ? { ...flattened, ...stored } : flattened;

        setFormData(merged);
        // Cache merged result so next visit is instant
        saveDraftToStorage(projectId, merged);
      } catch (err) {
        console.error('Failed to load project for editing:', err);
        // If the API call fails, fall back to localStorage if available
        const stored = loadDraftFromStorage(projectId);
        if (stored) setFormData(stored);
      } finally {
        setLoadingDraft(false);
      }
    };

    loadFullProject();
  }, [isEditMode, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFieldChange(name, value) {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      saveDraftToStorage(savedProjectId ?? (isEditMode ? projectId : null), next);
      return next;
    });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  function validateCurrentStep() {
    const errors = validateStep(stepConfig, formData);
    if (errors.length === 0) {
      setFieldErrors({});
      setGlobalError(null);
      return true;
    }
    const errorMap = {};
    for (const field of stepConfig.fields) {
      const fieldError = errors.find((e) => e.includes(`"${field.label}"`));
      if (fieldError) errorMap[field.name] = fieldError.replace(`"${field.label}" `, '');
    }
    setFieldErrors(errorMap);
    setGlobalError('Please fill all the required fields.');
    return false;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    setGlobalError(null);
    setFieldErrors({});
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveDraft() {
    if (!validateCurrentStep()) return;

    const payload = separateFormData(formData.project_type, formData);

    setSaving(true);
    setGlobalError(null);
    try {
      if (savedProjectId) {
        await updateProject(savedProjectId, payload);
      } else {
        const project = await createProject(payload);
        setSavedProjectId(project.id);
        clearDraftFromStorage(null);
        saveDraftToStorage(project.id, formData);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  }

  const progressPercent = Math.round((currentStep / steps.length) * 100);

  if (loadingDraft) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f7f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
          <p className="text-sm font-mono text-gray-500 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <SellerLayout 
      title={isEditMode ? 'Edit Draft Project' : 'Register Project'}
      subtitle={isEditMode ? 'Update your project details. You can save and come back anytime before submitting.' : 'Provide details about your carbon reduction project to get verified.'}
    >
      <div className="w-full flex flex-col items-center pb-12 font-sans relative">

      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-40 w-full flex flex-col items-center bg-[#f4f7f5]/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 py-6 mb-8 pt-10">
        <div className="w-full max-w-[800px] px-4 md:px-8 mx-auto">
          
          <div className="relative flex justify-between items-center w-full">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
            
            {/* Active progress line */}
            <div 
              className="absolute top-1/2 left-0 h-[3px] bg-[#0c0c0c] -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((s) => {
              const isCompleted = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              const isActive = isCompleted || isCurrent;
              
              return (
                <div key={s.step} className="relative z-10 flex flex-col items-center">
                  {/* Label (above) */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap hidden sm:block">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-[#0c0c0c]' : 'text-gray-400'}`}>
                      {s.title}
                    </span>
                  </div>
                  
                  {/* Node */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 border-[2px] sm:border-[2.5px] ${
                    isCompleted 
                      ? 'bg-[#0c0c0c] border-[#0c0c0c] text-[#c2ed6d]' 
                      : isCurrent
                      ? 'bg-[#c2ed6d] border-[#0c0c0c] text-[#0c0c0c]'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <FiCheck strokeWidth={3.5} size={15} /> : <span className="font-mono text-[10px] sm:text-[11px] font-bold">{s.step}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between items-center w-full">
            <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-widest">
              {progressPercent}% Complete
            </span>
          </div>

        </div>
      </div>

      <div className="w-full max-w-[800px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Save success banner */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <FiSave size={18} className="flex-shrink-0" />
              <p className="text-sm font-medium">
                Draft saved! You can continue editing or go back to your projects.
              </p>
            </motion.div>
          )}

          {/* Edit mode info banner */}
          {isEditMode && !saveSuccess && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <FiSave size={18} className="flex-shrink-0" />
              <p className="text-sm font-medium">
                You're editing a draft. Make your changes and click <strong>Save Draft</strong> to update. Submit when you're ready.
              </p>
            </div>
          )}

          {/* Error banner */}
          {globalError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <FiAlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">{globalError}</p>
            </motion.div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl wise-font font-black uppercase text-gray-900 mb-1">{stepConfig.title}</h2>
            {stepConfig.typeSpecific && formData.project_type && (
              <p className="text-sm font-mono text-gray-500 mb-6">
                These fields are specific to <strong className="capitalize">{formData.project_type.replace(/_/g, ' ')}</strong> projects.
              </p>
            )}
            {!stepConfig.typeSpecific && <div className="mb-6" />}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {stepConfig.fields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={formData[field.name]}
                    onChange={handleFieldChange}
                    error={fieldErrors[field.name]}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`h-11 px-6 font-mono font-bold border border-[#0c0c0c] bg-white text-[#0c0c0c] shadow-[4px_4px_0_0_#0c0c0c] hover:bg-gray-50 transition-all flex items-center gap-2 ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {/* Always-visible Save Draft button */}
              <Button
                onClick={handleSaveDraft}
                disabled={saving}
                className="h-11 px-6 bg-white hover:bg-gray-100 text-[#0c0c0c] font-mono font-bold border-[2px] border-[#0c0c0c] transition-colors flex items-center gap-2"
              >
                <FiSave size={15} />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>

              {!isLastStep && (
                <Button
                  onClick={handleNext}
                  className="h-11 px-8 bg-primary hover:bg-[#a3e635] text-[#0c0c0c] font-mono font-bold shadow-[4px_4px_0_0_#0c0c0c] border border-[#0c0c0c] flex items-center justify-center gap-2"
                >
                  Next
                  <FiArrowRight className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </SellerLayout>
  );
}