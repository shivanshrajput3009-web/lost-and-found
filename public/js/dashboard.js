// public/js/dashboard.js - Handles User Dashboard (Skills, Requests, Status Updates, Edit/Delete)

let currentStudent = localStorage.getItem('skillloop_user') || 'Rahul Sharma';

// ==================== Initialize Dashboard ====================
async function loadDashboard() {
  // Sync UI select with active student
  const select = document.getElementById('currentUser');
  if (select) {
    select.value = currentStudent;
  }
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.textContent = currentStudent;
  }

  try {
    // Parallel fetch of skills and exchange requests
    const [skills, requests] = await Promise.all([
      apiCall('/api/skills'),
      apiCall('/api/requests')
    ]);

    // Segment data for current student
    const mySkills = skills.filter(s => s.ownerName.toLowerCase().trim() === currentStudent.toLowerCase().trim());
    const received = requests.filter(r => r.ownerName.toLowerCase().trim() === currentStudent.toLowerCase().trim());
    const sent = requests.filter(r => r.requesterName.toLowerCase().trim() === currentStudent.toLowerCase().trim());
    const completed = requests.filter(r => 
      (r.ownerName.toLowerCase().trim() === currentStudent.toLowerCase().trim() ||
       r.requesterName.toLowerCase().trim() === currentStudent.toLowerCase().trim()) &&
      r.status === 'Completed'
    );

    // Update Counter Badges
    document.getElementById('mySkillsCount').textContent = mySkills.length;
    document.getElementById('requestsReceived').textContent = received.length;
    document.getElementById('requestsSent').textContent = sent.length;
    document.getElementById('completedCount').textContent = completed.length;

    // Render lists
    renderMySkills(mySkills);
    renderRequestsReceived(received);
    renderRequestsSent(sent);

  } catch (err) {
    showToast(`Error updating dashboard: ${err.message}`, 'error');
  }
}

// Switch demo perspective
function switchUser() {
  const select = document.getElementById('currentUser');
  currentStudent = select.value;
  localStorage.setItem('skillloop_user', currentStudent);
  document.getElementById('userName').textContent = currentStudent;
  showToast(`Switched perspective to: ${currentStudent}`, 'info');
  loadDashboard();
}

// ==================== Render "My Skills" ====================
function renderMySkills(skills) {
  const container = document.getElementById('mySkillsList');

  if (skills.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💡</div>
        <h3>You haven't posted any skills yet</h3>
        <p>Share your knowledge with fellow campus students and earn credits!</p>
        <a href="/add-skill.html" class="btn btn-primary btn-sm">+ Post a Skill</a>
      </div>
    `;
    return;
  }

  container.innerHTML = skills.map(skill => {
    const icon = categoryIcons[skill.category] || '📌';
    const levelColor = levelColors[skill.level] || '#64748b';
    const isAvailable = skill.status === 'Available';

    return `
      <div class="skill-list-item">
        <div class="skill-list-info">
          <h3>${icon} ${skill.title}</h3>
          <p>${skill.description}</p>
          <div class="skill-meta" style="border:none; padding:0; margin:0.4rem 0;">
            <span class="skill-level" style="color: ${levelColor};">● ${skill.level}</span>
            <span class="skill-credits">⭐ ${skill.credits} credits</span>
            <span class="skill-status ${isAvailable ? 'status-available' : 'status-taken'}">${skill.status}</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">📅 ${skill.availability}</span>
          </div>
        </div>
        <div class="skill-list-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('${skill._id}')">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteSkill('${skill._id}')">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== Render "Requests Received" ====================
function renderRequestsReceived(requests) {
  const container = document.getElementById('requestsReceivedList');

  if (requests.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📬</div>
        <h3>No requests received</h3>
        <p>When someone requests an exchange for your skills, it will show up here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => {
    const statusClass = `status-${req.status.toLowerCase()}`;

    return `
      <div class="request-card">
        <div class="request-card-header">
          <div class="request-info">
            <h3>Skill: ${req.skillTitle}</h3>
            <p><strong>${req.requesterName}</strong> wants to learn this skill from you.</p>
            <div class="request-message">"${req.message}"</div>
            <small>Sent on ${formatDate(req.createdAt)}</small>
          </div>
          <span class="request-status ${statusClass}">${req.status}</span>
        </div>
        <div class="request-actions">
          ${req.status === 'Pending' ? `
            <button class="btn btn-sm btn-success" onclick="updateRequestStatus('${req._id}', 'Accepted')">
              ✅ Accept Exchange
            </button>
            <button class="btn btn-sm btn-danger" onclick="updateRequestStatus('${req._id}', 'Rejected')">
              ❌ Decline
            </button>
          ` : req.status === 'Accepted' ? `
            <button class="btn btn-sm btn-primary" onclick="updateRequestStatus('${req._id}', 'Completed')">
              🎉 Mark as Completed
            </button>
          ` : `
            <span style="font-size:0.85rem; color:var(--text-muted);">Exchange is finalized.</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// ==================== Render "Requests Sent" ====================
function renderRequestsSent(requests) {
  const container = document.getElementById('requestsSentList');

  if (requests.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📤</div>
        <h3>No outgoing exchange requests</h3>
        <p>Browse campus skills and send a proposal to start learning!</p>
        <a href="/explore.html" class="btn btn-primary btn-sm">Explore Skills</a>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => {
    const statusClass = `status-${req.status.toLowerCase()}`;

    return `
      <div class="request-card">
        <div class="request-card-header">
          <div class="request-info">
            <h3>Skill: ${req.skillTitle}</h3>
            <p>Offered by: <strong>${req.ownerName}</strong></p>
            <div class="request-message">Your proposal: "${req.message}"</div>
            <small>Requested on ${formatDate(req.createdAt)}</small>
          </div>
          <span class="request-status ${statusClass}">${req.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== Update Request Status ====================
async function updateRequestStatus(requestId, status) {
  try {
    await apiCall(`/api/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`Request status updated to: ${status}`, 'success');
    loadDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==================== Delete Skill ====================
async function deleteSkill(skillId) {
  if (!confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
    return;
  }

  try {
    await apiCall(`/api/skills/${skillId}`, {
      method: 'DELETE'
    });
    showToast('Skill deleted successfully', 'success');
    loadDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==================== Edit Skill Modal ====================
async function openEditModal(skillId) {
  try {
    const skill = await apiCall(`/api/skills/${skillId}`);

    document.getElementById('editSkillId').value = skill._id;
    document.getElementById('editTitle').value = skill.title;
    document.getElementById('editDescription').value = skill.description;
    document.getElementById('editCategory').value = skill.category;
    document.getElementById('editLevel').value = skill.level;
    document.getElementById('editAvailability').value = skill.availability;
    document.getElementById('editDuration').value = skill.duration;
    document.getElementById('editCredits').value = skill.credits;

    document.getElementById('editModal').style.display = 'flex';
  } catch (err) {
    showToast('Failed to load skill details', 'error');
  }
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  document.getElementById('editSkillForm').reset();
}

// Handle Edit Form Submission
document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('editSkillForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const skillId = document.getElementById('editSkillId').value;
      const updatedData = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        category: document.getElementById('editCategory').value,
        level: document.getElementById('editLevel').value,
        availability: document.getElementById('editAvailability').value.trim(),
        duration: document.getElementById('editDuration').value.trim(),
        credits: Number(document.getElementById('editCredits').value)
      };

      try {
        await apiCall(`/api/skills/${skillId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedData)
        });

        showToast('Skill updated successfully! ✨', 'success');
        closeEditModal();
        loadDashboard();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Close modal when clicking outside
  const editModalOverlay = document.getElementById('editModal');
  if (editModalOverlay) {
    editModalOverlay.addEventListener('click', (e) => {
      if (e.target === editModalOverlay) closeEditModal();
    });
  }

  // Initial load
  loadDashboard();
});
