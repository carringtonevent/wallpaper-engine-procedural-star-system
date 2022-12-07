import * as BABYLON from 'babylonjs'
import { wallpaperEngineEventsAbstractionLayer } from '../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'

export const createCamera = (scene: BABYLON.Scene): void => {
  const minRadius = 3

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    minRadius,
    new BABYLON.Vector3(0, 0, 0),
    scene,
  )

  const zoomAnimation = new BABYLON.Animation(
    `${camera.name}_radius_animation`,
    'radius',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )

  const alphaAnimation = new BABYLON.Animation(
    `${camera.name}_alpha_animation`,
    'alpha',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )

  const betaAnimation = new BABYLON.Animation(
    `${camera.name}_beta_animation`,
    'beta',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    undefined,
    false,
  )

  camera.animations.push(zoomAnimation, alphaAnimation, betaAnimation)

  // Wallpaper Engine zoom option
  let isFirstZoomEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('zoom', zoom => {
    const newRadius = minRadius + zoom

    if (isFirstZoomEvent) {
      // Initial zoom configuration
      isFirstZoomEvent = false
      camera.radius = newRadius
      return
    }

    // Zoom configuration change

    zoomAnimation.setKeys([
      {
        frame: 0,
        value: camera.radius,
      },
      {
        frame: 60,
        value: newRadius,
      }
    ])

    scene.stopAnimation(camera, zoomAnimation.name)

    scene.beginDirectAnimation(
      camera,
      [zoomAnimation],
      0,
      60,
      false,
      2,
    )
  })

  // Wallpaper Engine alpha option
  let isFirstAlphaEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('alpha', alpha => {
    const alphaRadiants = BABYLON.Scalar.TwoPi * alpha * 0.01

    if (isFirstAlphaEvent) {
      // Initial alpha configuration
      isFirstAlphaEvent = false
      camera.alpha = alphaRadiants
      return
    }

    // Alpha configuration change

    alphaAnimation.setKeys([
      {
        frame: 0,
        value: camera.alpha,
      },
      {
        frame: 60,
        value: alphaRadiants,
      }
    ])

    scene.stopAnimation(camera, alphaAnimation.name)

    scene.beginDirectAnimation(
      camera,
      [alphaAnimation],
      0,
      60,
      false,
      2,
    )
  })

  // Wallpaper Engine beta option
  let isFirstBetaEvent = true
  wallpaperEngineEventsAbstractionLayer.addListener('beta', beta => {
    const betaRadiants = Math.PI * beta * 0.01

    if (isFirstBetaEvent) {
      // Initial beta configuration
      isFirstBetaEvent = false
      camera.beta = betaRadiants
      return
    }

    // Beta configuration change

    betaAnimation.setKeys([
      {
        frame: 0,
        value: camera.beta,
      },
      {
        frame: 60,
        value: betaRadiants,
      }
    ])

    scene.stopAnimation(camera, betaAnimation.name)

    scene.beginDirectAnimation(
      camera,
      [betaAnimation],
      0,
      60,
      false,
      2,
    )
  })
}
