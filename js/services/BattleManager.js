import { Creature } from "../models/Creature.js";

/**
 * Gerencia o estado da batalha (jogadores e inimigos).
 * Estende EventTarget para despachar eventos quando o estado muda.
 */
export class BattleManager extends EventTarget {
  constructor() {
    super();
    this.players = [];
    this.enemies = [];
  }

  /**
   * Adiciona uma criatura à batalha.
   * @param {object} data - Dados da criatura.
   * @param {string} type - 'player' ou 'enemy'.
   */
  addCreature(data, type) {
    const creatureData = {
      ...data,
      type: type,
    };

    const creature = new Creature(creatureData, {
      onHpChange: (id, newHp) => this.updateHp(id, newHp),
      onRemove: (id) => this.removeCreature(id, type),
      onDuplicate: (id) => this.duplicateCreature(id, type),
      onEdit: (id) => this.editCreature(id, type)
    });

    if (type === "player") {
      this.players.push(creature);
    } else {
      this.enemies.push(creature);
    }

    this.dispatchStateChange();
  }

  /**
   * Remove uma criatura da batalha.
   * @param {number} id - O ID da criatura a ser removida.
   * @param {string} type - O tipo da criatura ('player' ou 'enemy').
   */
  removeCreature(id, type) {
    if (type === "player") {
      this.players = this.players.filter((p) => p.id !== id);
    } else {
      this.enemies = this.enemies.filter((e) => e.id !== id);
    }
    this.dispatchStateChange();
  }

  /**
   * Duplica uma carta de criatura da batalha.
   * @param {number} id - O ID da criatura a ser duplicada.
   * @param {string} type - O tipo da criatura ('player' ou 'enemy').
   */
  duplicateCreature(id, type) {
    if (type === "player") {
      var index = this.players.findIndex(p => p.id === id)
      var player = this.players.at(index)
      this.addCreature(
        {
          name: structuredClone(player.name),
          hp: structuredClone(player.hp),
          ac: structuredClone(player.ac),
        },
        "player"
      )
    } else {
      var index = this.enemies.findIndex(p => p.id === id)
      var enemy = this.enemies.at(index)
      this.addCreature(
        {
          name: structuredClone(enemy.name),
          hp: structuredClone(enemy.hp),
          ac: structuredClone(enemy.ac),
        },
        "enemy"
      )
    }
    this.dispatchStateChange();
  }

  /**
   * Edita a estatística de uma criatura da batalha.
   * @param {number} id - O ID da criatura a ser editada.
   * @param {string} type - O tipo da criatura ('player' ou 'enemy').
   */
  editCreature(id, type) {
    this.dispatchCreatureEdit(id, type)
  }

  /**
   * Atualiza o HP de uma criatura.
   * @param {number} id - O ID da criatura a ser atualizada.
   * @param {number} newHp - O novo valor de HP.
   */
  updateHp(id, newHp) {
    const creature =
      this.players.find((p) => p.id === id) ||
      this.enemies.find((e) => e.id === id);

    if (creature) {
      creature.updateHp(newHp);
      this.dispatchStateChange();
    }
  }

  /**
   * Limpa toda a batalha.
   */
  clearBattle() {
    this.players = [];
    this.enemies = [];
    this.dispatchStateChange();
  }

  /**
   * Despacha um evento 'state-change' com o estado atual da batalha.
   */
  dispatchStateChange() {
    const event = new CustomEvent("state-change", {
      detail: {
        players: this.players,
        enemies: this.enemies,
        playerCount: this.players.length,
        enemyCount: this.enemies.length,
      },
    });
    this.dispatchEvent(event);
  }

  dispatchCreatureEdit(id, type) {
    const event = new CustomEvent("creature-edit", {
      detail: {
        creatureId: id,
        creatureType: type
      },
    })
    this.dispatchEvent(event)
  }

  /**
   * Retorna o estado atual da batalha para salvar.
   * @returns {object} O estado da batalha.
   */
  getStateForSave() {
    return {
      players: this.players.map((p) => p.toJSON()),
      enemies: this.enemies.map((e) => e.toJSON()),
    };
  }

  /**
   * Carrega o estado da batalha a partir de um objeto.
   * @param {object} state - O estado da batalha a ser carregado.
   */
  loadState(state) {
    if (!state || !state.players || !state.enemies) {
      console.error("Estado inválido:", state);
      return;
    }

    this.players = [];
    this.enemies = [];

    state.players.forEach((playerData) => {
      this.addCreature(playerData, "player");
    });
    state.enemies.forEach((enemyData) => {
      this.addCreature(enemyData, "enemy");
    });

    this.dispatchStateChange();
  }
}