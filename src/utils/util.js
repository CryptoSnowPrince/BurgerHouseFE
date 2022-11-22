export const getCoinRef = (_refLevel) => {
    if (_refLevel < 2) {
        return 7;
    }
    if (_refLevel < 3) {
        return 3;
    }
    return 2;
}

export const getCashRef = (_refLevel) => {
    if (_refLevel < 2) {
        return 3;
    }
    if (_refLevel < 3) {
        return 2;
    }
    return 1;
}