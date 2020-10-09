function locStr(key: string): string {
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

export { locStr };
