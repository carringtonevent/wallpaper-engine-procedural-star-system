import * as BABYLON from 'babylonjs'
import { createSunSystem } from './system/create_sun_system'
import { createCamera } from './camera/create_camera'
import { createSkybox } from './skybox/create_skybox'
import { glowLayerWrapper } from './glow_layer/glow_layer'
import { wallpaperEngineEventsAbstractionLayer } from './wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

import './style.css'

const canvas = document.getElementById('game') as HTMLCanvasElement
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
})

const scene = new BABYLON.Scene(engine, {
  useGeometryUniqueIdsMap: true,
  useMaterialMeshMap: true,
  useClonedMeshMap: true,
})
scene.autoClear = false
scene.skipFrustumClipping = true
// scene.autoClearDepthAndStencil = false

glowLayerWrapper.value = new BABYLON.GlowLayer('glowLayer', scene)

createSkybox(scene)

createSunSystem(scene)

createCamera(scene)

window.addEventListener('resize', () => engine.resize())

let fps = 0
let fpsThreshold = 0
let supportFpsSettings = true

wallpaperEngineEventsAbstractionLayer.addListener('supportfpssettings', newSupportFpsSettings => supportFpsSettings = newSupportFpsSettings)
wallpaperEngineEventsAbstractionLayer.addListener('fps', newFps => fps = newFps)

engine.runRenderLoop(() => {
  if (supportFpsSettings) {
    if (fps > 0) {
      fpsThreshold += engine.getDeltaTime() / 1000
  
      if (fpsThreshold < 1 / fps) return
  
      fpsThreshold -= 1 / fps
    } else {
      return
    }
  }

  scene.render()
})

// Debug Scene
// const camera = scene.getCameraByName('camera') as BABYLON.ArcRotateCamera
// camera.attachControl(canvas, true)
// scene.debugLayer.show({
//   showExplorer: true,
//   showInspector: true,
//   overlay: true,
//   inspectorURL: './assets/js/inspector.js'
// })
