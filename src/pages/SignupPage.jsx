import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import Logo from "../components/common/Logo";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  // Debug: Log acceptedTerms state changes
  useEffect(() => {
    console.log('acceptedTerms state updated to:', acceptedTerms);
  }, [acceptedTerms]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    if (score <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (score <= 3) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Skip honeypot field
    if (name === "website") return;
    
    setForm((f) => ({ ...f, [name]: value }));

    // Real-time validation
    if (name === "name") {
      if (value && value.length < 2) {
        setNameError("Name must be at least 2 characters");
      } else {
        setNameError("");
      }
    }

    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
        setEmailAvailable(null);
      } else if (value && validateEmail(value)) {
        setEmailError("");
        // Simulate email availability check
        setEmailChecking(true);
        setTimeout(() => {
          setEmailChecking(false);
          setEmailAvailable(Math.random() > 0.5); // Mock availability
        }, 1000);
      } else {
        setEmailError("");
        setEmailAvailable(null);
      }
    }

    if (name === "password") {
      if (value && value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
      // Check if passwords match when password changes
      if (form.confirmPassword && value !== form.confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else if (form.confirmPassword && value === form.confirmPassword) {
        setConfirmPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      // Check if passwords match when confirm password changes
      if (value && form.password && value !== form.password) {
        setConfirmPasswordError("Passwords do not match");
      } else if (value && form.password && value === form.password) {
        setConfirmPasswordError("");
      } else if (!value) {
        setConfirmPasswordError("");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && form.name && form.email && form.password && form.confirmPassword && acceptedTerms && !isLoading && !emailError && !passwordError && !confirmPasswordError) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!form.name || form.name.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }

    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emailAvailable === false) {
      setEmailError("This email is already in use");
      return;
    }

    if (form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/welcome"); // Navigate to welcome page instead of dashboard
    } catch (err) {
      console.error("Signup failed", err);
      const msg = err.response?.data?.error || "Failed to create account.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg signup-responsive">
      <div className="auth-card signup-floating">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <Logo size="large" />
          </div>
          <h1 className="auth-title text-2xl sm:text-3xl">Create an account</h1>
          <p className="auth-subtitle text-sm sm:text-base px-2">Join TaskFlow and start collaborating today.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form-container">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-xs sm:text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-input ${nameError ? 'border-red-500' : ''}`}
                  placeholder="Jane Smith"
                  required
                  disabled={isLoading}
                />
                {form.name && (
                  <div className="absolute right-3 top-3">
                    {nameError ? (
                      <XCircle size={18} className="text-red-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-input ${emailError ? 'border-red-500' : ''}`}
                  placeholder="jane@university.edu"
                  required
                  disabled={isLoading}
                />
                {form.email && (
                  <div className="absolute right-3 top-3">
                    {emailChecking ? (
                      <Loader2 size={18} className="animate-spin text-gray-400" />
                    ) : emailError ? (
                      <XCircle size={18} className="text-red-500" />
                    ) : emailAvailable === false ? (
                      <AlertTriangle size={18} className="text-orange-500" />
                    ) : (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
              {emailAvailable === false && !emailError && (
                <p className="text-orange-500 text-sm mt-1">This email is already in use</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${passwordError ? 'border-red-500' : ''}`}
                placeholder="Create a strong password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Password strength:</span>
                  <span className={`text-sm font-medium ${
                    checkPasswordStrength(form.password).level === 'weak' ? 'text-red-500' :
                    checkPasswordStrength(form.password).level === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {checkPasswordStrength(form.password).text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      checkPasswordStrength(form.password).level === 'weak' ? 'bg-red-500 w-1/3' :
                      checkPasswordStrength(form.password).level === 'medium' ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className={`text-xs flex items-center gap-2 ${form.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle size={12} className={form.password.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                    At least 8 characters
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle size={12} className={/[A-Z]/.test(form.password) ? 'text-green-500' : 'text-gray-300'} />
                    One uppercase letter
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${/\d/.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle size={12} className={/\d/.test(form.password) ? 'text-green-500' : 'text-gray-300'} />
                    One number
                  </div>
                </div>
              </div>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`form-input ${confirmPasswordError ? 'border-red-500' : ''}`}
                placeholder="Repeat your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {form.confirmPassword && (
                <div className="absolute right-10 top-3">
                  {confirmPasswordError ? (
                    <XCircle size={18} className="text-red-500" />
                  ) : form.password === form.confirmPassword ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : null}
                </div>
              )}
            </div>
            {form.confirmPassword && !confirmPasswordError && form.password === form.confirmPassword && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <CheckCircle size={14} />
                Passwords match
              </p>
            )}
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>

          {/* Honeypot field for bot protection */}
          <div className="hidden">
            <input
              type="text"
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              placeholder="Leave this field empty"
              autoComplete="off"
            />
          </div>

          <div className="form-group flex items-start gap-2 sm:gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => {
                const newValue = e.target.checked;
                console.log('Terms checkbox changed to:', newValue);
                setAcceptedTerms(newValue);
              }}
              className="mt-1 flex-shrink-0 cursor-pointer w-4 h-4"
              style={{ accentColor: 'var(--primary)' }}
              disabled={isLoading}
              aria-label="Accept Terms and Privacy Policy"
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 cursor-pointer leading-relaxed flex-1">
              I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button 
            className="btn btn-primary btn-block mb-4 sm:mb-6 flex items-center justify-center" 
            type="submit" 
            disabled={isLoading || !form.name || !form.email || !form.password || !form.confirmPassword || !acceptedTerms || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
            title={!acceptedTerms ? "You must accept the Terms and Privacy Policy to continue" : ""}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                <span>Creating your account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600 px-2">
            Already have an account?{" "}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
