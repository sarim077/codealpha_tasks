/**
 * Task 2: Advanced Glassmorphic Calculator
 * Features:
 * - Arithmetic operations (+, -, ×, ÷)
 * - Decimal numbers, sign toggle (±), percentage (%)
 * - Clear (AC) and Backspace (DEL)
 * - Real-time calculation preview
 * - Calculation History Drawer (persist in memory, click to restore)
 * - Full physical keyboard support
 */

class Calculator {
  constructor(displayElem, historyElem, historyListElem) {
    this.displayElem = displayElem;
    this.historyElem = historyElem;
    this.historyListElem = historyListElem;
    this.history = [];
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  delete() {
    if (this.shouldResetScreen) {
      this.currentOperand = "0";
      this.shouldResetScreen = false;
      this.updateDisplay();
      return;
    }
    if (this.currentOperand === "0") return;
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith("-"))) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.updateDisplay();
  }

  toggleSign() {
    if (this.currentOperand === "0") return;
    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = "-" + this.currentOperand;
    }
    this.updateDisplay();
  }

  percent() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" && this.previousOperand !== "") {
      this.operation = operation;
      this.updateDisplay();
      return;
    }
    if (this.previousOperand !== "") {
      this.compute(false);
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  compute(isFinal = true) {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
      case "−":
        computation = prev - current;
        break;
      case "×":
      case "*":
        computation = prev * current;
        break;
      case "÷":
      case "/":
        if (current === 0) {
          alert("Error: Cannot divide by zero");
          this.clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Format floating decimals nicely
    computation = Math.round(computation * 100000000) / 100000000;

    if (isFinal) {
      const expr = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
      this.addToHistory(expr, computation);
      this.previousOperand = "";
      this.operation = undefined;
    } else {
      this.previousOperand = computation.toString();
    }

    this.currentOperand = computation.toString();
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  addToHistory(expression, result) {
    this.history.unshift({ expression, result });
    if (this.history.length > 20) this.history.pop();
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.historyListElem.innerHTML = '<div class="empty-history">No calculations yet</div>';
      return;
    }

    this.historyListElem.innerHTML = this.history
      .map(
        item => `
        <div class="history-item" onclick="calc.loadFromHistory('${item.result}')">
          <div class="history-expr">${item.expression} =</div>
          <div class="history-res">${item.result}</div>
        </div>
      `
      )
      .join("");
  }

  loadFromHistory(val) {
    this.currentOperand = val.toString();
    this.shouldResetScreen = true;
    this.updateDisplay();
    document.getElementById("historyPanel").classList.remove("open");
  }

  clearHistory() {
    this.history = [];
    this.renderHistory();
  }

  formatDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (this.currentOperand.includes(".") && this.currentOperand.endsWith(".")) {
      this.displayElem.textContent = this.formatDisplayNumber(this.currentOperand.slice(0, -1)) + ".";
    } else {
      this.displayElem.textContent = this.formatDisplayNumber(this.currentOperand);
    }

    if (this.operation != null) {
      this.historyElem.textContent = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.historyElem.textContent = "";
    }

    // Auto font size shrink for long numbers
    const len = this.displayElem.textContent.length;
    if (len > 12) {
      this.displayElem.style.fontSize = "1.5rem";
    } else if (len > 8) {
      this.displayElem.style.fontSize = "1.9rem";
    } else {
      this.displayElem.style.fontSize = "2.5rem";
    }
  }
}

// Elements
const displayElem = document.getElementById("calcDisplay");
const historyElem = document.getElementById("calcHistory");
const historyListElem = document.getElementById("historyList");
const historyPanel = document.getElementById("historyPanel");
const historyToggleBtn = document.getElementById("historyToggleBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Instantiate calculator
const calc = new Calculator(displayElem, historyElem, historyListElem);

// Keypad Event Delegation
document.querySelector(".calc-keypad").addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;

  if (target.dataset.num !== undefined) {
    calc.appendNumber(target.dataset.num);
  } else if (target.dataset.op !== undefined) {
    calc.chooseOperation(target.dataset.op);
  } else if (target.dataset.action === "all-clear") {
    calc.clear();
  } else if (target.dataset.action === "delete") {
    calc.delete();
  } else if (target.dataset.action === "decimal") {
    calc.appendNumber(".");
  } else if (target.dataset.action === "calculate") {
    calc.compute();
  } else if (target.dataset.action === "percent") {
    calc.percent();
  } else if (target.dataset.action === "toggle-sign") {
    calc.toggleSign();
  }
});

// Toggle History Panel
historyToggleBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("open");
});

clearHistoryBtn.addEventListener("click", () => {
  calc.clearHistory();
});

// Keyboard Support
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    calc.appendNumber(e.key);
  } else if (e.key === ".") {
    calc.appendNumber(".");
  } else if (e.key === "+" || e.key === "-") {
    calc.chooseOperation(e.key === "-" ? "−" : "+");
  } else if (e.key === "*") {
    calc.chooseOperation("×");
  } else if (e.key === "/") {
    e.preventDefault();
    calc.chooseOperation("÷");
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calc.compute();
  } else if (e.key === "Backspace") {
    calc.delete();
  } else if (e.key === "Escape") {
    calc.clear();
    historyPanel.classList.remove("open");
  } else if (e.key === "%") {
    calc.percent();
  }
});
