import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFormStepsNumbered,
  getInitialFormData,
  validateStep,
  separateFormData,
} from '../../components/seller/projectFormConfig';
import FormField from '../../components/seller/FormField';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';
import { FiArrowLeft, FiArrowRight, FiSave, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../../components/layout/Navbar';

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const createProject = useSellerStore((s) => s.createProject);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());
  const [fieldErrors, setFieldErrors] = useState({}); // per-field error map
  const [globalError, setGlobalError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Dynamically re-generate steps whenever project_type changes
  const steps = useMemo(
    () => getFormStepsNumbered(formData.project_type),
    [formData.project_type]
  );

  const stepConfig = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  function handleFieldChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error when user starts correcting it
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

    // Build a per-field error map for inline display
    const errorMap = {};
    for (const field of stepConfig.fields) {
      const fieldError = errors.find((e) => e.includes(`"${field.label}"`));
      if (fieldError) errorMap[field.name] = fieldError.replace(`"${field.label}" `, '');
    }
    setFieldErrors(errorMap);
    setGlobalError('Please fill all the fields.');
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

    // Separate type-specific fields into methodology_specific_data JSONB
    const payload = separateFormData(formData.project_type, formData);

    setSaving(true);
    setGlobalError(null);
    try {
      const project = await createProject(payload);
      navigate('/seller/projects', { state: { justCreated: project.id } });
    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Failed to create project draft');
    } finally {
      setSaving(false);
    }
  }

  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 pt-24 pb-12 font-sans">
      <Navbar />
      <div className="w-full max-w-[800px] px-4 md:px-8">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/seller/projects')}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 text-sm font-medium"
            >
              <FiArrowLeft />
              <span>Back to Projects</span>
            </button>
            <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">
              Register a Project
            </div>
            <p className="text-gray-500 text-sm">
              Provide details about your carbon reduction project to get verified.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step {currentStep} of {steps.length}
              </span>
              <div className="flex items-center gap-2">
                {stepConfig.typeSpecific && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    {formData.project_type ? formData.project_type.replace(/_/g, ' ') : 'type-specific'}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {stepConfig.title}
                </span>
              </div>
            </div>
            {/* Segmented progress bar */}
            <div className="flex gap-1.5">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    s.step < currentStep
                      ? 'bg-emerald-500'
                      : s.step === currentStep
                      ? 'bg-emerald-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="mt-1.5 text-xs text-gray-400 text-right">{progressPercent}% complete</div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{stepConfig.title}</h2>
            {stepConfig.typeSpecific && formData.project_type && (
              <p className="text-sm text-gray-500 mb-6">
                These fields are specific to <strong className="capitalize">{formData.project_type.replace(/_/g, ' ')}</strong> projects
                and will be stored as structured methodology data.
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

          {/* Global Error Banner */}
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

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`h-11 px-6 rounded-xl font-semibold transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-gray-100 bg-white'
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Previous
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleSaveDraft}
                disabled={saving}
                className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
              >
                {saving ? 'Saving...' : 'Save Draft'}
                <FiSave className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="h-11 px-8 rounded-xl bg-gray-900 hover:bg-black text-white font-bold shadow-sm"
              >
                Next
                <FiArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}