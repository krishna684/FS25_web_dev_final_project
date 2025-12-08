const Team = require('../models/Team');
const User = require('../models/User');
const activityController = require('../controllers/activityController');

// Create a new team
exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Team name is required' });
        }

        const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        const newTeam = new Team({
            name,
            description,
            owner: req.user.userId,
            members: [{ user: req.user.userId, role: 'owner' }], // Correct structure
            inviteCode,
        });

        const savedTeam = await newTeam.save();

        // Update user's teams array
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { teams: savedTeam._id },
        });

        res.status(201).json(savedTeam);
    } catch (err) {
        console.error('Create Team Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's teams
exports.getUserTeams = async (req, res) => {
    try {
        // Find teams where members.user matches userId
        const teams = await Team.find({ 'members.user': req.user.userId })
            .populate('owner', 'name email')
            .populate('members.user', 'name email avatarUrl'); // Populate the nested user field
        res.json(teams);
    } catch (err) {
        console.error('Get Teams Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Join team via invite code
exports.joinTeam = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ error: 'Invite code is required' });
        }

        const team = await Team.findOne({ inviteCode });
        if (!team) {
            return res.status(404).json({ error: 'Invalid invite code' });
        }

        // Check if already member (iterate subdocs)
        const isMember = team.members.some(m => m.user.toString() === req.user.userId);
        if (isMember) {
            return res.status(400).json({ error: 'You are already a member of this team' });
        }

        // Add member
        team.members.push({ user: req.user.userId, role: 'member' });
        await team.save();

        // Update user
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { teams: team._id },
        });

        res.json({ message: 'Joined team successfully', team });

        await activityController.logActivity(
            req.user.userId,
            team._id,
            'team.member.joined',
            `User joined the team via invite code`
        );
    } catch (err) {
        console.error('Join Team Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get specific team details
exports.getTeamDetails = async (req, res) => {
    try {
        const team = await Team.findOne({
            _id: req.params.teamId,
            'members.user': req.user.userId, // Security check
        })
            .populate('members.user', 'name email avatarUrl role') // Populate nested
            .populate('owner', 'name email');

        if (!team) {
            return res.status(404).json({ error: 'Team not found or access denied' });
        }

        // Flatten members for frontend user friendliness? 
        // Or keep structure. Frontend expects members array.
        // Let's keep structure but frontend needs to know it's members[i].user

        res.json(team);
    } catch (err) {
        console.error('Get Team Details Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Leave team
exports.leaveTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) return res.status(404).json({ error: 'Team not found' });

        // Check if removing owner
        if (team.owner.toString() === req.user.userId) {
            return res.status(400).json({ error: 'Owner cannot leave team. Delete team or transfer ownership.' });
        }

        // Remove from members
        team.members = team.members.filter(m => m.user.toString() !== req.user.userId);
        await team.save();

        // Update user
        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { teams: team._id },
        });

        // Unassign user from all team tasks
        const Task = require('../models/Task');
        await Task.updateMany(
            { team: team._id, assignedTo: req.user.userId },
            { $set: { assignedTo: null } }
        );

        res.json({ message: 'Left team successfully' });
    } catch (err) {
        console.error('Leave Team Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
