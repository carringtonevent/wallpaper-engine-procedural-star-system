import * as BABYLON from 'babylonjs'
import { glowLayerWrapper } from '../../glow_layer/glow_layer'
import { wallpaperEngineEventsAbstractionLayer } from '../../wallpaper_engine_api/wallpaper_engine_events_abstraction_layer'
import { MathHelper } from '../../helpers/math_helper'

export interface PlanetOptions {
  name: string
  posRadiants: number
  posRadius: number
  scale: number
  spin: number
  color: BABYLON.Color3
  rocky: boolean
}

const Gm = 6674.20 * 0.05

export class Planet extends BABYLON.TransformNode {
  constructor(scene: BABYLON.Scene, private _options: PlanetOptions) {
    super(_options.name, scene)

    // Variables
    this._w = Math.sqrt(Gm / _options.posRadius) / (BABYLON.Scalar.TwoPi * Math.sqrt(Math.pow(_options.posRadius, 3) / Gm))
    this._angPos = _options.posRadiants

    const planetSpeed = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('planetspeed')
    this._planetSpeed = planetSpeed == undefined ? 50 : planetSpeed

    const planetSpin = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('planetspin')
    this._planetSpin = planetSpin == undefined ? 50 : planetSpin

    const planetDirection = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('planetdirection')
    this._planetDirection = planetDirection == undefined || planetDirection ? 1 : -1

    const initialShowPlanets = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('showplanets')
    const initialShowPlanetTrail = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('showplanettrail')

    const initialPlanetVisibility =
      initialShowPlanets == undefined || initialShowPlanets
        ? 1
        : 0

    const initialPlanetTrailVisibility =
      initialShowPlanets == undefined || initialShowPlanets
        ? initialShowPlanetTrail == undefined || initialShowPlanetTrail
          ? 1
          : 0
        : 0

    if (initialShowPlanets != undefined) {
      this._isFirstShowplanetsEvent = false
    }

    if (initialShowPlanets != undefined || initialShowPlanetTrail != undefined) {
      this._isFirstShowPlanetTrailSpecificEvent = false
    }

    // Planet Transform
    this._planetTransform = new BABYLON.TransformNode(`${_options.name}_planet_transform`, scene)

    // Planet
    this._planet = BABYLON.MeshBuilder.CreateSphere(`${_options.name}_planet`, { diameter: 1 }, scene)
    this._planet.visibility = initialPlanetVisibility

    const mat = new BABYLON.StandardMaterial(`${this.name}-mat`, scene)

    mat.diffuseColor = mat.specularColor = _options.color
    mat.specularPower = 0

    if (_options.rocky) {
      mat.bumpTexture = new BABYLON.Texture('assets/imgs/planets/rock/rockn.png', scene)
      mat.diffuseTexture = new BABYLON.Texture('assets/imgs/planets/rock/rock.png', scene)
    } else {
      mat.diffuseTexture = new BABYLON.Texture('assets/imgs/planets/gas/distortion.png', scene)
    }

    mat.freeze()

    this._planet.material = mat

    this._planet.scaling.setAll(_options.scale)

    this._planetTransform.position.x = _options.posRadius * Math.sin(_options.posRadiants)
    this._planetTransform.position.z = _options.posRadius * Math.cos(_options.posRadiants)

    this._planet.animations.push(this._planetVisibilityAnimation)

    glowLayerWrapper.value!.addExcludedMesh(this._planet)

    this._planet.parent = this._planetTransform
    this._planetTransform.parent = this

    // Planet Trail
    this._planet.computeWorldMatrix(true)

    const trailMat = new BABYLON.StandardMaterial(`${this.name}-trail-mat`, scene)
    trailMat.emissiveColor = trailMat.specularColor = trailMat.diffuseColor = _options.color

    trailMat.freeze()

    this._planetTrail = new BABYLON.TrailMesh(`${this.name}-trail`, this._planetTransform, scene, 0.1, BABYLON.Scalar.TwoPi * _options.posRadius, true)
    this._planetTrail.visibility = initialPlanetTrailVisibility
    this._planetTrail.material = trailMat

    this._planetTrail.parent = this

    this._planetTrail.animations.push(this._planetTrailVisibilityAnimation)

    this._planet.doNotSyncBoundingInfo = true
    this._planetTrail.doNotSyncBoundingInfo = true

    // Planet Orbit
    this._beforeRenderObserver = scene.onBeforeRenderObservable.add(this._onBeforeRender)

    // Wallpaper Engine showplanets option
    wallpaperEngineEventsAbstractionLayer.addListener('showplanets', this._onShowPlanets)
    wallpaperEngineEventsAbstractionLayer.addListener('showplanets', this._onPlanetTrailSpecificEvent)

    // Wallpaper Engine planetspeed option
    wallpaperEngineEventsAbstractionLayer.addListener('planetspeed', this._onPlanetSpeed)

    // Wallpaper Engine showplanettrail option
    wallpaperEngineEventsAbstractionLayer.addListener('showplanettrail', this._onPlanetTrailSpecificEvent)

    // Wallpaper Engine planetspin option
    wallpaperEngineEventsAbstractionLayer.addListener('planetspin', this._onPlanetSpin)

    // Wallpaper Engine planetdirection option
    wallpaperEngineEventsAbstractionLayer.addListener('planetdirection', this._onPlanetDirection)
  }

  private readonly _beforeRenderObserver: BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>>

  private _isFirstShowplanetsEvent: boolean = true
  private _isFirstShowPlanetTrailSpecificEvent: boolean = true

  private _angPos: number
  private _planetSpeed: number
  private _planetSpin: number
  private _planetDirection: number
  private readonly _w: number

  private readonly _planetTransform: BABYLON.TransformNode
  private readonly _planet: BABYLON.Mesh
  private readonly _planetTrail: BABYLON.TrailMesh

  private readonly _planetVisibilityAnimation = new BABYLON.Animation(
    `${this.name}-visibility-animation`,
    'visibility',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  )

  private readonly _planetTrailVisibilityAnimation = new BABYLON.Animation(
    `${this.name}-visibility-animation`,
    'visibility',
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  )

  dispose(doNotRecurse: boolean = false, disposeMaterialAndTextures: boolean = true): void {
    const scene = this.getScene()

    scene.onBeforeRenderObservable.remove(this._beforeRenderObserver)
    glowLayerWrapper.value!.removeExcludedMesh(this._planet)
    wallpaperEngineEventsAbstractionLayer.removeListener('showplanets', this._onShowPlanets)
    wallpaperEngineEventsAbstractionLayer.removeListener('showplanets', this._onPlanetTrailSpecificEvent)
    wallpaperEngineEventsAbstractionLayer.removeListener('planetspeed', this._onPlanetSpeed)
    wallpaperEngineEventsAbstractionLayer.removeListener('showplanettrail', this._onPlanetTrailSpecificEvent)
    wallpaperEngineEventsAbstractionLayer.removeListener('planetspin', this._onPlanetSpin)
    wallpaperEngineEventsAbstractionLayer.removeListener('planetdirection', this._onPlanetDirection)

    super.dispose(doNotRecurse, disposeMaterialAndTextures)
  }

  private _onBeforeRender = (_: BABYLON.Scene): void => {
    this._planet.rotation.y = MathHelper.repeatWithNegativ(this._planet.rotation.y + this._options.spin * this._planetSpin * 0.02 * BABYLON.Scalar.TwoPi * this._planetDirection / 60, BABYLON.Scalar.TwoPi)
    this._planetTransform.position.x = this._options.posRadius * Math.sin(this._angPos)
    this._planetTransform.position.z = this._options.posRadius * Math.cos(this._angPos)
    this._angPos = MathHelper.repeatWithNegativ(this._angPos + 0.001 * this._planetSpeed * this._w * this._planetDirection, BABYLON.Scalar.TwoPi)
  }

  private _onShowPlanets = (show: boolean): void => {
    const visibility = show ? 1 : 0

    if (this._isFirstShowplanetsEvent) {
      // Initial showplanets configuration
      this._isFirstShowplanetsEvent = false
      this._planet.visibility = visibility
      return
    }

    // Showplanets configuration change
    const keyFrames: BABYLON.IAnimationKey[] = [
      {
        frame: 0,
        value: this._planet.visibility,
      },
      {
        frame: 60,
        value: visibility,
      }
    ]

    const scene = this.getScene()

    scene.stopAnimation(this._planet, this._planetVisibilityAnimation.name)

    this._planetVisibilityAnimation.setKeys(keyFrames)

    scene.beginDirectAnimation(this._planet, [this._planetVisibilityAnimation], 0, 60, false, 2)
  }

  private _onPlanetSpeed = (planetSpeed: number): void => {
    this._planetSpeed = planetSpeed
  }

  private _onPlanetSpin = (planetSpin: number): void => {
    this._planetSpin = planetSpin
  }

  private _onPlanetDirection = (planetDirection: boolean) => {
    this._planetDirection = planetDirection ? 1 : -1
  }

  private _onPlanetTrailSpecificEvent = (): void => {
    const showPlanets = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('showplanets')
    const showPlanetTrail = wallpaperEngineEventsAbstractionLayer.getLastEventValueOf('showplanettrail')

    const visibility =
      showPlanets == undefined || showPlanets
        ? showPlanetTrail == undefined || showPlanetTrail
          ? 1
          : 0
        : 0

    if (this._isFirstShowPlanetTrailSpecificEvent) {
      // Initial showplanettrail configuration
      this._isFirstShowPlanetTrailSpecificEvent = false
      this._planetTrail.visibility = visibility
      return
    }

    const keyFrames: BABYLON.IAnimationKey[] = [
      {
        frame: 0,
        value: this._planetTrail.visibility,
      },
      {
        frame: 60,
        value: visibility,
      }
    ]

    const scene = this.getScene()

    scene.stopAnimation(this._planetTrail, this._planetTrailVisibilityAnimation.name)

    this._planetTrailVisibilityAnimation.setKeys(keyFrames)

    scene.beginDirectAnimation(this._planetTrail, [this._planetTrailVisibilityAnimation], 0, 60, false, 2)
  }
}
