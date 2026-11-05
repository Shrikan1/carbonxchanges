// backend/controllers/shared/contactController.js
const ContactMessage = require('../../models/ContactMessage');
const { sendContactMessageEmail } = require('../../services/emailService');

// POST /api/v1/contact
async function submitContactMessage(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone ? phone.trim() : null;
    const trimmedMessage = message.trim();

    // 1. Save to Database
    const savedMessage = await ContactMessage.createContactMessage({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      message: trimmedMessage,
    });

    // 2. Dispatch Email Asynchronously to Official Admin Email (does not block user response)
    sendContactMessageEmail({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      message: trimmedMessage,
    }).catch((err) => {
      console.error('Email dispatch failure for contact message:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: savedMessage,
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Failed to submit message. Please try again later.' });
  }
}

// GET /api/v1/admin/messages  (Admin only)
async function getAdminMessages(req, res) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const result = await ContactMessage.getAllContactMessages({
      status,
      limit: parseInt(limit, 10),
      offset,
    });

    return res.json({
      success: true,
      messages: result.rows,
      pagination: {
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      counts: {
        total: result.total,
        unread: result.unread,
        read: result.read,
        resolved: result.resolved,
      },
    });
  } catch (err) {
    console.error('Get admin messages error:', err);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// PATCH /api/v1/admin/messages/:id/status  (Admin only)
async function updateAdminMessageStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'read', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await ContactMessage.updateMessageStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.json({
      success: true,
      message: `Message status marked as ${status}`,
      data: updated,
    });
  } catch (err) {
    console.error('Update message status error:', err);
    return res.status(500).json({ error: 'Failed to update message status' });
  }
}

// DELETE /api/v1/admin/messages/:id  (Admin only)
async function deleteAdminMessage(req, res) {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.deleteContactMessage(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err) {
    console.error('Delete message error:', err);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
}

module.exports = {
  submitContactMessage,
  getAdminMessages,
  updateAdminMessageStatus,
  deleteAdminMessage,
};
