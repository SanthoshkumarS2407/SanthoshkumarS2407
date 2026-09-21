/**
 * SANTHOSHKUMAR S — PORTFOLIO JAVASCRIPT ENGINE
 * Handles dynamic interactions, terminal simulator, canvas animations,
 * project filters, theme toggles, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initCustomCursor();
  initNavbarScroll();
  initTypewriter();
  initProjectFilters();
  initProjectModals();
  initTerminal();
  initContactForm();
  initCopyButtons();
  initYear();
});

/* ==========================================================================
   1. THEME TOGGLER (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('santhosh_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('santhosh_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

/* ==========================================================================
   2. INTERACTIVE BACKGROUND CANVAS (Constellation / Network Particles)
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      const warmColors = ['#f59e0b', '#fb7185', '#38bdf8', '#a855f7'];
      this.baseColor = warmColors[Math.floor(Math.random() * warmColors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse attraction / interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.2;
          this.y -= (dy / dist) * force * 2.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.14})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline || window.innerWidth < 992) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    outline.style.left = `${e.clientX}px`;
    outline.style.top = `${e.clientY}px`;
  });

  const interactives = document.querySelectorAll('a, button, input, textarea, .card-glass, .quick-cmd');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
      outline.style.borderColor = 'var(--accent-cyan)';
      outline.style.background = 'rgba(0, 242, 254, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.borderColor = 'rgba(0, 242, 254, 0.5)';
      outline.style.background = 'transparent';
    });
  });
}

/* ==========================================================================
   4. NAVBAR SCROLL & ACTIVE SPY
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Spy
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   5. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typeTarget = document.getElementById('typewriter-text');
  if (!typeTarget) return;

  const words = [
    'Software Engineer.',
    'Full-Stack Developer.',
    'IoT Safety Innovator.',
    'B.Tech IT Student @ VSB.',
    'Passionate Problem Solver.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typeTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typeTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause after full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   6. PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT ARCHITECTURE MODALS
   ========================================================================== */
const projectDetails = {
  'smart-helmet': {
    title: 'Smart Helmet IoT Safety System',
    category: 'Hardware & IoT Safety Solution',
    tech: 'Arduino Uno, MQ-3 Alcohol Sensor, IR Sensor, GSM SIM800L, Neo-6M GPS, C++',
    diagram: `[ IR Sensor (Helmet Check) ] ----+
                                  |---> [ Arduino Uno MCU ] ---> [ Relay Ignition Cutoff ]
[ MQ-3 Sensor (Alcohol Check) ] --+           |
                                              +---> [ GSM/GPS Module ] ---> [ SMS Emergency Dispatch ]`,
    points: [
      'Engineered automated helmet-detection logic requiring rider verification before enabling vehicle engine ignition.',
      'Calibrated MQ-3 gas sensor array with dynamic thresholding to detect alcohol concentration in rider breath samples.',
      'Configured piezoelectric impact/vibration sensor to trigger instant coordinate lookup via Neo-6M GPS.',
      'Integrated SIM800L GSM transceiver to format emergency SMS alerts containing Google Maps location links to designated contacts and emergency services.'
    ]
  },
  'digital-village': {
    title: 'Digital Village Learning Platform for Rural Schools',
    category: 'Full-Stack EdTech Architecture',
    tech: 'React.js, Node.js, Express.js, MongoDB, JWT, Cloudinary Media API',
    diagram: `[ React Frontend (Low-Bandwidth UI) ] <---> [ REST API Gateway (Express / Node.js) ]
                     |                                         |
            [ Cloudinary CDN ]                        [ JWT Auth & Role Access ]
         (Adaptive Video/PDF Media)                            |
                                                      [ MongoDB Database ]`,
    points: [
      'Architected a resilient full-stack learning platform optimized specifically for rural areas with erratic network conditions.',
      'Secured backend endpoints with JSON Web Token (JWT) role-based authorization for students, teachers, and admins.',
      'Integrated Cloudinary media optimization pipeline to transcode educational video streams into low-bitrate adaptive chunks.',
      'Implemented offline cache strategies for course notes, interactive quizzes, and assignment progress tracking.'
    ]
  },
  'public-crm': {
    title: 'Public CRM Management Application',
    category: 'Enterprise Client Relationship Platform',
    tech: 'React.js, Node.js, MongoDB, Express.js, HTML5, CSS3, Chart.js',
    diagram: `[ React Single Page App ] <---> [ Express REST Controller ] <---> [ MongoDB Cluster ]
           |                                  |
    [ Visual Charts ]               [ Session Security & Auth ]
 (Leads / Pipelines / KPIs)         (Granular Team Roles)`,
    points: [
      'Developed end-to-end customer relationship management pipelines with full CRUD capabilities for leads, contacts, and deals.',
      'Implemented real-time visual dashboards illustrating conversion ratios, agent velocity, and performance KPIs.',
      'Engineered granular multi-tier role permissions and secure session handling across organizational divisions.',
      'Designed indexed MongoDB collections ensuring sub-50ms response times for large contact datasets.'
    ]
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetails[projectId];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="arch-header">
          <span class="arch-tag">${data.category}</span>
          <h3 class="arch-title">${data.title}</h3>
        </div>
        <p><strong>Technologies:</strong> <span class="term-cyan">${data.tech}</span></p>
        
        <h4 class="arch-section-title"><i class="fa-solid fa-diagram-project"></i> Architecture Diagram</h4>
        <pre class="arch-diagram"><code>${data.diagram}</code></pre>

        <h4 class="arch-section-title"><i class="fa-solid fa-list-check"></i> Key Engineering Highlights</h4>
        <ul class="arch-list">
          ${data.points.map((p) => `<li>${p}</li>`).join('')}
        </ul>

        <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
          <a href="https://github.com/SanthoshkumarS2407" target="_blank" class="btn btn-sm btn-primary">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
        </div>
      `;

      modal.classList.remove('hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
}

/* ==========================================================================
   8. INTERACTIVE CLI TERMINAL ENGINE
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const clearBtn = document.getElementById('clear-term-btn');
  const quickBtns = document.querySelectorAll('.quick-cmd');
  const body = document.getElementById('terminal-body');

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: `Available commands:
  • whoami       : Summary about Santhoshkumar S
  • skills       : List technical and professional skillsets
  • projects     : Showcase major software & IoT projects
  • education    : Academic qualifications & scores
  • certs        : Professional certifications
  • cat resume   : View resume overview & download link
  • sudo hire    : Submit interview / hiring request
  • contact      : Direct contact details
  • clear        : Clear the terminal screen
  • date         : Current date and time`,

    whoami: `Santhoshkumar S — Software Engineer & B.Tech IT student at VSB Engineering College, Karur.
Passionate about Full-Stack Development (React, Node.js, MongoDB), Python, Java, and IoT Solutions.
CGPA: 8.00 | Location: Dharapuram, Tamil Nadu, India.`,

    skills: `Technical Skills:
  [Languages]   : Python, Java, SQL, JavaScript (ES6+)
  [Web & DB]    : React.js, Node.js, MongoDB, Express, HTML5, CSS3, RESTful APIs, JWT
  [Tools]       : Git, GitHub, VS Code, Cloudinary API, Arduino IDE
  [UI/UX]       : Figma, Wireframing, Responsive Design, User Interface Design
  [Core]        : Problem Solving, Analytical Thinking, Collaboration, Adaptability`,

    projects: `Featured Projects:
  1. Smart Helmet IoT Safety System (Arduino, IR, MQ-3, GSM/GPS)
  2. Digital Village Learning Platform for Rural Schools (React, Node, MongoDB, JWT)
  3. Public CRM Management Application (React, Node, MongoDB, Analytics)`,

    education: `Education:
  • B.Tech Information Technology (2024 - 2028)
    VSB Engineering College, Karur | CGPA: 8.00
  • HSC Tamil Nadu State Board (2023 - 2024) | Score: 84.3%
    Bharathi Vidhyalaya Hr Sec School, Mulanur
  • SSLC Tamil Nadu State Board (2021 - 2022) | Score: 87.4%
    Bharathi Vidhyalaya Hr Sec School, Mulanur`,

    certs: `Certifications:
  • Programming Using Java — Infosys Springboard
  • Introduction to Internet of Things — Cisco Networking Academy
  • Becoming an Agentforce Champion — Salesforce`,

    'cat resume': `[RESUME] Santhoshkumar_S_Resume_Final.pdf
Role: Software Engineer | B.Tech IT
Email: writetokumarsanthosh@gmail.com | Phone: +91 9487528706
Click the 'Resume' button in the navigation header or download directly: <a href="resume.pdf" target="_blank" style="color:#00f2fe; text-decoration:underline;">resume.pdf</a>`,

    'sudo hire': `🚀 Initializing Interview & Offer Protocol...
[STATUS]: ACCESS GRANTED!
Thank you for your interest! Please shoot an email directly to writetokumarsanthosh@gmail.com or call +91 9487528706 to schedule an interview!`,

    contact: `Contact Channels:
  • Email: writetokumarsanthosh@gmail.com
  • Phone: +91 9487528706
  • GitHub: https://github.com/SanthoshkumarS2407
  • LinkedIn: https://linkedin.com/in/santhoshkumar-s-137b44377
  • Location: Dharapuram, Tamil Nadu, India`,

    date: () => new Date().toString()
  };

  function executeCommand(cmdText) {
    const rawCmd = cmdText.trim();
    const cleanCmd = rawCmd.toLowerCase();

    if (!rawCmd) return;

    history.push(rawCmd);
    historyIndex = history.length;

    if (cleanCmd === 'clear') {
      output.innerHTML = '';
      input.value = '';
      return;
    }

    let response = commands[cleanCmd];
    if (typeof response === 'function') {
      response = response();
    } else if (!response) {
      response = `command not found: "${rawCmd}". Type 'help' to see all available commands.`;
    }

    const entry = document.createElement('div');
    entry.className = 'term-entry';
    entry.innerHTML = `
      <div class="term-cmd-history"><span style="color:#34d399;">santhosh@portfolio:~$</span> ${escapeHtml(rawCmd)}</div>
      <div class="term-res">${response}</div>
    `;

    output.appendChild(entry);
    input.value = '';
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  clearBtn.addEventListener('click', () => {
    output.innerHTML = '';
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      input.value = cmd;
      executeCommand(cmd);
    });
  });
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* ==========================================================================
   9. CONTACT FORM & FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please fill out all required fields.';
      feedback.classList.remove('hidden');
      return;
    }

    // Submit state animation
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Preparing message...`;

    setTimeout(() => {
      // Create mailto fallback link
      const mailtoUrl = `mailto:writetokumarsanthosh@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `✅ Thank you <strong>${escapeHtml(
        name
      )}</strong>! Your email client is opening to deliver this message directly to Santhosh. You can also reach him at <a href="mailto:writetokumarsanthosh@gmail.com" style="text-decoration:underline;">writetokumarsanthosh@gmail.com</a>.`;
      feedback.classList.remove('hidden');

      // Trigger mailto link
      window.location.href = mailtoUrl;

      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>`;
      form.reset();
    }, 900);
  });
}

/* ==========================================================================
   10. COPY BUTTONS & TOAST
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        });
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

/* ==========================================================================
   11. DYNAMIC YEAR
   ========================================================================== */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
