import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import it from"./it/translation.json"
import en from"./en/translation.json"



i18n.use(initReactI18next).init({
    resources: {
        it: it,
        en: en
    },
    debug:true,
    lng:"it",
    fallbackLng:"it",
    })

export default i18n



