import {useEffect, useState} from "react";
import "../css/page.css"
import logoParco from "../utility/foto/4loghiParco.png"
import logoAreaMarina from "../utility/foto/4loghiAreaMarina.png"
import logoRegioni from "../utility/foto/4loghiAreaRegioni.png"
import logoItinerario from "../utility/foto/4loghiItinerari.png"
import {findByRicerca, findOneAreaByCodice, findOneAreaRandom} from "../service/areaService";
import {findAllNews} from "../service/newsService";
import {bottoniCarouselPagina, elementiPerPagina, formattaData} from "../utility/Function";
import fotoNews from "../utility/foto/news.png"
import {
    AREA_MARINA,
    AREA_PARCO,
    COLORE_BIANCO,
    COLORE_BLUE, COLORE_VERDE,
    NEWS,
    TESTO,
    TITOLO_NEWS,
    TROVA_AREA
} from "../utility/Costanti";
import {useHistory} from "react-router-dom";
import {ITINERARI, AREE_PROTETTE, REGIONE, DETTAGLI_AREA, RICERCA} from "../utility/Route";
import {useTranslation} from 'react-i18next';
import "../utility/i18n"
import * as React from "react";
import {Button,Modal} from "react-bootstrap";


export default function Home() {


    const [areaHome, setAreaHome] = useState();
    const [news, setNews] = useState();
    const [newsCorrente, setNewsCorrente] = useState();
    const [paginaCorrenteNews, setPaginaCorrenteNews] = useState(1)
    const [totalePagine, setTotalePagine] = useState()
    const [bottoniPagina, setBottoniPagina] = useState([])
    const [ricerca,setRicerca]=useState()
    const newsPerPagina = 4;
    const history = useHistory()
    const {t,i18n} = useTranslation()
    const [loading,setLoading]=useState(false)
    const [showModal, setShowModal] = useState(false);
    const [errore,setErrore] = useState()

    useEffect(() => {
        window.scrollTo(0, 0);
        caricamento()
    }, [])

    useEffect(() => {
        const nuovaLista = elementiPerPagina(paginaCorrenteNews, newsPerPagina, news)
        nuovaLista.then((risultato) => {
            setNewsCorrente(risultato)
        })
        const nuoviBottoni = bottoniCarouselPagina(bottoniPagina, totalePagine, setPaginaCorrenteNews,COLORE_BLUE)
        nuoviBottoni.then((risultato) => {
            setBottoniPagina(risultato)
        })
    }, [totalePagine, news, paginaCorrenteNews])

    useEffect(()=>{
        if(areaHome){
            cambioLingua()
        }
    },[i18n.language])

    useEffect(()=>{
        window.scrollTo(0, 900);
    },[paginaCorrenteNews])


    async function caricamento() {
        let dataNews = await findAllNews()
        setNews(dataNews)
        let dataArea = await findOneAreaRandom(i18n.language)
        console.log(dataArea)
        setAreaHome(dataArea)
        let tot = Math.ceil(dataNews.length / newsPerPagina)
        setTotalePagine(tot)
    }
    async function cambioLingua(){
        let dataArea = await findOneAreaByCodice(i18n.language,areaHome.codice)
        setAreaHome(dataArea)
        console.log(dataArea)
    }
    async function ricercaAree(){
        console.log(ricerca)
        let dataAree = await findByRicerca(i18n.language,ricerca,operazioni)
    }

    const operazioni = (caricamento,successo,risultato) => {
        setLoading(caricamento)
        if(successo != undefined){
            if(successo){
                if(Array.isArray(risultato)){
                    history.push(RICERCA, {risultatoRicerca : risultato, parolaRicercata:ricerca})
                }else{
                    setShowModal(true);
                    setErrore(risultato)
                    setRicerca("")
                }
            }else{
                setShowModal(true);
                setErrore(risultato)
                setRicerca("")
            }
        }
    }

    return (
        <>

            <div className="container text-center">
            {areaHome && (
                    <>
                        <div className={areaHome.type === AREA_PARCO ? "row p-0 bg-areaParco  d-flex flex-column justify-content-center " : "row p-0 bg-areaMarina d-flex flex-column justify-content-center p-0"}>
                                <div className="col-12 text-center">
                                    <p className="h4 my-5" style={{ color: COLORE_BIANCO }}>{areaHome.nome}</p>
                                </div>
                                <div className="col-lg-10 mx-auto text-center">
                                    <p className="h5 my-5 " style={{ color: COLORE_BIANCO }}>
                                        {(areaHome.descrizione && areaHome.descrizione.length > 50)
                                            ? areaHome.descrizione.split(' ').slice(0, 50).join(' ') + "..."
                                            : areaHome.descrizione}
                                    </p>
                                </div>
                                <div className="col-12 text-center mt-3">
                                    <Button className="border-0 mb-4" style={{ backgroundColor: areaHome.type === AREA_PARCO ? COLORE_VERDE : COLORE_BLUE }} onClick={() => history.push(DETTAGLI_AREA, { idArea: areaHome.id })}>
                                        {t("Leggi di più")}
                                    </Button>
                                </div>
                        </div>
                    </>
                )}
                <div className={"row p-0"} style={{backgroundColor:COLORE_BLUE}}>
                    <div className={"col-6 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"} >
                        <div className={"d-flex flex-row"}>
                            <img className={"m-2 rounded-4"} style={{width:"100px",height:"100px",cursor:"pointer"}} src={logoParco} onClick={() => history.push(AREE_PROTETTE,{ tipoArea: AREA_PARCO })}/>
                            <img className={"m-2 rounded-4"}  style={{width:"100px",height:"100px",cursor:"pointer"}} src={logoAreaMarina} onClick={() => history.push(AREE_PROTETTE,{ tipoArea: AREA_MARINA})}/>
                        </div>
                        <div className={"d-flex flex-row"}>
                            <img className={"m-2 rounded-4"}  style={{width:"100px",height:"100px",cursor:"pointer"}} src={logoRegioni} onClick={() => history.push(REGIONE)}/>
                            <img className={"m-2 rounded-4"}  style={{width:"100px",height:"100px",cursor:"pointer"}} src={logoItinerario} onClick={() => history.push(ITINERARI)}/>
                        </div>
                    </div>
                    <div className={"col-6 d-flex flex-column  mt-4 mb-4"} >
                        <p className={"h1 fw-bold btn-close-white text-start"} >{t("VISITA ESPLORA CONOSCI")}</p>
                        <p className={"h5 btn-close-white text-start"}>{TESTO}</p>
                        <div className="input-group mt-4 mb-2">
                            <input type="text" className="form-control" placeholder={t(TROVA_AREA)} value={ricerca}
                                   onChange={(e)=>setRicerca(e.target.value)}/>
                            {loading ? <p className={"h5 btn-close-white text-start mx-2"}>Loading...</p> : <Button className="mx-2" onClick={()=>ricercaAree()} >{t("Clicca qui")}</Button>}
                        </div>
                    </div>
                </div>
                <Modal show={showModal}  centered>
                    <div style={{margin:"10px 10px 10px 10px"}}>
                        <p>{errore}</p>
                        <Button style={{width:"200px"}} variant="secondary" onClick={() => setShowModal(false)}>
                            Chiudi
                        </Button>
                    </div>
                </Modal>
                <div className={"row"}>
                    <p className={"h1 mt-4 text-start"}>LAST NEWS</p>
                    <p className={"h3 text-start mt-2 fw-light"}>{t(NEWS)}</p>
                </div>
                <div className={"row g-5 d-flex justify-content-center pb-3"} >
                    {newsCorrente && newsCorrente.map((news,index)=>(
                        <div className={"col-lg-6 col-md-10"} >
                           <div className={"p-2 rounded-5 d-flex"} style={{backgroundColor:COLORE_BLUE}}>
                            <div className={"col-6 d-flex align-items-center"}>
                                <img className={"mx-auto img-fluid img-thumbnail"} style={{width:"300px",height:"250px"}} src={fotoNews}></img>
                            </div>
                            <div className={"col-6"}>
                                <p className={"h5 text-start mt-4 ms-4 btn-close-white"}>{(news.titolo) ? news.titolo : TITOLO_NEWS}</p>
                                <p className={"h5 text-start mt-3 ms-4 fw-light btn-close-white"}>{news.descrizioneBreve.toLowerCase().startsWith("desc") || news.descrizioneBreve.toLowerCase().startsWith("prova") ? TESTO : news.descrizioneBreve}</p>
                                <div className={"d-flex flex-row"}>
                                    <div className={"col-2"} >
                                        <i style={{position: "relative", top: "10px",color:COLORE_BIANCO}}
                                           className="fa-solid fa-calendar-days fa-xl"/>
                                    </div>
                                    <p className={"h5 text-start mt-2 ms-0 btn-close-white  fw-bold"}>{formattaData(news.data)}</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    ))}
                    <div className={"d-flex flex-row justify-content-center mt-4"}>
                        {bottoniPagina && (
                            bottoniPagina.map((e, index) => (
                                <div className={"mx-3 mt-3"} keys={index}>{e}</div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )


}