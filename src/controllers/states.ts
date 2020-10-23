import { StateData } from "@/types";

async function fetchTemplates() {
    return {
        REGISTERED: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nSuur tänu! Olete koolitusele registreeritud.\nTäpsema info ja arve saadame enne koolituse algust e-mailile.\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        WAIT4CONF: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nSuur tänu! Olete koolitusele registreeritud.\n\nSaadan Töötukassasse ära registreerimisteate ja annan teada kui neilt kinnitus saabub.\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        CONFRECEIVED: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nTöötukassalt saabus kinnitus, sellega on nüüd kõik korras ja jääb ainult koolitust oodata.\n\nSaadan enne koolituse algust veel täpsustava infomeili.\n\nTervitades\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        WAIT4ACCEPT: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nSuur tänu, et tunnete huvi meie koolituse vastu. Kuna järgmine koolitusaeg ei ole hetkel veel paigas, siis jätame Teid ootelehele ja anname teada kui koolitusaeg selgub.\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        WAIT4NEW: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nSuur tänu, et tunnete huvi meie koolituse vastu. Kuna järgmine koolitusaeg ei ole hetkel veel paigas, siis jätame Teid ootelehele ja anname teada kui koolitusaeg selgub.\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        NOTIFIED: {
            addresses: ["wp@nort.ee"],
            template:
                "Tere!\n\nOotame Teid esmaspäeval, 06. novembril kell 10.00, Exceli täiendkoolituse esimesele päevale.\n\nKoolitus toimub NORT Koolituse arvutiklassis, Vaksali 17a, ruum 407, Tartu (sissepääs Vaksali tänavalt, lillepoe ja kohvikuga samast uksest, liftiga 4.korrusele, asume otse lifti vastas.)\n\nPanin kaasa ka koolitusarve. Kui midagi oleks selles vaja muuta, siis andke palun teada.\n\nParkimine -  tänava ääres kellaga 90 min tasuta ja alates kella 18.00-st tasuta. Raudtee äärses parklas ja Tiigi tn äärses parklas on kogu aeg tasuta. Lähim linnaliini peatus on „Vaksali“.\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000",
        },
        FBASKED: {
            addresses: ["wp@nort.ee"],
            template:
                'Tere!\n\nSuur tänu koolitusel "<<label>>" osalemise eest.\nPaluksin nüüd Teilt sellele väikest tagasisidet. Mis hästi, mis halvasti, kas koolitusest oli reaalset kasu jms.\n\nTagasiside  küsimustiku leiate aadressilt https://nort.ee\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000',
        },
        NEWSLETTER: {
            addresses: ["wp@nort.ee"],
            template:
                'Tere!\n\nAitäh, et liitusite meie uudiskirjaga!.\n\nTänutäheks pakume Teile koolitusel osalemiseks soodustust -10%. (Soodustuse saamiseks, kirjutage koolitusele registreerumisel lisainfo lahtrisse sõna - "uudiskiri") Meie koolituskalendri leiate aadressilt https://nort.ee/koolituskalender/ \n\nKui on küsimusi, siis vastan meeleldi.\n\nTervitustega\nSirli Järviste\n_______________\nN.O.R.T Koolitus\nVaksali 17a, (407), Tartu\nhttps://www.nort.ee\ninfo@nort.ee\ntel. 7428000',
        },
    };
}
async function fetchStates(): Promise<StateData[]> {
    // eslint-disable-next-line
    const templates: any = await fetchTemplates();
    return [
        {
            order: 1,
            code: "NEW",
            state: "Uus",
            action: "M\u00e4\u00e4ra uueks",
            next: [
                "REGISTERED",
                "WAIT4CONF",
                "WAIT4NEW",
                "WAIT4ACCEPT",
                "CANCELLED",
                "NEWSLETTER",
                "ARCHIVED",
            ],
            template: templates["NEW"],
        },
        {
            order: 2,
            code: "REGISTERED",
            state: "Registreeritud",
            action: "Registreeri",
            next: ["NOTIFIED", "ARCHIVED", "CANCELLED"],
            template: templates["REGISTERED"],
        },
        {
            order: 3,
            code: "WAIT4CONF",
            state: "TTA kaudu",
            action: "TTA kaudu",
            next: ["CONFRECEIVED", "CANCELLED"],
            template: templates["WAIT4CONF"],
        },
        {
            order: 4,
            code: "WAIT4NEW",
            state: "Ooteleht",
            action: "Ooteleht",
            next: ["REGISTERED", "WAIT4ACCEPT", "CANCELLED"],
            template: templates["WAIT4NEW"],
        },
        {
            order: 5,
            code: "WAIT4ACCEPT",
            state: "Aeg pakutud",
            action: "Paku uus aeg",
            next: ["REGISTERED", "WAIT4ACCEPT", "CANCELLED"],
            template: templates["WAIT4ACCEPT"],
        },
        {
            order: 6,
            code: "CONFRECEIVED",
            state: "Kinnitus saabunud",
            action: "Kinnitus saabunud",
            next: ["REGISTERED", "NOTIFIED", "ARCHIVED", "CANCELLED"],
            template: templates["CONFRECEIVED"],
        },
        {
            order: 7,
            code: "NOTIFIED",
            state: "Teade saadetud",
            action: "Saada meeldetuletus",
            next: ["FBASKED", "ARCHIVED"],
            template: templates["NOTIFIED"],
        },
        {
            order: 8,
            code: "FBASKED",
            state: "Tagasiside k\u00fcsitud",
            action: "K\u00fcsi tagasiside",
            next: ["ARCHIVED"],
            template: templates["FBASKED"],
        },
        {
            order: 9,
            code: "NEWSLETTER",
            state: "Uudiskiri",
            action: "Uudiskiri",
            next: ["ARCHIVED"],
            template: templates["NEWSLETTER"],
        },
        {
            order: 10,
            code: "ARCHIVED",
            state: "Arhiveeritud",
            action: "Arhiveeri",
            next: [],
            template: templates["ARCHIVED"],
        },
        {
            order: 11,
            code: "CANCELLED",
            state: "Katkestatud",
            action: "Katkesta",
            next: ["ARCHIVED"],
            template: templates["CANCELLED"],
        },
    ];
}

export { fetchStates, fetchTemplates };
