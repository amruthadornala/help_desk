import { ChatHistory } from '../database/db.js';
import { generateAiResponse } from '../services/aiService.js';

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question || !question.trim())
      return res.status(400).json({ error: 'Please enter a question.' });

    const trimmedQuestion = question.trim();
    const { answer, sources } = await generateAiResponse(trimmedQuestion);

    // Save to chat history only for registered users (id != null)
    let chatId = null;
    if (req.user.id) {
      const chat = await ChatHistory.create({
        user_id:  req.user.id,
        question: trimmedQuestion,
        answer,
        sources:  sources || []
      });
      chatId = chat._id.toString();
    }

    res.json({
      id:         chatId,
      question:   trimmedQuestion,
      answer,
      sources,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'The AI service is temporarily unavailable. Please try again.' });
  }
}

export async function getChatHistory(req, res) {
  try {
    if (!req.user.id) return res.json([]);

    const { search } = req.query;
    let filter = { user_id: req.user.id };

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { question: { $regex: term, $options: 'i' } },
        { answer:   { $regex: term, $options: 'i' } }
      ];
    }

    const history = await ChatHistory.find(filter)
      .sort({ _id: -1 })
      .limit(50)
      .lean();

    res.json(history);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history.' });
  }
}

export async function deleteChatItem(req, res) {
  try {
    const { id } = req.params;
    const chat = await ChatHistory.findById(id);
    if (!chat)
      return res.status(404).json({ error: 'Chat conversation not found.' });

    if (chat.user_id?.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Unauthorized to delete this conversation.' });

    await chat.deleteOne();
    res.json({ message: 'Conversation deleted successfully.', id });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
}

export async function clearChatHistory(req, res) {
  try {
    await ChatHistory.deleteMany({ user_id: req.user.id });
    res.json({ message: 'All chat history cleared successfully.' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history.' });
  }
}
