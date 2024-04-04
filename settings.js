function applySettings(){
    if(localStorage.getItem("SEC")){
        SEC = JSON.parse(localStorage.getItem("SEC"))
    }

    try{
        SEC["checkbox"].forEach(settingName => {
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
        localStorage.removeItem("SEC")
        SEC = defaultSettings
        localStorage.setItem("SEC", JSON.stringify(SEC))
    }
}

function changeSetting(setting, enable = false, key){
    if(enable){
        if(!SEC[key].includes(setting)){
            SEC[key].push(setting)
        }
    }
    else{
        SEC[key] = SEC[key].filter(value => value != setting)
    }
    localStorage.setItem("SEC", JSON.stringify(SEC))
}

function applyCheckbox(settingName){
    const settingEl = document.getElementById(settingName)
    changeSetting(settingName, settingEl.checked, "checkbox")

    for(const el of settingEl.closest("fieldset").children){
        if(el.tagName !== "LEGEND" && !el.querySelector(`#${settingName}`)){
            if(SEC["checkbox"].includes(settingName)){
                el.classList.add("hide")
            }
            else{
                el.classList.remove("hide")
            }
        }
    }
}

const defaultSettings = {"checkbox": []}

window.SEC = defaultSettings

applySettings()