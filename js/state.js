// js/state.js
// Handles Auto Save, Undo, Redo, LocalStorage and History logic

const StateManager = (function() {
  const STORAGE_KEY = 'atlas_proposal_state';
  let history = [];
  let currentStep = -1;
  const MAX_HISTORY = 50;

  function saveState() {
    const inputs = document.querySelectorAll('.editable-field, [contenteditable="true"]');
    const state = {};

    inputs.forEach((el, index) => {
      const id = el.id || `field_${index}`;
      if (!el.id) el.id = id;

      if (el.tagName === 'INPUT') {
        state[id] = el.value;
      } else {
        state[id] = el.innerText;
      }
    });

    // Add to history if changed
    if (currentStep === -1 || JSON.stringify(state) !== JSON.stringify(history[currentStep])) {
      // If we are not at the end of history, truncate the future
      if (currentStep < history.length - 1) {
        history = history.slice(0, currentStep + 1);
      }

      history.push(state);
      if (history.length > MAX_HISTORY) {
        history.shift();
      } else {
        currentStep++;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('State saved automatically.');
    }
  }

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        applyState(state);

        // Initialize history with loaded state
        history = [state];
        currentStep = 0;
        console.log('State loaded from LocalStorage.');
      } catch (e) {
        console.error('Error loading state', e);
      }
    } else {
      // First save to initialize
      saveState();
    }
  }

  function applyState(state) {
    Object.keys(state).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (el.tagName === 'INPUT') {
          el.value = state[id];
        } else {
          el.innerText = state[id];
        }
      }
    });
  }

  function undo() {
    if (currentStep > 0) {
      currentStep--;
      applyState(history[currentStep]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history[currentStep]));
      console.log('Undo performed.');
    }
  }

  function redo() {
    if (currentStep < history.length - 1) {
      currentStep++;
      applyState(history[currentStep]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history[currentStep]));
      console.log('Redo performed.');
    }
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
    history = [];
    currentStep = -1;
  }

  return {
    init: function() {
      // Debounce auto-save
      let timeout;
      document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable-field') || e.target.hasAttribute('contenteditable')) {
          clearTimeout(timeout);
          timeout = setTimeout(saveState, 1000);
        }
      });

      // Keyboard shortcuts for undo/redo
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          } else if (e.key === 'y') {
            e.preventDefault();
            redo();
          }
        }
      });

      loadState();
    },
    save: saveState,
    undo: undo,
    redo: redo,
    clear: clearState
  };
})();

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', StateManager.init);
