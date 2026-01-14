export const PokeTypeColor = (type: string): [string, string] => {
    switch (type) {
        case "grass":
            return ["#00990D", "#00FF15"]
        case "fire" : 
            return ["#942601", "#FA4002"]
        case "water" :
            return ["#284E77", "#4A90DD"]
        case "bug":
            return ["#638514", "#AFEB24"]
        case "normal":
            return ["#959595", "#FBFBFB"]
        case "poison":
            return ["#7B316A", "#E15AC2"]
        case "electric":
            return ["#94790E", "#FACD18"]
        case "ground":
            return ["#4B2D14", "#B16930"]
        case "fairy":
            return ["#745A72", "#C273BA"]
        case "fighting":
            return ["#7C0F0F", "#E21C1C"]
        case "psychic":
            return ["#904142", "#F66F71"]
        case "rock":
            return ["#5F5742", "#C5B489"]
        case "steel":
            return ["#1D2F37", "#52869D"]
        case "ghost":
            return ["#212B46", "#516AAC"]
        case "dragon":
            return ["#063362", "#0C69C8"]
        case "ice":
            return ["#38665F", "#70CCBD"]
        case "dark":
            return ["#424246", "#66656C"]
        case "flying":
            return ["#4D5974", "#90A7DA"]
        default:
            return ["#959595", "#FBFBFB"]
    }
}

export const secondaryTypeColor = (type: string): string => {
    switch (type) {
        case "grass":
            return "rgba(169, 216, 175, 0.5)"
        case "fire" : 
            return "rgba(247, 149, 81, 0.5)"
        case "water" :
            return "rgba(74, 123, 215, 0.5)"
        // case "bug":
        //     return ["#638514", "#AFEB24"]
        // case "normal":
        //     return ["#959595", "#FBFBFB"]
        // case "poison":
        //     return ["#7B316A", "#E15AC2"]
        // case "electric":
        //     return ["#94790E", "#FACD18"]
        // case "ground":
        //     return ["#4B2D14", "#B16930"]
        // case "fairy":
        //     return ["#745A72", "#C273BA"]
        // case "fighting":
        //     return ["#7C0F0F", "#E21C1C"]
        // case "psychic":
        //     return ["#904142", "#F66F71"]
        // case "rock":
        //     return ["#5F5742", "#C5B489"]
        // case "steel":
        //     return ["#1D2F37", "#52869D"]
        // case "ghost":
        //     return ["#212B46", "#516AAC"]
        // case "dragon":
        //     return ["#063362", "#0C69C8"]
        // case "ice":
        //     return ["#38665F", "#70CCBD"]
        // case "dark":
        //     return ["#424246", "#66656C"]
        // case "flying":
        //     return ["#4D5974", "#90A7DA"]
        default:
            return "#FBFBFB"
    }
}
