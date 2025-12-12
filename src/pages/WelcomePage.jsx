import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Users, Plus, Play, X, Sparkles } from "lucide-react";
import Logo from "../components/common/Logo";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      title: "Welcome to TaskFlow!",
      subtitle: "Let's get you started with the basics",
      content: (
        <div className="text-center space-y-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: 'linear-gradient(to bottom right, var(--primary), var(--primary-hover))',
            }}
          >
            <Sparkles size={40} className="text-white" />
          </div>
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-main)' }}
            >
              Welcome aboard! 🎉
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              TaskFlow helps you organize, collaborate, and succeed. Let's take a quick tour to get you up and running.
            </p>
          </div>
          <div
            className="border rounded-lg p-6"
            style={{
              backgroundColor: 'var(--primary-lighter)',
              borderColor: 'var(--primary-light)',
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              What you'll learn:
            </h3>
            <ul
              className="text-sm space-y-2 list-disc"
              style={{
                color: 'var(--text-secondary)',
                paddingLeft: '1.25rem',
              }}
            >
              <li style={{ paddingLeft: '0.5rem' }}>How to create your first task</li>
              <li style={{ paddingLeft: '0.5rem' }}>Setting up your first team</li>
              <li style={{ paddingLeft: '0.5rem' }}>Navigating the dashboard</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Create Your First Task",
      subtitle: "Tasks are the building blocks of productivity",
      content: (
        <div className="space-y-6">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bg-muted)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--primary-lighter)',
                }}
              >
                <Plus size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: 'var(--text-main)' }}
                >
                  Creating Tasks
                </h3>
                <p
                  className="mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Tasks help you break down work into manageable pieces. Here's how to create your first one:
                </p>
                <ol
                  className="list-decimal list-inside space-y-2 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <li>Click the "New" button in the top navigation</li>
                  <li>Select "Task" from the dropdown</li>
                  <li>Fill in the title, description, and due date</li>
                  <li>Assign it to yourself or a team member</li>
                  <li>Set priority and add tags for better organization</li>
                </ol>
              </div>
            </div>
          </div>

          <div
            className="border rounded-lg p-4"
            style={{
              backgroundColor: 'var(--success-lighter)',
              borderColor: 'var(--success-light)',
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
              <div>
                <p
                  className="font-medium"
                  style={{ color: 'var(--success)' }}
                >
                  Pro tip:
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Use specific, actionable titles like "Review Q4 marketing report" instead of "Work on report"
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Build Your Team",
      subtitle: "Collaboration makes everything better",
      content: (
        <div className="space-y-6">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bg-muted)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: 'var(--team-lighter)',
                }}
              >
                <Users size={24} style={{ color: 'var(--team)' }} />
              </div>
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: 'var(--text-main)' }}
                >
                  Working with Teams
                </h3>
                <p
                  className="mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Teams allow you to collaborate with others and share responsibilities:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="rounded p-4 border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <h4
                      className="font-medium mb-2"
                      style={{ color: 'var(--text-main)' }}
                    >
                      Create a Team
                    </h4>
                    <ul
                      className="text-sm space-y-2 list-disc"
                      style={{
                        color: 'var(--text-secondary)',
                        paddingLeft: '1.25rem',
                      }}
                    >
                      <li style={{ paddingLeft: '0.5rem' }}>Go to Teams page</li>
                      <li style={{ paddingLeft: '0.5rem' }}>Click "Create Team"</li>
                      <li style={{ paddingLeft: '0.5rem' }}>Add team name and description</li>
                      <li style={{ paddingLeft: '0.5rem' }}>Invite members via email</li>
                    </ul>
                  </div>
                  <div
                    className="rounded p-4 border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <h4
                      className="font-medium mb-2"
                      style={{ color: 'var(--text-main)' }}
                    >
                      Join a Team
                    </h4>
                    <ul
                      className="text-sm space-y-2 list-disc"
                      style={{
                        color: 'var(--text-secondary)',
                        paddingLeft: '1.25rem',
                      }}
                    >
                      <li style={{ paddingLeft: '0.5rem' }}>Ask for invitation link</li>
                      <li style={{ paddingLeft: '0.5rem' }}>Or request to join existing teams</li>
                      <li style={{ paddingLeft: '0.5rem' }}>Start collaborating immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="border rounded-lg p-4"
            style={{
              backgroundColor: 'var(--team-lighter)',
              borderColor: 'var(--team-light)',
            }}
          >
            <div className="flex items-center gap-3">
              <Users size={20} style={{ color: 'var(--team)' }} />
              <div>
                <p
                  className="font-medium"
                  style={{ color: 'var(--team)' }}
                >
                  Team benefit:
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Shared tasks, progress tracking, and better communication
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to start being productive",
      content: (
        <div className="text-center space-y-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
            style={{
              backgroundColor: 'var(--success-lighter)',
            }}
          >
            <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-main)' }}
            >
              You're ready to go! 🚀
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              You've learned the basics of TaskFlow. Remember, you can always access help and tutorials from the menu.
            </p>
          </div>

          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--bg-muted)',
            }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              Quick Actions:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Create Your First Task
              </button>
              <button
                onClick={() => navigate('/teams')}
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                <Users size={18} />
                Set Up a Team
              </button>
            </div>
          </div>

          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <p>
              Need help? Visit our{' '}
              <a
                href="/help"
                style={{ color: 'var(--primary)' }}
                className="hover:underline"
              >
                Help Center
              </a>{' '}
              anytime.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--bg-body)',
        backgroundImage: 'linear-gradient(to bottom right, var(--primary-lighter), var(--bg-body))',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="default" />
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: index <= currentStep ? 'var(--primary)' : 'var(--bg-muted)',
                    color: index <= currentStep ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="w-12 h-1 mx-2"
                    style={{
                      backgroundColor: index < currentStep ? 'var(--primary)' : 'var(--bg-muted)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-xl shadow-lg p-8"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="mb-6">
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--text-main)' }}
              >
                {steps[currentStep].title}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                {steps[currentStep].subtitle}
              </p>
            </div>

            <div className="mb-8">
              {steps[currentStep].content}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-sm font-medium"
                style={{
                  color: 'var(--text-tertiary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                Skip tour
              </button>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;