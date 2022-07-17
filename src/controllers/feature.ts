import { FeatureUpdateDto } from '../types'

export const updateFeature = async (dto: FeatureUpdateDto) => {
  console.log('dto: ', dto)

  await new Promise((resolve) => setTimeout(resolve, 3000))
}
