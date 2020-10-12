export interface StateData {
	order: number,
	code: string,
	state: string,
	action: string,
	next: string[],
}

export interface NextState {
	value: string,
	text: string
}
