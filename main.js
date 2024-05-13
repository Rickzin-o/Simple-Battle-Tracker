// Constante dos formulários e das listas
const enemyForm = document.getElementById('enemy-form');
const playerForm = document.getElementById('player-form');
const enemyList = document.querySelector('#enemy-list');
const playerList = document.querySelector('#player-list');

// Pega as informações do formulário de inimigos ao clicar no botão
enemyForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const enemyName = document.getElementById('enemy-name').value;
    const enemyHP = parseInt(document.getElementById('enemy-hp').value);
    const enemyAC = parseInt(document.getElementById('enemy-ac').value);

    addEnemy(enemyName, enemyHP, enemyAC);
    this.reset(); // Limpa o formulário
});

// Pega as informações do formulário de jogadores ao clicar no botão
playerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const playerName = document.getElementById('player-name').value;
    const playerHP = parseInt(document.getElementById('player-hp').value);
    const playerAC = parseInt(document.getElementById('player-ac').value);

    addPlayer(playerName, playerHP, playerAC);
    this.reset(); // Limpa o formulário
});

// Adiciona as informações de um inimigo na lista
function addEnemy(name, hp, ac) {
    const enemyItem = document.createElement('div');
    enemyItem.classList.add('enemy-data');

    enemyItem.innerHTML = `
    <span id="name">${name}</span>
    <input id="hp" placeholder="HP" type=number value=${hp} min=0 max=${hp}>
    <span id="ca">CA: ${ac}</span>
    `;

    enemyList.appendChild(enemyItem);
}

// Adiciona as informações de um jogador na lista
function addPlayer(name, hp, ac) {
    const playerItem = document.createElement('div');
    playerItem.classList.add('player-data');

    playerItem.innerHTML = `
    <span id="name">${name}</span>
    <input id="hp" type=number placeholder="HP" value=${hp} min=0 max=${hp}>
    <span id="ca">CA: ${ac}</span>
    `;

    playerList.appendChild(playerItem);
}


function removerCriatura(listId) {
    let list = document.getElementById(`${listId}`)
    list.lastChild.remove()
}