import { DateRange } from "../value_objects/date_range";

export class Property {
    
    
    constructor(
        private id: string,
        private name: string,
        private description: string,
        private maxGuests: number,
        private basePricePerNight: number,
    ) {
        if(!name){
            throw new Error('Nome é obrigatório');
        }
        if(maxGuests <= 0){
            throw new Error('O numero maximo de hospedes deve ser maior que 0');
        }
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
    
    validateGuestCount(guestCount: number): void {
        if(guestCount > this.maxGuests){
            throw new Error('Número máximo de hospedes excedido. Máximo permitido é ' + this.maxGuests);
        }
    }
    
    calculateTotalPrice(dateRange: DateRange): number {
        const totalNights = dateRange.getTotalNights();
        const totalPrice = totalNights*this.basePricePerNight;
        if(totalNights >= 7){
            return totalPrice * 0.9;
        }
        return totalPrice;
    }
}