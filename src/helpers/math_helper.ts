import * as BABYLON from 'babylonjs'

export abstract class MathHelper {
  static repeatWithNegativ = (value: number, length: number): number => {
    while (value < 0) {
      value += length
    }

    return BABYLON.Scalar.Repeat(value, length)
  }
}
