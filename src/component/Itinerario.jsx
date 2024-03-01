import {useEffect, useRef, useState} from "react";
import {findAllArea, findOneAreaByCodice, findOneAreaById, findOneAreaRandom} from "../service/areaService";
import fotoParco from "../utility/foto/fotoParcoNazionaleFotoDettaglio.png";
import fotoIsoleEgadi from "../utility/foto/areaMarinaProtettaIsoleEgadi.png";
import {
    AREA_PARCO,
    CERCA,
    COLORE_BIANCO,
    COLORE_GRIGIO_CHIARO,
    COLORE_VIOLA,
    COLORE_VIOLA_TRASPARENTE,
    ESPLORA_ITINERARI,
    SELEZIONA_PARCO,
    SELEZIONA_PARCO_ITINERARI,
    TESTO_ITINERARIO,
    X_CENTRO_ITALIA,
    Y_CENTRO_ITALIA
} from "../utility/Costanti";
import location1 from "../utility/foto/location.png";
import {DETTAGLI_AREA, DETTAGLI_ITINERARIO, HOME_PAGE, ITINERARI} from "../utility/Route";
import {findAllItinerarioParco} from "../service/itinerarioService";
import {bottoniCarouselPagina, costruzioneMappa, elementiPerPagina, flyToSingleMarkerArea, formattaInKm, formattaInOre} from "../utility/Function";
import facile from "../utility/foto/itinerarioFacile.png";
import medio from "../utility/foto/itinerarioMedio.png";
import difficile from "../utility/foto/itinerarioDifficile.png";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import L from 'leaflet';

export default function Itinerario() {

    const location = useLocation();
    const [areaHome, setAreaHome] = useState()
    const [listaParchi,setListaParchi] = useState()
    const [listaItinerarioParco,setListaItinerarioParco] = useState()
    const [scelta,setScelta]=useState({})
    const [totalePagine,setTotalePagine] = useState()
    const [bottoniPagina, setBottoniPagina] = useState([])
    const [listaItinerariCorrente,setListaItinerariCorrente] = useState()
    const [paginaCorrente, setPaginaCorrente] = useState(1)
    const itinerariPerPagina = 10
    const [areaSelezionata,setAreaSelezionata] = useState()
    const [ricercaAutomatica,setRicercaAutomatica] = useState(false)
    const mappa = useRef()
    const history = useHistory()
    const {t,i18n} = useTranslation()

    const iconaLocation = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2377/2377874.png',
        iconSize: [40, 40]
    });

    useEffect(()=>{
        if(mappa.current == undefined){
            costruzioneMappa(mappa,X_CENTRO_ITALIA,Y_CENTRO_ITALIA,6)
        }
    },[])

    useEffect(() => {
        window.scrollTo(0, 0);
        caricamento()
    }, [paginaCorrente])

    useEffect(() => {
        changeLanguage()
    }, [i18n.language])

    useEffect(()=>{
        const nuovaLista = elementiPerPagina(paginaCorrente, itinerariPerPagina, listaItinerarioParco)
        nuovaLista.then((risultato) => {
            setListaItinerariCorrente(risultato)
        })
        const nuoviBottoni = bottoniCarouselPagina(bottoniPagina, totalePagine, setPaginaCorrente,COLORE_VIOLA_TRASPARENTE)
        nuoviBottoni.then((risultato) => {
            setBottoniPagina(risultato)
        })
    },[totalePagine,paginaCorrente,areaSelezionata])


    useEffect(()=>{
        if(ricercaAutomatica){
            setRicercaAutomatica(false)
            ricerca()
        }
    },[ricercaAutomatica,listaParchi])

    async function caricamento () {
        let codiceArea = (location.state) ? location.state.codiceArea : null
        if(areaHome){
            let dataArea = await findOneAreaByCodice(i18n.language,areaHome.codice)
            setAreaHome(dataArea)
        }else{
            let dataArea = await findOneAreaRandom(i18n.language)
            setAreaHome(dataArea)
        }
        let dataListaParchi = await findAllArea(i18n.language,AREA_PARCO)
        setListaParchi(dataListaParchi)
        if(Object.keys(scelta).length==0 && codiceArea){
            const parco = dataListaParchi.find(p=> p.codice === codiceArea)
            setScelta(parco)
            setRicercaAutomatica(true)
            codiceArea = null
        }else if(Object.keys(scelta).length>0){
            setAreaSelezionata(scelta)
            flyTo(scelta)
            setRicercaAutomatica(true)
        }
    }

    async function changeLanguage(){
        setListaItinerariCorrente(null)
        setListaItinerarioParco(null)
        setAreaSelezionata("")
        setBottoniPagina(null)
        setScelta("")
        if(areaHome){
            let dataArea = await findOneAreaByCodice(i18n.language,areaHome.codice)
            setAreaHome(dataArea)
        }else{
            let dataArea = await findOneAreaRandom(i18n.language)
            setAreaHome(dataArea)
        }
        let dataListaParchi = await findAllArea(i18n.language,AREA_PARCO)
        setListaParchi(dataListaParchi)
        document.getElementById('select').value = t(SELEZIONA_PARCO);
    }

    function handleScelta(codiceAreaScelta){
        const parco = listaParchi.find(p => p.codice === codiceAreaScelta);
        setScelta(parco)
    }

    async function ricerca(){
        if(scelta && Object.keys(scelta).length>0){
            if(scelta.id !== areaSelezionata.id){
                setPaginaCorrente(1)
            }
            let dataListaItinerari = await findAllItinerarioParco(i18n.language,scelta.codice)
            setListaItinerarioParco(dataListaItinerari)
            console.log(dataListaItinerari)
            if(Array.isArray(dataListaItinerari)){
                let tot = Math.ceil(dataListaItinerari.length / itinerariPerPagina)
                setTotalePagine(tot)
                setAreaSelezionata(scelta)
                flyTo(scelta)
            }
        }
    }

    const goToDettagliItinerario = (e) =>{
        let areaConItinerario = {
            area : areaSelezionata,
            itinerario : e
        }
        history.push(DETTAGLI_ITINERARIO, {areaConItinerario : areaConItinerario})
    }

    const flyTo = (areaSelezionata) => {
        flyToSingleMarkerArea(mappa,areaSelezionata,iconaLocation,12,history)
    }


    return (
        <>
            <div className="container text-center">
                {areaHome && (
                    <>
                        <div className={areaHome.type === AREA_PARCO ? "row p-0 bg-areaParco  d-flex flex-column justify-content-center " : "row p-0 bg-areaMarina d-flex flex-column justify-content-center p-0"}>>
                            <div className="col-12 text-center">
                                <p className="h4 my-5" style={{ color: COLORE_BIANCO }}>{areaHome.nome}</p>
                            </div>
                            <div className="col-10 mx-auto text-center">
                                <p className="h5 my-5 " style={{ color: COLORE_BIANCO }}>
                                    {(areaHome.descrizione && areaHome.descrizione.length > 50)
                                        ? areaHome.descrizione.split(' ').slice(0, 50).join(' ') + "..."
                                        : areaHome.descrizione}
                                </p>
                            </div>
                            <div className="col-12 text-center mt-1">
                                <Button className="border-0 mb-2" style={{ backgroundColor:COLORE_VIOLA }} onClick={() => history.push(DETTAGLI_AREA, { idArea: areaHome.id })}>
                                    {t("Leggi di più")}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                <div className={"row p-0 d-flex flex-row"} style={{backgroundColor:COLORE_VIOLA}}>
                    <div className={"col-6 d-flex justify-content-center mt-3 mb-3"}>
                        <img style={{width:"150px",height:"150px"}} src={location1}></img>
                    </div>
                    <div className={"col-6 d-flex justify-content-center align-items-center"}>
                        <p className={"h2 text-start btn-close-white"}>{t(TESTO_ITINERARIO)}</p>
                    </div>
                </div>
                <div className={"row p-0 d-flex flex-row mt-3"}>
                    <div className={"col-6 d-flex flex-row"}>
                        <Link to={HOME_PAGE}> <p style={{textDecoration:"none"}} className={"h5 mx-2 text-start"}>Home page</p></Link>
                        <p className={"h5 mx-2 text-start fw-bold"}>/ {t(ESPLORA_ITINERARI)}</p>
                    </div>
                </div>
                <div className={"row p-0 mt-2 d-flex flex-column"} >
                    <div className={"col-12 "}>
                        <p className={"h1"}>{t(SELEZIONA_PARCO_ITINERARI)}</p>
                    </div>
                    <div className={"col-12 d-flex justify-content-center mt-3"} >
                        <div className={"col-6 d-flex flex-row"}>
                            <select onChange={(e)=>handleScelta(e.target.value)} className="form-select" id={"select"} aria-label="Default select example">
                                <option selected disabled>{t(SELEZIONA_PARCO)}</option>
                                {listaParchi && listaParchi.map((e,index)=>(
                                    <option defaultValue=" " key={index} value={e.codice} >{e.nome}</option>
                                ))}
                            </select>
                            <div className={"col-1 ms-3"}>
                                <Button style={{backgroundColor:"orange",width:"120px",border:"none"}} onClick={()=>{ricerca()}}>{t(CERCA)} </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"row d-flex justify-content-center mt-4"}>
                    <div className={"col-12"}>
                        <p className={"h3 "}>{(areaSelezionata) ? areaSelezionata.nome : ""}</p>
                    </div>
                        <div className={"col-md-6 d-flex flex-column align-items-center "}>
                            <div id={"map1"} ref={mappa.current} style={{height:"500px"}}/>
                        </div>
                    <div className={"col-md-12 d-flex flex-column align-items-center mt-5"}>
                        {listaItinerariCorrente && listaItinerariCorrente.map((e,index)=>(
                            <div className={"col-md-10 d-flex flex-row rounded-3 mb-4 p-2"} onClick={()=> goToDettagliItinerario(e)} key={index} style={{cursor:"pointer",backgroundColor:COLORE_GRIGIO_CHIARO}}>
                                <img  className={"mx-auto img-fluid img-thumbnail"} style={{borderBottomRightRadius:"50px"}} src={e.idDifficolta == 1 ? facile : e.idDifficolta == 2 ? medio : e.idDifficolta == 3 ? difficile :""} ></img>
                                <div className={"col-6 d-flex flex-column"}>
                                    <p className={"h5 text-start ms-4"}>{e.nome}</p>
                                    <p className={"h5 text-start ms-4 fw-light"}>{e.descStatus}</p>
                                    <div className={"col-12 d-flex flex-row align-items-center"}>
                                        <i className="fa-solid fa-signs-post fa-lg ms-4"></i>
                                        <p className={"h5 text-start ms-2 fw-light"}>{formattaInKm(e.lunghezza)}</p>
                                    </div>
                                    <div className={"col-12 d-flex flex-row align-items-center"}>
                                        <i className="fa-solid fa-clock fa-lg ms-4"></i>
                                        <p className={"h5 text-start ms-2 fw-light"}>{formattaInKm(e.lunghezza)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className={"row p-0 mt-3"}>
                    <div className={"col-md-12 d-flex flex-row justify-content-center flex-wrap ì"}>
                        {bottoniPagina && (
                            <>
                                {(bottoniPagina && listaItinerariCorrente) && (
                                    bottoniPagina.map((e, index) => (
                                        <div className={"col-auto mx-4 mb-2"} style={{backgroundColor:index+1==paginaCorrente ? COLORE_VIOLA:"",position:"relative"}} key={index}>{e}</div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}