// js/ui.js
// Handles UI interactions like Accordions and visual updates

document.addEventListener('DOMContentLoaded', () => {
  // Accordion Logic is already handled by inline onclick in HTML,
  // but we can enhance it or move it here for cleaner separation.

  const solutionHeaders = document.querySelectorAll('.solution-header');

  solutionHeaders.forEach(header => {
    // Remove inline onclick to keep JS separate
    header.removeAttribute('onclick');

    header.addEventListener('click', function() {
      const body = this.nextElementSibling;
      const arrow = this.querySelector('div:last-child');

      body.classList.toggle('active');

      if (body.classList.contains('active')) {
        arrow.textContent = '▼';
      } else {
        arrow.textContent = '▶';
      }
    });
  });

  // Example: formatting currency inputs
  const formatCurrencyInput = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value) {
      value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      input.value = value;
    }
  };

  // Future implementation: automatic Bitrix24 Placeholders sync
  // Whenever the user types in an input that represents {{EMPRESA}}, we could
  // sync all other occurrences if there were multiple ones dynamically.
});
