import GrassType from "@/assets/Icons/pokeTypes/Grass.svg";
import WaterType from "@/assets/Icons/pokeTypes/Water.svg";
import BugType from "@/assets/Icons/pokeTypes/Bug.svg";
import DarkType from "@/assets/Icons/pokeTypes/Dark.svg";
import DragonType from "@/assets/Icons/pokeTypes/Dragon.svg";
import ElectricType from "@/assets/Icons/pokeTypes/Electric.svg";
import FairyType from "@/assets/Icons/pokeTypes/Fairy.svg";
import FightingType from "@/assets/Icons/pokeTypes/Fighting.svg";
import FireType from "@/assets/Icons/pokeTypes/Fire.svg";
import FlyingType from "@/assets/Icons/pokeTypes/Flying.svg";
import GhostType from "@/assets/Icons/pokeTypes/Ghost.svg";
import GroundType from "@/assets/Icons/pokeTypes/Ground.svg";
import IceType from "@/assets/Icons/pokeTypes/Ice.svg";
import NormalType from "@/assets/Icons/pokeTypes/Normal.svg";
import PoisonType from "@/assets/Icons/pokeTypes/Poison.svg";
import PsychicType from "@/assets/Icons/pokeTypes/Psychic.svg";
import SteelType from "@/assets/Icons/pokeTypes/Steel.svg";
import RockType from "@/assets/Icons/pokeTypes/Rock.svg";
import { StyleSheet } from "react-native";

export const PokeTypeIcon = (type: string) => {
    switch (type) {
        case 'grass':
            return <GrassType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'fire':
            return <FireType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'water':
            return <WaterType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'bug':
            return <BugType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'dark':
            return <DarkType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'dragon':
            return <DragonType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'electric':
            return <ElectricType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'ice':
            return <IceType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'steel':
            return <SteelType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'fairy':
            return <FairyType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'fighting':
            return <FightingType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'flying':
            return <FlyingType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'ghost':
            return <GhostType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'ground':
            return <GroundType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'Normal':
            return <NormalType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'poison':
            return <PoisonType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'psychic':
            return <PsychicType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        case 'rock':
            return <RockType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />
        default:
            return <NormalType width={100} height={100} style={{ position: 'absolute', right: '3%' }} />    
    }
}

export const PokeBG = (type: string) => {
    switch (type) {
        case 'grass':
            return <GrassType width={550} height={550} style={styles.background} />
        case 'fire':
            return <FireType width={550} height={550} style={styles.background} />
        case 'water':
            return <WaterType width={550} height={550} style={styles.background} />
        case 'bug':
            return <BugType width={550} height={550} style={styles.background} />
        case 'dark':
            return <DarkType width={550} height={550} style={styles.background} />
        case 'dragon':
            return <DragonType width={550} height={550} style={styles.background} />
        case 'electric':
            return <ElectricType width={550} height={550} style={styles.background} />
        case 'ice':
            return <IceType width={550} height={550} style={styles.background} />
        case 'steel':
            return <SteelType width={550} height={550} style={styles.background} />
        case 'fairy':
            return <FairyType width={550} height={550} style={styles.background} />
        case 'fighting':
            return <FightingType width={550} height={550} style={styles.background} />
        case 'flying':
            return <FlyingType width={550} height={550} style={styles.background} />
        case 'ghost':
            return <GhostType width={550} height={550} style={styles.background} />
        case 'ground':
            return <GroundType width={550} height={550} style={styles.background} />
        case 'Normal':
            return <NormalType width={550} height={550} style={styles.background} />
        case 'poison':
            return <PoisonType width={550} height={550} style={styles.background} />
        case 'psychic':
            return <PsychicType width={550} height={550} style={styles.background} />
        case 'rock':
            return <RockType width={550} height={550} style={styles.background} />
        default:
            return <NormalType width={550} height={550} style={styles.background} />    
    }
}

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFillObject,
        transform: [{translateX: "-16%"}, {translateY: "-30%"}]
        // zIndex: 4
    }
})