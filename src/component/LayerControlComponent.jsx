import {FeatureGroup, LayerGroup, LayersControl, Marker, TileLayer, useMap} from "react-leaflet";
import {useEffect, useState} from "react";
import { useLeafletContext } from '@react-leaflet/core'
import L from "leaflet"
import MarkerComponent from "./MarkerComponent";
import GeoJsonComponent from "./GeoJsonComponent";


export default function LayerControlComponent({regione,aree,areaSelezionata,filtraLista,ricercaAreeRegione}){


    const map = useMap()
    const context = useLeafletContext()
    const [showAree, setShowAree] = useState(true);
    const [showGeoJSON, setShowGeoJSON] = useState(true);

    useEffect(()=>{

    },[])

    return (
        <>
            <LayersControl>
                <LayersControl.BaseLayer name={"visualizzazione 1"} > >
                    <TileLayer url={"https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'"} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={"visualizzazione 2"}>
                    <TileLayer url={"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={"visualizzazione 3"}>
                    <TileLayer url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={"visualizzazione 4"} checked={true}>
                    <TileLayer url={"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"} />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay name={"aree"} checked={showAree} onChange={() => setShowAree(!showAree)}>
                    {showAree && (
                        <LayerGroup>
                            <MarkerComponent regione={regione} aree = {aree} areaSelezionata = {areaSelezionata} filtraLista = {filtraLista} />
                        </LayerGroup>
                    )}
                </LayersControl.Overlay>
                <LayersControl.Overlay name={"geo"} checked={showGeoJSON} onChange={() => setShowGeoJSON(!showGeoJSON)}>
                    {showGeoJSON && (
                        <FeatureGroup>
                            <GeoJsonComponent regione={regione} ricercaAreeRegione={ricercaAreeRegione}/>
                        </FeatureGroup>
                    )}
                </LayersControl.Overlay>
            </LayersControl>





        </>
    )
}