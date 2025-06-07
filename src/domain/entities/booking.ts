import { DateRange } from "../value_objects/date_range";
import { Property } from "./property";
import { User } from "./user";

export class Booking {
    private readonly id: string;
    private readonly guest: User;
    private readonly property: Property;
    private readonly dateRange: DateRange;
    private readonly guestCount: number;

    constructor(
        id: string,
        property: Property,
        guest: User,
        dateRange: DateRange,
        guestCount: number
    ){
        this.id = id;
        this.property = property;
        this.guest = guest;
        this.dateRange = dateRange;
        this.guestCount = guestCount;
    }

    getId(){
        return this.id;
    }

    getProperty(){
        return this.property;
    }

    getUser(){
        return this.guest;
    }

    getDateRange(){
        return this.dateRange;
    }

    getGuestCount(){
        return this.guestCount;
    }
}