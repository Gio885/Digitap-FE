import icona4 from "../utility/foto/Icona4.png"
import {HOME_PAGE} from "../utility/Route";
import {useHistory} from "react-router-dom";
import {COLORE_BIANCO, COLORE_BLUE} from "../utility/Costanti";
import {useTranslation} from "react-i18next";


export default function Footer(){

    const history = useHistory()
    const {t,i18n} = useTranslation()


    return (
        <>
            <div className={"row m-0"}>
                <div className={"col-6 m-3  d-flex flex-row justify-content-center align-items-center p-0"} >
                    <img style={{height:"120px"}} onClick={()=>history.push(HOME_PAGE)} src={icona4} />
                    <h1 className={"text-start mx-2"}  style={{color:COLORE_BLUE}}>Natura<br/> Italia</h1>
                </div>
                <div className={"col-xl-5 d-flex flex-row justify-content-center align-items-center p-0 flex-wrap"}>
                    <button className="buttonFooter">{t("PRIVACY")} |</button>
                    <button className="buttonFooter">{t("RESPONSABILITA")} |</button>
                    <button className="buttonFooter">{t("ACCESSIBILITA")} |</button>
                    <button className="buttonFooter">{t("CONTATTI")}</button>
                </div>
            </div>
            <div className={"row d-flex  align-items-center m-0"} style={{backgroundColor:COLORE_BLUE,height:"100px"}}>
                    <p className={"h4 mx-auto text-start w-auto"} style={{color:COLORE_BIANCO}}>Ministero dell'Ambiente e della Sicurezza Energetica</p>
            </div>


        
        
        
        
        </>
    )

}