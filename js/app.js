import { BattleManager } from "./services/BattleManager.js";
import { UIManager } from "./services/UIManager.js";

/**
 * Classe principal da aplicação.
 */
class App {
  constructor() {
    this.battleManager = new BattleManager();
    this.uiManager = new UIManager(this.battleManager);
  }

  /**
   * Inicializa a aplicação.
   */
  init() {
    this.loadExamples();
    // Dispara a atualização inicial da UI diretamente após carregar os exemplos.
    // Isto é mais fiável do que depender de eventos durante a configuração inicial.
    this.uiManager.updateUI({
      players: this.battleManager.players,
      enemies: this.battleManager.enemies,
      playerCount: this.battleManager.players.length,
      enemyCount: this.battleManager.enemies.length,
    });
  }

  /**
   * Carrega criaturas de exemplo iniciais se a batalha estiver vazia.
   */
  loadExamples() {
    if (
      this.battleManager.players.length === 0 &&
      this.battleManager.enemies.length === 0
    ) {
      this.battleManager.addCreature(
        { name: "Cavaleiro", hp: 60, ac: 16 },
        "player"
      );
      this.battleManager.addCreature(
        { name: "Zumbi", hp: 30, ac: 10 },
        "enemy"
      );
      this.battleManager.addCreature(
        { name: "Zumbi", hp: 30, ac: 10 },
        "enemy"
      );
    }
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});