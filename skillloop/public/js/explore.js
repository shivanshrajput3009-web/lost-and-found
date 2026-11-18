// public/js/explore.js - Handles the Explore Skills Catalog, Filtering, and Request Modal
let allSkills = [];

// ==================== Load Skills from Backend ====================
async function loadSkills() {
  const grid = document.getElementById('skillsGrid');
  const countEl = document.getElementById('resultsCount');

  try {
    const skills = await apiCall('/api/skills');
    allSkills = skills;

    // Check if query params were passed from homepage hero search or category pills
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');

    if (searchParam) {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = searchParam;
    }
    if (categoryParam) {
      const categorySelect = document.getElementById('categoryFilter');
      if (categorySelect) categorySelect.value = categoryParam;
    }

    filterAndRenderSkills();
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load skills</h3>
        <p>${err.message}</p>
        <button onclick="loadSkills()" class="btn btn-outline btn-sm">Try Again</button>
      </div>
    `;
    if (countEl) countEl.textContent = 'Error loading skills';
  }
}

// ==================== Filter, Sort & Display ====================
function filterAndRenderSkills() {
  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const selectedCategory = document.getElementById('categoryFilter')?.value || '';
  const selectedLevel = document.getElementById('levelFilter')?.value || '';
  const sortType = document.getElementById('sortFilter')?.value || 'newest';

  // Filter skills
  let filtered = allSkills.filter(skill => {
    const matchSearch = !searchTerm ||
      skill.title.toLowerCase().includes(searchTerm) ||
      skill.description.toLowerCase().includes(searchTerm) ||
      skill.ownerName.toLowerCase().includes(searchTerm);

    const matchCategory = !selectedCategory || skill.category === selectedCategory;
    const matchLevel = !selectedLevel || skill.level === selectedLevel;

    return matchSearch && matchCategory && matchLevel;
  });

  // Sort skills
  if (sortType === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortType === 'credits-high') {
    filtered.sort((a, b) => b.credits - a.credits);
  } else if (sortType === 'credits-low') {
    filtered.sort((a, b) => a.credits - b.credits);
  }

  renderSkillsGrid(filtered);
}

function renderSkillsGrid(skills) {
  const grid = document.getElementById('skillsGrid');
  const countEl = document.getElementById('resultsCount');

  if (countEl) {
    countEl.textContent = `Showing ${skills.length} ${skills.length === 1 ? 'skill' : 'skills'}`;
  }

  if (skills.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No matching skills found</h3>
        <p>Try clearing filters or search for something else.</p>
        <button onclick="clearFilters()" class="btn btn-outline btn-sm">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = skills.map(skill => {
    const icon = categoryIcons[skill.category] || '📌';
    const levelColor = levelColors[skill.level] || '#64748b';
    const isAvailable = skill.status === 'Available';

    // Safe escaping for onclick attribute values
    const safeTitle = skill.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const safeOwner = skill.ownerName.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
      <div class="skill-card">
        <div class="skill-card-header">
          <span class="skill-category">${icon} ${skill.category}</span>
          <span class="skill-status ${isAvailable ? 'status-available' : 'status-taken'}">
            ${skill.status}
          </span>
        </div>

        <h3 class="skill-title">${skill.title}</h3>
        <p class="skill-description">${skill.description}</p>

        <div class="skill-details-row">
          <div class="skill-detail-item"><strong>📅 Availability:</strong> ${skill.availability}</div>
          <div class="skill-detail-item"><strong>⏱️ Duration:</strong> ${skill.duration}</div>
        </div>

        <div class="skill-meta">
          <span class="skill-level" style="color: ${levelColor};">● ${skill.level}</span>
          <span class="skill-credits">⭐ ${skill.credits} credits</span>
        </div>

        <div class="skill-owner">
          <span class="owner-avatar">${skill.ownerName.charAt(0).toUpperCase()}</span>
          <span class="owner-name">${skill.ownerName}</span>
        </div>

        ${isAvailable ? `
          <button 
            class="btn btn-primary btn-sm btn-full" 
            onclick="openRequestModal('${skill._id}', '${safeTitle}', '${safeOwner}')">
            Request Exchange 🤝
          </button>
        ` : `
          <button class="btn btn-sm btn-full" style="background:#e2e8f0; color:#94a3b8; cursor:not-allowed;" disabled>
            Currently Taken
          </button>
        `}
      </div>
    `;
  }).join('');
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('levelFilter').value = '';
  document.getElementById('sortFilter').value = 'newest';
  filterAndRenderSkills();
}

// ==================== Request Exchange Modal ====================
function openRequestModal(skillId, skillTitle, ownerName) {
  document.getElementById('requestSkillId').value = skillId;
  document.getElementById('modalSkillTitle').textContent = `Skill: ${skillTitle}`;
  document.getElementById('modalOwnerName').textContent = ownerName;
  
  // Pre-fill requester name if saved in localStorage or demo user
  const savedUser = localStorage.getItem('skillloop_user') || 'Rahul Sharma';
  document.getElementById('requesterName').value = savedUser;

  const modal = document.getElementById('requestModal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('requestModal');
  modal.style.display = 'none';
  document.getElementById('requestForm').reset();
}

// Submit Exchange Request Handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const skillId = document.getElementById('requestSkillId').value;
      const requesterName = document.getElementById('requesterName').value.trim();
      const message = document.getElementById('requestMessage').value.trim();

      if (!requesterName || !message) {
        showToast('Please provide your name and message', 'warning');
        return;
      }

      try {
        await apiCall('/api/requests', {
          method: 'POST',
          body: JSON.stringify({
            skillId,
            requesterName,
            message
          })
        });

        // Store preferred user name for convenience
        localStorage.setItem('skillloop_user', requesterName);

        showToast('🎉 Exchange request submitted successfully!', 'success');
        closeModal();

        // Refresh skills to show latest statuses
        await loadSkills();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Filter input listeners
  document.getElementById('searchInput')?.addEventListener('input', filterAndRenderSkills);
  document.getElementById('categoryFilter')?.addEventListener('change', filterAndRenderSkills);
  document.getElementById('levelFilter')?.addEventListener('change', filterAndRenderSkills);
  document.getElementById('sortFilter')?.addEventListener('change', filterAndRenderSkills);

  // Close modal when clicking on background overlay
  const modalOverlay = document.getElementById('requestModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Initial load
  loadSkills();
});
