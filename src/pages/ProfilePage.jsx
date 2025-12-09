import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, Edit2, Save, X, MapPin, Briefcase, Loader } from 'lucide-react';
import taskApi from '../api/tasks';
import teamApi from '../api/teams';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        tasksCompleted: 0,
        teamsJoined: 0,
        activeProjects: 0,
        totalTasks: 0
    });

    // Profile state
    const [profile, setProfile] = useState({
        name: user?.name || 'User Name',
        email: user?.email || 'user@example.com',
        bio: '',
        location: '',
        jobTitle: '',
        joined: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    });

    // Load user stats
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                // Fetch tasks
                const tasksRes = await taskApi.getAll();
                const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
                
                const completedTasks = tasks.filter(t => t.status === 'done').length;
                const totalTasks = tasks.length;

                // Fetch teams
                const teamsRes = await teamApi.getAll();
                const teams = Array.isArray(teamsRes.data) ? teamsRes.data : [];
                const teamsJoined = teams.length;

                setStats({
                    tasksCompleted: completedTasks,
                    teamsJoined: teamsJoined,
                    activeProjects: teams.filter(t => t.status !== 'archived').length,
                    totalTasks: totalTasks
                });
            } catch (error) {
                console.error('Failed to load stats:', error);
                // Keep default values on error
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadStats();
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original values if needed
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement actual API call
            // await userApi.updateProfile(profile);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Profile</h1>
                <p className="text-[var(--text-secondary)]">Manage your personal information</p>
            </div>

            <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="card">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white dark:ring-gray-700 shadow-lg">
                                {profile.name.substring(0, 1).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-600 transition-colors">
                                <Edit2 size={14} />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">Display Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profile.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={profile.email}
                                            disabled
                                            title="Email cannot be changed here. Go to Settings to update."
                                        />
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                                            Email can be changed in Settings
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">{profile.name}</h2>
                                    <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-3">
                                        <Mail size={16} />
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                        <Calendar size={16} />
                                        <span>Joined {profile.joined}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Edit/Save Buttons */}
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="btn btn-ghost">
                                        <X size={16} />
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="btn btn-primary">
                                    <Edit2 size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card text-center hover:shadow-md transition-shadow">
                        {loading ? (
                            <Loader size={32} className="mx-auto animate-spin text-[var(--primary)] mb-2" />
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-[var(--primary)] mb-2">{stats.tasksCompleted}</div>
                                <div className="text-sm font-medium text-[var(--text-secondary)]">Tasks Completed</div>
                                <div className="text-xs text-[var(--text-secondary)] mt-1">Out of {stats.totalTasks}</div>
                            </>
                        )}
                    </div>
                    <div className="card text-center hover:shadow-md transition-shadow">
                        {loading ? (
                            <Loader size={32} className="mx-auto animate-spin text-[var(--accent)] mb-2" />
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-[var(--accent)] mb-2">{stats.teamsJoined}</div>
                                <div className="text-sm font-medium text-[var(--text-secondary)]">Teams Joined</div>
                            </>
                        )}
                    </div>
                    <div className="card text-center hover:shadow-md transition-shadow">
                        {loading ? (
                            <Loader size={32} className="mx-auto animate-spin text-[var(--warning)] mb-2" />
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-[var(--warning)] mb-2">{stats.activeProjects}</div>
                                <div className="text-sm font-medium text-[var(--text-secondary)]">Active Projects</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="card">
                    <h3 className="text-xl font-semibold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border)]">
                        Additional Information
                    </h3>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">
                                    <Briefcase size={16} className="inline mr-2" />
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.jobTitle}
                                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                                    placeholder="e.g. Product Manager"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <MapPin size={16} className="inline mr-2" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <User size={16} className="inline mr-2" />
                                    Bio
                                </label>
                                <textarea
                                    className="form-input min-h-[100px]"
                                    value={profile.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Brief description for your profile</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {profile.jobTitle && (
                                <div className="flex items-start gap-3">
                                    <Briefcase size={18} className="text-[var(--text-secondary)] mt-0.5" />
                                    <div>
                                        <div className="text-sm text-[var(--text-secondary)]">Job Title</div>
                                        <div className="text-[var(--text-main)] font-medium">{profile.jobTitle}</div>
                                    </div>
                                </div>
                            )}

                            {profile.location && (
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-[var(--text-secondary)] mt-0.5" />
                                    <div>
                                        <div className="text-sm text-[var(--text-secondary)]">Location</div>
                                        <div className="text-[var(--text-main)] font-medium">{profile.location}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <User size={18} className="text-[var(--text-secondary)] mt-0.5" />
                                <div className="flex-1">
                                    <div className="text-sm text-[var(--text-secondary)] mb-1">Bio</div>
                                    <div className="text-[var(--text-main)]">
                                        {profile.bio || (
                                            <span className="text-[var(--text-secondary)] italic">
                                                No bio yet. Click "Edit Profile" to add information about yourself.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievements */}
                <div className="card">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                        <Award size={20} className="text-[var(--primary)]" />
                        <h3 className="text-xl font-semibold text-[var(--text-main)]">Achievements</h3>
                    </div>
                    <div className="text-center py-8">
                        <Award size={48} className="mx-auto text-[var(--text-secondary)] mb-3 opacity-50" />
                        <p className="text-[var(--text-secondary)]">
                            Complete tasks and collaborate with teams to unlock achievements!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
