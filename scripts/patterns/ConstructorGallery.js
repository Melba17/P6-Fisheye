
export default class Media {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.likes = data.likes;
        this.date = data.date;
        this.image = data.image;
        this.video = data.video
        this.price = data.price;
    }   
};

export class Image extends Media {
    constructor(data) {
        super(data);
        this.image = data.image;
    }
};

export class Video extends Media {
    constructor(data) {
        super(data);
        this.video = data.video;
    }
};