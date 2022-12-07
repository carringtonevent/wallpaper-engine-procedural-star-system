import * as BABYLON from 'babylonjs'
import { glowLayerWrapper } from '../../glow_layer/glow_layer'

BABYLON.ParticleHelper.BaseAssetsUrl = './assets/particles'
BABYLON.ParticleSystemSet.BaseAssetsUrl = './assets/particles'

export const createSun = (scene: BABYLON.Scene): void => {
  BABYLON.ParticleHelper.CreateAsync('sun', scene, true).then(
    sun => {
      const sunEmitter = sun.emitterNode as BABYLON.Mesh
      sunEmitter.freezeWorldMatrix()
      sunEmitter.doNotSyncBoundingInfo = true
      glowLayerWrapper.value!.addExcludedMesh(sunEmitter)
      sun.start()
    }
  )

  const light = new BABYLON.PointLight('starLight', BABYLON.Vector3.Zero(), scene)
  light.diffuse = new BABYLON.Color3(0.98, 0.9, 1)
  light.specular = new BABYLON.Color3(1, 0.9, 0.5)

  // z-index Fix
  scene.setRenderingAutoClearDepthStencil(2, false)
  scene.setRenderingAutoClearDepthStencil(1, false)
  scene.setRenderingAutoClearDepthStencil(3, false)
}
