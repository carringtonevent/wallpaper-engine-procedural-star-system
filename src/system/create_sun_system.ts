import * as BABYLON from 'babylonjs'
import { createSun } from './sun/create_sun'
import { createPlanets } from './planets/create_planets'
import { wallpaperEngineEventsAbstractionLayer } from '../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

export const createSunSystem = (scene: BABYLON.Scene): void => {
  createSun(scene)
  createPlanets(scene, 1)

  // Create planets with wallpaper engine seed
  wallpaperEngineEventsAbstractionLayer.addListener('planetsseed', seed => createPlanets(scene, seed))
}
