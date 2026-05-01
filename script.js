(() => {
  const display = document.querySelector('[data-display]');
  const keys = document.querySelector('.keys');

  const state = {
    current: '0',
    previous: null,
    operator: null,
    waitingForOperand: false,
    error: false,
  };

  const MAX_LEN = 12;

  const format = (n) => {
    if (!Number.isFinite(n)) return 'Erreur';
    const rounded = Number.parseFloat(n.toPrecision(12));
    let s = String(rounded);
    if (s.length > MAX_LEN) s = rounded.toExponential(6);
    return s;
  };

  const render = () => {
    display.textContent = state.current;
    document.querySelectorAll('.key--op.is-active').forEach((b) => b.classList.remove('is-active'));
    if (state.operator && state.waitingForOperand) {
      const btn = document.querySelector(`.key--op[data-operator="${state.operator}"]`);
      if (btn) btn.classList.add('is-active');
    }
  };

  const resetIfError = () => {
    if (state.error) {
      state.current = '0';
      state.previous = null;
      state.operator = null;
      state.waitingForOperand = false;
      state.error = false;
    }
  };

  const inputDigit = (d) => {
    resetIfError();
    if (state.waitingForOperand) {
      state.current = d;
      state.waitingForOperand = false;
    } else {
      if (state.current.replace('-', '').length >= MAX_LEN) return;
      state.current = state.current === '0' ? d : state.current + d;
    }
  };

  const inputDecimal = () => {
    resetIfError();
    if (state.waitingForOperand) {
      state.current = '0.';
      state.waitingForOperand = false;
      return;
    }
    if (!state.current.includes('.')) state.current += '.';
  };

  const clearAll = () => {
    state.current = '0';
    state.previous = null;
    state.operator = null;
    state.waitingForOperand = false;
    state.error = false;
  };

  const backspace = () => {
    if (state.error || state.waitingForOperand) return;
    if (state.current.length <= 1 || (state.current.length === 2 && state.current.startsWith('-'))) {
      state.current = '0';
    } else {
      state.current = state.current.slice(0, -1);
    }
  };

  const toggleSign = () => {
    if (state.error || state.current === '0') return;
    state.current = state.current.startsWith('-') ? state.current.slice(1) : '-' + state.current;
  };

  const percent = () => {
    if (state.error) return;
    const n = parseFloat(state.current);
    state.current = format(n / 100);
  };

  const compute = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const handleOperator = (op) => {
    resetIfError();
    const value = parseFloat(state.current);
    if (state.previous !== null && state.operator && !state.waitingForOperand) {
      const result = compute(state.previous, value, state.operator);
      const formatted = format(result);
      if (formatted === 'Erreur') {
        state.current = 'Erreur';
        state.error = true;
        state.previous = null;
        state.operator = null;
        state.waitingForOperand = false;
        return;
      }
      state.current = formatted;
      state.previous = result;
    } else {
      state.previous = value;
    }
    state.operator = op;
    state.waitingForOperand = true;
  };

  const equals = () => {
    if (state.error || state.operator === null || state.previous === null) return;
    const value = parseFloat(state.current);
    const result = compute(state.previous, value, state.operator);
    const formatted = format(result);
    state.current = formatted;
    if (formatted === 'Erreur') {
      state.error = true;
      state.previous = null;
    } else {
      state.previous = null;
    }
    state.operator = null;
    state.waitingForOperand = true;
  };

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn) return;
    const { key, action, operator } = btn.dataset;
    if (key !== undefined) {
      if (key === '.') inputDecimal();
      else inputDigit(key);
    } else if (action === 'clear') clearAll();
    else if (action === 'sign') toggleSign();
    else if (action === 'percent') percent();
    else if (action === 'operator') handleOperator(operator);
    else if (action === 'equals') equals();
    render();
  });

  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k >= '0' && k <= '9') { inputDigit(k); render(); }
    else if (k === '.' || k === ',') { inputDecimal(); render(); }
    else if (k === '+' || k === '-' || k === '*' || k === '/') { handleOperator(k); render(); }
    else if (k === 'Enter' || k === '=') { e.preventDefault(); equals(); render(); }
    else if (k === 'Escape') { clearAll(); render(); }
    else if (k === 'Backspace') { backspace(); render(); }
    else if (k === '%') { percent(); render(); }
  });

  render();
})();
