document.getElementById("settingsButton").addEventListener("click", () => {
    let stop = false
    document.querySelectorAll('input[required]').forEach(el => {
        if(el.value == "" && window.getComputedStyle(el).display != "none"){
            el.classList.add("required")
            stop = true
            window.scrollTo(0, 0)
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
            let check = {"name": false, "item": false, "gender": false, "nickname": false, "ability": false, "level": false, "shiny": false, "shiny": false, "happiness": false, "evs": false, "nature": false, "ivs": false, "tera": false, "moves": []}
            let name, item, gender, nickname, ability, level, shiny, happiness, evs, nature, ivs, tera, moves = []

            mon.forEach(line => {
                line = line.trim()
                if(line == mon[0].trim()){
                    monString += handleName(line, check, name)
                    if(/@/.test(line)){
                        monString += handleItem(line, check, item)
                    }
                    if(/\(\s*M\s*\)|\(\s*F\s*\)/i.test(line)){
                        monString += handleGender(line, check, gender)
                    }
                    if(/^\s*(.*)\s*(?!\(\s*M\s*\)|\(\s*F\s*\))(?=\()/i.test(line)){
                        monString += handleNickname(line, check, nickname)
                    }
                }
                else if(/Ability:/.test(line)){
                    monString += handleAbility(line, check, ability)
                }
                else if(/Level:/.test(line)){
                    monString += handleLevel(line, check, level)
                }
                else if(/Shiny:\s*Yes/.test(line)){
                    monString += handleShiny(line, check, shiny)
                }
                else if(/Happiness:/.test(line)){
                    monString += handleHappiness(line, check, happiness)
                }
                else if(/EVs:/.test(line)){
                    monString += handleEVs(line, check, evs)
                }
                else if(/Nature/.test(line)){
                    monString += handleNature(line, check, nature)
                }
                else if(/IVs:/.test(line)){
                    monString += handleIVs(line, check, ivs)
                }
                else if(/Tera Type/.test(line)){
                    monString += handleTera(line, check, tera)
                }
                else if(/^_\s*\w+/.test(line)){
                    moves.push(`MOVE_${line.replaceAll(/\s/g, "_").match(/^_*(\w+)/)[1].toUpperCase()}`)
                }
            })
            if(moves.length > 0){
                monString += handleMoves(moves, check)
            }

            monString += handleCheck(check)

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

        if(finalString !== ""){
            try{
                navigator.clipboard.writeText(finalString).then(() => {
                    copyToClipboardStatus.innerText = "Copied to clipboard!"
                })
            }
            catch(e){
                try{
                    copyToClipboard(finalString)
                    copyToClipboardStatus.innerText = "Copied to clipboard!"
                }
                catch(e){
                    console.log(e)
                }
            }
        }

        document.getElementById("settingsContainer").classList.add("hide")
        document.getElementById("outputAreaContainer").classList.remove("hide")

        document.querySelectorAll('input[required]').forEach(el => {
            el.value = ""
            el.classList.remove("required")
        })
        document.querySelectorAll('input[type="text"]:not([required])').forEach(el => {
            if(el.id){
                settings["input"][el.id] = el.value
                localStorage.setItem("SECsettings", JSON.stringify(settings))
            }
        })
    }
})


















function handleCheck(check){
    let string = ""
    document.querySelectorAll(".default.clicked").forEach(el => {
        if(el.id){
            const field = el.id.replace("DefaultButton", "")
            if(!check[field]){
                const disableEl = document.getElementById(`${field}Disable`)
                let disableb = false
                if(disableEl){
                    disableb = disableEl.classList.contains("clicked")
                }
                if(disableb === false){
                    const outputEl = document.getElementById(`${field}Output`)
                    const defaultEl = document.getElementById(`${field}DefaultInput`)
                    if(outputEl && defaultEl){
                        string += `        ${outputEl.value.replace(`\${${field}}`, defaultEl.value)},\n`
                    }
                }
            }
        }
    })
    return string
}

function handleName(line, check, name){
    check["name"] = true
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
        name = line.replace(/\s*\(\s*M\s*\)\s*|\s*\(\s*F\s*\)\s*/i, "").replaceAll(/\s/g, "_").match(/(\w+)(?!.*\()|\((\w+)/)[0].match(/\w+/)[0].toUpperCase().replace(/_$/, "") // it is what it is ¯\_(ツ)_/¯
        return `        ${document.getElementById("nameOutput").value.replace("${name}", name)},\n`
    }
    return ""
}

function handleNickname(line, check, nickname){
    check["nickname"] = true
    if(!document.getElementById("nicknameDisable").classList.contains("clicked")){
        nickname = line.match(/^\s*(.*)\s*(?!\(\s*M\s*\)|\(\s*F\s*\))(?=\()/i)[1].replace(/\s$/, "")
        return `        ${document.getElementById("nicknameOutput").value.replace("${nickname}", nickname)},\n`
    }
    return ""
}

function handleItem(line, check, item){
    check["item"] = true
    if(!document.getElementById("itemDisable").classList.contains("clicked")){
        item = line.match(/@\s*(.*)/i)[1].toUpperCase().replaceAll(/\s/g, "_")
        return `        ${document.getElementById("itemOutput").value.replace("${item}", item)},\n`
    }
    return ""
}

function handleGender(line, check, gender){
    check["gender"] = true
    if(!document.getElementById("genderDisable").classList.contains("clicked")){
        gender = line.match(/\(\s*M\s*\)|\(\s*F\s*\)/i)[0].toUpperCase().match(/F|M/i)[0]
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

function handleAbility(line, check, ability){
    check["ability"] = true
    if(!document.getElementById("abilityDisable").classList.contains("clicked")){
        ability = line.match(/Ability:\s*(.*)/i)[1].toUpperCase().replaceAll(/\s/g, "_")
        return `        ${document.getElementById("abilityOutput").value.replace("${ability}", ability)},\n`
    }
    return ""
}

function handleLevel(line, check, level){
    check["level"] = true
    if(!document.getElementById("levelDisable").classList.contains("clicked")){
        level = line.match(/Level:\s*(\d+)/)[1]
        return `        ${document.getElementById("levelOutput").value.replace("${level}", level)},\n`
    }
    return ""
}

function handleShiny(line, check, shiny){
    check["shiny"] = true
    if(!document.getElementById("shinyDisable").classList.contains("clicked")){
        shiny = "TRUE"
        return `        ${document.getElementById("shinyOutput").value.replace("${shiny}", shiny)},\n`
    }
    return ""
}

function handleHappiness(line, check, happiness){
    check["happiness"] = true
    if(!document.getElementById("happinessDisable").classList.contains("clicked")){
        happiness = line.match(/Happiness:\s*(\d+)/)[1]
        return `        ${document.getElementById("happinessOutput").value.replace("${happiness}", happiness)},\n`
    }
    return ""
}

function handleEVs(line, check, evs){
    check["evs"] = true
    if(!document.getElementById("evsDisable").classList.contains("clicked")){
        evs = [0, 0, 0, 0, 0, 0]
        const statsRegex = /HP|ATK|DEF|SPE|SPA|SPD/g
        const evsOrder = document.getElementById("evsOrder").value.toUpperCase().match(statsRegex)
        const matchEVs = line.match(/\d+\s*\w+/g)
        matchEVs.forEach(ev => {
            let index = evsOrder.indexOf(ev.toUpperCase().match(statsRegex)[0])
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

function handleNature(line, check, nature){
    check["nature"] = true
    if(!document.getElementById("natureDisable").classList.contains("clicked")){
        nature = line.match(/\w+/)[0].toUpperCase()
        return `        ${document.getElementById("natureOutput").value.replace("${nature}", nature)},\n`
    }
    return ""
}

function handleIVs(line, check, ivs){
    check["ivs"] = true
    if(!document.getElementById("ivsDisable").classList.contains("clicked")){
        ivs = [31, 31, 31, 31, 31, 31]
        const statsRegex = /HP|Atk|Def|Spe|SpA|SpD/ig
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

function handleTera(line, check, tera){
    check["tera"] = true
    if(!document.getElementById("teraDisable").classList.contains("clicked")){
        tera = line.match(/Tera Type: (\w+)/)[1].toUpperCase()
        return `        ${document.getElementById("teraOutput").value.replace("${tera}", tera)},\n`
    }
    return ""
}

function handleMoves(moves, check){
    check["moves"] = true
    if(!document.getElementById("movesDisable").classList.contains("clicked")){
        return `        ${document.getElementById("movesOutput").value.replace("${moves}", moves).replaceAll(",", ", ")},\n`
    }
    return ""
}
