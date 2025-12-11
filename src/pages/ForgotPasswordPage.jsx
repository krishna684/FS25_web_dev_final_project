import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Logo from "../components/common/Logo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      console.error("Password reset failed", err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-bg">
        <div className="auth-card">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Logo size="large" />
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">What happens next?</p>
              <ul className="space-y-1 text-left">
                <li>• Click the link in the email to reset your password</li>
                <li>• The link will expire in 24 hours</li>
                <li>• Check your spam folder if you don't see the email</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="btn btn-secondary btn-block"
            >
              Send another email
            </button>

            <Link to="/login" className="btn btn-primary btn-block">
              <ArrowLeft size={18} className="mr-2" />
              Back to login
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn't receive the email?{" "}
            <button
              onClick={() => setIsSuccess(false)}
              className="text-primary hover:underline font-medium"
            >
              Try a different email
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Logo size="large" />
          </div>
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={handleChange}
                className={`form-input ${emailError ? 'border-red-500' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
              {email && (
                <div className="absolute right-3 top-3">
                  {emailError ? (
                    <CheckCircle size={18} className="text-red-500" />
                  ) : (
                    <CheckCircle size={18} className="text-green-500" />
                  )}
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <button className="btn btn-primary btn-block mb-4" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-primary hover:underline text-sm font-medium flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;