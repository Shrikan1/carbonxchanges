import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECT_FORM_STEPS, getInitialFormData } from '../../components/seller/projectFormConfig';
import FormField from '../../components/seller/FormField';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';

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

    // Strip empty strings down to undefined so the backend's createProject
    // (which only writes columns actually present in the payload) doesn't
    // receive a wall of empty-string values for fields the seller skipped.
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Register a Project</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Step {currentStep} of {PROJECT_FORM_STEPS.length}: {stepConfig.title}
      </p>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {PROJECT_FORM_STEPS.map((s) => (
          <div
            key={s.step}
            className={`h-1.5 flex-1 rounded-full ${s.step <= currentStep ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      <div className="space-y-4">
        {stepConfig.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Back
        </Button>

        {isLastStep ? (
          <Button onClick={handleSaveDraft} disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
}