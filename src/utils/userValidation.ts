export function inputIsCityState(input: string) {
    const regex = /^[\w ]+,[ ]?[A-Za-z]{2}$/ //regex to check if format is comma separated city state pair
    
    //determine if the entry is a city/state pair
    if(regex.test(input)) {
        return true;
    }

    return false;
}

export function formatCityStateInput(input: string) {
    const stateCode = input.substring(input.length - 2, input.length);
    const idxComma = input.indexOf(',');
    return `${input.substring(0, idxComma)},+'${stateCode}`;
}
