function locStr(key: string): string {
    // eslint-disable-next-line
    const MANGOFP_RESOURCES = (window as any).MANGOFP_RESOURCES;
    if (
        !MANGOFP_RESOURCES ||
        !MANGOFP_RESOURCES.strings ||
        !MANGOFP_RESOURCES.strings[key]
    ) {
        return key;
    }
    return MANGOFP_RESOURCES.strings[key];
}

function validateEmail(email: string): boolean {
    if (!email) {
        return true;
    }
    const RegValidate = /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    return RegValidate.test(email);
}

export { locStr, validateEmail };
