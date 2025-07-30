// Sticky nav active link highlighting and smooth scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function onScroll() {
  let scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Fade-in/slide-in animations on scroll
function revealOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in, .project-card');
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', () => {
  revealOnScroll();
  onScroll();

  // Mobile navbar toggle
  const navbarToggle = document.getElementById('navbar-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navbarToggle && navLinks) {
    navbarToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('open');
      navbarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close menu when a link is clicked (mobile UX)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navbarToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero CTA buttons
  const viewProjectsBtn = document.getElementById('view-projects-btn');
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', function() {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        window.scrollTo({
          top: projectsSection.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  }
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', function() {
      const link = document.createElement('a');
      link.href = 'assets/resume.pdf';
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Contact form functionality
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
});

// Contact form handler
function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Basic validation
  if (!name || !email || !message) {
    showNotification('Please fill in all fields.', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = e.target.querySelector('.send-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="send-icon">⏳</span> Sending...';
  submitBtn.disabled = true;
  
  // Try to send via EmailJS first (if configured), otherwise fallback to mailto
  if (typeof emailjs !== 'undefined') {
    // EmailJS implementation
    emailjs.send('service_9ra42p8', '__ejs-test-mail-service__', {
      from_name: name,
      from_email: email,
      message: message
    })
    .then(() => {
      showNotification('Message sent successfully!', 'success');
      e.target.reset();
    })
    .catch(() => {
      // Fallback to mailto
      sendViaMailto(name, email, message);
    })
    .finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  } else {
    // Direct mailto fallback
    sendViaMailto(name, email, message);
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Send via mailto (fallback method)
function sendViaMailto(name, email, message) {
  const mailtoLink = `mailto:saiaashish28@gmail.com?subject=${encodeURIComponent('Contact from Portfolio')}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;
  
  window.open(mailtoLink);
  showNotification('Opening email client...', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--card-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    color: var(--text-main);
    font-size: 14px;
    z-index: 10000;
    box-shadow: var(--card-shadow);
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  notification.querySelector('.notification-content').style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  notification.querySelector('.notification-icon').style.cssText = `
    font-size: 18px;
    flex-shrink: 0;
  `;
  
  notification.querySelector('.notification-message').style.cssText = `
    flex: 1;
    line-height: 1.4;
  `;
  
  notification.querySelector('.notification-close').style.cssText = `
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  `;
  
  notification.querySelector('.notification-close').addEventListener('mouseenter', function() {
    this.style.background = 'rgba(255, 255, 255, 0.1)';
    this.style.color = 'var(--text-main)';
  });
  
  notification.querySelector('.notification-close').addEventListener('mouseleave', function() {
    this.style.background = 'none';
    this.style.color = 'var(--text-secondary)';
  });
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .notification-success .notification-icon { color: #10b981; }
    .notification-error .notification-icon { color: #ef4444; }
    .notification-info .notification-icon { color: #3b82f6; }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'info': return 'ℹ';
    default: return 'ℹ';
  }
}

// Optional: Animate skill bars on scroll
function animateSkills() {
  const skills = document.querySelectorAll('.skill-level');
  skills.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      bar.style.width = bar.style.width;
    }
  });
}
window.addEventListener('scroll', animateSkills); 