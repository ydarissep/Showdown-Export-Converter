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

    Object.keys(defaultSettings["replace"]).forEach(settingName => {
        document.getElementById(settingName).addEventListener("click", () => {
            clickButton(settingName)
        })
    })
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

    if(settingEl.classList.contains("disable")){
        settingEl.classList.toggle("clicked")
        changeSetting(settingName, settingEl.classList.contains("clicked"), "button")
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
    else if(settingEl.classList.contains("replace")){
        try{
            document.getElementById("replaceAreaContainer").classList.remove("hide")
            document.getElementById("settingsContainer").classList.add("hide")
            document.getElementById("replaceArea").value = settings["replace"][settingName]

            document.getElementById("replaceAreaButton").addEventListener("click", () => {
                document.getElementById("replaceAreaContainer").classList.add("hide")
                document.getElementById("settingsContainer").classList.remove("hide")
                settings["replace"][settingName] = document.getElementById("replaceArea").value
                localStorage.setItem("SECsettings", JSON.stringify(settings))
            })
        }
        catch{
            settings["replace"] = defaultSettings["replace"]
            localStorage.setItem("SECsettings", JSON.stringify(settings))
            applySettings()
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
    "shinyOutput": ".isShiny = ${shiny}"},
"replace": {"nameReplace": `"Type: Null": "TYPE_NULL"
"Farfetch’d": "FARFETCHD"
"Sirfetch'd": "SIRFETCHD"
"Mr. Mime": "MR_MIME"
"Mime Jr.": "MIME_JR"
"Mr. Rime": "MR_RIME"
"Flabébé": "FLABEBE"
"-Alola": "_ALOLAN"
"-Galar": "_GALARIAN"
"-Hisui": "_HISUIAN"
"-Paldea": "_PALDEAN"
"-Mega": ""`}
}

window.settings = defaultSettings

document.addEventListener("DOMContentLoaded", () => {
    applySettings()

    document.getElementById("pasteAreaButton").addEventListener("click", () => {
        document.getElementById("pasteAreaContainer").classList.add("hide")
        document.getElementById("settingsContainer").classList.remove("hide")
    })
    
    document.getElementById("outputAreaButton").addEventListener("click", () => {
        document.getElementById("outputAreaContainer").classList.add("hide")
        document.getElementById("pasteAreaContainer").classList.remove("hide")
    })
})