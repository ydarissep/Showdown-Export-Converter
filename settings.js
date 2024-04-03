window.settings = []
const trainerStructInput = document.getElementById("trainerStructInput")
const trainerStructName = document.getElementById("trainerStructName")
const trainerStructDisable = document.getElementById("trainerStructDisable")


applySettings()

function applySettings(){
    if(localStorage.getItem("settings")){
        settings = JSON.parse(localStorage.getItem("settings"))
    }

    if(settings.includes("trainerStructDisable")){
        trainerStructDisable.checked = true
        trainerStructInput.classList.add("hide")
        trainerStructName.classList.add("hide")
    }
    else{
        trainerStructDisable.checked = false
        trainerStructInput.classList.remove("hide")
        trainerStructName.classList.remove("hide")
    }
}

document.getElementById("trainerStructDisable").addEventListener("change", () => {
    changeSetting("trainerStructDisable", trainerStructDisable.checked)
    if(trainerStructDisable.checked){
        trainerStructInput.classList.add("hide")
        trainerStructName.classList.add("hide")
    }
    else{
        trainerStructInput.classList.remove("hide")
        trainerStructName.classList.remove("hide")
    }
})

function changeSetting(setting, enable = false){
    if(enable){
        if(!settings.includes(setting)){
            settings.push(setting)
        }
    }
    else{
        settings = settings.filter(value => value != setting)
    }
    localStorage.setItem("settings", JSON.stringify(settings))
}