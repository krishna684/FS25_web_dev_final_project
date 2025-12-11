import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
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

  useEffect(() => {
    console.log("acceptedTerms state updated to:", acceptedTerms);
  }, [acceptedTerms]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    if (score <= 2) return { level: "weak", text: "Weak" };
    if (score <= 3) return { level: "medium", text: "Medium" };
    return { level: "strong", text: "Strong" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // honeypot
    if (name === "website") return;

    setForm((f) => ({ ...f, [name]: value }));

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
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
      if (form.confirmPassword && value !== form.confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else if (form.confirmPassword && value === form.confirmPassword) {
        setConfirmPasswordError("");
      }
    }

    if (name === "confirmPassword") {
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
    if (
      e.key === "Enter" &&
      form.name &&
      form.email &&
      form.password &&
      form.confirmPassword &&
      acceptedTerms &&
      !isLoading &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError
    ) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || form.name.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }

    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email address");
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
      navigate("/welcome");
    } catch (err) {
      console.error("Signup failed", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to create account.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = checkPasswordStrength(form.password);

  return (
    <div className="auth-bg signup-responsive">
      <div className="auth-card signup-floating" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="large" />
          </div>
          <h1 className="auth-title text-2xl sm:text-3xl mb-2">
            Create an account
          </h1>
          <p className="auth-subtitle text-sm sm:text-base px-2 mb-4">
            Join TaskFlow and start collaborating today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form-container">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-xs sm:text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
            {/* Name (no tick icon) */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`form-input ${nameError ? "border-red-500" : ""}`}
                placeholder="Jane Smith"
                required
                disabled={isLoading}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Email (no tick icon) */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${emailError ? "border-red-500" : ""}`}
                placeholder="jane@university.edu"
                required
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
          </div>

          {/* Password – eye on RIGHT inside box */}
          <div className="form-group mb-4">
            <label className="form-label mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${passwordError ? "border-red-500" : ""}`}
                placeholder="Create a strong password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 h-full flex items-center justify-center pr-8 text-gray-400 hover:text-gray-600 z-10"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  width: "auto",
                }}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {form.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    Password strength:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      strength.level === "weak"
                        ? "text-red-500"
                        : strength.level === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {strength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.level === "weak"
                        ? "bg-red-500 w-1/3"
                        : strength.level === "medium"
                        ? "bg-yellow-500 w-2/3"
                        : "bg-green-500 w-full"
                    }`}
                  ></div>
                </div>
                <div className="mt-2 space-y-1">
                  <div
                    className={`text-xs flex items-center gap-2 ${
                      form.password.length >= 8
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      size={12}
                      className={
                        form.password.length >= 8
                          ? "text-green-500"
                          : "text-gray-300"
                      }
                    />
                    At least 8 characters
                  </div>
                  <div
                    className={`text-xs flex items-center gap-2 ${
                      /[A-Z]/.test(form.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      size={12}
                      className={
                        /[A-Z]/.test(form.password)
                          ? "text-green-500"
                          : "text-gray-300"
                      }
                    />
                    One uppercase letter
                  </div>
                  <div
                    className={`text-xs flex items-center gap-2 ${
                      /\d/.test(form.password)
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <CheckCircle
                      size={12}
                      className={
                        /\d/.test(form.password)
                          ? "text-green-500"
                          : "text-gray-300"
                      }
                    />
                    One number
                  </div>
                </div>
              </div>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password – eye on RIGHT inside box */}
          <div className="form-group mb-4">
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`form-input ${
                  confirmPasswordError ? "border-red-500" : ""
                }`}
                placeholder="Repeat your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute top-0 right-0 h-full flex items-center justify-center pr-8 text-gray-400 hover:text-gray-600 z-10"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  width: "auto",
                }}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {form.confirmPassword &&
              !confirmPasswordError &&
              form.password === form.confirmPassword && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Passwords match
                </p>
              )}
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Honeypot */}
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

          {/* Terms checkbox – text beside box */}
          <div className="mb-4 flex items-center gap-2 sm:gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="flex-shrink-0 cursor-pointer w-4 h-4"
              style={{ accentColor: "var(--primary)" }}
              disabled={isLoading}
              aria-label="Accept Terms and Privacy Policy"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm text-gray-600 cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Submit button */}
          <button
            className="btn btn-primary btn-block mb-4 flex items-center justify-center"
            type="submit"
            disabled={
              isLoading ||
              !form.name ||
              !form.email ||
              !form.password ||
              !form.confirmPassword ||
              !acceptedTerms ||
              !!nameError ||
              !!emailError ||
              !!passwordError ||
              !!confirmPasswordError
            }
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
            <Link
              to="/login"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
