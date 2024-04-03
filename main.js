const pasteAreaContainer = document.getElementById("pasteAreaContainer")
const pasteArea = document.getElementById("pasteArea")
const pasteAreaButton = document.getElementById("pasteAreaButton")

const outputAreaContainer = document.getElementById("outputAreaContainer")
const outputArea = document.getElementById("outputArea")
const outputAreaButton = document.getElementById("outputAreaButton")

const settingsContainer = document.getElementById("settingsContainer")
const settingsButton = document.getElementById("settingsButton")

pasteAreaButton.addEventListener("click", () => {
    pasteAreaContainer.classList.add("hide")
    settingsContainer.classList.remove("hide")

    trainerStructName.placeholder = "Trainer's name"
})

settingsButton.addEventListener("click", () => {
    const teamLines = pasteArea.value.replaceAll("-", "_").replaceAll(/'|!|&/g, "").split(/\n\s*\n/).filter(value => value != "")
    let team = []
    const regex = /@\s*\w+|Ability:|Level:|Happiness:|EVs:|Nature|IVs:|^_\s*\w+/i
    const IVsEVsOrder = ["HP", "Atk", "Def", "Spe", "SpA", "SpD"]
    const statsRegex = /HP|Atk|Def|Spe|SpA|SpD/

    teamLines.forEach(mon => {
        team.push(mon.split("\n"))
    })

    let finalString = ""
    if(!settings.includes("trainerStructDisable")){
        if(trainerStructName.value.trim() == ""){
            required(trainerStructName)
            return
        }
        else{
            finalString = `${trainerStructInput.value.trim()}${trainerStructName.value.trim()}[] = {\n`
        }
    }

    team.forEach(mon => {
        let monString = "    {\n"
        let checkSpecies = false
        let moves = []
        mon.forEach(line => {
            line = line.trim()
            if(line == mon[0].trim()){
                monString += `        .species = SPECIES_${line.replaceAll(" ", "_").match(/\w+/i)[0].toUpperCase().replace(/_$/, "")},\n`
                if(/@\s*(.*)/.test(line)){
                    monString += `        .heldItem = ITEM_${line.match(/@\s*(.*)/i)[1].toUpperCase().replaceAll(" ", "_")},\n`
                }
                checkSpecies = true
            }
            else if(/Ability:/.test(line)){
                monString += `        .ability = ABILITY_${line.match(/Ability:\s*(.*)/i)[1].toUpperCase().replaceAll(" ", "_")},\n`
            }
            else if(/Level:/.test(line)){
                monString += `        .lvl = ${line.match(/Level:\s*(\d+)/)[1]},\n`
            }
            else if(/Happiness:/.test(line)){
                monString += `        .friendship = ${line.match(/Happiness:\s*(\d+)/)[1]},\n`
            }
            else if(/EVs:/.test(line)){
                let EVs = [0, 0, 0, 0, 0, 0]
                const matchEVs = line.match(/\d+\s*\w+/g)
                matchEVs.forEach(EV => {
                    EVs[IVsEVsOrder.indexOf(EV.match(statsRegex)[0])] = EV.match(/\d+/)[0]
                })
                monString += `        .ev = TRAINER_PARTY_EVS(${EVs}),\n`.replaceAll(",", ", ")
            }
            else if(/Nature/.test(line)){
                monString += `        .nature = TRAINER_PARTY_NATURE(NATURE_${line.match(/\w+/)[0].toUpperCase()}),\n`
            }
            else if(/IVs:/.test(line)){
                let IVs = [31, 31, 31, 31, 31, 31]
                const matchIVs = line.match(/\d+\s*\w+/g)
                matchIVs.forEach(IV => {
                    IVs[IVsEVsOrder.indexOf(IV.match(statsRegex)[0])] = IV.match(/\d+/)[0]
                })
                monString += `        .iv = TRAINER_PARTY_IVS(${IVs}),\n`.replaceAll(",", ", ")
            }
            else if(/^_\s*\w+/.test(line)){
                moves.push(`MOVE_${line.replaceAll(" ", "_").match(/^_*(\w+)/)[1].toUpperCase()}`)
            }
        })
        if(moves.length > 0){
            monString += `        .moves = {${moves}},\n`.replaceAll(",", ", ")
        }
        if(checkSpecies){
            monString = monString.replace(/,\s*\n$/, "\n")
            monString += "    },\n"
            if(mon == team[team.length - 1]){
                monString = monString.replace(/,\n$/, "\n")
            }
            finalString += monString
        }
    })

    if(!settings.includes("trainerStructDisable")){
        finalString += "};\n"
    }
    
    outputArea.value = finalString

    Array.from(document.getElementsByClassName("required")).forEach(el => 
        el.classList.remove("required")
    )

    settingsContainer.classList.add("hide")
    outputAreaContainer.classList.remove("hide")
})

outputAreaButton.addEventListener("click", () => {
    outputAreaContainer.classList.add("hide")
    pasteAreaContainer.classList.remove("hide")
})


/*
species_replacements = {
    "HO_OH": "Ho-Oh",
    "PORYGON_Z": "Porygon-Z",
    "TYPE_NULL": "Type: Null",
    "JANGMO_O": "Jangmo-o",
    "HAKAMO_O": "Hakamo-o",
    "KOMMO_O": "Kommo-o",
    "WO_CHIEN": "Wo-Chien",
    "CHIEN_PAO": "Chien-Pao",
    "TING_LU": "Ting-Lu",
    "CHI_YU": "Chi-Yu",
    "_ALOLAN": "-Alola",
    "_GALARIAN": "-Galar",
    "_HISUIAN": "-Hisui",
}
*/



function required(el){
    el.classList.add("required")
    el.placeholder = "Required"
}