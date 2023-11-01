function adicionarCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    
    let nomeCriatura = document.getElementById("input-name").value
    
    if (nomeCriatura != "" && nomeCriatura != null) {
    let vidaCriatura = document.getElementById("input-hp").value
    let armaduraCriatura = document.getElementById("input-ca").value
    
        if (vidaCriatura != "" && armaduraCriatura != "") {
            footer.innerHTML += `<div class="creature-info"><label>${nomeCriatura}</label><input value="${vidaCriatura}" placeholder="HP" type="number" min="0" max="${vidaCriatura}"><label>CA ${armaduraCriatura}</label></div>`
        }
    } else {
        alert("Por favor, insira um nome de criatura válido!")
    }
}

function removerCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    footer.lastChild.remove()
}