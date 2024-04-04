function applySettings(){
    if(localStorage.getItem("settings")){
        settings = JSON.parse(localStorage.getItem("settings"))
    }

    try{
        settings["checkbox"].forEach(settingName => {
            applyCheckbox(settingName)
        })

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if(checkbox.id){
                checkbox.addEventListener("change", () => {
                    applyCheckbox(checkbox.id)                
                })
            }
        })
    }
    catch{
        localStorage.removeItem("settings")
        settings = defaultSettings
        localStorage.setItem("settings", JSON.stringify(settings))
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
    localStorage.setItem("settings", JSON.stringify(settings))
}

function applyCheckbox(settingName){
    const settingEl = document.getElementById(settingName)
    changeSetting(settingName, settingEl.checked, "checkbox")

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

const defaultSettings = {"checkbox": []}

window.settings = defaultSettings

applySettings()