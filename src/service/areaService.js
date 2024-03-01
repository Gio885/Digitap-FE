import axios from "axios";
import {
    URL_FIND_ALL_AREA,
    URL_FIND_ONE_AREA_RANDOM,
    URL_FIND_ONE_AREA_BY_ID,
    URL_FIND_ALL_REGIONI, URL_FIND_ALL_AREE_PER_REGIONE, URL_FIND_ONE_AREA_BY_CODICE, URL_FIND_BY_RICERCA
} from "../utility/EndPoint";
import {useHistory} from "react-router-dom";



export function findOneAreaRandom(language,tipo) {
    return axios.get(URL_FIND_ONE_AREA_RANDOM,{ params: {language:language,tipo: tipo} })
        .then((response) => response.data)
        .catch(error => {
            console.log("C'è stato un errore durante il caricamento dell'area: " + error);
        });
}


//CAMBIARE URL
export function findOneAreaByCodice(language,codice) {
    return axios.get(URL_FIND_ONE_AREA_BY_CODICE, { params: {language:language, codice: codice } })
        .then((response) => response.data)
        .catch(error => {
            console.log("C'è stato un errore durante il caricamento dell'area: " + error);
        });
}

export function findOneAreaById(language,id) {
    return axios.get(URL_FIND_ONE_AREA_BY_ID, { params: {language:language,id: id } })
        .then((response) => response.data)
        .catch(error => {
            console.log("C'è stato un errore durante il caricamento dell'area: " + error);
        });
}

export function findAllArea(language,tipo) {

    return axios.get(URL_FIND_ALL_AREA, {params:{language:language,tipo:tipo}})
        .then((response) =>
            response.data)
        .catch(error => {
            console.log("C'è stato un errore durante il caricamento delle aree Parco Nazionale: " + error);
        });
}

export function findAllRegioni(){
    return axios.get(URL_FIND_ALL_REGIONI).then((response)=>response.data).catch(error =>{
        console.log("C'è stato un errore durante il caricamento delle regioni: "+error)
    })
}

export function findAllAreePerRegione(language,regione){
    return axios.get(URL_FIND_ALL_AREE_PER_REGIONE,{params:{language:language,regione:regione}}).then((response)=>response.data).catch(error =>{
        console.log("C'è stato un errore durante il caricamento delle aree: "+error)
    })
}

export function findByRicerca(language,ricerca,operazioni){
    operazioni(true)
    return axios.get(URL_FIND_BY_RICERCA,{params:{language:language,ricerca:ricerca}}).then((response)=>{
        setTimeout(()=>{
            if(response.status == 200){
                operazioni(false,true,response.data)
            }else if(response.status == 204){
                operazioni(false,true,"La ricerca non ha prodotto alcun risultato")
            }
        },1000)
    }).catch(error =>{
        operazioni(false,false,"C'è stato un errore contattare l'assistenza")
    })

}