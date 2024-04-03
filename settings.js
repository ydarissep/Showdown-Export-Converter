window.settings = []

applySettings()

function applySettings(){
    if(localStorage.getItem("settings")){
        settings = JSON.parse(localStorage.getItem("settings"))
    }

    // checkbox
    ["trainerStructDisable", "evsDisable"].forEach(settingName => {
        if(settings.includes(settingName)){
            applyCheckbox(settingName)
        }

        document.getElementById(settingName).addEventListener("change", () => {
            applyCheckbox(settingName)
        })
    })
}

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

function applyCheckbox(settingName){
    const settingEl = document.getElementById(settingName)
    changeSetting(settingName, settingEl.checked)

    for(const el of settingEl.closest("fieldset").children){
        if(el.tagName !== "legend" && !el.querySelector(`#${settingName}`)){
            if(settings.includes(settingName)){
                el.classList.add("hide")
            }
            else{
                el.classList.remove("hide")
            }
        }
    }
}