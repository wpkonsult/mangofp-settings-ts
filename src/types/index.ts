export interface NextState {
    value: string;
    text: string;
}

export interface EmailTemplate {
    mainAddresses: string[];
    addresses: string[];
    template: string;
    stateCode: string;
    loaded: boolean;
}

export function makeTemplateObj(
    stateCode = "",
    template = "",
    addresses: string[] = [],
    mainAddresses: string[] = ["[contactEmail]"],
    loaded = false,
): EmailTemplate {
    return { stateCode, mainAddresses, addresses, template, loaded };
}

export interface StateData {
    order: number;
    code: string;
    state: string;
    action: string;
    next: string[];
    template: EmailTemplate;
    savingInfo: boolean;
    savingTemplate: boolean;
}
