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
            return "rgba(251, 174, 70, 0.3)"
        case "water" :
            return "rgba(85, 178, 224, 0.3)"
        case "bug":
            return "rgba(144, 194, 62, 0.3)"
        case "normal":
            return "rgba(171, 182, 196, 0.3)"
        case "poison":
            return "rgba(172, 98, 194, 0.3)"
        case "electric":
            return "rgba(234, 217, 109, 0.3)"
        case "ground":
            return "rgba(223, 151, 109, 0.3)"
        case "fairy":
            return "rgba(234, 200, 231, 0.6)"
        case "fighting":
            return "rgba(209, 46, 62, 0.3)"
        case "psychic":
            return "rgba(236, 110, 111, 0.3)"
        case "rock":
            return "rgba(189, 173, 131, 0.1)"
        case "steel":
            return "rgba(78, 128, 149, 0.3)"
        case "ghost":
            return "rgba(91, 111, 170, 0.3)"
        case "dragon":
            return "rgba(10, 101, 190, 0.35)"
        case "ice":
            return "rgba(109, 195, 181, 0.2)"
        case "dark":
            return "rgba(93, 92, 101, 0.3)"
        case "flying":
            return "rgba(140, 162, 211, 0.5)"
        default:
            return "#FBFBFB"
    }
}
