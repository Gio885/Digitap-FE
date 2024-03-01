import axios from "axios";
import {URL_FIND_ALL_NEWS, URL_FIND_ONE_AREA_RANDOM} from "../utility/EndPoint";


export function findAllNews() {
    return axios.get(URL_FIND_ALL_NEWS).then((response) =>
        response.data
    )
        .catch(error => {
            console.log("C'è stato un errore durante il caricamento delle news: " + error);
        });
}