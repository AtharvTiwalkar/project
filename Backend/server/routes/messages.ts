import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Mock messages data
const mockConversations = [
  {
    id: 1,
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for the payment reminder!',
    time: '2:30 PM',
    unread: 2,
    avatar: 'SJ',
    online: true,
    messages: [
      {
        id: 1,
        sender: 'Sarah Johnson',
        content: 'Hi! I wanted to confirm the payment for this month.',
        time: '2:25 PM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        content: 'Yes, I can see your payment went through successfully. Thank you!',
        time: '2:27 PM',
        isOwn: true
      }
    ]
  }
];

// Get all conversations
router.get('/conversations', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const conversations = mockConversations.map(conv => ({
      id: conv.id,
      name: conv.name,
      lastMessage: conv.lastMessage,
      time: conv.time,
      unread: conv.unread,
      avatar: conv.avatar,
      online: conv.online
    }));

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      conversation: {
        id: conversation.id,
        name: conversation.name,
        avatar: conversation.avatar,
        online: conversation.online
      },
      messages: conversation.messages
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/conversations/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const { content } = req.body;
    
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const newMessage = {
      id: conversation.messages.length + 1,
      sender: 'You',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    conversation.messages.push(newMessage);
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
