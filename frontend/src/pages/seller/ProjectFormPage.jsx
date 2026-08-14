import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECT_FORM_STEPS, getInitialFormData } from '../../components/seller/projectFormConfig';
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
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const stepConfig = PROJECT_FORM_STEPS[currentStep - 1];
  const isLastStep = currentStep === PROJECT_FORM_STEPS.length;

  function handleFieldChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateCurrentStep() {
    const missing = stepConfig.fields.filter((f) => f.required && !formData[f.name]);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map((f) => f.label).join(', ')}`);
      return false;
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setError(null);
    setCurrentStep((s) => s - 1);
  }

  async function handleSaveDraft() {
    if (!validateCurrentStep()) return;

    const cleaned = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== '' && v !== undefined)
    );

    setSaving(true);
    setError(null);
    try {
      const project = await createProject(cleaned);
      navigate('/seller/projects', { state: { justCreated: project.id } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project draft');
    } finally {
      setSaving(false);
    }
  }

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
            <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">Register a Project</div>
            <p className="text-gray-500 text-sm">Provide details about your carbon reduction project to get verified.</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {currentStep} of {PROJECT_FORM_STEPS.length}</span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{stepConfig.title}</span>
            </div>
            <div className="flex gap-2">
              {PROJECT_FORM_STEPS.map((s) => (
                <div
                  key={s.step}
                  className={`h-2 flex-1 rounded-full transition-colors duration-500 ${s.step < currentStep ? 'bg-emerald-500' : s.step === currentStep ? 'bg-emerald-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{stepConfig.title}</h2>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {stepConfig.fields.map((field) => (
                  <div key={field.name}>
                    <FormField
                      field={field}
                      value={formData[field.name]}
                      onChange={handleFieldChange}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <FiAlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 1}
              className={`h-11 px-6 rounded-xl font-semibold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-gray-100 bg-white'}`}
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