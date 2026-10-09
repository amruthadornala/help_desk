import { Department } from '../database/db.js';

export async function getDepartments(req, res) {
  try {
    const { search } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name:        { $regex: term, $options: 'i' } },
        { hod:         { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { location:    { $regex: term, $options: 'i' } }
      ];
    }

    const departments = await Department.find(filter).sort({ name: 1 }).lean();
    res.json(departments);
  } catch (error) {
    console.error('Fetch departments error:', error);
    res.status(500).json({ error: 'Failed to retrieve departments list.' });
  }
}

export async function createDepartment(req, res) {
  try {
    const { name, hod, contact, email, location, description } = req.body;
    if (!name        || !name.trim())        return res.status(400).json({ error: 'Department name is required.' });
    if (!hod         || !hod.trim())         return res.status(400).json({ error: 'Head of Department (HOD) is required.' });
    if (!contact     || !contact.trim())     return res.status(400).json({ error: 'Contact number is required.' });
    if (!location    || !location.trim())    return res.status(400).json({ error: 'Location is required.' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required.' });

    const dept = await Department.create({
      name:        name.trim(),
      hod:         hod.trim(),
      contact:     contact.trim(),
      email:       email ? email.trim() : '',
      location:    location.trim(),
      description: description.trim()
    });
    res.status(201).json({ message: 'Department added successfully.', department: dept });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Failed to create department.' });
  }
}

export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, hod, contact, email, location, description } = req.body;

    const dept = await Department.findByIdAndUpdate(
      id,
      {
        name:        name.trim(),
        hod:         hod.trim(),
        contact:     contact.trim(),
        email:       email ? email.trim() : '',
        location:    location.trim(),
        description: description.trim()
      },
      { new: true }
    );
    if (!dept) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department updated successfully.', department: dept });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Failed to update department.' });
  }
}

export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    const dept = await Department.findByIdAndDelete(id);
    if (!dept) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department deleted successfully.', id });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Failed to delete department.' });
  }
}
