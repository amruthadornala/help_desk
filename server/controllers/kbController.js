import { KnowledgeBase } from '../database/db.js';

export async function getKnowledge(req, res) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { title:    { $regex: term, $options: 'i' } },
        { content:  { $regex: term, $options: 'i' } },
        { keywords: { $regex: term, $options: 'i' } }
      ];
    }

    const entries = await KnowledgeBase.find(filter).sort({ _id: 1 }).lean();
    res.json(entries);
  } catch (error) {
    console.error('Fetch knowledge base error:', error);
    res.status(500).json({ error: 'Failed to retrieve knowledge base records.' });
  }
}

export async function createKnowledge(req, res) {
  try {
    const { title, content, category, keywords } = req.body;
    if (!title   || !title.trim())   return res.status(400).json({ error: 'Title is required.' });
    if (!content || !content.trim()) return res.status(400).json({ error: 'Content is required.' });
    if (!category|| !category.trim())return res.status(400).json({ error: 'Category is required.' });

    const entry = await KnowledgeBase.create({
      title:    title.trim(),
      content:  content.trim(),
      category: category.trim(),
      keywords: keywords ? keywords.trim() : ''
    });
    res.status(201).json({ message: 'Knowledge base entry created successfully.', entry });
  } catch (error) {
    console.error('Create knowledge error:', error);
    res.status(500).json({ error: 'Failed to create knowledge base entry.' });
  }
}

export async function updateKnowledge(req, res) {
  try {
    const { id } = req.params;
    const { title, content, category, keywords } = req.body;

    const entry = await KnowledgeBase.findByIdAndUpdate(
      id,
      { title: title.trim(), content: content.trim(), category: category.trim(), keywords: keywords ? keywords.trim() : '' },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Knowledge base entry not found.' });
    res.json({ message: 'Knowledge base entry updated successfully.', entry });
  } catch (error) {
    console.error('Update knowledge error:', error);
    res.status(500).json({ error: 'Failed to update knowledge base entry.' });
  }
}

export async function deleteKnowledge(req, res) {
  try {
    const { id } = req.params;
    const entry = await KnowledgeBase.findByIdAndDelete(id);
    if (!entry) return res.status(404).json({ error: 'Knowledge base entry not found.' });
    res.json({ message: 'Knowledge base entry deleted successfully.', id });
  } catch (error) {
    console.error('Delete knowledge error:', error);
    res.status(500).json({ error: 'Failed to delete knowledge base entry.' });
  }
}
