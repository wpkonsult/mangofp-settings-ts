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

export enum ParameterType {
    text = "TEXT",
    email = "EMAIL",
    boolean = "BOOL",
    select = "SELECT",
}

export interface Parameter {
    label: string;
    type: ParameterType;
    name: string;
    value: string;
    hint?: string;
    errorMsg?: string;
}
