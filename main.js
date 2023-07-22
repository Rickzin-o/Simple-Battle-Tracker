function adicionarCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    
    let nomeCriatura = prompt("Insira nome da criatura.")
    
    if (nomeCriatura != "" && nomeCriatura != null) {
    let vidaCriatura = prompt("Insira HP da criatura.")
    let armaduraCriatura = prompt("Insira CA da criatura.")
    
    if (vidaCriatura != "" && armaduraCriatura != "") {
        footer.innerHTML += `<div class="creature-info"><label>${nomeCriatura}</label><input value="${vidaCriatura}" placeholder="HP" type="number" min="0" max="${vidaCriatura}"><label>CA ${armaduraCriatura}</label></div>`
    }
    }
}

function removerCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    footer.lastChild.remove()
}