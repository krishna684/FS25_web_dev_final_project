import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import './CreateTeamModal.css';

/**
 * CreateTeamModal - Modal for creating a new team
 */
const CreateTeamModal = ({
  isOpen,
  onClose,
  onCreate,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorTheme: 'blue',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const colorThemes = [
    { id: 'blue', label: 'Blue', gradient: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)' },
    { id: 'purple', label: 'Purple', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' },
    { id: 'green', label: 'Green', gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)' },
    { id: 'rose', label: 'Rose', gradient: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)' },
    { id: 'amber', label: 'Amber', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
    { id: 'teal', label: 'Teal', gradient: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' },
    { id: 'indigo', label: 'Indigo', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Team name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Team name must be less than 50 characters';
    }

    if (formData.description && formData.description.length > 250) {
      newErrors.description = 'Description must be less than 250 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleColorChange = (themeId) => {
    setFormData((prev) => ({
      ...prev,
      colorTheme: themeId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      await onCreate(formData);
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        colorTheme: 'blue',
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        'Failed to create team'
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal-lg">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Create New Team</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="create-team-form">
            {/* Submit Error */}
            {submitError && (
              <div className="form-error-alert">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Team Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Team Name <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Product Team, Marketing Squad"
                className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                disabled={loading}
                maxLength={50}
              />
              {errors.name && (
                <span className="form-error-text">{errors.name}</span>
              )}
              <span className="form-hint">
                {formData.name.length}/50 characters
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional: Brief description of your team's purpose"
                className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
                disabled={loading}
                rows={3}
                maxLength={250}
              />
              {errors.description && (
                <span className="form-error-text">{errors.description}</span>
              )}
              <span className="form-hint">
                {formData.description.length}/250 characters
              </span>
            </div>

            {/* Color Theme Picker */}
            <div className="form-group">
              <label className="form-label">Avatar Color Theme</label>
              <div className="color-theme-picker">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    className={`color-theme-option ${
                      formData.colorTheme === theme.id ? 'active' : ''
                    }`}
                    style={{ background: theme.gradient }}
                    onClick={() => handleColorChange(theme.id)}
                    title={theme.label}
                    aria-label={`Select ${theme.label} color theme`}
                    disabled={loading}
                  >
                    {formData.colorTheme === theme.id && (
                      <span className="color-theme-checkmark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? (
              <>
                <div className="spinner-small" />
                Creating...
              </>
            ) : (
              'Create Team'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
