import { StateData } from "@/types";
async function fetchStates() {
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
        },
        {
            order: 2,
            code: "REGISTERED",
            state: "Registreeritud",
            action: "Registreeri",
            next: ["NOTIFIED", "ARCHIVED", "CANCELLED"],
        },
        {
            order: 3,
            code: "WAIT4CONF",
            state: "TTA kaudu",
            action: "TTA kaudu",
            next: ["CONFRECEIVED", "CANCELLED"],
        },
        {
            order: 4,
            code: "WAIT4NEW",
            state: "Ooteleht",
            action: "Ooteleht",
            next: ["REGISTERED", "WAIT4ACCEPT", "CANCELLED"],
        },
        {
            order: 5,
            code: "WAIT4ACCEPT",
            state: "Aeg pakutud",
            action: "Paku uus aeg",
            next: ["REGISTERED", "WAIT4ACCEPT", "CANCELLED"],
        },
        {
            order: 6,
            code: "CONFRECEIVED",
            state: "Kinnitus saabunud",
            action: "Kinnitus saabunud",
            next: ["REGISTERED", "NOTIFIED", "ARCHIVED", "CANCELLED"],
        },
        {
            order: 7,
            code: "NOTIFIED",
            state: "Teade saadetud",
            action: "Saada meeldetuletus",
            next: ["FBASKED", "ARCHIVED"],
        },
        {
            order: 8,
            code: "FBASKED",
            state: "Tagasiside k\u00fcsitud",
            action: "K\u00fcsi tagasiside",
            next: ["ARCHIVED"],
        },
        {
            order: 9,
            code: "NEWSLETTER",
            state: "Uudiskiri",
            action: "Uudiskiri",
            next: ["ARCHIVED"],
        },
        {
            order: 10,
            code: "ARCHIVED",
            state: "Arhiveeritud",
            action: "Arhiveeri",
            next: [],
        },
        {
            order: 11,
            code: "CANCELLED",
            state: "Katkestatud",
            action: "Katkesta",
            next: ["ARCHIVED"],
        },
    ];
}

export { fetchStates };
