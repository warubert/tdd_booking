export class DateRange {
    private readonly startDate: Date;
    private readonly endDate: Date;
    constructor(startDate: Date, endDate: Date) {
        if (endDate < startDate) {
            throw new Error('Data de término não pode ser menor que a data de início');
        }

        this.startDate = startDate;
        this.endDate = endDate;
    }

    getStartDate(): Date {
        return this.startDate;
    }
    
    getEndDate(): Date {
        return this.endDate;
    }
}