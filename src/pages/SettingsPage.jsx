import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Bell, Globe, Palette, Save } from 'lucide-react';

const SettingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form state
    const [settings, setSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        emailNotifications: true,
        taskReminders: true,
        teamUpdates: false,
        timezone: 'America/New_York',
        language: 'en'
    });

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement actual API call to save settings
            // await userApi.updateSettings(settings);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = () => {
        // TODO: Implement password change modal/flow
        alert('Password change functionality coming soon!');
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Settings</h1>
                <p className="text-[var(--text-secondary)]">Manage your account preferences and settings</p>
            </div>

            {/* Save Status */}
            {saved && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Save size={18} />
                    <span className="font-medium">Settings saved successfully!</span>
                </div>
            )}

            {/* Settings Sections */}
            <div className="space-y-6">

                {/* Account Information */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <User size={20} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-main)]">Account Information</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Update your personal details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={settings.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="your@email.com"
                            />
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Used for login and notifications</p>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Lock size={20} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-main)]">Security</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Manage your password and security settings</p>
                        </div>
                    </div>

                    <div>
                        <button onClick={handleChangePassword} className="btn btn-secondary">
                            <Lock size={16} />
                            Change Password
                        </button>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                            Last changed: Never
                        </p>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Bell size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-main)]">Notifications</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Choose what you want to be notified about</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg cursor-pointer transition-colors">
                            <div className="flex-1">
                                <div className="font-medium text-[var(--text-main)]">Email Notifications</div>
                                <div className="text-sm text-[var(--text-secondary)]">Receive email updates about your activity</div>
                            </div>
                            <input
                                type="checkbox"
                                className="form-checkbox ml-4"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg cursor-pointer transition-colors">
                            <div className="flex-1">
                                <div className="font-medium text-[var(--text-main)]">Task Reminders</div>
                                <div className="text-sm text-[var(--text-secondary)]">Get reminders for upcoming task deadlines</div>
                            </div>
                            <input
                                type="checkbox"
                                className="form-checkbox ml-4"
                                checked={settings.taskReminders}
                                onChange={(e) => handleChange('taskReminders', e.target.checked)}
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 hover:bg-[var(--bg-body)] rounded-lg cursor-pointer transition-colors">
                            <div className="flex-1">
                                <div className="font-medium text-[var(--text-main)]">Team Activity Updates</div>
                                <div className="text-sm text-[var(--text-secondary)]">Notifications when team members update tasks</div>
                            </div>
                            <input
                                type="checkbox"
                                className="form-checkbox ml-4"
                                checked={settings.teamUpdates}
                                onChange={(e) => handleChange('teamUpdates', e.target.checked)}
                            />
                        </label>
                    </div>
                </div>

                {/* Preferences */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Globe size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-main)]">Preferences</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Customize your experience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Timezone</label>
                            <select
                                className="form-input"
                                value={settings.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Language</label>
                            <select
                                className="form-input"
                                value={settings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="ja">Japanese</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-[var(--bg-body)] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Palette size={16} className="text-[var(--text-secondary)]" />
                            <span className="font-medium text-[var(--text-main)]">Theme</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Use the theme toggle in the navbar to switch between light and dark mode.
                        </p>
                    </div>
                </div>

            </div>

            {/* Save Button - Sticky Footer */}
            <div className="sticky bottom-0 mt-8 p-4 bg-[var(--bg-body)] border-t border-[var(--border)] -mx-8 -mb-8 flex items-center justify-between rounded-b-lg">
                <p className="text-sm text-[var(--text-secondary)]">
                    {saved ? 'All changes saved' : 'You have unsaved changes'}
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
