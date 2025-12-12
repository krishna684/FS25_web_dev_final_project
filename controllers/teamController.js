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

// Update member role (owner only)
exports.updateMemberRole = async (req, res) => {
    try {
        const { teamId, memberId } = req.params;
        const { role } = req.body;

        if (!['owner', 'member'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Check if requester is owner
        if (team.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only team owners can change member roles' });
        }

        // Find member in team
        const memberIndex = team.members.findIndex(m => m._id.toString() === memberId);
        if (memberIndex === -1) {
            return res.status(404).json({ error: 'Member not found in team' });
        }

        // Cannot change owner's role
        if (team.members[memberIndex].user.toString() === team.owner.toString()) {
            return res.status(400).json({ error: 'Cannot change owner role' });
        }

        // Update role
        team.members[memberIndex].role = role;
        await team.save();

        // Populate member data for response
        await team.populate('members.user', 'name email avatarUrl');

        res.json({
            message: 'Member role updated successfully',
            member: team.members[memberIndex]
        });

        await activityController.logActivity(
            req.user.userId,
            teamId,
            'team.member.role.changed',
            `Changed ${team.members[memberIndex].user.name}'s role to ${role}`
        );
    } catch (err) {
        console.error('Update Member Role Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Remove member from team (owner only)
exports.removeMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Check if requester is owner
        if (team.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only team owners can remove members' });
        }

        // Find member in team
        const memberIndex = team.members.findIndex(m => m._id.toString() === memberId);
        if (memberIndex === -1) {
            return res.status(404).json({ error: 'Member not found in team' });
        }

        const memberToRemove = team.members[memberIndex];

        // Cannot remove owner
        if (memberToRemove.user.toString() === team.owner.toString()) {
            return res.status(400).json({ error: 'Cannot remove team owner' });
        }

        // Remove from team
        team.members.splice(memberIndex, 1);
        await team.save();

        // Update user's teams array
        await User.findByIdAndUpdate(memberToRemove.user, {
            $pull: { teams: teamId },
        });

        // Unassign user from all team tasks
        const Task = require('../models/Task');
        await Task.updateMany(
            { team: teamId, assignedTo: memberToRemove.user },
            { $set: { assignedTo: null } }
        );

        res.json({ message: 'Member removed successfully' });

        await activityController.logActivity(
            req.user.userId,
            teamId,
            'team.member.left',
            `Removed ${memberToRemove.user.name || 'member'} from team`
        );
    } catch (err) {
        console.error('Remove Member Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete team (owner only)
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Only owner can delete the team
        if (team.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only the team owner can delete this team' });
        }

        // Remove this team from all users' `teams` array
        const memberIds = team.members.map(m => m.user);
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $pull: { teams: team._id } }
        );

        // Delete all tasks that belong to this team
        const Task = require('../models/Task');
        await Task.deleteMany({ team: team._id });

        // Finally delete the team
        await team.deleteOne();

        // (Optional) log activity – teamId is still valid here
        await activityController.logActivity(
            req.user.userId,
            teamId,
            'team.deleted',
            `Team "${team.name}" was deleted`
        );

        return res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        console.error('Delete Team Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Regenerate invite code (owner only)
exports.regenerateInviteCode = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Check if requester is owner
        if (team.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only team owners can regenerate invite codes' });
        }

        // Generate new invite code
        const newInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        team.inviteCode = newInviteCode;
        await team.save();

        res.json({
            message: 'Invite code regenerated successfully',
            inviteCode: newInviteCode
        });

        await activityController.logActivity(
            req.user.userId,
            teamId,
            'team.invite.regenerated',
            `Regenerated team invite code`
        );
    } catch (err) {
        console.error('Regenerate Invite Code Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
