function adicionarCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    
    let nomeCriatura = document.getElementById("input-name").value
    
    if (nomeCriatura != "" && nomeCriatura != null) {
    let vidaCriatura = document.getElementById("input-hp").value
    let armaduraCriatura = document.getElementById("input-ca").value
    
        if (vidaCriatura != "" && armaduraCriatura != "") {
            let numeroDeCriaturas = Number(document.getElementById("input-num").value)
            
            if (numeroDeCriaturas > 1){
                for (let i = 0; i < numeroDeCriaturas; i++) {
                    footer.innerHTML += `<div class="creature-info"><label>${nomeCriatura}</label><input value="${vidaCriatura}" placeholder="HP" type="number" min="0" max="${vidaCriatura}"><label>CA ${armaduraCriatura}</label></div>`
                }
            } else{
                footer.innerHTML += `<div class="creature-info"><label>${nomeCriatura}</label><input value="${vidaCriatura}" placeholder="HP" type="number" min="0" max="${vidaCriatura}"><label>CA ${armaduraCriatura}</label></div>`
            }

            document.getElementById("input-name").value = ""
            document.getElementById("input-hp").value = ""
            document.getElementById("input-ca").value = ""
            document.getElementById("input-num").value = ""
        }
    } else {
        alert("Por favor, insira um nome de criatura válido!")
    }
}

function removerCriatura(footerIndex) {
    let footer = document.getElementById(`footer${footerIndex}`)
    footer.lastChild.remove()
}