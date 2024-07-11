import { Image, Video } from './ConstructorGallery.js'

export default class MediaFactory  {
    constructor(data) {
        if (data.image) {
            return new Image(data)
        }else if (data.video) {
            return new Video(data)
    }else {
        throw "Erreur data Image ou Vidéo"
    }
    }
}