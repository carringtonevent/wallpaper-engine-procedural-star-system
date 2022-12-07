import * as BABYLON from 'babylonjs'
import { Planet } from './planet'

const planets: Planet[] = []

export const createPlanets = (scene: BABYLON.Scene, seed: number): void => {
  scene.blockfreeActiveMeshesAndRenderingGroups = true

  for (const planet of planets) {
    planet.dispose()
  }
  planets.length = 0

  scene.blockfreeActiveMeshesAndRenderingGroups = false

  const originalSeed = seed

  const getRandom = (): number => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const planetCount = Math.round(getRandom() * 9 + 1)

  const getRandomPosRadiants = () => getRandom() * BABYLON.Scalar.TwoPi
  const getRandomScale = () => getRandom() * 0.9 + 0.1
  const getRandomSpin = () => getRandom() * 2.9 + 0.1
  const getRandomColor = () => new BABYLON.Color3(getRandom() * 0.7, getRandom() * 0.6, getRandom() * 0.7)
  const getRandomBool = () => getRandom() > 0.5

  let planetPosRadius = 0
  const getRandomPosRadius = () => {
    planetPosRadius += getRandom() * 5 + 5
    return planetPosRadius
  }

  for (let i = 0; i < planetCount; i++) {
    planets.push(new Planet(scene, {
      name: `planet_${originalSeed}_${i}`,
      posRadiants: getRandomPosRadiants(),
      posRadius: getRandomPosRadius(),
      scale: getRandomScale(),
      spin: getRandomSpin(),
      color: getRandomColor(),
      rocky: getRandomBool(),
    }))
  }
}
