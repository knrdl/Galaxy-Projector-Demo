/// <reference types="svelte" />

class HSV {
    h: number // 0-360
    s: number // percent
    v: number // percent
}

class HSL {
    h: number // 0-360
    s: number // percent
    l: number // percent
}

class Stars {
    on: boolean
    brightness: number // percent
    speed: number // percent
}

type SceneMode = 'flash' | 'breath'

class Scene {
    speed: number // percent
    mode: SceneMode
    colors: HSV[]
}

class Nebula {
    on: boolean
    scene: Scene
}

class GalaxyState {
    stars: Stars
    nebula: Nebula
}

class Galaxy extends GalaxyState {
    name: string
    selected: boolean
}

class ProjectorState extends GalaxyState {
    power: boolean
}
