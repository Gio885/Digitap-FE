import {GeoJSON, Marker, Popup, Tooltip, useMap} from "react-leaflet";
import {useEffect} from "react";
import L from "leaflet";
import {AREA_PARCO, REGIONI} from "../utility/Costanti";
import {useEventHandlers} from "@react-leaflet/core";


export default function GeoJsonComponent({regione,ricercaAreeRegione}){



    useEffect(()=>{
        console.log("geojson")

    },[regione])

    const highlight = (layer) =>{
        if(regione === "TUTTE LE REGIONI"){
            layer.on("mouseover",()=>{
                layer.setStyle({"fillColor":'rgba(255,215,86,0.88)'})
            })
            layer.on("mouseout",()=>{
                layer.setStyle({"fillColor":''})
            })
            layer.on("click",()=>{
                ricercaAreeRegione(layer.feature.properties.reg_name.toUpperCase())
            })
        }
    }

    return (
        <>
            {regione && (
                <GeoJSON key={REGIONI[regione].geoJson.features[0].properties.id} data={REGIONI[regione].geoJson} onEachFeature={(feature, layer) => highlight(layer)}/>
            )}
        </>
    )
}