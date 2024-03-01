import {useHistory, useLocation} from "react-router-dom";
import imgAreaMarina from "../utility/foto/imgAreaMarina.png"
import imgAreaParco from "../utility/foto/imgAreaParco.png"
import {
    AREA_MARINA_PROTETTA,
    AREA_PARCO,
    COLORE_ARANCIO_CHIARO, COLORE_ARANCIONE,
    COLORE_ARANCIONE_CHIARO, COLORE_BIANCO, COLORE_BLUE, COLORE_CELESTE,
    COLORE_GRIGIO_CHIARO,
    COLORE_VERDE,
    PARCO_NAZIONALE
} from "../utility/Costanti";
import {DETTAGLI_AREA, HOME_PAGE} from "../utility/Route";
import {useEffect, useState} from "react";
import {bottoniCarouselPagina, elementiPerPagina} from "../utility/Function";
import {Button} from "react-bootstrap";
import { findOneAreaByCodice, findOneAreaRandom} from "../service/areaService";
import {useTranslation} from "react-i18next";


export default function Ricerca() {

    const location = useLocation()
    const listaRisultati = location.state.risultatoRicerca
    const parolaRicercata = location.state.parolaRicercata
    const history = useHistory()
    const risultatiPerPagina = 9;
    const [totalePagine,setTotalePagine]= useState()
    const [bottoniPagina,setBottoniPagina]=useState([])
    const [paginaCorrenteArea,setpaginaCorrenteArea] = useState(1)
    const [listaCorrente, setListaCorrente] = useState();
    const [areaHome, setAreaHome] = useState();
    const {t,i18n} = useTranslation()


    useEffect(()=>{
        buildPagina()
        window.scrollTo(0, 0);
    },[paginaCorrenteArea,totalePagine])



    async function buildPagina(){
        if(areaHome){
            let dataArea = await findOneAreaByCodice(i18n.language,areaHome.codice)
            setAreaHome(dataArea)
        }else{
            let dataArea = await findOneAreaRandom(i18n.language)
            setAreaHome(dataArea)
        }
        let tot = Math.ceil(listaRisultati.length / risultatiPerPagina)
        setTotalePagine(tot)
        const nuovaLista = await elementiPerPagina(paginaCorrenteArea, risultatiPerPagina, listaRisultati)
        setListaCorrente(nuovaLista)
        const nuoviBottoni = await bottoniCarouselPagina(bottoniPagina, totalePagine, setpaginaCorrenteArea,COLORE_ARANCIONE_CHIARO,setBottoniPagina)
        setBottoniPagina(nuoviBottoni)

    }


    //https://www.npmjs.com/package/react-highlighter highlighter restituisce paragrafo con parola ricercata evidenziata
    const evidenziaParolaRicercata = (testo,isTitle) => {
        let splitParolaRicercata =  parolaRicercata.split(" ")
        let regex = new RegExp(parolaRicercata,"gi")
        let testoSplit = testo.split(" ")
        let nuovoTesto =
        testoSplit.map((parola)=>{
            return (
                <>
                    <p className={isTitle ? "h5":""+"m-1"}  style={{marginRight:"3px",backgroundColor:parola.match(regex)?"yellow":"transparent"}}>{parola}</p>
                </>
            )
            /*let elemento = document.createElement('span')
            elemento.textContent = parola
            if(parola.match(regex)){
                elemento.style.backgroundColor = ("yellow")
            }*/
        })
        return nuovoTesto
        /*let elemento = document.createElement('div')
        elemento.textContet = "ok"
        //elemento.setAttribute("backgroundColor","yellow")
        elemento.style.backgroundColor=("yellow")
        let nuovoTesto = testo.replace(regex,elemento.textContet)
        return nuovoTesto*/

    }

    function stampa(){
        if(parolaRicercata.includes(" ")){
            console.log("contiene spazi")
        }else{
            console.log("non contiene spazi")

        }
    }

    return (
        <>
            <div className="container text-center">
                {areaHome && (
                    <div className="sfondo row mb-5" style={{height:"500px"}}>
                        <div className="bg d-flex flex-column justify-content-around rounded-3 p-0">
                                <div className={"col-12"}>
                                    <p className="h4 my-5"style={{color:COLORE_BIANCO}}>{areaHome.nome}</p>
                                </div>
                            <div className={"row d-flex justify-content-center z-index-2"}>
                                <div className={"col-2"}></div>
                                <div className={"col-8"}>
                                    <p className="h5" style={{color:COLORE_BIANCO}}>{(areaHome.descrizione && areaHome.descrizione.length>200)? areaHome.descrizione.split(' ').slice(0,200).join(' ')+"...":areaHome.descrizione}</p>
                                </div>
                                <div className={"col-2"}></div>
                            </div>
                            <div className={"mt-3 mb-4"}>
                                <Button className={"border-0"} style={{backgroundColor:COLORE_BLUE}} onClick={()=>alert("")}>Clicca qui</Button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row justify-content-center">
                    {listaCorrente && listaCorrente.map((area) => (
                            <div onClick={()=>history.push(DETTAGLI_AREA,{idArea:area.id})} className="col-md-3 mx-5 my-4 p-0  d-flex flex-column align-items-center rounded-4" style={{backgroundColor: COLORE_GRIGIO_CHIARO,cursor:"pointer"}}>
                                <img className="img-fluid img-thumbnail p-0" alt="Responsive image" src={area.type == AREA_PARCO ? imgAreaParco : imgAreaMarina} ></img>
                                <p className="h4 my-3 fw-bold" style={{color:area.type == AREA_PARCO ? COLORE_VERDE :COLORE_CELESTE}}>{area.type == AREA_PARCO ? t(PARCO_NAZIONALE) : t(AREA_MARINA_PROTETTA)}</p>
                                <div className={"col-12 d-flex flex-row flex-wrap justify-content-center mb-3"}>
                                    {evidenziaParolaRicercata(area.nome,true)}
                                </div>
                                <div className={"col-12 d-flex flex-row flex-wrap justify-content-left lh-1"}>
                                    {area.descrizione && area.descrizione.length>50 ? evidenziaParolaRicercata(area.descrizione.split(" ").slice(0,50).join(" ")+"...",false) : evidenziaParolaRicercata(area.descrizione,false)}
                                </div>
                            </div>
                    ))
                    }
                </div>
                <div className="row justify-content-center" style={{width:"100%",height:"100px"}}>
                    {bottoniPagina && bottoniPagina.map((bottone,index)=>(
                        <div keys={index} className="col-1">
                            <Button style={{backgroundColor: index+1 == paginaCorrenteArea ? COLORE_ARANCIONE :"transparent",margin:"10px",padding:"0px",border:"none"}} >{bottone}</Button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}