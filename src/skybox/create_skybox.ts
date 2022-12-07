import * as BABYLON from 'babylonjs'

export const createSkybox = (scene: BABYLON.Scene): void => {
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 10000 }, scene)

  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('./assets/imgs/skybox/bkg1', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.freeze()

  skybox.material = skyboxMaterial
  skybox.freezeWorldMatrix()
  skybox.doNotSyncBoundingInfo = true
}
