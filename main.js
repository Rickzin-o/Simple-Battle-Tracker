// Seletores de Elementos
const enemyForm = document.getElementById('enemy-form');
const playerForm = document.getElementById('player-form');
const enemyList = document.getElementById('enemy-list');
const playerList = document.getElementById('player-list');

/**
 * Cria o elemento HTML para uma criatura (jogador ou inimigo).
 * @param {string} name - O nome da criatura.
 * @param {number} hp - Os pontos de vida máximos da criatura.
 * @param {number} ac - A classe de armadura da criatura.
 * @param {string} type - O tipo da criatura ('player' or 'enemy').
 * @returns {HTMLElement} O elemento div da criatura.
 */
function createCreatureElement(name, hp, ac, type) {
    const creatureElement = document.createElement('div');
    // Usando uma classe base e uma classe específica de tipo
    creatureElement.classList.add('creature-card', `${type}-card`);

    // Usando classes em vez de IDs para os elementos internos para evitar duplicatas
    creatureElement.innerHTML = `
        <span class="creature-name">${name}</span>
        <input class="creature-hp" placeholder="HP" type="number" value="${hp}" min="0" max="${hp}">
        <span class="creature-ac">CA: ${ac}</span>
        <button class="remove-btn">X</button>
    `;

    // Adiciona o event listener para o botão de remover
    creatureElement.querySelector('.remove-btn').addEventListener('click', () => {
        creatureElement.remove();
    });

    return creatureElement;
}

/**
 * Manipula a submissão do formulário para adicionar uma nova criatura.
 * @param {Event} event - O evento de submissão do formulário.
 * @param {string} type - O tipo da criatura a ser adicionada ('player' or 'enemy').
 */
function handleFormSubmit(event, type) {
    event.preventDefault();

    const form = event.target;
    // Seleciona os inputs pelo atributo 'name' que é único dentro de cada formulário
    const nameInput = form.querySelector(`input[name="${type}-name"]`);
    const hpInput = form.querySelector(`input[name="${type}-hp"]`);
    const acInput = form.querySelector(`input[name="${type}-ac"]`);

    const name = nameInput.value;
    const hp = parseInt(hpInput.value);
    const ac = parseInt(acInput.value);

    // Validação simples para garantir que os campos não estão vazios
    if (name && !isNaN(hp) && !isNaN(ac)) {
        const creatureElement = createCreatureElement(name, hp, ac, type);

        if (type === 'enemy') {
            enemyList.appendChild(creatureElement);
        } else {
            playerList.appendChild(creatureElement);
        }

        form.reset();
    }
}

// Adiciona os event listeners aos formulários, passando o tipo de criatura
enemyForm.addEventListener('submit', (event) => handleFormSubmit(event, 'enemy'));
playerForm.addEventListener('submit', (event) => handleFormSubmit(event, 'player'));

// A função antiga 'removerCriatura' não é mais necessária, pois a remoção é tratada por card.