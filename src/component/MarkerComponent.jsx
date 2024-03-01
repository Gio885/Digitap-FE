import {LayersControl, Marker, Popup, Tooltip, useMap, useMapEvent, useMapEvents} from "react-leaflet";
import {useEffect} from "react";
import L from "leaflet";
import {AREA_PARCO, REGIONI} from "../utility/Costanti";
import {useEventHandlers} from "@react-leaflet/core";


export default function MarkerComponent({regione,aree,areaSelezionata,filtraLista}){

    const map = useMap()
    const iconaLocationParcoNazionale = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685022.png',
        iconSize: [25, 25]
    });
    const iconaLocationAreaMarina = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/10873/10873773.png',
        iconSize: [25, 25]
    });

    useEffect(()=>{
        console.log("markerComponent")
        if(aree){
            if(areaSelezionata){
                map.flyTo(areaSelezionata.location.coordinates,13)
            }else{
                map.flyTo(REGIONI[regione].coordinate,REGIONI[regione].zoom)
            }
        }
    },[aree])


    return (
        <>
            {aree && aree.map((area)=>(

                <Marker position={area.location.coordinates} icon={area.type === AREA_PARCO ? iconaLocationParcoNazionale :iconaLocationAreaMarina}
                        eventHandlers={{ click:()=> filtraLista(area.codice) }}>
                    <Tooltip>{area.nome}</Tooltip>
                </Marker>

                )
            )}
        </>
    )
}





{/*
const caricamento = ()=>{
        aree.map((e)=>{
            <Marker>
                <Tooltip>{area.nome}</Tooltip>
            </Marker>
        })
    }
*/}