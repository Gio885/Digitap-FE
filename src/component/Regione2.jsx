import {
    AREA_PARCO,
    COLORE_BIANCO, ESPLORA_REGIONI, ITALIA,
    PARCO_NAZIONALE, REGIONI, TESTO_REGIONI, X_CENTRO_ITALIA, Y_CENTRO_ITALIA
} from "../utility/Costanti";
import {DETTAGLI_AREA, HOME_PAGE, RICERCA} from "../utility/Route";
import {Link, useHistory} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {findAllArea, findAllAreePerRegione, findAllRegioni, findOneAreaById, findOneAreaRandom} from "../service/areaService";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import L from "leaflet";
import {buildMarkerAndFly, costruzioneMappa, flyToSingleMarkerArea} from "../utility/Function";
import MarkerComponent from "./MarkerComponent";
import GeoJsonComponent from "./GeoJsonComponent";
import LayerControlComponent from "./LayerControlComponent";

import {MapContainer, Marker, Pane, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";



export default function Regione2(){

    const [areaHome, setAreaHome] = useState();
    const [tipoArea,setTipoArea] = useState();
    const [regioni,setRegioni] = useState();
    const [regioneSelezionata,setRegioneSelezionata] = useState("");
    const [listaAree,setListaAree] = useState()
    const history = useHistory();
    const {t,i18n} = useTranslation()
    const [areaSelezionata,setAreaSelezionata] = useState()
    const mappa = useRef()
    const iconaLocationParcoNazionale = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685022.png',
        iconSize: [25, 25]
    });
    const iconaLocationAreaMarina = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/10873/10873773.png',
        iconSize: [25, 25]
    });


    useEffect(()=>{
        window.scrollTo(0, 0);
        caricamento()
    },[])

    useEffect(()=>{
        caricamento()
        if(regioneSelezionata){
            ricercaAreeRegione(regioneSelezionata)
        }
    },[i18n.language])

    async function caricamento() {
        if(areaHome){
            let dataArea = await findOneAreaById(i18n.language,areaHome.id)
            setAreaHome(dataArea)
        }else{
            let dataArea = await findOneAreaRandom(i18n.language)
            setAreaHome(dataArea)
            setTipoArea(dataArea.type)
        }
        let dataRegioni = await findAllRegioni()
        setRegioneSelezionata(dataRegioni[0])
        setRegioni(dataRegioni)
        let dataAree = await findAllArea(i18n.language)
        setListaAree(dataAree)
        //buildMarkerAndFly(mappa,dataAree,iconaLocationParcoNazionale,iconaLocationAreaMarina,8,dataRegioni[0],history,ricercaAreeRegione)
    }

    async function ricercaAreeRegione(regione){
        setAreaSelezionata()
        let regioneFormattata = regione.split(" ")
        let primaParte = regioneFormattata[0]
        setRegioneSelezionata(regione)
        if(primaParte == "TUTTE"){
            let dataAree = await findAllArea(i18n.language)
            setListaAree(dataAree)
            //buildMarkerAndFly(mappa,dataAree,iconaLocationParcoNazionale,iconaLocationAreaMarina,8,regione,history,ricercaAreeRegione)
        }else{
            let dataAree = await findAllAreePerRegione(i18n.language,primaParte)
            setListaAree(dataAree)
            //buildMarkerAndFly(mappa,dataAree,iconaLocationParcoNazionale,iconaLocationAreaMarina,8,regione,history,ricercaAreeRegione)
        }
    }

    function filtraLista (codice){
        let areaFiltrata = listaAree.filter(e=>
            e.codice == codice)
        setListaAree(areaFiltrata)
        setAreaSelezionata(areaFiltrata[0])
        let icona = areaFiltrata.type == AREA_PARCO ? iconaLocationParcoNazionale : iconaLocationAreaMarina
        //flyToSingleMarkerArea(mappa,areaFiltrata,icona,13,history)
    }





    return (
        <>
            <div className="container text-center">
                {areaHome && (
                    <>
                        <div className={tipoArea === AREA_PARCO ? "row p-0 bg-areaParco  d-flex flex-column justify-content-center " : "row p-0 bg-areaMarina d-flex flex-column justify-content-center p-0"}>>
                            <div className="col-12 text-center">
                                <p className="h4 my-5" style={{ color: COLORE_BIANCO }}>{areaHome.nome}</p>
                            </div>
                            <div className="col-10 mx-auto text-center">
                                <p className="h5 text-start my-5 " style={{ color: COLORE_BIANCO }}>
                                    {(areaHome.descrizione && areaHome.descrizione.length > 50)
                                        ? areaHome.descrizione.split(' ').slice(0, 50).join(' ') + "..."
                                        : areaHome.descrizione}
                                </p>
                            </div>
                            <div className="col-12 text-center mt-1">
                                <Button className="border-0 mb-2" style={{ backgroundColor:"orange" }} onClick={() => history.push(DETTAGLI_AREA, { idArea: areaHome.id })}>
                                    {t("Leggi di più")}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                <div className={"row p-0 d-flex flex-row"} style={{backgroundColor:"orange"}}>
                    <div className={"col-6 d-flex justify-content-center"}>
                        <i style={{color:COLORE_BIANCO}} className="fa-regular fa-chess-rook fa-8x mt-5 mb-5"></i>
                    </div>
                    <div className={"col-6 d-flex justify-content-center align-items-center"}>
                        <p className={"h2 text-start btn-close-white"}>{t(TESTO_REGIONI)}</p>
                    </div>
                </div>
                <div className={"row p-0 d-flex flex-row mt-3"}>
                    <div className={"col-6 d-flex flex-row"}>
                        <Link to={HOME_PAGE}> <p style={{textDecoration:"none"}} className={"h5 mx-2 text-start"}>Home page</p></Link>
                        <p className={"h5 mx-2 text-start fw-bold"}>/ {t(ESPLORA_REGIONI)}</p>
                    </div>
                </div>
                <div className={"row p-0 mt-4"}>
                    {regioneSelezionata && <p className={"h2 text-start"}>{regioneSelezionata}</p>}
                </div>
                <div className={"row p-0 d-flex mt-4 mb-4"} >
                    <div className={"col-md-4 d-flex flex-column"}>
                        {regioni && regioni.map((regione,index)=>(
                            <>
                                <div className={"row"}>
                                    {(regioneSelezionata && regioneSelezionata == regione)&&(
                                        <div className={"col-4"} style={{width:"13px",height:"30px",backgroundColor:"orange"}}></div>
                                    )}
                                    <div className={"col-8 d-flex"}>
                                        <p className={"h4 text start mb-3"} onClick={(e)=>ricercaAreeRegione(regione)} style={{cursor:"pointer",fontWeight:regioneSelezionata==regione ?"bold":"lighter"}} keys={index}>{regione}</p>
                                    </div>
                                </div>
                                {(regioneSelezionata == regione && regioneSelezionata != ITALIA) && listaAree.map((area,index)=>(
                                        <div className={"row d-flex"}>
                                            <div className={"col-12 d-flex"}>
                                                <ul >
                                                    <li className={"text-start"} style={{cursor:"pointer",fontWeight:(areaSelezionata && areaSelezionata.codice == area.codice) ? "bold":""}} onClick={()=> filtraLista(area.codice)} >{area.nome}</li>
                                                </ul>
                                            </div>
                                        </div>
                                ))}
                            </>
                        ))}
                    </div>
                    <div className={"col-md-8"} style={{height:"900px"}}>
                        <MapContainer center={[REGIONI[ITALIA].coordinate[0],REGIONI[ITALIA].coordinate[1]]} zoom={REGIONI[ITALIA].zoom}>
                            {/*DISABILITA SCROLL MOUSE, DI DEFAULT SONO TRUE <Map zoomControl=false scrollWheelZoom=false doubleClickZoom=false touchZoom=false boxZoom=false />*/}
                            <TileLayer url={"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"} />
                            <LayerControlComponent regione={regioneSelezionata} aree = {listaAree} areaSelezionata = {areaSelezionata} filtraLista = {filtraLista} ricercaAreeRegione={ricercaAreeRegione} />
                        </MapContainer>
                    </div>




                    <div className={"col-12"} style={{height:"900px"}}>
                        <MapContainer center={[51.505, -0.09]} zoom={13}>
                            <Pane name={"1"} style={{backgroundColor:"red",border:"13px solid black"}}/>
                            <Pane name={"2"} style={{backgroundColor:"red",border:"13px solid black"}}/>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        </MapContainer>
                    </div>





                </div>
            </div>
        </>
    )

}





{/*


    async function costruzioneMappaConMarker(regioneSel,lista){
        mappa.current.containerMarker.clearLayers();  //CONTAINER MARKER, CONTENITORE CREATO NEL MOMENTO IN CUI VIENE INIZIALIZZATA LA MAPPA
        if(regioneSel){
            let nuovaLista = lista.map((area)=>{
                let nuovoMarker = L.marker(area.location.coordinates,{icon:area.type == AREA_PARCO ? iconaLocationParcoNazionale : iconaLocationAreaMarina,id:"marker"}).bindPopup(area.nome)
                mappa.current.containerMarker.addLayer(nuovoMarker)
                return nuovoMarker
            })
        }
    }



<MapContainer center={[42.5165,12.5266]} zoom={6} scrollWheelZoom={false}>
                            DISABILITA SCROLL MOUSE, DI DEFAULT SONO TRUE <Map zoomControl=false scrollWheelZoom=false doubleClickZoom=false touchZoom=false boxZoom=false />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                            { (areaSelezionata)
                                ?
                                <MarkerComponent position={areaSelezionata.location.coordinates} icon={areaSelezionata.type == AREA_PARCO ? iconaLocationParcoNazionale :iconaLocationAreaMarina}>
                                    <Popup>
                                        <p onClick={(e)=>history.push(DETTAGLI_AREA,{idArea:areaSelezionata.id})} style={{cursor:"pointer",textDecoration:"underline"}} >{areaSelezionata.nome}</p>
                                    </Popup>
                                </MarkerComponent>
                                :
                                <>
                                    {(listaAree && listaAree.length>0) && listaAree.map((area,index)=>(
                                        <MarkerComponent keys={index} position={area.location.coordinates} icon={area.type == AREA_PARCO ? iconaLocationParcoNazionale :iconaLocationAreaMarina}>
                                            <Popup>
                                                <p onClick={(e)=>history.push(DETTAGLI_AREA,{idArea:area.id})} style={{cursor:"pointer",textDecoration:"underline"}} >{area.nome}</p>
                                            </Popup>
                                        </MarkerComponent>
                                    ))}
                                </>
                            }
                        </MapContainer>*/}




{/* <div className={"col-sm-8 "} >
                        <div className={"col-12 d-flex flex-wrap justify-content-center"}>
                            {(listaAree && listaAree.length>0) && listaAree.map((area,index)=>(
                                <div className={"col-md-5 d-flex flex-column  mb-2 mx-4 mb-4  rounded-4 "} style={{backgroundColor:COLORE_GRIGIO_CHIARO}} key={index} onClick={(e)=>history.push(DETTAGLI_AREA,{idArea:area.id})}>
                                    {area.type == AREA_PARCO ?
                                        <img  className={"mx-auto img-fluid img-thumbnail"} src={imgAreaParco} style={{ width: "406px", height: "220px"}}></img>
                                        :
                                        <img  className={"mx-auto img-fluid img-thumbnail"} src={imgAreaMarina} style={{ width: "406px", height: "220px"}}></img>
                                    }
                                    <p className={"h3 mt-2"} style={{color:area.type == AREA_PARCO ? COLORE_VERDE : area.type == AREA_MARINA ? COLORE_CELESTE : ""}}>{area.type == AREA_PARCO ? t(PARCO_NAZIONALE): area.type == AREA_MARINA ? t(AREA_MARINA_PROTETTA) :""}</p>
                                    <p className={"h5 mb-3"}>{area.nome}</p>
                                </div>
                            ))}
                        </div>
                    </div>*/}