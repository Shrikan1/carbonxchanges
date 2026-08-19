const Notification = require('../../models/Notification');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 20;
    
    const notifications = await Notification.findRecentByUser(userId, limit);
    const unreadCount = await Notification.getUnreadCount(userId);
    
    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const notification = await Notification.markAsRead(id, userId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Marked as read', notification });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  markAsRead
};
