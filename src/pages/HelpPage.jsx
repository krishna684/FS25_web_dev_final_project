import { BookOpen, FileText, Video, MessageCircle, ExternalLink } from 'lucide-react';

const HelpPage = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Help & Documentation</h1>
            <p className="text-[var(--text-secondary)] mb-8">Everything you need to get started with TaskFlow</p>

            <div className="space-y-6">
                {/* Quick Start Guide */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen size={20} className="text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold text-[var(--text-main)]">Quick Start Guide</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 bg-[var(--bg-body)] rounded-lg">
                            <h3 className="font-semibold text-[var(--text-main)] mb-2">1. Create Your First Task</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Click the "+ New" button in the navbar and select "New Task" to create your first task.
                            </p>
                        </div>
                        <div className="p-4 bg-[var(--bg-body)] rounded-lg">
                            <h3 className="font-semibold text-[var(--text-main)] mb-2">2. Join or Create a Team</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Navigate to Teams and either create a new team or join an existing one with an invite code.
                            </p>
                        </div>
                        <div className="p-4 bg-[var(--bg-body)] rounded-lg">
                            <h3 className="font-semibold text-[var(--text-main)] mb-2">3. Use the Calendar View</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                View all your tasks with due dates in the Calendar page for better planning.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText size={20} className="text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold text-[var(--text-main)]">Resources</h2>
                    </div>
                    <div className="grid gap-3">
                        <a href="#" className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-[var(--text-secondary)]" />
                                <span className="text-[var(--text-main)]">User Guide</span>
                            </div>
                            <ExternalLink size={16} className="text-[var(--text-secondary)]" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <Video size={18} className="text-[var(--text-secondary)]" />
                                <span className="text-[var(--text-main)]">Video Tutorials</span>
                            </div>
                            <ExternalLink size={16} className="text-[var(--text-secondary)]" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <MessageCircle size={18} className="text-[var(--text-secondary)]" />
                                <span className="text-[var(--text-main)]">Community Forum</span>
                            </div>
                            <ExternalLink size={16} className="text-[var(--text-secondary)]" />
                        </a>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-[var(--text-main)] mb-4">Need More Help?</h2>
                    <p className="text-[var(--text-secondary)] mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <button className="btn btn-primary">Contact Support</button>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
