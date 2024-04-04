document.getElementById("settingsButton").addEventListener("click", () => {
    let stop = false
    document.getElementById("settingsContainer").querySelectorAll('input[required]').forEach(el => {
        if(el.value == "" && window.getComputedStyle(el).display != "none"){
            el.classList.add("required")
            stop = true
        }
    })

    if(!stop){
        const teamLines = document.getElementById("pasteArea").value.replaceAll("-", "_").replaceAll(/'|!|&/g, "").split(/\n\s*\n/).filter(value => value != "")
        let team = []
        //const regex = /@\s*\w+|Ability:|Level:|Happiness:|EVs:|Nature|IVs:|^_\s*\w+/i
        const IVsEVsOrder = ["HP", "Atk", "Def", "Spe", "SpA", "SpD"]
        const statsRegex = /HP|Atk|Def|Spe|SpA|SpD/

        teamLines.forEach(mon => {
            team.push(mon.split("\n"))
        })

        let finalString = ""
        if(!settings["checkbox"].includes("trainerStructDisable")){
            finalString = `${trainerStructInput.value.trim()}${trainerStructName.value.trim()}[] = {\n`
        }

        team.forEach(mon => {
            let monString = "    {\n"
            let checkSpecies = false
            let name = "NONE", item = "NONE", ability = "NONE", level = 1, friendship = 0, evs = [0, 0, 0, 0, 0, 0], nature = "HARDY", ivs = [31, 31, 31, 31, 31, 31], moves = []

            mon.forEach(line => {
                line = line.trim()
                if(line == mon[0].trim()){
                    name = line.replace(/\s*\(\s*M\s*\)\s*|\s*\(\s*F\s*\)\s*/, "").replaceAll(" ", "_").match(/(\w+)(?!.*\()|\((\w+)/)[0].match(/\w+/)[0].toUpperCase().replace(/_$/, "") // it is what it is ¯\_(ツ)_/¯
                    monString += `        .species = SPECIES_${name},\n`
                    if(/@\s*(.*)/.test(line)){
                        item = line.match(/@\s*(.*)/i)[1].toUpperCase().replaceAll(" ", "_")
                        monString += `        .heldItem = ITEM_${item},\n`
                    }
                    checkSpecies = true
                }
                else if(/Ability:/.test(line)){
                    ability = line.match(/Ability:\s*(.*)/i)[1].toUpperCase().replaceAll(" ", "_")
                    monString += `        .ability = ABILITY_${ability},\n`
                }
                else if(/Level:/.test(line)){
                    level = line.match(/Level:\s*(\d+)/)[1]
                    monString += `        .lvl = ${level},\n`
                }
                else if(/Happiness:/.test(line)){
                    friendship = line.match(/Happiness:\s*(\d+)/)[1]
                    monString += `        .friendship = ${friendship},\n`
                }
                else if(/EVs:/.test(line)){
                    const matchEVs = line.match(/\d+\s*\w+/g)
                    matchEVs.forEach(ev => {
                        const index = IVsEVsOrder.indexOf(ev.match(statsRegex)[0])
                        evs[index] = ev.match(/\d+/)[0]
                    })
                    monString += `        .ev = TRAINER_PARTY_EVS(${evs}),\n`.replaceAll(",", ", ")
                }
                else if(/Nature/.test(line)){
                    nature = line.match(/\w+/)[0].toUpperCase()
                    monString += `        .nature = NATURE_${nature},\n`
                }
                else if(/IVs:/.test(line)){
                    const matchIVs = line.match(/\d+\s*\w+/g)
                    matchIVs.forEach(iv => {
                        const index = IVsEVsOrder.indexOf(iv.match(statsRegex)[0])
                        ivs[index] = iv.match(/\d+/)[0]
                    })
                    monString += `        .iv = TRAINER_PARTY_IVS(${ivs}),\n`.replaceAll(",", ", ")
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

        if(!settings["checkbox"].includes("trainerStructDisable")){
            finalString += "};\n"
        }
        
        document.getElementById("outputArea").value = finalString

        document.getElementById("settingsContainer").classList.add("hide")
        document.getElementById("outputAreaContainer").classList.remove("hide")

        document.getElementById("settingsContainer").querySelectorAll('input[required]').forEach(el => {
            el.value = ""
            el.classList.remove("required")
        })
    }
})

document.getElementById("pasteAreaButton").addEventListener("click", () => {
    document.getElementById("pasteAreaContainer").classList.add("hide")
    document.getElementById("settingsContainer").classList.remove("hide")
})

document.getElementById("outputAreaButton").addEventListener("click", () => {
    document.getElementById("outputAreaContainer").classList.add("hide")
    document.getElementById("pasteAreaContainer").classList.remove("hide")
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