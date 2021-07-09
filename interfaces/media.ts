export enum mediaEntityType {
    photo = 'photo',
    video = 'video',
    vimeo = 'vimeo',
    youtube = 'youtube',
}

export interface Media {
    title?: string
    fileName?: string
    url?: string
    id?: number
    entityType: mediaEntityType
    rivers?: number
    user: number
}

export const MediaModel: Media = {
    title: '',
    fileName: '',
    url: '',
    entityType: mediaEntityType.photo,
    user: 0,
}



export interface RiversMedia {
    riverId: number
    mediaId: number
    primary: boolean
    key?: string
}
