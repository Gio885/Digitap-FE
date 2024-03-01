import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import fotoParco from "../utility/foto/fotoParcoNazionaleFotoDettaglio.png";
import iconaAreaParco from "../utility/foto/iconaAreaParco.png";
import open from "../utility/foto/open.png"
import {
    COLORE_VERDE,
    IT,
    EN,
    FACILE,
    INTERMEDIO,
    DIFFICILE,
    COLORE_VIOLA,
    COLORE_ROSSO,
    COLORE_BIANCO,
    FACILE_STRING,
    INTERMEDIO_STRING,
    DIFFICILE_STRING,
    APERTO_STRING,
    CHIUSO,
    CHIUSO_STRING,
    APERTO,
    COLORE_VIOLA_CHIARO,
    TESTO,
    NESSUN_INFORMAZIONE_DISPONIBILE,
    DIFFICILE_PLUS,
    DIFFICILE_PLUS_STRING, AREA_PARCO, TESTO_AREA_PARCO, TESTO_AREA_MARINA, TROVA_AREA, ESPLORA_ITINERARI
} from "../utility/Costanti";
import {findOneAreaById} from "../service/areaService";
import {AREE_PROTETTE, DETTAGLI_AREA, HOME_PAGE, ITINERARI} from "../utility/Route";
import {formattaInKm, formattaInOre} from "../utility/Function";
import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";


export default function DettaglioItinerario(){

    const location = useLocation()
    const areaConItinerario = location.state.areaConItinerario;
    const [area,setArea] = useState()
    const [itinerario,setItinerario]= useState()
    const history = useHistory()
    const [coloreDifficolta,setColoreDifficolta] = useState()
    const [difficolta,setDifficolta] = useState()
    const {t,i18n} = useTranslation()

    useEffect(()=>{
        window.scrollTo(0, 0);
        caricamento()
    },[])

    async function caricamento(){
        let dataArea = await findOneAreaById(i18n.language,areaConItinerario.area.id)
        setArea(dataArea)
        setItinerario(areaConItinerario.itinerario)
        if(areaConItinerario.itinerario.idDifficolta == FACILE){
            setColoreDifficolta(COLORE_VERDE)
            setDifficolta(FACILE_STRING)
        }else if(areaConItinerario.itinerario.idDifficolta == INTERMEDIO){
            setColoreDifficolta(COLORE_VIOLA)
            setDifficolta(INTERMEDIO_STRING)
        }else if(areaConItinerario.itinerario.idDifficolta == DIFFICILE){
            setColoreDifficolta(COLORE_ROSSO)
            setDifficolta(DIFFICILE_STRING)
        }else if(areaConItinerario.itinerario.idDifficolta == DIFFICILE_PLUS){
            setColoreDifficolta(COLORE_ROSSO)
            setDifficolta(DIFFICILE_PLUS_STRING)
        }
    }
    return (
        <>
            {(area && itinerario) && (
                <div className="container text-center">
                    <div className={"row p-0 bg-areaParco  d-flex flex-column justify-content-center "}/>
                    <div className={"row p-0"} style={{backgroundColor:COLORE_VERDE}}>
                        <div className={"col-6 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"} >
                                <img className={"m-2 rounded-4"} style={{width:"350px",height:"100px"}} src={iconaAreaParco}/>
                        </div>
                        <div className={"col-6 d-flex flex-column  mt-4 mb-4"} >
                            <p className={"h1 btn-close-white text-start"}>{area.nome}</p>
                        </div>
                    </div>
                    <div className={"row p-0 d-flex flex-row text-start"}>
                        <div className={"col-12 d-flex flex-row mt-4"}>
                            <p className={"h5 "} style={{cursor:"pointer",color:"#0A58CA"}} onClick={()=> history.push(HOME_PAGE)}>Home page</p>
                            <p className={"h5 mx-1"} style={{cursor:"pointer",color:"#0A58CA"}} onClick={()=> history.push(ITINERARI)}>/ {t(ESPLORA_ITINERARI)} </p>
                            <p className={"h5 mx-1"} style={{cursor:"pointer",color:"#0A58CA"}} onClick={()=> history.push(DETTAGLI_AREA,{idArea : area.id})}>/ {area.nome}</p>
                            <p className={"h5"} >/ {itinerario.nome}</p>
                        </div>
                    </div>
                    <div className={"row p-0 d-flex flex-row align-items-center mt-3"}>
                        <div className={"col-3 mt-2"} style={{backgroundColor:COLORE_VIOLA,borderBottomRightRadius:"25px"}}>
                            <p className={"h3 fw-bold btn-close-white m-2"}>{t(difficolta)}</p>
                        </div>
                    </div>
                    <div className={"row p-0 mt-4"}>
                        <div className={"col-12 d-flex flex-row"}>
                            <p className={"h2 fw-bold text-start"}>{itinerario.nome}</p>
                            <p className={"h2 fw-bold text-start ms-3"}>({area.provincia})</p>
                        </div>
                        <div className={"col-12"}>
                            <p className={"h4 fw-light text-start"}>{t("Dislivello")} : {itinerario.dislivello}</p>
                        </div>
                    </div>
                    <div className={"row p-0 d-flex flex-row mt-4 mb-4"} >
                        <div className={"col-3 d-flex flex-column"} style={{backgroundColor:COLORE_VIOLA_CHIARO}}>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i style={{color:"black"}} className="fa-solid fa-signs-post fa-3x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Indicazioni Segnaletica")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{itinerario.indicazione ? itinerario.indicazione:NESSUN_INFORMAZIONE_DISPONIBILE}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i style={{color:"black"}} className="fa-solid fa-location-dot fa-3x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Partenza")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{itinerario.partenza ? itinerario.partenza:NESSUN_INFORMAZIONE_DISPONIBILE}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i style={{color:"black"}} className="fa-solid fa-location-dot fa-3x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Arrivo")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{itinerario.arrivo ? itinerario.arrivo:NESSUN_INFORMAZIONE_DISPONIBILE}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i style={{color:"black",scale:"1.5"}} className="fa-solid fa-clock fa-2x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Tempo medio percorrenza")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{(itinerario.tMedioPerc)? formattaInOre(itinerario.tMedioPerc) : NESSUN_INFORMAZIONE_DISPONIBILE}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <img src={open} style={{width:"50px",height:"50px"}}></img>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>Status</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{itinerario.status == APERTO ? APERTO_STRING :itinerario.status == CHIUSO ? CHIUSO_STRING : CHIUSO_STRING}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i  className="fa-solid fa-ruler fa-3x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Lunghezza percorso")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>{formattaInKm(itinerario.lunghezza)}</p>
                                </div>
                            </div>
                            <div className={"col-12 d-flex flex-row align-items-center mt-3"}>
                                <div className={"col-3"}>
                                    <i  className="fa-solid fa-road fa-3x"></i>
                                </div>
                                <div className={"col-9"}>
                                    <p className={"h5 fw-bold text-start ms-2"} style={{color:COLORE_VIOLA}}>{t("Tipo")}</p>
                                    <p className={"h6 fw-regular text-start ms-2"}>Ciclabile - Accessibile</p>
                                </div>
                            </div>
                        </div>
                        <div className={"col-8 d-flex flex-column ms-4"} >
                                <p className={"h4 fw-normal text-start"}>{itinerario.descrizione ? itinerario.descrizione :TESTO}</p>
                            <div className={"col-12 d-flex mt-3"}>
                                <Button  onClick={() => history.push(ITINERARI,{codiceArea : area.codice})}  style={{backgroundColor:COLORE_VIOLA,border:"none"}}>{t("Lista itinerari parco")}</Button>
                                <Button  onClick={()=> history.push(DETTAGLI_AREA,{idArea : area.id})}  className={"ms-4"} style={{backgroundColor:COLORE_VIOLA,border:"none"}}>{t("Vai al parco")}</Button>
                            </div>
                        </div>
                    </div>
                </div>


            )}
        </>
    )

}