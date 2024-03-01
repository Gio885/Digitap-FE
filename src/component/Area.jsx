import {useEffect, useState} from "react";
import fotoParco from "../utility/foto/fotoParcoNazionaleFotoDettaglio.png";
import fotoIsoleEgadi from "../utility/foto/areaMarinaProtettaIsoleEgadi.png";
import "../css/page.css"
import iconaAreaParco from "../utility/foto/iconaAreaParco.png"
import iconaAreaMarina from "../utility/foto/iconaAreaMarina.png"
import imgAreaMarina from "../utility/foto/imgAreaMarina.png"
import imgAreaParco from "../utility/foto/imgAreaParco.png"
import {findAllArea, findOneAreaByCodice, findOneAreaRandom} from "../service/areaService";
import {bottoniCarouselPagina, elementiPerPagina, formattaData} from "../utility/Function";
import {
    AREA_MARINA, AREA_MARINA_PROTETTA,
    AREA_PARCO, AREE_MARINE_PROTETTE, COLORE_BIANCO, COLORE_BLUE,
    COLORE_CELESTE, COLORE_CELESTE_TRASPARENTE,
    COLORE_VERDE, COLORE_VERDE_TRASPARENTE, COLORE_VIOLA, PARCHI_E_AREE_PROTETTE, PARCO_NAZIONALE,
    TESTO, TESTO2_AREA_MARINA, TESTO2_AREA_PARCO, TESTO3_AREA, TESTO_AREA_MARINA, TESTO_AREA_PARCO,
    TROVA_AREA
} from "../utility/Costanti";
import {Link, useHistory, useLocation} from "react-router-dom";
import {AREE_PROTETTE, DETTAGLI_AREA, HOME_PAGE, ITINERARI, REGIONE} from "../utility/Route";
import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";



export default function Area() {
    const location = useLocation();
    const tipoArea = location.state.tipoArea;
    const [areaHome, setAreaHome] = useState();
    const [listaArea, setListaArea] = useState();
    const [listaAreaCorrente, setListaAreaCorrente] = useState();
    const [paginaCorrenteArea,setpaginaCorrenteArea] = useState(1)
    const [totalePagine,setTotalePagine]= useState()
    const [bottoniPagina,setBottoniPagina]=useState([])
    const [colore,setColore]=useState()
    const [coloreBottoni,setColoreBottoni]=useState()
    const [listaAreeRicerca,setListaAreeRicerca]=useState()
    const [areaRicercata,setAreaRicercata] = useState("")
    const areePerPagina = 9;
    const history = useHistory()
    const {t,i18n} = useTranslation()

    useEffect(() => {
        window.scrollTo(0, 0);
        if(tipoArea == AREA_PARCO){
            setColore(COLORE_VERDE)
            setColoreBottoni(COLORE_VERDE_TRASPARENTE)
        }else if (tipoArea == AREA_MARINA){
            setColore(COLORE_CELESTE)
            setColoreBottoni(COLORE_CELESTE_TRASPARENTE)
        }
        caricamento()
    }, [])

    useEffect(()=>{
        window.scrollTo(0, 800);
    },[paginaCorrenteArea])

    useEffect(() => {
        if(!areaRicercata){
            buildPagina(listaArea)
        }else{
            buildPagina(listaAreeRicerca)
        }
    }, [totalePagine,listaArea, paginaCorrenteArea])



    useEffect(()=>{
        changeLanguage()
    },[i18n.language])

    async function buildPagina(lista){
        const nuovaLista = elementiPerPagina(paginaCorrenteArea, areePerPagina, lista)
        nuovaLista.then((risultato) => {
            setListaAreaCorrente(risultato)
        })
        const nuoviBottoni = bottoniCarouselPagina(bottoniPagina, totalePagine, setpaginaCorrenteArea,coloreBottoni,setBottoniPagina)
        nuoviBottoni.then((risultato) => {
            setBottoniPagina(risultato)
        })
    }

    async function caricamento() {
        let dataListaAree = await findAllArea(i18n.language,tipoArea)
        setListaArea(dataListaAree)
        console.log(dataListaAree)
        let dataArea = await findOneAreaRandom(i18n.language,tipoArea)
        console.log(dataArea,"OOOOOOOOOOOOOOOOOOOOO")
        setAreaHome(dataArea)
        let tot = Math.ceil(dataListaAree.length / areePerPagina)
        setTotalePagine(tot)
    }
    function searchArea(){
        const ricercaMinuscola = areaRicercata.toLowerCase();
        const risultatiFiltrati = listaArea.filter((e)=>
            e.nome.toLowerCase().includes(ricercaMinuscola)
        )
        let tot = Math.ceil(risultatiFiltrati.length / areePerPagina)
        setTotalePagine(tot)
        setListaAreeRicerca(risultatiFiltrati)
        buildPagina(risultatiFiltrati)
    }

    async function changeLanguage(){
        if(areaHome){
            let dataListaAree = await findAllArea(i18n.language,tipoArea)
            setListaArea(dataListaAree)
            let dataArea = await findOneAreaByCodice(i18n.language,areaHome.codice)
            setAreaHome(dataArea)
            console.log(dataListaAree)
        }
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
                                    <p className="h5 my-5 " style={{ color: COLORE_BIANCO }}>
                                        {(areaHome.descrizione && areaHome.descrizione.length > 200)
                                            ? areaHome.descrizione.split(' ').slice(0, 200).join(' ') + "..."
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
                <div className={"row p-0"} style={{backgroundColor:colore}}>
                    <div className={"col-6 d-flex flex-column justify-content-center align-items-center mt-4 mb-4"} >
                        {tipoArea == AREA_PARCO ?
                            <img className={"m-2 rounded-4"} style={{width:"350px",height:"100px"}} src={iconaAreaParco}/>
                            :
                            <img className={"m-2 rounded-4"} style={{width:"150px",height:"150px"}} src={iconaAreaMarina}/>
                        }
                    </div>
                    <div className={"col-md-6 d-flex flex-column  mt-4 mb-4"} >
                        <p className={"h1 fw-bold btn-close-white text-start"} >{(tipoArea == AREA_PARCO) ? t(TESTO_AREA_PARCO) : t(TESTO_AREA_MARINA)}</p>
                        <p className={"h5 btn-close-white text-start"}>{TESTO}</p>
                        <div className="input-group mt-4 mb-2">
                            <input type="text" className="form-control" placeholder={t(TROVA_AREA)} value={areaRicercata}
                                   onChange={(e)=>setAreaRicercata(e.target.value)}/>
                            <Button className="mx-2" onClick={()=>searchArea()}>{t("Clicca qui")}</Button>
                        </div>
                    </div>
                </div>
                <div className={"row p-0 d-flex flex-row text-start"}>
                    <div className={"col-12 d-flex flex-row mt-4"}>
                        <Link to={HOME_PAGE}> <p style={{textDecoration:"none"}} className={"h5 mx-2"}>Home page</p></Link>
                        <p className={"h5"}>{tipoArea == AREA_PARCO ? "/ "+ t(PARCHI_E_AREE_PROTETTE): "/ "+ t(AREE_MARINE_PROTETTE)}</p>
                    </div>
                </div>
                <div className={"row p-0"}>
                    <div className={"col-12 d-flex flex-column text-start mt-4"}>
                        <p className={"h2"}> {tipoArea==AREA_PARCO ? t(TESTO2_AREA_PARCO) : t(TESTO2_AREA_MARINA)} </p>
                        <p className={"h4 fw-light"}>{t(TESTO3_AREA)}</p>
                    </div>
                </div>
                <div className="row p-0 mt-4">
                    {listaAreaCorrente && listaAreaCorrente.map((area,index)=>(
                        <div className={"col-xl-4 col-lg-6 col-md-12 p-0 d-flex flex-row justify-content-center mb-5"}>
                            <div keys={index} className={"col-10 d-flex flex-column  align-items-center rounded-4 "} style={{backgroundColor:"#F4F4F4",cursor:"pointer"}} onClick={() => history.push(DETTAGLI_AREA,{idArea : area.id})}>
                                {tipoArea == AREA_PARCO ?
                                    <img  className={"mx-auto img-fluid img-thumbnail"} src={imgAreaParco} style={{ width: "417px", height: "220px"}}></img>
                                :
                                    <img  className={"mx-auto img-fluid img-thumbnail"} src={imgAreaMarina} style={{ width: "417px", height: "220px"}}></img>
                                }
                                <p className={"h3 mt-3"} style={{color:colore}}>{tipoArea == AREA_PARCO ? t(PARCO_NAZIONALE) : t(AREA_MARINA_PROTETTA)}</p>
                                <p className={"h5 fw-light mt-2 mb-3"}>{(area.nome) ? area.nome.toUpperCase():""}</p>
                            </div>
                        </div>
                        )
                    )}
                    <div className={"d-flex flex-row justify-content-center "}>
                        {bottoniPagina && (
                            bottoniPagina.map((e, index) => (
                                <div className={"mx-3 mt-3"} style={{backgroundColor:index+1==paginaCorrenteArea ? colore:"",}} keys={index}>{e}</div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}