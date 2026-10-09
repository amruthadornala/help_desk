import { Announcement } from '../database/db.js';

export async function getAnnouncements(req, res) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { title:       { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    const announcements = await Announcement.find(filter).sort({ date: -1, _id: -1 }).lean();
    res.json(announcements);
  } catch (error) {
    console.error('Fetch announcements error:', error);
    res.status(500).json({ error: 'Failed to retrieve announcements.' });
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { title, description, category, priority, date } = req.body;
    if (!title       || !title.trim())       return res.status(400).json({ error: 'Title is required.' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required.' });
    if (!category    || !category.trim())    return res.status(400).json({ error: 'Category is required.' });

    const ann = await Announcement.create({
      title:       title.trim(),
      description: description.trim(),
      category:    category.trim(),
      priority:    priority || 'Normal',
      date:        date || new Date().toISOString().split('T')[0]
    });
    res.status(201).json({ message: 'Announcement published successfully.', announcement: ann });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, priority, date } = req.body;

    const ann = await Announcement.findByIdAndUpdate(
      id,
      {
        title:       title.trim(),
        description: description.trim(),
        category:    category.trim(),
        priority:    priority || 'Normal',
        ...(date ? { date } : {})
      },
      { new: true }
    );
    if (!ann) return res.status(404).json({ error: 'Announcement not found.' });
    res.json({ message: 'Announcement updated successfully.', announcement: ann });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const ann = await Announcement.findByIdAndDelete(id);
    if (!ann) return res.status(404).json({ error: 'Announcement not found.' });
    res.json({ message: 'Announcement deleted successfully.', id });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
}
