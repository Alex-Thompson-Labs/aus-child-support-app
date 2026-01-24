/***
 * AUS Child Support - Lead Qualification Chatbot Widget
 * Zero dependencies - Vanilla JavaScript
 * Lazy-loaded for optimal Core Web Vitals
 * 
 * Decision Tree Logic - No open-ended text input to prevent
 * accidental legal advice.
 */
(function () {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    calculatorUrl: 'https://auschildsupport.com',
    generalInfoUrl: 'https://auschildsupport.com/blog',

    // ROUTING: Specific Forms for different lead types
    forms: {
      // Standard General Inquiry
      standard: 'https://auschildsupport.com/lawyer-inquiry?mode=direct',
      // Hidden Income / Forensic Accounting
      hiddenIncome: 'https://auschildsupport.com/lawyer-inquiry?mode=direct&reason=hidden_income',
      // Binding Child Support Agreements
      agreements: 'https://auschildsupport.com/lawyer-inquiry?mode=direct&reason=binding_agreement',
      // Special Circumstances (Direct to landing page/form)
      special: 'https://auschildsupport.com/special-circumstances'
    },

    primaryColor: '#1e40af',      // Professional blue
    primaryHover: '#1e3a8a',
    secondaryColor: '#3b82f6',
    lightBg: '#eff6ff',
    borderColor: '#bfdbfe',
    textDark: '#1e293b',
    textMuted: '#64748b',
    white: '#ffffff'
  };

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  let state = {
    isOpen: false,
    isLoaded: false,
    currentPath: 'main',
    qualifyingAnswers: {}
  };

  // ============================================
  // DECISION TREE STRUCTURE
  // ============================================
  const DECISION_TREE = {
    main: {
      message: "Hi there! 👋 I'm here to help you navigate Australian Child Support. What would you like to do today?",
      options: [
        { id: 'estimate', label: '💰 Estimate My Payments', action: 'external', url: CONFIG.calculatorUrl },
        { id: 'lawyer', label: '⚖️ Find a Lawyer', action: 'navigate', target: 'lawyer_q1' },
        { id: 'info', label: '📚 General Information', action: 'navigate', target: 'info_menu' },
        { id: 'already_have', label: '🔄 I Have An Assessment', action: 'navigate', target: 'existing_menu' }
      ]
    },

    // LAWYER QUALIFICATION PATH
    lawyer_q1: {
      message: "Great, I can help connect you with a family lawyer. First, a quick question:",
      question: "Do you currently have a parenting plan or court order in place?",
      options: [
        { id: 'yes', label: 'Yes, I have one', action: 'navigate', target: 'lawyer_q2', answer: true },
        { id: 'no', label: 'No, not yet', action: 'navigate', target: 'lawyer_q2', answer: false },
        { id: 'unsure', label: "I'm not sure", action: 'navigate', target: 'lawyer_q2', answer: 'unsure' },
        { id: 'back', label: '← Back', action: 'navigate', target: 'main' }
      ],
      qualifier: 'hasParentingPlan'
    },

    // TRIAGE STEP: Routing to specific forms
    lawyer_q2: {
      message: "Thanks. One more question to help us match you with the right specialist:",
      question: "What is your main goal right now?",
      options: [
        { id: 'income', label: '🔍 Ex hiding income / Unfair assessment', action: 'navigate', target: 'qualified_income', answer: 'income' },
        { id: 'agree', label: '📝 Make or change an agreement', action: 'navigate', target: 'qualified_agreement', answer: 'agreement' },
        { id: 'special', label: '⚠️ Special Circumstances / Appeal', action: 'navigate', target: 'qualified_special', answer: 'special' },
        { id: 'other', label: '⚖️ General Legal Advice', action: 'navigate', target: 'qualified_standard', answer: 'general' },
        { id: 'back', label: '← Back', action: 'navigate', target: 'lawyer_q1' }
      ],
      qualifier: 'assessmentType'
    },

    // --- SUCCESS SCREEN 1: HIDDEN INCOME ---
    qualified_income: {
      message: "We have specialists who are experts in forensic accounting and uncovering hidden income.",
      summary: true,
      options: [
        { id: 'contact', label: '🕵️ Talk to an Income Specialist', action: 'external', url: CONFIG.forms.hiddenIncome, primary: true },
        { id: 'back', label: '← Back', action: 'navigate', target: 'lawyer_q2' }
      ]
    },

    // --- SUCCESS SCREEN 2: AGREEMENTS ---
    qualified_agreement: {
      message: "Binding Child Support Agreements require specific legal wording to be valid. We can help draft this correctly.",
      summary: true,
      options: [
        { id: 'contact', label: '📝 Start Agreement Process', action: 'external', url: CONFIG.forms.agreements, primary: true },
        { id: 'back', label: '← Back', action: 'navigate', target: 'lawyer_q2' }
      ]
    },

    // --- SUCCESS SCREEN 3: SPECIAL CIRCUMSTANCES ---
    qualified_special: {
      message: "Special Circumstances applications are complex. We can connect you with a lawyer who handles these appeals.",
      summary: true,
      options: [
        { id: 'contact', label: '⚠️ Review Special Circumstances', action: 'external', url: CONFIG.forms.special, primary: true },
        { id: 'back', label: '← Back', action: 'navigate', target: 'lawyer_q2' }
      ]
    },

    // --- SUCCESS SCREEN 4: STANDARD ---
    qualified_standard: {
      message: "Perfect! Based on your answers, we can connect you with a family lawyer who specializes in child support matters.",
      summary: true,
      options: [
        { id: 'contact', label: '📞 Contact Us Now', action: 'external', url: CONFIG.forms.standard, primary: true },
        { id: 'back', label: '← Back', action: 'navigate', target: 'lawyer_q2' }
      ]
    },

    // GENERAL INFO PATH
    info_menu: {
      message: "Here are some popular resources to get you started:",
      options: [
        { id: 'basics', label: '📖 Child Support Basics', action: 'external', url: 'https://auschildsupport.com/blog/child-support-formula-australia' },
        { id: 'calculator', label: '🧮 Use Our Calculator', action: 'external', url: CONFIG.calculatorUrl },
        { id: 'care', label: '👨‍👩‍👧 Care Percentage Guide', action: 'external', url: 'https://auschildsupport.com/blog/child-support-care-percentage-table' },
        { id: 'back', label: '← Back to Menu', action: 'navigate', target: 'main' }
      ]
    },

    // EXISTING ASSESSMENT PATH
    existing_menu: {
      message: "If you already have a child support assessment, here's how I can help:",
      options: [
        { id: 'check', label: '✅ Check My Estimate', action: 'external', url: CONFIG.calculatorUrl },
        { id: 'change', label: '📝 Change of Assessment', action: 'navigate', target: 'lawyer_q1' },
        { id: 'review', label: '🔍 Review Options', action: 'external', url: CONFIG.generalInfoUrl },
        { id: 'back', label: '← Back to Menu', action: 'navigate', target: 'main' }
      ]
    }
  };

  // ============================================
  // STYLES (Injected lazily)
  // ============================================
  const STYLES = `
.auscsc-widget-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4);
  z-index: 999998;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auscsc-widget-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(30, 64, 175, 0.5);
}

.auscsc-widget-trigger svg {
  width: 28px;
  height: 28px;
  fill: ${CONFIG.white};
}

.auscsc-widget-trigger.open svg.chat-icon { display: none; }
.auscsc-widget-trigger.open svg.close-icon { display: block; }
.auscsc-widget-trigger:not(.open) svg.chat-icon { display: block; }
.auscsc-widget-trigger:not(.open) svg.close-icon { display: none; }

.auscsc-chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 360px;
  max-width: calc(100vw - 40px);
  height: 500px;
  max-height: calc(100vh - 120px);
  background: ${CONFIG.white};
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.auscsc-chat-window.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.auscsc-chat-header {
  background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
  color: ${CONFIG.white};
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.auscsc-chat-header-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auscsc-chat-header-icon svg {
  width: 24px;
  height: 24px;
  fill: ${CONFIG.white};
}

.auscsc-chat-header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.auscsc-chat-header-text p {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.auscsc-chat-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: ${CONFIG.lightBg};
}

.auscsc-message {
  background: ${CONFIG.white};
  border: 1px solid ${CONFIG.borderColor};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: ${CONFIG.textDark};
  animation: auscsc-fadeIn 0.3s ease;
}

.auscsc-message.question {
  background: ${CONFIG.lightBg};
  border-left: 3px solid ${CONFIG.secondaryColor};
  font-weight: 500;
  margin-top: 8px;
}

.auscsc-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.auscsc-option-btn {
  background: ${CONFIG.white};
  border: 2px solid ${CONFIG.borderColor};
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${CONFIG.textDark};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auscsc-option-btn:hover {
  border-color: ${CONFIG.secondaryColor};
  background: ${CONFIG.lightBg};
  transform: translateX(4px);
}

.auscsc-option-btn.primary {
  background: ${CONFIG.primaryColor};
  color: ${CONFIG.white};
  border-color: ${CONFIG.primaryColor};
}

.auscsc-option-btn.primary:hover {
  background: ${CONFIG.primaryHover};
  border-color: ${CONFIG.primaryHover};
}

.auscsc-summary {
  background: ${CONFIG.lightBg};
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  font-size: 13px;
}

.auscsc-summary-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: ${CONFIG.textMuted};
}

.auscsc-summary-item span:last-child {
  font-weight: 500;
  color: ${CONFIG.textDark};
}

.auscsc-chat-footer {
  padding: 10px 16px;
  background: #fef3c7;
  border-top: 1px solid #fcd34d;
  font-size: 11px;
  color: #92400e;
  text-align: center;
  line-height: 1.4;
}

.auscsc-chat-footer strong {
  display: block;
  margin-bottom: 2px;
}

@keyframes auscsc-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 400px) {
  .auscsc-chat-window {
    bottom: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    height: calc(100vh - 80px);
    max-height: none;
    border-radius: 16px 16px 0 0;
  }
  
  .auscsc-widget-trigger {
    bottom: 12px;
    right: 12px;
  }
}
`;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  function injectStyles() {
    if (document.getElementById('auscsc-widget-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'auscsc-widget-styles';
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  function createTriggerButton() {
    const trigger = document.createElement('button');
    trigger.className = 'auscsc-widget-trigger';
    trigger.setAttribute('aria-label', 'Open chat assistant');
    trigger.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
        <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `;
    trigger.addEventListener('click', toggleChat);
    document.body.appendChild(trigger);
    return trigger;
  }

  function createChatWindow() {
    const chatWindow = document.createElement('div');
    chatWindow.className = 'auscsc-chat-window';
    chatWindow.id = 'auscsc-chat-window';
    chatWindow.innerHTML = `
      <div class="auscsc-chat-header">
        <div class="auscsc-chat-header-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div class="auscsc-chat-header-text">
          <h3>AUS Child Support</h3>
          <p>We're here to help</p>
        </div>
      </div>
      <div class="auscsc-chat-body" id="auscsc-chat-body"></div>
      <div class="auscsc-chat-footer">
        <strong>⚠️ General Information Only</strong>
        This tool provides general guidance only. It is not legal advice. Please consult a qualified professional for advice specific to your situation.
      </div>
    `;
    document.body.appendChild(chatWindow);
    return chatWindow;
  }

  function renderNode(nodeKey) {
    const node = DECISION_TREE[nodeKey];
    if (!node) return;

    state.currentPath = nodeKey;
    const body = document.getElementById('auscsc-chat-body');
    body.innerHTML = '';

    // Message
    const msgEl = document.createElement('div');
    msgEl.className = 'auscsc-message';
    msgEl.textContent = node.message;
    body.appendChild(msgEl);

    // Question (if exists)
    if (node.question) {
      const qEl = document.createElement('div');
      qEl.className = 'auscsc-message question';
      qEl.textContent = node.question;
      body.appendChild(qEl);
    }

    // Summary (for qualified leads)
    if (node.summary && Object.keys(state.qualifyingAnswers).length > 0) {
      const summaryEl = document.createElement('div');
      summaryEl.className = 'auscsc-summary';
      
      const items = [
        { label: 'Parenting Plan', value: formatAnswer(state.qualifyingAnswers.hasParentingPlan) },
        { label: 'Assessment Type', value: formatAnswer(state.qualifyingAnswers.assessmentType) }
      ];

      items.forEach(item => {
        if (item.value) {
          const itemEl = document.createElement('div');
          itemEl.className = 'auscsc-summary-item';
          itemEl.innerHTML = `<span>${item.label}:</span><span>${item.value}</span>`;
          summaryEl.appendChild(itemEl);
        }
      });

      body.appendChild(summaryEl);
    }

    // Options
    const optionsEl = document.createElement('div');
    optionsEl.className = 'auscsc-options';

    node.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'auscsc-option-btn' + (option.primary ? ' primary' : '');
      btn.textContent = option.label;
      btn.addEventListener('click', () => handleOptionClick(option, node));
      optionsEl.appendChild(btn);
    });

    body.appendChild(optionsEl);
  }

  function formatAnswer(answer) {
    if (answer === true) return 'Yes';
    if (answer === false) return 'No';
    if (answer === 'unsure') return 'Not sure';
    if (answer === 'income') return 'Hidden Income';
    if (answer === 'agreement') return 'Agreement';
    if (answer === 'special') return 'Special/Appeal';
    if (answer === 'general') return 'General Advice';
    return answer || null;
  }

  function handleOptionClick(option, currentNode) {
    // 1. Save the answer for the current step
    if (currentNode.qualifier && option.answer !== undefined) {
      state.qualifyingAnswers[currentNode.qualifier] = option.answer;
    }

    switch (option.action) {
      case 'navigate':
        renderNode(option.target);
        break;

      case 'external':
        // Check if this is one of our internal inquiry forms
        const isForm = option.url && (
          option.url.includes('lawyer-inquiry') || 
          option.url.includes('special-circumstances')
        );

        if (isForm) {
          // --- STEP A: Get Base URL ---
          let finalUrl = option.url;
          const separator = finalUrl.includes('?') ? '&' : '?';
          finalUrl += separator;

          // --- STEP B: Pack User Answers into URL ---
          const answersParams = Object.keys(state.qualifyingAnswers)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(state.qualifyingAnswers[key])}`)
            .join('&');

          if (answersParams) {
            finalUrl += answersParams + '&';
          }

          // --- STEP C: Add Return URL ---
          const currentBlogPage = encodeURIComponent(window.location.href);
          finalUrl += `returnTo=${currentBlogPage}`;

          // --- STEP D: Go there ---
          window.location.href = finalUrl;
        } else {
          // External links (Calculator, etc.)
          window.open(option.url, '_blank', 'noopener,noreferrer');
        }
        break;
    }
  }

  function toggleChat() {
    state.isOpen = !state.isOpen;
    const trigger = document.querySelector('.auscsc-widget-trigger');
    const chatWindow = document.getElementById('auscsc-chat-window');

    if (state.isOpen) {
      trigger.classList.add('open');
      trigger.setAttribute('aria-label', 'Close chat assistant');

      // Lazy-load chat window on first open
      if (!state.isLoaded) {
        createChatWindow();
        state.isLoaded = true;

        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          document.getElementById('auscsc-chat-window').classList.add('open');
          renderNode('main');
        });
      } else {
        chatWindow.classList.add('open');
      }
    } else {
      trigger.classList.remove('open');
      trigger.setAttribute('aria-label', 'Open chat assistant');
      chatWindow.classList.remove('open');
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Prevent double-loading
    if (document.querySelector('.auscsc-widget-trigger')) return;

    // Only inject styles when trigger is created (minimal initial load)
    injectStyles();
    createTriggerButton();
  }

  // ============================================
  // PERFORMANCE: DELAY UNTIL INTERACTION
  // ============================================
  function loadOnInteraction() {
    init();
    // Remove listeners so we don't keep firing this function
    const events = ['mouseover', 'keydown', 'touchmove', 'touchstart', 'wheel'];
    events.forEach(event => window.removeEventListener(event, loadOnInteraction));
  }

  // Add passive listeners for user interaction
  const events = ['mouseover', 'keydown', 'touchmove', 'touchstart', 'wheel'];
  events.forEach(event => {
    window.addEventListener(event, loadOnInteraction, { passive: true });
  });

  // Fallback: Load automatically after 4 seconds if no interaction occurs
  setTimeout(init, 4000);
})();
