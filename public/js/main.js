// public/js/main.js - Shared utilities, Toast Notifications & Global Handlers

// Base API configuration (empty string means same origin e.g. http://localhost:5000)
const API_BASE = '';

// ==================== Toast Notifications ====================
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// ==================== Mobile Navigation ====================
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Close mobile navigation on menu link click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });
});

// ==================== Helper Mappings & Utils ====================
const categoryIcons = {
  'Programming': '💻',
  'Design': '🎨',
  'Music': '🎵',
  'Languages': '🌍',
  'Academics': '📖',
  'Fitness': '💪',
  'Photography': '📷',
  'Writing': '✍️',
  'Other': '📌'
};

const levelColors = {
  'Beginner': '#10b981',
  'Intermediate': '#f59e0b',
  'Advanced': '#ef4444'
};

// Format ISO date to readable string (e.g. "Nov 18, 2024")
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Standard fetch wrapper with automated error handling and parsing
async function apiCall(endpoint, options = {}) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${endpoint}]:`, error);
    throw error;
  }
}
