import L from "leaflet";
import {AREA_PARCO,REGIONI} from "./Costanti";
import {DETTAGLI_AREA} from "./Route";
import "leaflet-easybutton"
import {setPosition} from "leaflet/src/dom/DomUtil";


const { DateTime } = require("luxon");

export function formattaData(data) {
    return DateTime.fromISO(data).toFormat("dd/MM/yy");
}

export async function elementiPerPagina(paginaCorrenteNews,elementoPerPagina,lista){
    return new Promise((resolve)=>{
        let indiceUltimoElemento = paginaCorrenteNews * elementoPerPagina;
        let indicePrimoElemento = indiceUltimoElemento - elementoPerPagina;
        if(lista){
            const listaNuova = lista.slice(indicePrimoElemento,indiceUltimoElemento)
            resolve(listaNuova);
        }
    })
}
export async function bottoniCarouselPagina(bottoniPagina,totalePagine,setPaginaCorrenteNews,colore){
    return new Promise((resolve)=>{
        const bottoniPaginaNuovi = []
        for(let i = 1; i<= totalePagine;i++){
            bottoniPaginaNuovi.push(
                <button style={{cursor:"pointer",color:"white",fontWeight:"bold",fontSize:"20px",backgroundColor:colore,height:"50px",width:"50px"}} key={i}onClick={()=>setPaginaCorrenteNews(i)}>{i}</button>
            )
        }
        resolve(bottoniPaginaNuovi)
    })
}
export function formattaInKm(m){
    if(m > 1000){
        return Math.round(m/1000)+" km"
    }
    return m+" metri"
}
export function formattaInOre(minuti){
    if(minuti > 59){
        return Math.round(minuti/60)+" ore"
    }
    return minuti +" minuti";
}
/*
L.map viene stanziato un oggetto Map che rapprensenta la mappa
L.titleLayer viene creato un layer che rappresenta tutta la mappa presa da openStreetMap e viene aggiunto all'oggetto Map
mi prendo il container della mappa ovvero l'elemento HTML che rappresenta la mappa stessa con getContainer
classList e una proprieta dell'oggetto ELEMENT che fornisce un oggetto di tipo DOMTokenList che rappresenta le classi dell'elemento, add e un metodo di classList che
aggiunge l'elemento html (IL CONTAINER DI MAP) e lo aggiunge ad un div con id "map1" contenuto nel DOM
setto la vista della mappa con coordinate e zoom su una parte specifica della mappa
mi creo un contenitore per salvare i layer dentro il mio oggetto Map
ottengo un riferimento alla mappa

 */
//let container = map1.getContainer()
//container.classList.add("map1")
export function costruzioneMappa(riferimentoMappa,x,y,zoom){
    let visualizzazione1 = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    let visualizzazione2 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')
    let visualizzazione3 = L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png')
    let visualizzazione4 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
    let map1 = L.map("map1",{center:[x,y],zoom:zoom,layers:[visualizzazione1],inertia:true})
    riferimentoMappa.current = map1
    riferimentoMappa.current.containerMarker = L.layerGroup().addTo(riferimentoMappa.current);
    riferimentoMappa.current.geoContainer = L.geoJSON().addTo(riferimentoMappa.current)
    console.log(riferimentoMappa,"mappa con container")
    let layerMappa = {
        "Visualizzazione 1": visualizzazione1,
        "Visualizzazione 2": visualizzazione2,
        "Visualizzazione 3": visualizzazione3,
        "Visualizzazione 4": visualizzazione4,
    };
    let overlay = {
            "Aree":riferimentoMappa.current.containerMarker
    }

    L.easyButton( '<img src="https://cdn-icons-png.flaticon.com/512/9723/9723306.png" style="width: 30px ; height:30px;background-color: transparent" >', function(){
        if(Object.keys(riferimentoMappa.current.containerMarker._layers).length<15){
            riferimentoMappa.current.containerMarker.eachLayer(marker => marker.openPopup())
            setTimeout(()=>{
                riferimentoMappa.current.containerMarker.eachLayer(marker => marker.closePopup())
            },3000)
        }
    }).setPosition("topright").addTo(riferimentoMappa.current)

    riferimentoMappa.current.layerControl = L.control.layers(layerMappa,overlay).addTo(riferimentoMappa.current);
}

export function flyToSingleMarkerArea(riferimentoMappa,area,iconaMarker,zoom,history){
    riferimentoMappa.current.containerMarker.clearLayers();
    let nuovoMarker = L.marker(area.location.coordinates,{icon:iconaMarker}).bindPopup(area.nome).on('click', function () {
        history.push(DETTAGLI_AREA, { idArea: area.id });
    });
    riferimentoMappa.current.containerMarker.addLayer(nuovoMarker)
    creazioneArea(riferimentoMappa,area.location.coordinates[0],area.location.coordinates[1])
    riferimentoMappa.current.flyTo([area.location.coordinates[0],area.location.coordinates[1]],zoom,{animate:true,duration:2})
    riferimentoMappa.current.containerMarker.eachLayer(marker => marker.openPopup());
    setTimeout(()=>{
        riferimentoMappa.current.containerMarker.eachLayer(marker => marker.closePopup());
    },4000)
}

export function buildMarkerAndFly(riferimentoMappa,listaAree,icona1,icona2,zoom,regioneSelezionata,history,ricercaAreeRegione){
    riferimentoMappa.current.containerMarker.clearLayers();
    riferimentoMappa.current.geoContainer.clearLayers();
    console.log(regioneSelezionata,"geoooooo")
    riferimentoMappa.current.geoContainer.addData(REGIONI[regioneSelezionata].geoJson);
    //IF ONMOUSEOVER SULLE REGIONI
    if(regioneSelezionata == "TUTTE LE REGIONI"){
        riferimentoMappa.current.geoContainer.eachLayer((regione)=>{
            regione.on("mouseover",function () {
                regione.setStyle({"fillColor":'rgba(255,215,86,0.88)'})
            })
            regione.on("mouseout",function () {
                regione.setStyle({"fillColor":''})
            })
            regione.on("click", () => {
                ricercaAreeRegione(regione.feature.properties.reg_name.toUpperCase())
            })
        })
    }
    //CREAZIONE MARKER PER OGNI AREA DELLA LISTA
    listaAree.forEach((e)=>{                                                          //AUTOCLOSE NON SI POSSONO APRIRE PIU POPUP CONTEMPORANEAMENTE SE I MARKER NON HANNO QUESTA PROPRIETA
        let nuovoMarker = L.marker(e.location.coordinates,{icon:e.type == AREA_PARCO ? icona1 : icona2})
            .bindPopup(e.nome,{autoClose: false}).
            on('click', function () {
                flyToSingleMarkerArea(riferimentoMappa,e,e.type  == AREA_PARCO ? icona1 : icona2,13,history)
            })
            .on('mouseover',()=>{
            nuovoMarker.openPopup()
            })
            .on('mouseout',()=>{
                nuovoMarker.closePopup()
            })
        riferimentoMappa.current.containerMarker.addLayer(nuovoMarker)
    })
    //SETTIMEOUT PER MOSTRARE TEMPORANEMANETE I NOMI DELLE AREEE
    if(regioneSelezionata != "TUTTE LE REGIONI"){
        setTimeout(() => {
            riferimentoMappa.current.containerMarker.eachLayer((marker) => {
                marker.openPopup()
                setTimeout(()=>{
                    marker.closePopup()
                },2000)
            })
        }, 4000);
    }
    if(regioneSelezionata == "TUTTE LE REGIONI"){
        riferimentoMappa.current.flyTo([REGIONI[regioneSelezionata].coordinate[0],REGIONI[regioneSelezionata].coordinate[1]],6.3,{animate:true,duration:2})
    }else{
        riferimentoMappa.current.flyTo([REGIONI[regioneSelezionata].coordinate[0],REGIONI[regioneSelezionata].coordinate[1]],zoom,{animate:true,duration:2})
    }

}


export function creazioneArea (riferimentoMappa,lat,lng){
    const circle = L.circle([lat,lng], {
        color: 'yellow',
        fillColor: 'rgba(68,68,68,0.76)',
        fillOpacity: 0.5,
        radius: 5000
    })
    riferimentoMappa.current.containerMarker.addLayer(circle)
}