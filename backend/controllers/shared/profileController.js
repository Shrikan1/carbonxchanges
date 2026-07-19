const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// GET /api/profile
// Note: this covers your "findSellerById()" query — it's the same as the
// already-existing User.findById(), since profile lookup isn't actually
// seller-specific (any logged-in role uses the same users table/fields).
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

// PUT /api/profile   body: { name }
async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    const user = await User.updateProfile(req.user.id, { name: name.trim() });
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

// PUT /api/profile/password   body: { current_password, new_password }
async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'current_password and new_password are required' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ error: 'new_password must be at least 8 characters' });
    }

    const user = await User.findByIdWithPassword(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentMatches = await bcrypt.compare(current_password, user.password_hash);
    if (!currentMatches) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.user.id, newHash);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
}

module.exports = { getProfile, updateProfile, changePassword };