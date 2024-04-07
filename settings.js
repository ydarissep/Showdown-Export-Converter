function applySettings(){
    if(localStorage.getItem("SECsettings")){
        settings = JSON.parse(localStorage.getItem("SECsettings"))
    }

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

    Object.keys(settings["input"]).forEach(key => {
        if(document.getElementById(key)){
            document.getElementById(key).value = settings["input"][key]
        }
    })

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
        document.getElementById("replaceAreaContainer").classList.remove("hide")
        document.getElementById("settingsContainer").classList.add("hide")
        document.getElementById("replaceArea").value = settings["replace"][settingName]
        settingEl.classList.add("replaceActive")
    }
    else if(settingEl.classList.contains("default")){
        settingEl.classList.toggle("clicked")
        changeSetting(settingName, settingEl.classList.contains("clicked"), "button")
        const inputEl = document.getElementById(settingName.replace(/Button$/, "Input"))
        if(inputEl){
            if(settings["button"].includes(settingName)){
                inputEl.classList.remove("hideDefaultInput")
            }
            else{
                inputEl.classList.add("hideDefaultInput")
            }
        }
    }
}

const settingsVer = 1
const defaultSettings = {
"button": [
    "nicknameDisable",
    "happinessDisable",
    "genderDisable",
    "shinyDisable",
    "teraDisable",
    "ivsDefaultButton", 
    "evsDefaultButton", 
    "levelDefaultButton", 
    "natureDefaultButton"], 
"input": {
    "nameOutput": ".species = SPECIES_${name}",
    "evsOrder": ["HP", " Atk", " Def", " Spe", " SpA", " SpD"], 
    "ivsOrder": ["HP", " Atk", " Def", " Spe", " SpA", " SpD"], 
    "evsOutput": ".ev = TRAINER_PARTY_EVS(${evs})", 
    "ivsOutput": ".iv = TRAINER_PARTY_IVS(${ivs})", 
    "levelOutput": ".lvl = ${level}",
    "natureOutput": ".nature = NATURE_${nature}",
    "movesOutput": ".moves = {${moves}}",
    "abilityOutput": ".ability = ABILITY_${ability}",
    "itemOutput": ".heldItem = ITEM_${item}",
    "nicknameOutput": '.nickname = COMPOUND_STRING("${nickname}")',
    "happinessOutput": ".friendship = ${happiness}",
    "genderOutput": ".gender = TRAINER_MON_${gender}",
    "shinyOutput": ".isShiny = ${shiny}",
    "teraOutput": ".tera = TYPE_${tera}",

    "nameDefaultInput": "NONE",
    "evsDefaultInput": "0, 0, 0, 0, 0, 0",
    "ivsDefaultInput": "31, 31, 31, 31, 31, 31",
    "levelDefaultInput": 100,
    "natureDefaultInput": "SERIOUS",
    "movesDefaultInput": "MOVE_NONE, MOVE_NONE, MOVE_NONE, MOVE_NONE",
    "abilityDefaultInput": "NONE",
    "itemDefaultInput": "NONE",
    "nicknameDefaultInput": "Idk",
    "happinessDefaultInput": 255,
    "genderDefaultInput": "MALE",
    "shinyDefaultInput": "FALSE",
    "teraDefaultInput": "NONE"},
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
"-Mega-X": ""
"-Mega-Y": ""
"-Mega": ""`,
"abilityReplace": ``,
"movesReplace": ``,
"itemReplace": ``}
}

window.settings = defaultSettings

document.addEventListener("DOMContentLoaded", () => {
    forceUpdate()

    applySettings()

    document.getElementById("pasteAreaButton").addEventListener("click", () => {
        document.getElementById("pasteAreaContainer").classList.add("hide")
        document.getElementById("settingsContainer").classList.remove("hide")
    })
    
    document.getElementById("outputAreaButton").addEventListener("click", () => {
        document.getElementById("pasteArea").value = ""
        document.getElementById("copyToClipboardStatus").innerText = ""
        document.getElementById("outputAreaContainer").classList.add("hide")
        document.getElementById("pasteAreaContainer").classList.remove("hide")
    })

    document.getElementById("replaceAreaButton").addEventListener("click", () => {
        document.getElementById("replaceAreaContainer").classList.add("hide")
        document.getElementById("settingsContainer").classList.remove("hide")
        settings["replace"][document.getElementsByClassName("replaceActive")[0].id] = document.getElementById("replaceArea").value
        localStorage.setItem("SECsettings", JSON.stringify(settings))
        document.getElementsByClassName("replaceActive")[0].classList.remove("replaceActive")
    })
})

function forceUpdate(){
    if(localStorage.getItem("SECsettingsVer") != `${settingsVer}`){
        localStorage.removeItem("SECsettings")
        localStorage.setItem("SECsettingsVer", `${settingsVer}`)
    }
}