import {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {
    AREA,
    AREA_MARINA,
    AREA_PARCO,
    AREE_MARINE_PROTETTE, CODICE,
    COLORE_ARANCIO_CHIARO,
    COLORE_BIANCO,
    COLORE_BLUE,
    COLORE_CELESTE,
    COLORE_GRIGIO_CHIARO,
    COLORE_ROSSO,
    COLORE_VERDE,
    COLORE_VERDE_CHIARO,
    COLORE_VIOLA,
    COLORE_VIOLA_CHIARO, CONOSCI, CONTATTI_DETT,
    DIFFICILE,
    DIFFICILE_PLUS, ENTE, ESPLORA,
    FACILE, FLORA_FAUNA,
    IL_PARCO, INDIRIZZO,
    INTERMEDIO, ITINERARI_DETT, ITINERARIO, LUOGO,
    PARCHI_E_AREE_PROTETTE, STORIA_GEOGRAFIA, TESTO,
    TESTO_AREA_MARINA,
    TESTO_AREA_PARCO, VEDI_TUTTI_ITINERARI, VISITA
} from "../utility/Costanti";

import iconaAreaParco from "../utility/foto/iconaAreaParco.png";
import iconaAreaMarina from "../utility/foto/iconaAreaMarina.png";
import {AREE_PROTETTE, DETTAGLI_AREA, DETTAGLI_ITINERARIO, HOME_PAGE, ITINERARI} from "../utility/Route";
import { findOneAreaById} from "../service/areaService";
import {findAllItinerarioParco} from "../service/itinerarioService";
import {formattaInKm, formattaInOre} from "../utility/Function";
import facile from "../utility/foto/itinerarioFacile.png";
import medio from "../utility/foto/itinerarioMedio.png";
import difficile from "../utility/foto/itinerarioDifficile.png";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";


export default function DettagliArea(){

    const location = useLocation();
    const idArea = location.state.idArea
    const [area,setArea]=useState()
    const [colore,setColore] = useState()
    const [listaItinerari,setListaItinerari] = useState()
    const history = useHistory()
    const {t,i18n} = useTranslation()


    {/* L RAPPRESENZA L'IOGGETTO GLOBALE DI LEAFTLET, UTILIZZATO PER ACCEDERE AI SCRIPT DI LEAFLET, IN QUESTO L.ICON E UN COSTRUTTORE FORNITO
    DA LEAFTLET PER CREARE OGGETTI DI TIPO ICON*/}
    const iconaLocation = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2377/2377874.png',
        iconSize: [40, 40]
    });
    const iconaLocation2 = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/535/535137.png',
        iconSize: [40, 40]
    });


    useEffect(()=>{
        //window.scrollTo(0, 0);
        const response =  findOneAreaById(i18n.language,idArea)
        response.then((risultato)=>{
            setArea(risultato)
            console.log(risultato)
            if(risultato.type == AREA_PARCO){
                setColore(COLORE_VERDE)
                const dataListaItinerari = findAllItinerarioParco(i18n.language,risultato.codice)
                dataListaItinerari.then((risultato)=>{
                    const listaIdDifficolta = [];
                    const listaFiltrata = risultato.filter((e) => {
                        const idDifficolta = e.idDifficolta;
                        if (!listaIdDifficolta.includes(idDifficolta)) {
                            listaIdDifficolta.push(idDifficolta)
                            return true;
                        }
                        return false;
                    }).slice(0, 3);
                    setListaItinerari(listaFiltrata)
                })

            }else if(risultato.type == AREA_MARINA){
                setColore(COLORE_CELESTE)
            }
        })
        console.log(area)
    },[i18n.language])

    const goToDettagliItinerario = (e) =>{
        let areaConItinerario = {
            area : area,
            itinerario : e
        }
        history.push(DETTAGLI_ITINERARIO, {areaConItinerario : areaConItinerario})
    }

    return (
        <>

            {(area) && (
                <>
                    <div className="container text-center">
                        <div className={area.type === AREA_PARCO ? "row p-0 bg-areaParco  d-flex flex-column justify-content-center " : "row p-0 bg-areaMarina d-flex flex-column justify-content-center p-0"}/>
                        <div className={"row p-0"} style={{backgroundColor:colore}}>
                            <div className={"col-6 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"} >
                                {area.type == AREA_PARCO ?
                                    <img className={"m-2 rounded-4"} style={{width:"350px",height:"100px"}} src={iconaAreaParco}/>
                                    :
                                    <img className={"m-2 rounded-4"} style={{width:"150px",height:"150px"}} src={iconaAreaMarina}/>
                                }
                            </div>
                            <div className={"col-6 d-flex flex-column  mt-4 mb-4"} >
                                <p className={"h1 fw-bold btn-close-white text-start"} >{area.nome}</p>
                            </div>
                        </div>
                        <div className={"row p-0 d-flex flex-row text-start"}>
                            <div className={"col-12 d-flex flex-row mt-4"}>
                                <p className={"h5 "} style={{cursor:"pointer",color:"#0A58CA"}} onClick={()=> history.push(HOME_PAGE)}>Home page</p>
                                <p className={"h5 mx-1"} style={{cursor:"pointer",color:"#0A58CA"}} onClick={()=> history.push(AREE_PROTETTE,{tipoArea : area.type})}>/ {area.type == AREA_PARCO ? t(PARCHI_E_AREE_PROTETTE) : t(AREE_MARINE_PROTETTE) } </p>
                                <p className={"h5"}>/ {area.nome}</p>
                            </div>
                        </div>
                        <div className={"row p-0 d-flex flex-row align-items-center"}>
                            <div className={"col-3 mt-2"} style={{backgroundColor:colore,borderBottomRightRadius:"25px"}}>
                                <p className={"h4 btn-close-white m-2"}>{t(area.categoria)}</p>
                            </div>
                            <div className={"col-3"}>
                                <p className={"h4 m-auto ms-2 text-start "}>{area.regione}</p>
                            </div>
                        </div>
                        <div className={"row d-flex flex-column p-0 mt-3 mb-3"}>
                            <p className={"h1 m-2 text-start"}>{area.nome}</p>
                        </div>
                        <div className={"row p-0"} style={{height:"600px",marginBottom:"30px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                            {/*MAP CONTAINER VIENE UTILIZZATO PER CREARE UN CONTENITORE DELLA MAPPA, HA DUE PROP OVVERO CENTER PER SPECIFICARE IL PUNTO CENTRALE DELLA MAPPA
                            E ZOOM PER IMPOSTARE IL LIVELLO DI ZOOM, UNA VOLTA DEFINITO IL CONTENITORE DELLA MAPPA, UTILIZZIAMO TITLE LAYER PER RAPPRESENTARE UNO STRATO DELLA MAPPA, OVVERO
                            UN LAYER CHE DEFINISCE UN PROVIDER DI MAPPE, IN QUESTO CASO VENGONO UTILIZZATE LE IMMAGINI DELLE MAPPE DI OPEN STREET MAP.
                            ATTRAVERSO APPUNTO LA URL ANDIAMO A PRENDERE LA MAPPA INTERESSATA, REACT LEAFTLET SI OCCUPA DI
                            SOSTITUIRE AUTOMATICAMENTE  I VALORI Z (ZOOM) , X,Y CON I VALORI CORRISPONDENTI NEL MAP CONTAINER. S STA PER SOTTO DOMINIO(SERVER) OVVERO VENGONO FATTE RICHIESTE CON SOTTO DOMINIO
                            DIVERSO PER GARANTIRE UNA DISTRIBUZIONE UNIFORME E MIGLIORE L'EFFICIENZA DEL CARICO DELLE RICHIESTE ALLE MAPPE
                            MARKER MARCATORE SULLA MAPPA, POSITION PER SPECIFICARE LA POSIZIONE DEL MARCATORE E ICON PER DARGLI UN ICONA
                            POPUP QUANDO SI CLICCA SUL MARCATORE SI APRE UNA FINESTRA CON IL NOME DEL AREA DEL MARCATORE

                            IN SOSTANZA MAP CONTAINER DEFINISCE UNA MAPPA CON POSIZIONE E LIVELLO DI ZOOM. TITLE LAYER DEFINISCE LO STRATO DI MAPPA DA RENDERIZZARE, DA DOVE PRENDERE LA MAPPA
                            LE MAPPE DI OPEN STREET MAP VENGONO FORNITE LIBERAMENTE ATTRAVERSO UN PROTOCOLLO STANDARD NOTO COME SLIPPY MAP TILE O XYZ TITLES, OVVERO LE MAPPE VENGONO DIVISE IN TESSEERE
                            CHE POSSONO ESSERE RICHIESTE E VISUALIZZATE DINAMICAMENTE ATTRAVERSO LA URL "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", LEAFTLET SI OCCUPA DI SOSTIUIRE COORDINATE E ZOOM
                            COME HO FATTO IO, QUINDI NON E RICHIESTO ALCUN TOKEN O CHIAVE API PER OTTENERE IMMAGINI DI MAPPE, GOOGLE MAPS INVECE FORNISCE UN SERVIZIO PIU AVANZATO CHE RICHIEDE UN
                            AUTENTIFICAZIONE MEDIANTE UNA CHIAVE API, LE RICHIESTE ALLE API DI GOOGLE MAPS SONO LIMITATE E MONITORATE, PER TANTO E NECESSARIO ISTALLARE LEAFLET GOOGLE CHE SI OCCUPA
                            DI GESTIRE LA LOGICA DI AUTENTIFICAZIONE E L'INTEGRAZIONE CON GOOGLE MAPS API. OCCORRE QUINDI UNA CHIAVE API CHE IDENTIFICA L'APPLICAZIONE O IL SERVIZIO CHE FA RICHIESTA
                            AI SERVER DI GOOGLE MAPS, QUESTA CHIAVE E ASSOCIATA AD UN ACCOUNT GOOGLE E VIENE UTILIZZATA APPUNTO PER TRACCIARE L'UTILIZZO DELL'API.

                           */}
                                <MapContainer center={[area.location.coordinates[0],area.location.coordinates[1]]} zoom={13} scrollWheelZoom={false}>{/*DISABILITA SCROLL MOUSE*/}
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={area.location.coordinates} icon={iconaLocation}>
                                        <Popup>
                                            <p>
                                                {area.nome}
                                            </p>
                                        </Popup>
                                    </Marker>
                                    {area.luoghiDiInteresse && area.luoghiDiInteresse.map((luogo)=>(
                                        <Marker position={luogo.coordinate[0].coordinates} icon={iconaLocation2}>
                                            <Popup>
                                                <p>
                                                    {luogo.it.nome}
                                                </p>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                        </div>
                        <div className={"row p-0 d-flex flex-row "}>
                            <div className={"col-md-8 d-flex flex-column"}>
                                <div className={"col-12 d-flex flex-row align-content-start align-items-center"}>
                                    <i style={{backgroundColor:colore,color:COLORE_BIANCO,padding:"10px"}} className={area.type == AREA_PARCO ? "fa-solid fa-tree fa-3x" : "fa-solid fa-water fa-3x" } ></i>
                                    <p style={{color:colore}} className={"h4 text-start ms-3"}>{area.type == AREA_PARCO ? t(IL_PARCO) : t(AREA) }</p>
                                </div>
                                <div className={"col-12 d-flex flex-column mt-4 p-4"} style={{backgroundColor:COLORE_GRIGIO_CHIARO}}>
                                    <p className={"h5 fw-normal text-start"}>{(area.descrizione) ? area.descrizione.length > 200 ? area.descrizione.split(' ').slice(0,100).join(' ')+"..." : area.descrizione : TESTO}</p>
                                </div>
                                <div className={"col-12 mt-4 mb-4"}>
                                    <p style={{color:"orange"}} className={"h4 text-start "}>{t(CONOSCI)}</p>
                                </div>
                                <div className={"col-12 d-flex flex-column p-4"} style={{backgroundColor:COLORE_ARANCIO_CHIARO}}>
                                    <p style={{color:"orange"}} className={"h4 text-start mb-4 "}>{t(STORIA_GEOGRAFIA)}</p>
                                    <p className={"h5 fw-normal text-start"}>{(area.storiaGeografia) ? area.storiaGeografia.length > 200 ? area.storiaGeografia.split(' ').slice(0, 100).join(' ')+"..." : area.storiaGeografia : TESTO}</p>
                                </div>
                                <div className={"col-12 d-flex flex-column p-4 mt-4"} style={{backgroundColor:COLORE_ARANCIO_CHIARO}}>
                                    <p style={{color:"orange"}} className={"h4 text-start mb-4 "}>{t(FLORA_FAUNA)}</p>
                                    <p className={"h5 fw-normal text-start"}>{(area.floraFauna) ? area.floraFauna.length > 350 ? area.floraFauna.split(' ').slice(0, 350).join(' ')+"..." : area.floraFauna : TESTO}</p>
                                </div>
                            </div>
                            <div className={"col-md-4 d-flex flex-column"}>
                                <div className={"col-12 d-flex flex-column mt-4 p-4"} style={{backgroundColor:COLORE_GRIGIO_CHIARO}}>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i style={{color:"black"}} className="fa-solid fa-location-dot fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color: area.type == AREA_PARCO ? COLORE_VERDE : COLORE_CELESTE}}>{t(LUOGO)}</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{area.provincia + " " +area.regione}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"} >
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i className="fa-regular fa-address-card fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color: area.type == AREA_PARCO ? COLORE_VERDE : COLORE_CELESTE}}>{t(CODICE)}</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{area.codice}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"}>
                                            <i className="fa-solid fa-hotel fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color: area.type == AREA_PARCO ? COLORE_VERDE : COLORE_CELESTE}}>{t(ENTE)}</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{area.enteGestore.nome}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-12 mt-4"}>
                                    <p className={"h2 fw-bold text-start"} style={{color: COLORE_VERDE }} >{t(VISITA)}</p>
                                </div>
                                <div className={"col-12 d-flex flex-column mt-4 p-4"} style={{backgroundColor:COLORE_VERDE_CHIARO}}>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i style={{color:"black"}} className="fa-solid fa-location-dot fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color:COLORE_VERDE}}>{t(INDIRIZZO)}</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{(area.infoVisita && area.infoVisita.indirizzo) ? area.infoVisita.indirizzo : "XXX"}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i className="fa-regular fa-address-card fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color:COLORE_VERDE}}>{t(CONTATTI_DETT)}</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>Tel. {(area.infoVisita && area.infoVisita.telefono) ? area.infoVisita.telefono:"XXX"}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i className="fa-regular fa-envelope fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color: COLORE_VERDE }}>Email</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{(area.infoVisita && area.infoVisita.email) ?area.infoVisita.email:"XXX"}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"} >
                                            <i className="fa-regular fa-envelope fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color:COLORE_VERDE}}>Pec</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{(area.infoVisita && area.infoVisita.pec) ? area.infoVisita.pec : "xxx@pec.it"}</p>
                                        </div>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center mb-2"}>
                                        <div className={"col-2 d-flex align-items-center"}>
                                            <i className="fa-solid fa-globe fa-3x"></i>
                                        </div>
                                        <div className={"col-1"}/>
                                        <div className={"col-8 d-flex flex-column"}>
                                            <p className={"h5 text-start fw-bold fs-5"} style={{color: COLORE_VERDE }}>Sito web</p>
                                            <p className={"h5 text-start fw-normal fs-6"}>{(area.infoVisita && area.infoVisita.sito) ? area.infoVisita.sito : "www.xxx.it"}</p>
                                        </div>
                                    </div>
                                </div>
                                {area.type == AREA_PARCO && (
                                    <>
                                        <div className={"col-12 mt-4 mb-4"}>
                                            <p className={"h2 fw-bold text-start"} style={{color: COLORE_VIOLA}} >{t(ESPLORA)}</p>
                                        </div>
                                        <div className={"col-12 d-flex flex-column justify-content-center align-items-center p-4"} style={{backgroundColor:COLORE_VIOLA_CHIARO}}>
                                            <div className={"col-12 d-flex justify-content-center"}>
                                                <p className={"h4"} style={{color:COLORE_VIOLA}}>{t(ITINERARI_DETT)}</p>
                                            </div>
                                            {listaItinerari && listaItinerari.map((e,index)=>(
                                                <div onClick={()=> goToDettagliItinerario(e)} keys={index} className={"col-12 d-flex flex-row align-items-center mb-4 pt-2 pb-2"} style={{backgroundColor:COLORE_BIANCO,cursor:"pointer"}}>
                                                    <div className={"col-4"}>
                                                        <img style={{scale:"2",width:"40%"}} src={e.idDifficolta == FACILE ? facile : e.idDifficolta == INTERMEDIO ? medio : e.idDifficolta == DIFFICILE ? difficile : e.idDifficolta == DIFFICILE_PLUS ? difficile : ""}/>
                                                    </div>
                                                    <div className={"col-1"}/>
                                                    <div className={"col-7 d-flex flex-column "}>
                                                        <p className={"h5 text-start fw-normal fs-6"}>{t(ITINERARIO)}</p>
                                                        <p className={"h5 text-start fw-normal fs-6"}>{e.nome}</p>
                                                        <div className={"col-12 d-flex flex-row align-items-center"}>
                                                            <div className={"col-1"}>
                                                                <i className="fa-solid fa-signs-post fa-lg"></i>
                                                            </div>
                                                            <div className={"col-11"}>
                                                                <p className={"h5 text-start fw-normal fs-5 ms-2"}>{formattaInKm(e.lunghezza)}</p>
                                                            </div>
                                                        </div>
                                                        <div className={"col-12 d-flex flex-row align-items-start"} >
                                                            <div className={"col-1"}>
                                                                <i className="fa-solid fa-clock fa-lg"></i>
                                                            </div>
                                                            <div className={"col-11"}>
                                                                <p className={"h5 text-start fw-normal fs-5 ms-2"}>{formattaInOre(e.tMedioPerc)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                                <Button style={{backgroundColor:"transparent",color:COLORE_VIOLA,border:"none",fontWeight:"bold",fontSize:"20px"}} onClick={() => history.push(ITINERARI,{codiceArea : area.codice})} >{t(VEDI_TUTTI_ITINERARI)}</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}