// Gerenciador de Estado da Batalha
class BattleManager {
    constructor() {
        this.players = [];
        this.enemies = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateBattleStats();
        this.loadExamples();
    }

    bindEvents() {
        // Modals
        document.getElementById('add-enemy-btn').addEventListener('click', () => this.openModal('enemy'));
        document.getElementById('add-player-btn').addEventListener('click', () => this.openModal('player'));
        document.getElementById('clear-battle-btn').addEventListener('click', () => this.clearBattle());

        // Fechar modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Formulários
        document.getElementById('enemy-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'enemy'));
        document.getElementById('player-form').addEventListener('submit', (e) => this.handleFormSubmit(e, 'player'));

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    openModal(type) {
        const modal = document.getElementById(`${type}-modal`);
        modal.style.display = 'block';
        
        // Foco no primeiro input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleFormSubmit(event, type) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get(`${type}-name`),
            hp: parseInt(formData.get(`${type}-hp`)),
            ac: parseInt(formData.get(`${type}-ac`))
        };

        if (this.validateCreatureData(data)) {
            this.addCreature(data, type);
            form.reset();
            this.closeModals();
        }
    }

    validateCreatureData(data) {
        if (!data.name.trim()) {
            alert('Por favor, insira um nome para a criatura.');
            return false;
        }
        if (data.hp <= 0) {
            alert('O HP deve ser maior que 0.');
            return false;
        }
        if (data.ac < 0) {
            alert('A CA não pode ser negativa.');
            return false;
        }
        return true;
    }

    addCreature(data, type) {
        const creature = {
            id: Date.now() + Math.random(),
            ...data,
            currentHp: data.hp,
            type: type
        };

        if (type === 'player') {
            this.players.push(creature);
        } else {
            this.enemies.push(creature);
        }

        this.renderCreatures();
        this.updateBattleStats();
    }

    removeCreature(id, type) {
        if (type === 'player') {
            this.players = this.players.filter(p => p.id !== id);
        } else {
            this.enemies = this.enemies.filter(e => e.id !== id);
        }

        this.renderCreatures();
        this.updateBattleStats();
    }

    updateHp(id, newHp, type) {
        const collection = type === 'player' ? this.players : this.enemies;
        const creature = collection.find(c => c.id === id);
        
        if (creature) {
            creature.currentHp = Math.max(0, Math.min(newHp, creature.hp));
            this.renderCreatures();
        }
    }

    renderCreatures() {
        this.renderCreatureList('player', this.players);
        this.renderCreatureList('enemy', this.enemies);
    }

    renderCreatureList(type, creatures) {
        const container = document.getElementById(`${type}-list`);
        container.innerHTML = '';

        if (creatures.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Nenhum ${type === 'player' ? 'jogador' : 'inimigo'} adicionado</p>
                    <small>Use o botão acima para adicionar</small>
                </div>
            `;
            return;
        }

        creatures.forEach(creature => {
            const element = this.createCreatureElement(creature);
            container.appendChild(element);
        });
    }

    createCreatureElement(creature) {
        const element = document.createElement('div');
        element.className = `creature-card ${creature.type}-card`;
        element.dataset.id = creature.id;

        const hpPercentage = (creature.currentHp / creature.hp) * 100;
        const hpColor = hpPercentage > 60 ? 'var(--accent-color)' : 
                       hpPercentage > 25 ? 'orange' : 'var(--danger-color)';

        element.innerHTML = `
            <button class="remove-btn" title="Remover">×</button>
            <div class="creature-name">${creature.name}</div>
            <div class="creature-stats">
                <div class="stat-group">
                    <span class="stat-label">HP</span>
                    <input type="number" 
                           class="creature-hp" 
                           value="${creature.currentHp}" 
                           min="0" 
                           max="${creature.hp}"
                           data-creature-id="${creature.id}">
                </div>
                <div class="stat-group">
                    <span class="stat-label">CA</span>
                    <span class="stat-value">${creature.ac}</span>
                </div>
            </div>
            <div class="hp-bar">
                <div class="hp-fill" style="width: ${hpPercentage}%; background: ${hpColor};"></div>
            </div>
        `;

        // Event listeners
        element.querySelector('.remove-btn').addEventListener('click', () => {
            this.removeCreature(creature.id, creature.type);
        });

        const hpInput = element.querySelector('.creature-hp');
        hpInput.addEventListener('change', (e) => {
            const newHp = parseInt(e.target.value);
            this.updateHp(creature.id, newHp, creature.type);
        });

        hpInput.addEventListener('input', (e) => {
            const newHp = parseInt(e.target.value);
            const hpFill = element.querySelector('.hp-fill');
            const hpPercentage = (newHp / creature.hp) * 100;
            const hpColor = hpPercentage > 60 ? 'var(--accent-color)' : 
                           hpPercentage > 25 ? 'orange' : 'var(--danger-color)';
            
            hpFill.style.width = `${hpPercentage}%`;
            hpFill.style.background = hpColor;
        });

        return element;
    }

    updateBattleStats() {
        document.getElementById('player-count').textContent = this.players.length;
        document.getElementById('enemy-count').textContent = this.enemies.length;
    }

    clearBattle() {
        if (confirm('Tem certeza que deseja limpar toda a batalha? Esta ação não pode ser desfeita.')) {
            this.players = [];
            this.enemies = [];
            this.renderCreatures();
            this.updateBattleStats();
        }
    }

    loadExamples() {
        // Adiciona exemplos iniciais
        if (this.players.length === 0 && this.enemies.length === 0) {
            this.addCreature({ name: "Cavaleiro", hp: 60, ac: 16 }, 'player');
            this.addCreature({ name: "Zumbi", hp: 30, ac: 10 }, 'enemy');
            this.addCreature({ name: "Zumbi", hp: 30, ac: 10 }, 'enemy');
        }
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.battleManager = new BattleManager();
});
