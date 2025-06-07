export interface IRoom {
    _id: string;
    nameRoom: string;
    hotel: string;
    capacity: string;
    roomType: string;
    pricePerNight: number;
    amenities: string[];
    images: string[];
    isAvailable: boolean;
    text: string;
}