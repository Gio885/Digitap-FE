import axios from "axios";
import {URL_FIND_ALL_ITINERARIO_PARCO, URL_FIND_PARCO_FROM_ITINERARIO} from "../utility/EndPoint";


export function findAllItinerarioParco(language,codice){
    return axios.get(URL_FIND_ALL_ITINERARIO_PARCO, {params :{language:language,codice : codice}}).then((response)=>response.data).catch(error=>{
        console.log("Errore caricamento lista itinerari del parco: "+error)
    })
}


export function findParcoFromItinerario(objectId){
    return axios.get(URL_FIND_PARCO_FROM_ITINERARIO, {params:{objectId : objectId }}).then((response)=> response.data).catch(error=>{
        console.log("Errore caricamento parco dell' itinerario: "+error)
    })
}