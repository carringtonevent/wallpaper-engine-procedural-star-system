import * as BABYLON from 'babylonjs'
import { glowLayerWrapper } from '../../glow_layer/glow_layer'
import { wallpaperEngineEventsAbstractionLayer } from '../../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

BABYLON.ParticleHelper.BaseAssetsUrl = './assets/particles'
BABYLON.ParticleSystemSet.BaseAssetsUrl = './assets/particles'

export const createSun = (scene: BABYLON.Scene): void => {
  BABYLON.ParticleHelper.CreateAsync('sun', scene, true).then(
    star => {
      // Star emmiter mesh
      const starEmitter = star.emitterNode as BABYLON.Mesh
      starEmitter.freezeWorldMatrix()
      starEmitter.doNotSyncBoundingInfo = true
      glowLayerWrapper.value!.addExcludedMesh(starEmitter)

      // Cold Star surface
      const sunEmmiterMaterial = scene.getMaterialById('emitterSphereMaterial') as BABYLON.StandardMaterial
      const lastColdSurfaceColor = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starcoldsurfacecolor')
      if (lastColdSurfaceColor) {
        sunEmmiterMaterial.emissiveColor = new BABYLON.Color3(...lastColdSurfaceColor.split(' ').map(float => parseFloat(float)))
      } else {
        sunEmmiterMaterial.emissiveColor = new BABYLON.Color3(96 / 255, 24 / 255, 7 / 255)
      }

      wallpaperEngineEventsAbstractionLayer.addListener('starcoldsurfacecolor', coldSurfaceColor => {
        sunEmmiterMaterial.emissiveColor = new BABYLON.Color3(...coldSurfaceColor.split(' ').map(float => parseFloat(float)))
      })

      // Star surface
      const surfaceParticles = scene.getParticleSystemById('sunSystem') as BABYLON.GPUParticleSystem
      const addSurfaceColor = (color: BABYLON.Color4) => {
        surfaceParticles.removeColorGradient(0.4)
        surfaceParticles.addColorGradient(0.4, color)
        surfaceParticles.removeColorGradient(0.5)
        surfaceParticles.addColorGradient(0.5, color)
      }
      const lastSurfaceColor = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starsurfacecolor')
      const lastSurfaceTransparency = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starsurfacetransparency')
      const initialSurfaceTransparency = lastSurfaceTransparency == undefined ? 128 / 255 : lastSurfaceTransparency / 255

      if (lastSurfaceColor) {
        addSurfaceColor(new BABYLON.Color4(...lastSurfaceColor.split(' ').map(float => parseFloat(float)), initialSurfaceTransparency))
      } else {
        addSurfaceColor(new BABYLON.Color4(160 / 255, 78 / 255, 16 / 255, initialSurfaceTransparency))
      }

      const onSurfaceEvent = () => {
        surfaceParticles.stop()
        const surfaceColor = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starsurfacecolor')
        const surfaceTransparency = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starsurfacetransparency')
        const finalSurfaceTransparency = surfaceTransparency == undefined ? 128 / 255 : surfaceTransparency / 255
        if (surfaceColor) {
          addSurfaceColor(new BABYLON.Color4(...surfaceColor.split(' ').map(float => parseFloat(float)), finalSurfaceTransparency))
        } else {
          addSurfaceColor(new BABYLON.Color4(160 / 255, 78 / 255, 16 / 255, finalSurfaceTransparency))
        }
        surfaceParticles.reset()
        surfaceParticles.start()
      }

      wallpaperEngineEventsAbstractionLayer.addListener('starsurfacecolor', onSurfaceEvent)
      wallpaperEngineEventsAbstractionLayer.addListener('starsurfacetransparency', onSurfaceEvent)

      // Star corona
      const coronaParticles = scene.getParticleSystemById('glareParticles') as BABYLON.GPUParticleSystem
      const addCoronaColor = (color: BABYLON.Color4) => {
        coronaParticles.removeColorGradient(0.5)
        coronaParticles.addColorGradient(0.5, color)
      }

      const lastCoronaColor = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('starcoronacolor')
      if (lastCoronaColor) {
        addCoronaColor(new BABYLON.Color4(...lastCoronaColor.split(' ').map(float => parseFloat(float)), 31 / 255))
      } else {
        addCoronaColor(new BABYLON.Color4(154 / 255, 74 / 255, 15 / 255, 31 / 255))
      }

      wallpaperEngineEventsAbstractionLayer.addListener('starcoronacolor', color => {
        coronaParticles.stop()
        addCoronaColor(new BABYLON.Color4(...color.split(' ').map(float => parseFloat(float)), 31 / 255))
        coronaParticles.reset()
        coronaParticles.start()
      })

      // Star eruption
      const eruptionParticles = scene.getParticleSystemById('flareParticles') as BABYLON.GPUParticleSystem
      const addEruptionColor = (color: BABYLON.Color4) => {
        eruptionParticles.removeColorGradient(0.25)
        eruptionParticles.addColorGradient(0.25, color)
      }

      const lastEruptionColor = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('stareruptioncolor')
      if (lastEruptionColor) {
        addEruptionColor(new BABYLON.Color4(...lastEruptionColor.split(' ').map(float => parseFloat(float)), 1))
      } else {
        addEruptionColor(new BABYLON.Color4(231 / 255, 182 / 255, 98 / 255, 1))
      }

      wallpaperEngineEventsAbstractionLayer.addListener('stareruptioncolor', color => {
        eruptionParticles.stop()
        addEruptionColor(new BABYLON.Color4(...color.split(' ').map(float => parseFloat(float)), 1))
        eruptionParticles.reset()
        eruptionParticles.start()
      })

      // Star(t)
      surfaceParticles.start()
      coronaParticles.start()
      eruptionParticles.start()
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
