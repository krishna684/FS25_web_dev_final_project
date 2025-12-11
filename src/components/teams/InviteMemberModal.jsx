import React, { useState } from 'react';
import { X, Copy, Check, Mail, Send } from 'lucide-react';

const InviteMemberModal = ({ isOpen, onClose, teamName, inviteCode }) => {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [sending, setSending] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        const inviteUrl = `${window.location.origin}/join-team?code=${inviteCode}`;
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = async () => {
        if (!email.trim()) return;

        try {
            setSending(true);
            // In a real app, this would call an API endpoint to send the email
            // For now, we'll simulate the email sending
            await new Promise(resolve => setTimeout(resolve, 1000));

            setEmailSent(true);
            setEmail('');
            setTimeout(() => setEmailSent(false), 3000);
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-surface)] w-full max-w-lg rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden scale-100 p-0 transform transition-all">
                {/* Header */}
                <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-body)]">
                    <h3 className="text-lg font-semibold text-[var(--text-main)]">Invite to {teamName}</h3>
                    <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Invite Code Section */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="font-bold text-xl">#</span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Share this code with your team members. They can use it to join this team from their dashboard.
                        </p>

                        <div className="relative">
                            <div className="flex items-center justify-between bg-[var(--bg-body)] border-2 border-dashed border-[var(--border)] rounded-lg p-3">
                                <span className="text-2xl font-mono font-bold tracking-widest text-[var(--text-main)]">{inviteCode || 'ABCD-1234'}</span>
                                <button
                                    onClick={handleCopy}
                                    className={`p-2 rounded-md transition-all ${copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200 text-[var(--text-secondary)]'}`}
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                            {copied && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-600 font-medium">Copied!</span>}
                        </div>
                    </div>

                    {/* Email Invite Section */}
                    <div className="border-t border-[var(--border)] pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Mail size={18} className="text-[var(--text-secondary)]" />
                            <h4 className="font-medium text-[var(--text-main)]">Send Email Invitation</h4>
                        </div>

                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            Send a direct email invitation to a team member.
                        </p>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="form-input flex-1"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendEmail}
                                    disabled={!email.trim() || sending}
                                    className="btn btn-primary px-4"
                                >
                                    {sending ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            </div>

                            {emailSent && (
                                <div className="text-green-600 text-sm flex items-center gap-2">
                                    <Check size={16} />
                                    Email invitation sent successfully!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[var(--bg-body)] border-t border-[var(--border)] flex justify-end">
                    <button onClick={onClose} className="btn btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;
