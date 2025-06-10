export interface CreateBookingDto {
    userId: string;
    propertyId: string;
    startTime: Date;
    endTime: Date;
    guestCount: number;
}