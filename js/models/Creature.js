export class Creature {
  /**
   * @param {object} data - Os dados da criatura.
   * @param {string} data.name - O nome da criatura.
   * @param {number} data.hp - O HP máximo da criatura.
   * @param {number} data.ac - A classe de armadura da criatura.
   * @param {string} data.type - O tipo da criatura ('player' ou 'enemy').
   * @param {function(id, newHp): void} onHpChange - Callback para mudanças de HP.
   * @param {function(id): void} onRemove - Callback para remoção.
   */
  constructor(data, { onHpChange, onRemove, onDuplicate }) {
    this.id = data.id || Date.now() + Math.random();
    this.name = data.name;
    this.hp = data.hp;
    this.ac = data.ac;
    this.currentHp = data.currentHp ?? data.hp;
    this.type = data.type;

    // Callbacks para comunicar com o BattleManager
    this.onHpChange = onHpChange;
    this.onRemove = onRemove;
    this.onDuplicate = onDuplicate

    this.element = this.createElement();
    this.bindEvents();
  }

  /**
   * Cria o elemento HTML do card da criatura.
   * @returns {HTMLDivElement} O elemento do card da criatura.
   */
  createElement() {
    const element = document.createElement("div");
    element.className = `creature-card ${this.type}-card`;
    element.dataset.id = this.id;
    this.updateElement(element);
    return element;
  }

  /**
   * Atualiza o conteúdo do elemento do card da criatura.
   * @param {HTMLDivElement} element - O elemento a ser atualizado.
   */
  updateElement(element) {
    const hpPercentage = (this.currentHp / this.hp) * 100;
    const hpColor =
      hpPercentage > 60
        ? "var(--accent-color)"
        : hpPercentage > 25
        ? "orange"
        : "var(--danger-color)";

    element.innerHTML = `
      <button class="remove-btn" title="Remover">×</button>
      <button class="duplicate-btn" title="Duplicar">c</button>
      <div class="creature-name">${this.name}</div>
      <div class="creature-stats">
        <div class="stat-group">
          <span class="stat-label">HP</span>
          <input type="number"
                 class="creature-hp"
                 value="${this.currentHp}"
                 min="0"
                 max="${this.hp}">
        </div>
        <div class="stat-group">
          <span class="stat-label">CA</span>
          <span class="stat-value">${this.ac}</span>
        </div>
      </div>
      <div class="hp-bar">
        <div class="hp-fill" style="width: ${hpPercentage}%; background: ${hpColor};"></div>
      </div>
    `;
  }

  /**
   * Vincula os ouvintes de eventos aos elementos interativos do card da criatura.
   */
  bindEvents() {
    this.element.querySelector(".remove-btn").addEventListener("click", () => {
      this.onRemove(this.id);
    });

    this.element.querySelector(".duplicate-btn").addEventListener("click", () => {
      this.onDuplicate(this.id);
    });

    const hpInput = this.element.querySelector(".creature-hp");
    hpInput.addEventListener("change", (e) => {
      const newHp = parseInt(e.target.value, 10);
      this.onHpChange(this.id, newHp);
    });

    hpInput.addEventListener("input", (e) => {
      const newHp = parseInt(e.target.value, 10);
      this.updateHpBar(newHp);
    });
  }

  /**
   * Atualiza a aparência da barra de HP com base no HP atual.
   * @param {number} newHp - O novo valor de HP.
   */
  updateHpBar(newHp) {
    const hpFill = this.element.querySelector(".hp-fill");
    if (!hpFill) return;

    const hpPercentage = (Math.max(0, newHp) / this.hp) * 100;
    const hpColor =
      hpPercentage > 60
        ? "var(--accent-color)"
        : hpPercentage > 25
        ? "orange"
        : "var(--danger-color)";

    hpFill.style.width = `${hpPercentage}%`;
    hpFill.style.background = hpColor;
  }

  /**
   * Atualiza o HP atual da criatura e renderiza novamente o elemento.
   * @param {number} newHp - O novo valor de HP.
   */
  updateHp(newHp) {
    this.currentHp = Math.max(0, Math.min(newHp, this.hp));
    this.updateElement(this.element);
    this.bindEvents(); // Re-vincula os eventos após a sobreescrita do innerHTML
  }
}