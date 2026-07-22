// js/export.js
// Handles PDF and HTML export functionality

document.addEventListener('DOMContentLoaded', () => {
  const btnPrint = document.getElementById('btn-print');
  const btnSave = document.getElementById('btn-save');

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      // Before printing, we might want to ensure all open accordions are expanded
      // so they appear in the PDF.
      const solutionBodies = document.querySelectorAll('.solution-body');
      const wasClosed = [];

      solutionBodies.forEach((body, index) => {
        if (!body.classList.contains('active')) {
          wasClosed.push(index);
          body.classList.add('active'); // force open for print
        }
      });

      window.print();

      // Restore state after print dialog closes (setTimeout as a workaround)
      setTimeout(() => {
        solutionBodies.forEach((body, index) => {
          if (wasClosed.includes(index)) {
            body.classList.remove('active');
          }
        });
      }, 1000);
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      // Force manual save
      if (typeof StateManager !== 'undefined') {
        StateManager.save();

        // Visual feedback
        const originalText = btnSave.textContent;
        btnSave.textContent = 'Salvo!';
        btnSave.style.backgroundColor = '#28a745';
        btnSave.style.color = '#fff';

        setTimeout(() => {
          btnSave.textContent = originalText;
          btnSave.style.backgroundColor = '';
          btnSave.style.color = '';
        }, 2000);
      }
    });
  }

  // Future implementation: Duplicate proposal
  // Could clone localStorage state into a new key or generate a new HTML file string.

  // Expose a function to export HTML globally
  window.exportHTML = function() {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposta_atlas_exportada.html';
    a.click();
    URL.revokeObjectURL(url);
  };
});
