/**
 * Tip Calculator Logic
 * Assessment: Form inputs, arithmetic calculation, live updates, and division-by-zero validation.
 */

// DOM Elements
const billInput = document.getElementById('bill');
const tipButtons = document.querySelectorAll('.tip-btn');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('people');
const peopleWrap = document.getElementById('people-wrap');
const peopleError = document.getElementById('people-error');
const currencySelect = document.getElementById('currency-select');
const currencySymbol = document.getElementById('currency-symbol');

// Output Elements
const tipPerPersonDisplay = document.getElementById('tip-per-person');
const totalPerPersonDisplay = document.getElementById('total-per-person');
const totalTipDisplay = document.getElementById('total-tip');
const grandTotalDisplay = document.getElementById('grand-total');
const resetBtn = document.getElementById('reset-btn');

// State
let selectedTipPercent = 15; // Default preset (15%)
let activeCurrency = currencySelect ? currencySelect.value : '₹';

/**
 * Format a numeric value to a standard two-decimal monetary string
 * @param {number} value - The numerical amount
 * @returns {string} - Formatted currency string (e.g. "₹12.50")
 */
function formatCurrency(value) {
  if (isNaN(value) || !isFinite(value) || value < 0) {
    value = 0;
  }
  return `${activeCurrency}${value.toFixed(2)}`;
}

/**
 * Trigger a subtle pulse micro-animation on output numbers
 * @param {HTMLElement} element 
 */
function animateValue(element) {
  element.classList.remove('pulse');
  // Trigger reflow to restart CSS animation
  void element.offsetWidth;
  element.classList.add('pulse');
}

/**
 * Validate inputs and calculate tip + total per person
 * Guards strictly against division by zero and invalid states.
 */
function calculateTip() {
  const billValue = parseFloat(billInput.value);
  const peopleRawValue = peopleInput.value.trim();
  const peopleCount = parseInt(peopleRawValue, 10);

  // Check if reset button should be active
  const hasValues = (billInput.value !== '') || 
                    (customTipInput.value !== '') || 
                    (peopleRawValue !== '' && peopleRawValue !== '1') || 
                    (selectedTipPercent !== 15) ||
                    (activeCurrency !== '₹');
  resetBtn.disabled = !hasValues && (billInput.value === '');

  // Guard against Division by Zero & Invalid People Count
  let isPeopleValid = true;

  if (peopleRawValue === '') {
    // Empty field before user types
    hidePeopleError();
    isPeopleValid = false;
  } else if (isNaN(peopleCount) || peopleCount <= 0) {
    // Zero or negative number of people
    showPeopleError("Can't be zero");
    isPeopleValid = false;
  } else {
    hidePeopleError();
  }

  // If bill is empty, invalid, or negative, or people count is invalid
  if (isNaN(billValue) || billValue < 0 || !isPeopleValid) {
    updateDisplay(0, 0, 0, 0);
    return;
  }

  // Compute arithmetic
  const tipPercentage = Math.max(0, selectedTipPercent);
  const totalTipAmount = billValue * (tipPercentage / 100);
  const grandTotalAmount = billValue + totalTipAmount;

  // Safe division since peopleCount >= 1
  const tipPerPerson = totalTipAmount / peopleCount;
  const totalPerPerson = grandTotalAmount / peopleCount;

  updateDisplay(tipPerPerson, totalPerPerson, totalTipAmount, grandTotalAmount);
}

/**
 * Update the DOM output fields and trigger micro-animations
 */
function updateDisplay(tipPerPerson, totalPerPerson, totalTip, grandTotal) {
  const formattedTipPerPerson = formatCurrency(tipPerPerson);
  const formattedTotalPerPerson = formatCurrency(totalPerPerson);
  const formattedTotalTip = formatCurrency(totalTip);
  const formattedGrandTotal = formatCurrency(grandTotal);

  if (tipPerPersonDisplay.textContent !== formattedTipPerPerson) {
    tipPerPersonDisplay.textContent = formattedTipPerPerson;
    animateValue(tipPerPersonDisplay);
  }

  if (totalPerPersonDisplay.textContent !== formattedTotalPerPerson) {
    totalPerPersonDisplay.textContent = formattedTotalPerPerson;
    animateValue(totalPerPersonDisplay);
  }

  totalTipDisplay.textContent = formattedTotalTip;
  grandTotalDisplay.textContent = formattedGrandTotal;
}

/**
 * Show error for number of people
 * @param {string} message 
 */
function showPeopleError(message) {
  peopleError.textContent = message;
  peopleError.classList.add('visible');
  peopleWrap.classList.add('has-error');
  peopleInput.setAttribute('aria-invalid', 'true');
}

/**
 * Clear error for number of people
 */
function hidePeopleError() {
  peopleError.classList.remove('visible');
  peopleWrap.classList.remove('has-error');
  peopleInput.removeAttribute('aria-invalid');
}

/**
 * Clear active state from preset tip buttons
 */
function clearActiveTipButtons() {
  tipButtons.forEach(btn => btn.classList.remove('active'));
}

/**
 * Set up tip percentage preset buttons
 */
tipButtons.forEach(button => {
  button.addEventListener('click', () => {
    clearActiveTipButtons();
    button.classList.add('active');
    customTipInput.value = '';
    customTipInput.classList.remove('active');
    selectedTipPercent = parseFloat(button.dataset.tip);
    calculateTip();
  });
});

/**
 * Handle custom tip percentage input
 */
customTipInput.addEventListener('input', () => {
  clearActiveTipButtons();
  const customValue = parseFloat(customTipInput.value);

  if (!isNaN(customValue) && customValue >= 0) {
    customTipInput.classList.add('active');
    selectedTipPercent = customValue;
  } else {
    customTipInput.classList.remove('active');
    selectedTipPercent = 0;
  }
  calculateTip();
});

/**
 * Listen for live updates on form inputs (MDN 'input' event)
 */
billInput.addEventListener('input', () => {
  // Prevent negative bill inputs
  if (parseFloat(billInput.value) < 0) {
    billInput.value = '0';
  }
  calculateTip();
});

peopleInput.addEventListener('input', () => {
  calculateTip();
});

/**
 * Handle currency selection change
 */
currencySelect.addEventListener('change', (e) => {
  activeCurrency = e.target.value;
  currencySymbol.textContent = activeCurrency;
  calculateTip();
});

/**
 * Reset calculator to default state
 */
resetBtn.addEventListener('click', () => {
  // Reset input values
  billInput.value = '';
  customTipInput.value = '';
  customTipInput.classList.remove('active');
  peopleInput.value = '1';
  hidePeopleError();

  // Reset tip to 15% default preset
  clearActiveTipButtons();
  const defaultTipBtn = document.querySelector('.tip-btn[data-tip="15"]');
  if (defaultTipBtn) {
    defaultTipBtn.classList.add('active');
  }
  selectedTipPercent = 15;

  // Reset currency to default INR (₹)
  if (currencySelect) {
    currencySelect.value = '₹';
  }
  if (currencySymbol) {
    currencySymbol.textContent = '₹';
  }
  activeCurrency = '₹';

  // Reset calculations
  calculateTip();
  resetBtn.disabled = true;
});

// Initial run
calculateTip();
