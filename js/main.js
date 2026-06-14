document.addEventListener('DOMContentLoaded', () => {
  // --- HEADER SCROLL EFFECT ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled

  // --- MOBILE MENU TOGGLE & ACCESSIBILITY ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Keyboard navigation (Enter or Space key) for accessibility
    menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isActive = menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- FAQ ACCORDION ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- INTERACTIVE ESTIMATOR (PRICING PAGE) ---
  const estimatorForm = document.getElementById('estimator-form');
  if (estimatorForm) {
    const revenueSelect = document.getElementById('business-revenue');
    const volumeSelect = document.getElementById('transaction-volume');
    const typeSelect = document.getElementById('business-type');
    const vatSelect = document.getElementById('vat-registered');
    const resultValue = document.getElementById('estimated-price-value');

    const calculateFee = () => {
      const revenueVal = revenueSelect.value;
      const volumeVal = volumeSelect.value;
      const typeVal = typeSelect.value;
      const vatVal = vatSelect.value;

      // Base fee calculation logic
      let baseFee = 3000;

      // 1. Transaction Volume multiplier
      switch (volumeVal) {
        case 'low': // < 30 transactions
          baseFee += 0;
          break;
        case 'medium': // 31-100 transactions
          baseFee += 2000;
          break;
        case 'high': // 101-200 transactions
          baseFee += 4500;
          break;
        case 'very-high': // 201-500 transactions
          baseFee += 8000;
          break;
        case 'corporate': // > 500 transactions
          baseFee += 13000;
          break;
      }

      // 2. Business Revenue adjustments
      switch (revenueVal) {
        case 'under-1m':
          baseFee += 0;
          break;
        case '1m-5m':
          baseFee += 1000;
          break;
        case '5m-10m':
          baseFee += 2500;
          break;
        case 'over-10m':
          baseFee += 5000;
          break;
      }

      // 3. Business Type multiplier (Trading and Manufacturing have more inventory/audits)
      switch (typeVal) {
        case 'service':
          baseFee = baseFee * 1.0;
          break;
        case 'trading':
          baseFee = baseFee * 1.15;
          break;
        case 'manufacturing':
          baseFee = baseFee * 1.3;
          break;
      }

      // 4. VAT Registration adds extra compliance overhead
      if (vatVal === 'yes') {
        baseFee += 1500;
      }

      // Round to nearest hundred
      const finalFee = Math.round(baseFee / 100) * 100;
      
      // Update DOM with localized currency format
      resultValue.textContent = finalFee.toLocaleString('th-TH');
    };

    // Listen to changes on inputs
    [revenueSelect, volumeSelect, typeSelect, vatSelect].forEach(select => {
      if (select) select.addEventListener('change', calculateFee);
    });

    // Run initial calculation
    calculateFee();
  }

  // --- CONTACT FORM VALIDATION & SUBMISSION MOCK (CONTACT PAGE) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const statusBox = document.getElementById('form-status');
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      
      // Clear status
      statusBox.className = 'form-status';
      statusBox.style.display = 'none';

      // Validation
      if (!name || !email || !phone || !subject || !message) {
        showStatus('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย (*) ให้ครบถ้วน', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showStatus('รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', 'error');
        return;
      }

      if (!validatePhone(phone)) {
        showStatus('เบอร์โทรศัพท์ควรเป็นตัวเลข 9-10 หลัก', 'error');
        return;
      }

      // Simulate sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่งข้อมูล...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showStatus('ส่งข้อมูลติดต่อเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อกลับหาท่านภายใน 24 ชั่วโมงทำการ', 'success');
        contactForm.reset();
      }, 1500);
    });

    const showStatus = (msg, type) => {
      statusBox.textContent = msg;
      statusBox.classList.add(type);
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validatePhone = (phone) => {
      const cleanPhone = phone.replace(/[- ]/g, '');
      const re = /^[0-9]{9,10}$/;
      return re.test(cleanPhone);
    };
  }

  // --- SCROLL ANIMATION (FADE-IN-UP) ---
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    fadeElements.forEach(el => el.classList.add('appear'));
  }
});
