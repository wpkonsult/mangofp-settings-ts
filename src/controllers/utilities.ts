function swapArrayElements(sourceArray: any[], firstIndex: number, secondIndex: number) {
	const tempElem = sourceArray[firstIndex];
	sourceArray[firstIndex] = sourceArray[secondIndex];
	sourceArray[secondIndex] = tempElem;
	return sourceArray;
}

export default {swapArrayElements};