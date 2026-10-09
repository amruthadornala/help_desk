const API_BASE = '/api';

/**
 * Universal fetch wrapper with automatic JWT token management and error formatting.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('college_helpdesk_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
      // Auto-logout on 401/403 expired token if trying authenticated endpoints
      if ((res.status === 401 || res.status === 403) && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        if (localStorage.getItem('college_helpdesk_token')) {
          localStorage.removeItem('college_helpdesk_token');
          localStorage.removeItem('college_helpdesk_user');
          window.dispatchEvent(new Event('auth-changed'));
        }
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => {
    localStorage.removeItem('college_helpdesk_token');
    localStorage.removeItem('college_helpdesk_user');
    window.dispatchEvent(new Event('auth-changed'));
  },
  getProfile: () => request('/auth/profile'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Chatbot & History
  askQuestion: (question) => request('/chat', { method: 'POST', body: JSON.stringify({ question }) }),
  getChatHistory: (search = '') => request(`/chat/history${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  deleteChat: (id) => request(`/chat/${id}`, { method: 'DELETE' }),
  clearChatHistory: () => request('/chat/history', { method: 'DELETE' }),

  // FAQs
  getFaqs: (category = 'All', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    return request(`/faqs?${params.toString()}`);
  },
  createFaq: (faq) => request('/faqs', { method: 'POST', body: JSON.stringify(faq) }),
  updateFaq: (id, faq) => request(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(faq) }),
  deleteFaq: (id) => request(`/faqs/${id}`, { method: 'DELETE' }),

  // Knowledge Base
  getKnowledge: (category = 'All', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    return request(`/knowledge?${params.toString()}`);
  },
  createKnowledge: (kb) => request('/knowledge', { method: 'POST', body: JSON.stringify(kb) }),
  updateKnowledge: (id, kb) => request(`/knowledge/${id}`, { method: 'PUT', body: JSON.stringify(kb) }),
  deleteKnowledge: (id) => request(`/knowledge/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: (search = '') => request(`/departments${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createDepartment: (dept) => request('/departments', { method: 'POST', body: JSON.stringify(dept) }),
  updateDepartment: (id, dept) => request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(dept) }),
  deleteDepartment: (id) => request(`/departments/${id}`, { method: 'DELETE' }),

  // Announcements
  getAnnouncements: (category = 'All', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    return request(`/announcements?${params.toString()}`);
  },
  createAnnouncement: (ann) => request('/announcements', { method: 'POST', body: JSON.stringify(ann) }),
  updateAnnouncement: (id, ann) => request(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(ann) }),
  deleteAnnouncement: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),

  // Feedback
  submitFeedback: (feedback) => request('/feedback', { method: 'POST', body: JSON.stringify(feedback) }),
  getFeedback: () => request('/feedback'),
  deleteFeedback: (id) => request(`/feedback/${id}`, { method: 'DELETE' }),

  // Admin Central Dashboard
  getAdminStats: () => request('/admin/dashboard'),
  getAllStudents: () => request('/admin/students'),
  getAllQuestions: (search = '') => request(`/admin/questions${search ? `?search=${encodeURIComponent(search)}` : ''}`)
};
