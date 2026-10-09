import { FAQ } from '../database/db.js';

export async function getFaqs(req, res) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { question: { $regex: term, $options: 'i' } },
        { answer:   { $regex: term, $options: 'i' } }
      ];
    }

    const faqs = await FAQ.find(filter).sort({ _id: 1 }).lean();
    res.json(faqs);
  } catch (error) {
    console.error('Fetch FAQs error:', error);
    res.status(500).json({ error: 'Failed to retrieve FAQs.' });
  }
}

export async function createFaq(req, res) {
  try {
    const { question, answer, category } = req.body;
    if (!question || !question.trim()) return res.status(400).json({ error: 'Question is required.' });
    if (!answer   || !answer.trim())   return res.status(400).json({ error: 'Answer is required.' });
    if (!category || !category.trim()) return res.status(400).json({ error: 'Category is required.' });

    const faq = await FAQ.create({ question: question.trim(), answer: answer.trim(), category: category.trim() });
    res.status(201).json({ message: 'FAQ created successfully.', faq });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Failed to create FAQ.' });
  }
}

export async function updateFaq(req, res) {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { question: question.trim(), answer: answer.trim(), category: category.trim() },
      { new: true }
    );
    if (!faq) return res.status(404).json({ error: 'FAQ not found.' });
    res.json({ message: 'FAQ updated successfully.', faq });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Failed to update FAQ.' });
  }
}

export async function deleteFaq(req, res) {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found.' });
    res.json({ message: 'FAQ deleted successfully.', id });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Failed to delete FAQ.' });
  }
}
