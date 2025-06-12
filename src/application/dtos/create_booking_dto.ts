export interface CreateBookingDto {
    guestId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    guestCount: number;
}