export enum mediaEntityType {
  photo = 'photo',
  video = 'video',
  vimeo = 'vimeo',
  youtube = 'youtube',
}

export interface CreateMediaDto {
  title?: string
  fileName?: string
  url?: string
  mediaType: mediaEntityType
  userId: number
  reachId: number
}

export interface Media {
  title?: string
  fileName?: string
  url?: string
  id: number
  entityType: mediaEntityType
  rivers?: number
  user: number
}

export const MediaModel: CreateMediaDto = {
  title: '',
  fileName: '',
  url: '',
  mediaType: mediaEntityType.photo,
  userId: 0,
  reachId: 0,
}

export interface RiversMedia {
  riverId: number
  mediaId: number
  primary: boolean
  key?: string
}
