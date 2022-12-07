import * as BABYLON from 'babylonjs'
import { wallpaperEngineEventsAbstractionLayer } from '../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

export const createSkybox = (scene: BABYLON.Scene): void => {
  const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 10000 }, scene)

  const skyboxMaterial = new BABYLON.StandardMaterial('skybox', scene)

  const blueReflectionTexture = new BABYLON.CubeTexture('assets/imgs/skybox/blue/bkg1', scene)
  const darkGreenReflectionTexture = new BABYLON.CubeTexture('assets/imgs/skybox/green/space', scene)

  blueReflectionTexture.coordinatesMode = darkGreenReflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE

  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = blueReflectionTexture
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.freeze()

  skybox.material = skyboxMaterial
  skybox.freezeWorldMatrix()
  skybox.doNotSyncBoundingInfo = true

  wallpaperEngineEventsAbstractionLayer.addListener('skybox', skyboxType => {
    skyboxMaterial.unfreeze()

    switch (skyboxType) {
      case 'blue':
        skyboxMaterial.reflectionTexture = blueReflectionTexture
        break
      case 'darkgreen':
        skyboxMaterial.reflectionTexture = darkGreenReflectionTexture
        break
    }

    skyboxMaterial.freeze()
  })
}
