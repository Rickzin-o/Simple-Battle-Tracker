import { StorageManager } from "./StorageManager.js";

/**
 * Gerencia as interações e atualizações da UI.
 */
export class UIManager {
  /**
   * @param {BattleManager} battleManager - A instância do gerenciador de batalha.
   */
  constructor(battleManager) {
    this.battleManager = battleManager;
    this.playerList = document.getElementById("player-list");
    this.enemyList = document.getElementById("enemy-list");
    this.playerCount = document.getElementById("player-count");
    this.enemyCount = document.getElementById("enemy-count");
    this.notesTextarea = document.getElementById("notes-textarea");

    this.bindEvents();
    this.initNotes();
  }

  /**
   * Vincula todos os ouvintes de eventos gerais da UI.
   */
  bindEvents() {
    // Modais
    document
      .getElementById("add-player-btn")
      .addEventListener("click", () => this.openModal("player"));
    document
      .getElementById("add-enemy-btn")
      .addEventListener("click", () => this.openModal("enemy"));
    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.closeModals());
    });
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) this.closeModals();
    });

    // Formulários
    document
      .getElementById("player-form")
      .addEventListener("submit", (e) => this.handleFormSubmit(e, "player"));
    document
      .getElementById("enemy-form")
      .addEventListener("submit", (e) => this.handleFormSubmit(e, "enemy"));

    // Controles de batalha
    document
      .getElementById("clear-battle-btn")
      .addEventListener("click", () => this.handleClearBattle());

    // Ouve as mudanças de estado do BattleManager
    this.battleManager.addEventListener("state-change", (e) =>
      this.updateUI(e.detail)
    );
  }

  /**
   * Abre o modal especificado.
   * @param {string} type - 'player' ou 'enemy'.
   */
  openModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    modal.style.display = "block";
    setTimeout(() => {
      const firstInput = modal.querySelector("input");
      if (firstInput) firstInput.focus();
    }, 100);
  }

  /**
   * Fecha todos os modais.
   */
  closeModals() {
    document
      .querySelectorAll(".modal")
      .forEach((modal) => (modal.style.display = "none"));
  }

  /**
   * Lida com a submissão dos formulários de adicionar criatura.
   * @param {Event} event - O evento de submissão do formulário.
   * @param {string} type - 'player' ou 'enemy'.
   */
  handleFormSubmit(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get(`${type}-name`),
      hp: parseInt(formData.get(`${type}-hp`)),
      ac: parseInt(formData.get(`${type}-ac`)),
    };

    if (this.validateCreatureData(data)) {
      this.battleManager.addCreature(data, type);
      form.reset();
      this.closeModals();
    }
  }

  /**
   * Valida os dados da criatura do formulário.
   * @param {object} data - Os dados da criatura.
   * @returns {boolean} - Verdadeiro se os dados forem válidos, falso caso contrário.
   */
  validateCreatureData(data) {
    if (!data.name.trim()) {
      alert("Por favor, insira um nome para a criatura.");
      return false;
    }
    if (data.hp <= 0) {
      alert("O HP deve ser maior que 0.");
      return false;
    }
    if (data.ac < 0) {
      alert("A CA não pode ser negativa.");
      return false;
    }
    return true;
  }

  /**
   * Lida com o clique no botão de limpar a batalha.
   */
  handleClearBattle() {
    if (
      confirm(
        "Tem certeza que deseja limpar toda a batalha? Esta ação não pode ser desfeita."
      )
    ) {
      this.battleManager.clearBattle();
    }
  }

  /**
   * Atualiza toda a UI com base no novo estado.
   * @param {object} state - O novo estado da batalha.
   */
  updateUI(state) {
    this.renderCreatureList("player", state.players);
    this.renderCreatureList("enemy", state.enemies);
    this.updateBattleStats(state.playerCount, state.enemyCount);
  }

  /**
   * Renderiza uma lista de criaturas.
   * @param {string} type - 'player' ou 'enemy'.
   * @param {Creature[]} creatures - A lista de criaturas a ser renderizada.
   */
  renderCreatureList(type, creatures) {
    const container = type === "player" ? this.playerList : this.enemyList;
    container.innerHTML = "";

    if (creatures.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Nenhum ${
            type === "player" ? "jogador" : "inimigo"
          } adicionado</p>
          <small>Use o painél ${
            type === "player" ? "abaixo" : "acima"
          } para adicionar</small>
        </div>`;
      return;
    }

    creatures.forEach((creature) => {
      container.appendChild(creature.element);
    });
  }

  /**
   * Atualiza a exibição das estatísticas da batalha.
   * @param {number} playerCount - O número de jogadores.
   * @param {number} enemyCount - O número de inimigos.
   */
  updateBattleStats(playerCount, enemyCount) {
    this.playerCount.textContent = playerCount;
    this.enemyCount.textContent = enemyCount;
  }

  /**
   * Inicializa a funcionalidade de anotações.
   */
  initNotes() {
    if (!this.notesTextarea) return;
    const savedNotes = StorageManager.get("battleTrackerNotes");
    if (savedNotes) {
      this.notesTextarea.value = savedNotes;
    }
    this.notesTextarea.addEventListener("input", () => {
      StorageManager.set("battleTrackerNotes", this.notesTextarea.value);
    });
  }
}