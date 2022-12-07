import * as BABYLON from 'babylonjs'
import { wallpaperEngineEventsAbstractionLayer } from '../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

export const createSkybox = (scene: BABYLON.Scene): void => {
  const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 10000 }, scene)

  const rotationXAnimation = new BABYLON.Animation(
    `${skybox.name}_rotation_x_animation`,
    'rotation.x',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )
  const rotationYAnimation = new BABYLON.Animation(
    `${skybox.name}_rotation_y_animation`,
    'rotation.y',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )
  const rotationZAnimation = new BABYLON.Animation(
    `${skybox.name}_rotation_z_animation`,
    'rotation.z',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )

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
  skybox.animations.push(rotationXAnimation, rotationYAnimation, rotationZAnimation)
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

  // Wallpaper Engine skyboxrotationx option
  let isFirstRotationXEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('skyboxrotationx', rotationX => {
    const xRadiants = rotationX * 0.01 * BABYLON.Scalar.TwoPi

    if (isFirstRotationXEvent) {
      // Initial skyboxrotationx configuration
      isFirstRotationXEvent = false
      skybox.rotation.x = xRadiants
      return
    }

    // Skyboxrotationx configuration change

    rotationXAnimation.setKeys([
      {
        frame: 0,
        value: skybox.rotation.x,
      },
      {
        frame: 60,
        value: xRadiants,
      }
    ])

    scene.stopAnimation(skybox, rotationXAnimation.name)

    scene.beginDirectAnimation(
      skybox,
      [rotationXAnimation],
      0,
      60,
      false,
      2,
    )
  })

  // Wallpaper Engine skyboxrotationy option
  let isFirstRotationYEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('skyboxrotationy', rotationY => {
    const yRadiants = rotationY * 0.01 * BABYLON.Scalar.TwoPi

    if (isFirstRotationYEvent) {
      // Initial skyboxrotationy configuration
      isFirstRotationYEvent = false
      skybox.rotation.y = yRadiants
      return
    }

    // Skyboxrotationy configuration change

    rotationYAnimation.setKeys([
      {
        frame: 0,
        value: skybox.rotation.y,
      },
      {
        frame: 60,
        value: yRadiants,
      }
    ])

    scene.stopAnimation(skybox, rotationYAnimation.name)

    scene.beginDirectAnimation(
      skybox,
      [rotationYAnimation],
      0,
      60,
      false,
      2,
    )
  })

  // Wallpaper Engine skyboxrotationz option
  let isFirstRotationZEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('skyboxrotationz', rotationZ => {
    const zRadiants = rotationZ * 0.01 * BABYLON.Scalar.TwoPi

    if (isFirstRotationZEvent) {
      // Initial skyboxrotationz configuration
      isFirstRotationZEvent = false
      skybox.rotation.z = zRadiants
      return
    }

    // Skyboxrotationz configuration change

    rotationZAnimation.setKeys([
      {
        frame: 0,
        value: skybox.rotation.z,
      },
      {
        frame: 60,
        value: zRadiants,
      }
    ])

    scene.stopAnimation(skybox, rotationZAnimation.name)

    scene.beginDirectAnimation(
      skybox,
      [rotationZAnimation],
      0,
      60,
      false,
      2,
    )
  })
}
