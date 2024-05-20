export const radToDeg = (rad) => { return rad * 180 / Math. PI; }

export const degToRad = (deg) => { return deg * Math. PI / 180; }

export const mapVal = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};