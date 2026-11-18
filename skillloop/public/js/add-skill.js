// public/js/add-skill.js - Form validation and submission for posting a new skill

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addSkillForm');
  
  // Pre-fill owner name if user previously selected or saved a profile name
  const savedUser = localStorage.getItem('skillloop_user') || 'Rahul Sharma';
  const ownerInput = document.getElementById('ownerName');
  if (ownerInput && !ownerInput.value) {
    ownerInput.value = savedUser;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Retrieve form inputs
      const ownerName = document.getElementById('ownerName').value.trim();
      const title = document.getElementById('skillTitle').value.trim();
      const description = document.getElementById('skillDescription').value.trim();
      const category = document.getElementById('skillCategory').value;
      const level = document.getElementById('skillLevel').value;
      const availability = document.getElementById('skillAvailability').value.trim();
      const duration = document.getElementById('skillDuration').value.trim();
      const credits = Number(document.getElementById('skillCredits').value);

      // Validation
      if (!ownerName || !title || !description || !category || !level || !availability || !duration || isNaN(credits)) {
        showToast('Please fill out all required fields marked with *', 'warning');
        return;
      }

      if (credits < 1 || credits > 100) {
        showToast('Credits must be a number between 1 and 100', 'warning');
        return;
      }

      const payload = {
        ownerName,
        title,
        description,
        category,
        level,
        availability,
        duration,
        credits
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Posting Skill... ⏳';
      submitBtn.disabled = true;

      try {
        await apiCall('/api/skills', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // Remember user name
        localStorage.setItem('skillloop_user', ownerName);

        showToast('🎉 Skill posted successfully! Redirecting to Explore...', 'success');
        form.reset();

        // Redirect to explore page after short delay so toast is seen
        setTimeout(() => {
          window.location.href = '/explore.html';
        }, 1500);

      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
