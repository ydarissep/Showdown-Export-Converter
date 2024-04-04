function applySettings(){
    if(localStorage.getItem("SECsettings")){
        settings = JSON.parse(localStorage.getItem("SECsettings"))
    }

    try{
        settings["checkbox"].forEach(settingName => {
            applyCheckbox(settingName, true, "checkbox")
        })

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if(checkbox.id){
                checkbox.addEventListener("change", () => {
                    applyCheckbox(checkbox.id, checkbox.checked, "checkbox")
                })
                if(settings["checkbox"].includes(checkbox.id)){
                    checkbox.checked = true
                }
            }
        })
    }
    catch{
        settings["checkbox"] = defaultSettings["checkbox"]
        localStorage.setItem("SECsettings", JSON.stringify(settings))
        applySettings()
    }
    try{
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

function applyCheckbox(settingName, enable = false, key){
    const settingEl = document.getElementById(settingName)
    changeSetting(settingName, enable, "checkbox")

    for(const el of settingEl.closest("fieldset").children){
        if(el.tagName !== "LEGEND" && !el.querySelector(`#${settingName}`)){
            if(settings["checkbox"].includes(settingName)){
                el.classList.add("hide")
            }
            else{
                el.classList.remove("hide")
            }
        }
    }
}

const defaultSettings = {"checkbox": [], "input": {"evsOrder": ["HP", "Atk", "Def", "Spe", "SpA", "SpD"], "evsOutput": ".ev = TRAINER_PARTY_EVS(${evs})", "natureOutput": ".nature = NATURE_${nature}"}}

window.settings = defaultSettings

applySettings()