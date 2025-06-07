export class Property {


    constructor(
        private id: string,
        private name: string,
        private description: string,
        private maxGuests: number,
        private basePricePerNight: number,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxGuests = maxGuests;
        this.basePricePerNight = basePricePerNight;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDescription() { 
        return this.description;
    }
    getMaxGuests() {
        return this.maxGuests;
    }
    getBasePricePerNight() {
        return this.basePricePerNight;
    }
}