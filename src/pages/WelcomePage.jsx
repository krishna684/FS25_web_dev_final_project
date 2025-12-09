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
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard! 🎉</h2>
            <p className="text-gray-600">
              TaskFlow helps you organize, collaborate, and succeed. Let's take a quick tour to get you up and running.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">What you'll learn:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• How to create your first task</li>
              <li>• Setting up your first team</li>
              <li>• Navigating the dashboard</li>
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
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Creating Tasks</h3>
                <p className="text-gray-600 mb-4">
                  Tasks help you break down work into manageable pieces. Here's how to create your first one:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Click the "New" button in the top navigation</li>
                  <li>Select "Task" from the dropdown</li>
                  <li>Fill in the title, description, and due date</li>
                  <li>Assign it to yourself or a team member</li>
                  <li>Set priority and add tags for better organization</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Pro tip:</p>
                <p className="text-green-700 text-sm">Use specific, actionable titles like "Review Q4 marketing report" instead of "Work on report"</p>
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
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Working with Teams</h3>
                <p className="text-gray-600 mb-4">
                  Teams allow you to collaborate with others and share responsibilities:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Create a Team</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Go to Teams page</li>
                      <li>• Click "Create Team"</li>
                      <li>• Add team name and description</li>
                      <li>• Invite members via email</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Join a Team</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Ask for invitation link</li>
                      <li>• Or request to join existing teams</li>
                      <li>• Start collaborating immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-purple-600" />
              <div>
                <p className="text-purple-800 font-medium">Team benefit:</p>
                <p className="text-purple-700 text-sm">Shared tasks, progress tracking, and better communication</p>
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
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're ready to go! 🚀</h2>
            <p className="text-gray-600">
              You've learned the basics of TaskFlow. Remember, you can always access help and tutorials from the menu.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions:</h3>
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

          <div className="text-sm text-gray-500">
            <p>Need help? Visit our <a href="/help" className="text-blue-600 hover:underline">Help Center</a> anytime.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600">
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
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
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