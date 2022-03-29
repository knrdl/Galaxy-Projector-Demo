export function hsv2hsl({h, s, v}: HSV): HSL {
    s /= 100
    v /= 100
    const l = v - v * s / 2
    const m = Math.min(l, 1 - l)
    return {h, s: (m ? (v - l) / m : 0) * 100, l: l * 100}
}

export function hsv2css(hsv: HSV) {
    const hsl = hsv2hsl(hsv)
    return `hsla(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%, ${20 + hsv.v * 0.8}%)`
}
