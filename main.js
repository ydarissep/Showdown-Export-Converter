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

        teamLines.forEach(mon => {
            team.push(mon.split("\n"))
        })

        let finalString = ""
        if(!settings["button"].includes("trainerStructDisable")){
            finalString = `${trainerStructInput.value.trim()}${trainerStructName.value.trim()}[] = {\n`
        }

        team.forEach(mon => {
            let monString = "    {\n"
            let moves = []

            mon.forEach(line => {
                line = line.trim()
                if(line == mon[0].trim()){
                    monString += handleName(line)
                    if(/@/.test(line)){
                        monString += handleItem(line)
                    }
                    if(/\(\s*M\s*\)|\(\s*F\s*\)/i.test(line)){
                        monString += handleGender(line)
                    }
                    if(/^\s*(.*)\s*(?!\(\s*M\s*\)|\(\s*F\s*\))(?=\()/i.test(line)){
                        monString += handleNickname(line)
                    }
                }
                else if(/Ability:/.test(line)){
                    monString += handleAbility(line)
                }
                else if(/Level:/.test(line)){
                    monString += handleLevel(line)
                }
                else if(/Shiny:\s*Yes/.test(line)){
                    monString += handleShiny(line)
                }
                else if(/Happiness:/.test(line)){
                    monString += handleHappiness(line)
                }
                else if(/EVs:/.test(line)){
                    monString += handleEVs(line)
                }
                else if(/Nature/.test(line)){
                    monString += handleNature(line)
                }
                else if(/IVs:/.test(line)){
                    monString += handleIVs(line)
                }
                else if(/^_\s*\w+/.test(line)){
                    moves.push(`MOVE_${line.replaceAll(/\s/g, "_").match(/^_*(\w+)/)[1].toUpperCase()}`)
                }
            })
            if(moves.length > 0){
                monString += handleMoves(moves)
            }

            monString = monString.replace(/,\s*\n$/, "\n")
            monString += "    },\n"
            if(mon == team[team.length - 1]){
                monString = monString.replace(/,\n$/, "\n")
            }

            finalString += monString
        })

        if(!settings["button"].includes("trainerStructDisable")){
            finalString += "};\n"
        }
        
        document.getElementById("outputArea").value = finalString

        document.getElementById("settingsContainer").classList.add("hide")
        document.getElementById("outputAreaContainer").classList.remove("hide")

        document.getElementById("settingsContainer").querySelectorAll('input[required]').forEach(el => {
            el.value = ""
            el.classList.remove("required")
        })
        document.getElementById("settingsContainer").querySelectorAll('input[type="text"]:not([required])').forEach(el => {
            if(el.id){
                settings["input"][el.id] = el.value
                localStorage.setItem("SECsettings", JSON.stringify(settings))
            }
        })
    }
})




















function handleName(line){
    if(!document.getElementById("nameDisable").classList.contains("clicked")){
        settings["replace"]["nameReplace"].split("\n").forEach(string => {
            if(/".+"\s*:\s*".*"/.test(string)){
                const stringMatch = string.replaceAll("-", "_").match(/"(.+)"\s*:\s*"(.*)"/)
                const regex = new RegExp(stringMatch[1], "i")
                if(line.includes(stringMatch[1])){
                    line = line.replace(regex, stringMatch[2])
                }
            }
        })
        let name = line.replace(/\s*\(\s*M\s*\)\s*|\s*\(\s*F\s*\)\s*/i, "").replaceAll(/\s/g, "_").match(/(\w+)(?!.*\()|\((\w+)/)[0].match(/\w+/)[0].toUpperCase().replace(/_$/, "") // it is what it is ¯\_(ツ)_/¯
        return `        ${document.getElementById("nameOutput").value.replace("${name}", name)},\n`
    }
    return ""
}

function handleNickname(line){
    if(!document.getElementById("nicknameDisable").classList.contains("clicked")){
        let nickname = line.match(/^\s*(.*)\s*(?!\(\s*M\s*\)|\(\s*F\s*\))(?=\()/i)[1].replace(/\s$/, "")
        return `        ${document.getElementById("nicknameOutput").value.replace("${nickname}", nickname)},\n`
    }
    return ""
}

function handleItem(line){
    if(!document.getElementById("itemDisable").classList.contains("clicked")){
        let item = line.match(/@\s*(.*)/i)[1].toUpperCase().replaceAll(/\s/g, "_")
        return `        ${document.getElementById("itemOutput").value.replace("${item}", item)},\n`
    }
    return ""
}

function handleGender(line){
    if(!document.getElementById("genderDisable").classList.contains("clicked")){
        let gender = line.match(/\(\s*M\s*\)|\(\s*F\s*\)/i)[0].toUpperCase().match(/F|M/i)[0]
        if(gender == "F"){
            gender = "FEMALE"
        }
        else if(gender == "M"){
            gender = "MALE"
        }
        return `        ${document.getElementById("genderOutput").value.replace("${gender}", gender)},\n`
    }
    return ""
}

function handleAbility(line){
    if(!document.getElementById("abilityDisable").classList.contains("clicked")){
        let ability = line.match(/Ability:\s*(.*)/i)[1].toUpperCase().replaceAll(/\s/g, "_")
        return `        ${document.getElementById("abilityOutput").value.replace("${ability}", ability)},\n`
    }
    return ""
}

function handleLevel(line){
    if(!document.getElementById("levelDisable").classList.contains("clicked")){
        let level = line.match(/Level:\s*(\d+)/)[1]
        return `        ${document.getElementById("levelOutput").value.replace("${level}", level)},\n`
    }
    return ""
}

function handleShiny(line){
    if(!document.getElementById("shinyDisable").classList.contains("clicked")){
        let shiny = "TRUE"
        return `        ${document.getElementById("shinyOutput").value.replace("${shiny}", shiny)},\n`
    }
    return ""
}

function handleHappiness(line){
    if(!document.getElementById("happinessDisable").classList.contains("clicked")){
        let happiness = line.match(/Happiness:\s*(\d+)/)[1]
        return `        ${document.getElementById("happinessOutput").value.replace("${happiness}", happiness)},\n`
    }
    return ""
}

function handleEVs(line){
    if(!document.getElementById("evsDisable").classList.contains("clicked")){
        let evs = [0, 0, 0, 0, 0, 0]
        const statsRegex = /HP|Atk|Def|Spe|SpA|SpD/g
        const evsOrder = document.getElementById("evsOrder").value.match(statsRegex)
        const matchEVs = line.match(/\d+\s*\w+/g)
        matchEVs.forEach(ev => {
            let index = evsOrder.indexOf(ev.match(statsRegex)[0])
            if(index == -1){
                index = defaultSettings["input"]["evsOrder"].indexOf(ev.match(statsRegex)[0])
                document.getElementById("evsOrder").value = defaultSettings["input"]["evsOrder"]
            }
            evs[index] = ev.match(/\d+/)[0]
        })
        return `        ${document.getElementById("evsOutput").value.replace("${evs}", evs).replaceAll(",", ", ")},\n`
    }
    return ""
}

function handleNature(line){
    if(!document.getElementById("natureDisable").classList.contains("clicked")){
        let nature = line.match(/\w+/)[0].toUpperCase()
        return `        ${document.getElementById("natureOutput").value.replace("${nature}", nature)},\n`
    }
    return ""
}

function handleIVs(line){
    if(!document.getElementById("ivsDisable").classList.contains("clicked")){
        let ivs = [31, 31, 31, 31, 31, 31]
        const statsRegex = /HP|Atk|Def|Spe|SpA|SpD/g
        const ivsOrder = document.getElementById("ivsOrder").value.match(statsRegex)
        const matchIVs = line.match(/\d+\s*\w+/g)
        matchIVs.forEach(iv => {
            let index = ivsOrder.indexOf(iv.match(statsRegex)[0])
            if(index == -1){
                index = defaultSettings["input"]["ivsOrder"].indexOf(iv.match(statsRegex)[0])
                document.getElementById("ivsOrder").value = defaultSettings["input"]["ivsOrder"]
            }
            ivs[index] = iv.match(/\d+/)[0]
        })
        return `        ${document.getElementById("ivsOutput").value.replace("${ivs}", ivs).replaceAll(",", ", ")},\n`
    }
    return ""
}

function handleMoves(moves){
    if(!document.getElementById("movesDisable").classList.contains("clicked")){
        return `        ${document.getElementById("movesOutput").value.replace("${moves}", moves).replaceAll(",", ", ")},\n`
    }
    return ""
}
