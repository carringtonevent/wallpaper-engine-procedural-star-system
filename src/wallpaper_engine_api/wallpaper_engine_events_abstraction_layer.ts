import { Listenable } from '../helpers/listenable'

const possibleEvents = {
  // boolean
  supportfpssettings: (_: boolean) => {},
  skybox: (_: 'blue' | 'darkgreen' | 'lightblue' | 'red') => {},
  // int (0-100)
  skyboxrotationx: (_: number) => {},
  // int (0-100)
  skyboxrotationy: (_: number) => {},
  // int (0-100)
  skyboxrotationz: (_: number) => {},
  // int (0-100)
  alpha: (_: number) => {},
  // int (0-100)
  beta: (_: number) => {},
  // int (0-100)
  zoom: (_: number) => {},
  // '0.62 0.62 0.62'
  starcoldsurfacecolor: (_: String) => {},
  // '0.62 0.62 0.62'
  starsurfacecolor: (_: String) => {},
  // int (0-255)
  starsurfacetransparency: (_: number) => {},
  // '0.62 0.62 0.62'
  starcoronacolor: (_: String) => {},
  // '0.62 0.62 0.62'
  stareruptioncolor: (_: String) => {},
  // boolean
  showplanets: (_: boolean) => {},
  // int
  planetsseed: (_: number) => {},
  // int (0-100)
  planetspeed: (_: number) => {},
  // boolean
  showplanettrail: (_: boolean) => {},
  // int (0-100)
  planetspin: (_: number) => {},
  // boolean
  planetdirection: (_: boolean) => {},
}

type UserPropertyEvents = typeof possibleEvents

interface GeneralPropertyEvents {
  fps: (fps: number) => void
}

type UserProperties = {
  [K in keyof UserPropertyEvents]?: {
    value: Parameters<UserPropertyEvents[K]>[0]
  }
}

interface GeneralProperties {
  fps?: number
}

export type AllEvents = UserPropertyEvents & GeneralPropertyEvents

type AllEventsCache = {
  [K in keyof AllEvents]?: Parameters<AllEvents[K]>[0]
}

declare global {
  interface Window {
    wallpaperPropertyListener?: {
      applyUserProperties: (properties: UserProperties) => void
      applyGeneralProperties: (properties: GeneralProperties) => void
    }
  }
}

class WallpaperEngineEventsAbstractionLayer extends Listenable<AllEvents> {
  private readonly _allEventsCache: AllEventsCache = {}

  constructor() {
    super()

    window.wallpaperPropertyListener = {
      applyUserProperties: (properties: UserProperties) => {
        const eventsActivationCache: AllEventsCache = {}

        for (const keyString in possibleEvents) {
          const key = keyString as keyof UserPropertyEvents
          const property = properties[key]
          if (property && property.value != this._allEventsCache[key]) {
            this._allEventsCache[key] = eventsActivationCache[key] = property.value as any
          }
        }

        for (const keyString in eventsActivationCache) {
          const key = keyString as keyof AllEventsCache
          this.activateListeners(key, eventsActivationCache[key]!)
        }
      },
      applyGeneralProperties: (properties: GeneralProperties) => {
        const eventsActivationCache: AllEventsCache = {}

        if (properties.fps != undefined && properties.fps != this._allEventsCache.fps) {
          this._allEventsCache.fps = eventsActivationCache.fps = properties.fps
        }

        for (const keyString in eventsActivationCache) {
          const key = keyString as keyof AllEventsCache
          this.activateListeners(key, eventsActivationCache[key]!)
        }
      },
    }
  }

  public getLastEventValueOf<T extends keyof AllEventsCache>(event: T): AllEventsCache[T] {
    return this._allEventsCache[event]
  }
}

export const wallpaperEngineEventsAbstractionLayer = new WallpaperEngineEventsAbstractionLayer()
