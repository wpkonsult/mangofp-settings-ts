export interface NextState {
    value: string;
    text: string;
}

export interface EmailTemplate {
    addresses: string[];
    template: string;
}

export function makeTemplateObj(): EmailTemplate {
    return {
        addresses: [],
        template: "",
    };
}

export interface StateData {
    order: number;
    code: string;
    state: string;
    action: string;
    next: string[];
    template?: EmailTemplate;
}
