# 💸 Smart Tip Calculator

A modern, responsive, and accessible client-side Tip Calculator built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed for seamless bill splitting, dynamic tip calculation, real-time recalculation, and robust defensive input validation.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features & Assessment Deliverables](#-key-features--assessment-deliverables)
- [Approach & Architecture](#-approach--architecture)
- [Project Structure](#-project-structure)
- [Deployment Configuration](#-deployment-configuration)
  - [GitHub Pages](#1-github-pages)
  - [Vercel](#2-vercel-static)
- [Rollback Strategy & Evidence](#-rollback-strategy--evidence)
- [Assessment Interview Questions & Answers](#-assessment-interview-questions--answers)
- [Outcome & Performance](#-outcome--performance)

---

## 🎯 Project Overview

This project was built to fulfill the technical assessment requirements:

- **Objective:** Practice form inputs, arithmetic operations, event handling, and conditional validation.
- **Core Stack:** HTML5 (Semantic Structure), CSS3 (Modern Vanilla Styling), JavaScript (ES6+ Client-Side Logic).
- **Strict Constraints:** Self-contained within `index.html`, `style.css`, and `script.js` without external framework dependencies.

---

## ✨ Key Features & Assessment Deliverables

| Assessment Deliverable | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Bill Amount Input** | Real-time decimal input with configurable currency symbols (`₹`, `$`, `€`, `£`, etc.). Clamps negative values. | ✅ |
| **Tip Percentage Selection** | Preset grid options (**5%**, **10%**, **15%**, **20%**, **25%**) alongside a dynamic **Custom %** input. | ✅ |
| **Number of People Input** | Integer step input with immediate division-by-zero validation and error indicator. | ✅ |
| **Live Results Display** | **Tip Amount / person** and **Total / person** updated on every keystroke (`input` event). | ✅ |
| **Division by Zero Guard** | Prevents arithmetic division when people $\le 0$, showing `"Can't be zero"` error styling while safely displaying `₹0.00`. | ✅ |
| **2-Decimal Rounding** | Financial formatting via `.toFixed(2)` preventing floating-point precision display glitches. | ✅ |
| **Interactive Reset** | Restores default state (Bill clear, 15% tip preset, 1 person, INR `₹` currency, error clears). | ✅ |

---

## 🛠 Approach & Architecture

### 1. HTML5 Architecture (`index.html`)

- **Semantic Hierarchy:** Utilizes `<main>`, `<section>`, `<header>`, `<fieldset>`, and `<legend>` for clean DOM structure.
- **Accessibility (a11y):** All inputs are explicitly bound with `<label for="...">` and unique IDs. ARIA attributes (`aria-live="polite"`, `aria-invalid="true"`, `aria-label`) ensure screen-reader clarity.
- **Mobile-Friendly Controls:** Employs `inputmode="decimal"` and `inputmode="numeric"` to trigger appropriate mobile touch keypads.

### 2. Styling System (`style.css`)

- **Modern Fintech Aesthetics:** Styled with a dark glassmorphic design system (`--bg-dark`, `--card-bg`, `--accent-primary`).
- **Tactile Micro-Animations:** Focus glow rings, hover states, active button elevation, and `.pulse` number transitions on value recalculation.
- **Zero External Font Blocking:** Built using a native modern system font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) for instant First Contentful Paint (FCP).

### 3. JavaScript Logic (`script.js`)

- **Single Source of Truth:** Centralized state variables (`selectedTipPercent`, `activeCurrency`) synchronized across inputs.
- **Event-Driven Architecture:** Listens to `input`, `click`, and `change` events across inputs to ensure instantaneous calculation without form submission delays.
- **Defensive Arithmetic Guard:**

```javascript
// Arithmetic validation guard
if (isNaN(billValue) || billValue < 0 || !isPeopleValid) {
  updateDisplay(0, 0, 0, 0);
  return;
}

const totalTip = billValue * (tipPercentage / 100);
const grandTotal = billValue + totalTip;
const tipPerPerson = totalTip / peopleCount;
const totalPerPerson = grandTotal / peopleCount;
```

---

## 📂 Project Structure

```text
Tip_Calculator/
├── index.html        # Semantic HTML5 markup, inputs, and results card
├── style.css         # Modern responsive CSS, glassmorphism, animations
├── script.js         # Real-time calculation engine, validation, and DOM handlers
└── README.md         # Deployment configs, rollback evidence, interview QA
```

---

## 🚀 Deployment Configuration

Because this project consists strictly of standard static assets, it requires **zero build steps** (`npm run build` is not required).

### 1. GitHub Pages

1. Push the repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of tip calculator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tip-calculator.git
   git push -u origin main
   ```
2. Navigate to **Repository Settings** > **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` / `root`.
4. Click **Save**. The application will be live at `https://<your-username>.github.io/tip-calculator/`.

---

### 2. Vercel (Static)

Deploy via Vercel CLI without any special configuration:

```bash
npx vercel --prod
```

Optional `vercel.json` (for custom cache headers):

```json
{
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600, must-revalidate" }
      ]
    }
  ]
}
```

---

## 🔄 Rollback Strategy & Evidence

In production continuous deployment (CD) pipelines, rollback mechanisms ensure high availability if a release introduces unexpected regressions.

### Rollback Strategy

1. **Immutable Git Versioning:** Every release is tagged with semantic versions (`v1.0.0`, `v1.0.1`).
2. **Instant Git Revert (Standard Static Deployment):**
   ```bash
   # Identify failing commit
   git log --oneline -n 5

   # Create safe revert commit (preserves history)
   git revert <failing-commit-hash> --no-edit

   # Push revert to trigger automated redeployment
   git push origin main
   ```
3. **Hard Rollback (Emergency Hotfix):**
   ```bash
   # Reset branch to known working tag/commit
   git reset --hard v1.0.0
   git push origin main --force-with-lease
   ```
4. **Hosting Provider Instant Rollback:**
   - **Vercel / Cloud CDN:** Instant 1-click rollback via dashboard or CLI (`vercel rollback <deployment-id>`) which redirects CDN traffic to the prior immutable build artifact in $< 500\text{ms}$ with zero downtime.

### Rollback Evidence Checklist

- [x] **Zero Build Dependencies:** Rollback succeeds immediately because no compiler/transpiler steps exist to fail or time out.
- [x] **Browser Cache Safety:** Static asset links do not rely on broken chunks or split hashes that would cause 404 errors during an active rollback transition.
- [x] **State Isolation:** The calculator is fully client-side and stateless; rollbacks do not require database migrations or cache flushes.

---

## 🎤 Assessment Interview Questions & Answers

### Question 1: How would you prevent division by zero?

> **Answer:**
> In JavaScript, dividing a positive number by zero yields `Infinity`, and dividing `0 / 0` yields `NaN`.
> To prevent this:
> 1. **Input Validation:** Inspect the raw value of the people input. Check if the value is empty, `isNaN`, or parsed as an integer $\le 0$.
> 2. **Conditional Guard:** When an invalid number of people is detected, do **not** execute the division. Immediately mark the input wrapper with an error class (`.has-error`), display a clear inline message (`"Can't be zero"`), and set `aria-invalid="true"`.
> 3. **Graceful Fallback:** Set the output display safely to `₹0.00` so no user sees `Infinity`, `NaN`, or an application error.

---

### Question 2: Why round monetary values to two decimals?

> **Answer:**
> 1. **Currency Representation:** Real-world fiat currencies (like Rupees, Dollars, Euros) divide their base unit into hundredths (e.g., paise, cents). A fractional monetary amount like `₹33.333333333333` cannot be paid in practice.
> 2. **IEEE 754 Floating-Point Precision:** JavaScript uses binary 64-bit floating point arithmetic. Certain decimal numbers cannot be represented precisely in binary (for example, `0.1 + 0.2 === 0.30000000000000004`). Calling `.toFixed(2)` ensures that calculation artifacts are rounded to clean, expected financial outputs.

---

### Question 3: How would you support a custom tip percentage?

> **Answer:**
> 1. **Dual Input Paradigm:** Provide fixed percentage preset buttons (5%, 10%, 15%, 20%, 25%) alongside a dedicated `<input type="number" id="custom-tip" placeholder="Custom %">`.
> 2. **Mutual Exclusion & State Sync:**
>    - When a user clicks a preset button, remove the `.active` class from other buttons, clear any value in the custom input, and store the button's `data-tip` attribute in state.
>    - When a user types into the custom input field, remove the `.active` class from all preset buttons, parse the custom input, clamp it to non-negative numbers ($\ge 0$), and update the calculation in real-time.

---

## 📊 Outcome & Performance

- **Zero Dependencies:** Pure vanilla code for maximum security, zero CVE vulnerabilities, and minimal footprint.
- **Instant Load Time:** Total bundle size is $< 25\text{ KB}$ uncompressed.
- **100% Responsive:** Tested across mobile, tablet, and desktop viewports.
- **Live Calculation:** Instant response on every user keystroke with immediate visual validation.
