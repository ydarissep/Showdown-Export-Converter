function applySettings(){
    if(localStorage.getItem("SECsettings")){
        settings = JSON.parse(localStorage.getItem("SECsettings"))
    }

    try{
        settings["button"].forEach(settingName => {
            clickButton(settingName)
        })

        document.querySelectorAll('button[type="button"]').forEach(button => {
            if(button.id){
                button.addEventListener("click", () => {
                    clickButton(button.id)
                })
                if(settings["button"].includes(button.id)){
                    button.classList.add("clicked")
                }
            }
        })
    }
    catch{
        settings["button"] = defaultSettings["button"]
        localStorage.setItem("SECsettings", JSON.stringify(settings))
        applySettings()
    }
    try{
        Object.keys(defaultSettings["input"]).forEach(key => {
            if(document.getElementById(key)){
                document.getElementById(key).value = defaultSettings["input"][key]
            }
        })
        Object.keys(settings["input"]).forEach(key => {
            if(document.getElementById(key)){
                document.getElementById(key).value = settings["input"][key]
            }
        })
    }
    catch{
        settings["input"] = defaultSettings["input"]
        localStorage.setItem("SECsettings", JSON.stringify(settings))
        applySettings()
    }
}

function changeSetting(setting, enable = false, key){
    if(enable){
        if(!settings[key].includes(setting)){
            settings[key].push(setting)
        }
    }
    else{
        settings[key] = settings[key].filter(value => value != setting)
    }
    localStorage.setItem("SECsettings", JSON.stringify(settings))
}

function clickButton(settingName){
    const settingEl = document.getElementById(settingName)
    settingEl.classList.toggle("clicked")
    changeSetting(settingName, settingEl.classList.contains("clicked"), "button")

    if(settingEl.classList.contains("disable")){
        for(const el of settingEl.closest("fieldset").getElementsByTagName("*")){
            if(el.tagName !== "LEGEND" && !el.querySelector(`#${settingName}`) && el.id !== settingName){
                if(settings["button"].includes(settingName)){
                    el.classList.add("hide")
                }
                else{
                    el.classList.remove("hide")
                }
            }
        }
    }
}

const defaultSettings = {
"button": [], 
"input": {
    "nameOutput": ".species = SPECIES_${name}",
    "evsOrder": ["HP", "Atk", "Def", "Spe", "SpA", "SpD"], 
    "ivsOrder": ["HP", "Atk", "Def", "Spe", "SpA", "SpD"], 
    "evsOutput": ".ev = TRAINER_PARTY_EVS(${evs})", 
    "ivsOutput": ".iv = TRAINER_PARTY_IVS(${ivs})", 
    "movesOutput": ".moves = {${moves}}",
    "levelOutput": ".lvl = ${level}",
    "abilityOutput": ".ability = ABILITY_${ability}",
    "itemOutput": ".heldItem = ITEM_${item}",
    "natureOutput": ".nature = NATURE_${nature}",
    "nicknameOutput": '.nickname = COMPOUND_STRING("${nickname}")',
    "happinessOutput": ".friendship = ${happiness}",
    "genderOutput": ".gender = TRAINER_MON_${gender}",
    "shinyOutput": ".isShiny = ${shiny}"}
}

window.settings = defaultSettings

document.addEventListener("DOMContentLoaded", () => {
    applySettings()
})