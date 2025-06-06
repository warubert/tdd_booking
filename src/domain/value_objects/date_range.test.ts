import { DateRange } from './date_range';

describe('DateRange Value Object', () => {
    
    it('Deve criar uma instancia de DateRange com datas válidas e verificar o retorno das datas', () => {
        const startDate = new Date('2025-06-20');
        const endDate = new Date('2025-06-22');
        const dateRange = new DateRange(startDate, endDate);
        
        expect(dateRange).toBeInstanceOf(DateRange);
        expect(dateRange.getStartDate()).toEqual(startDate);
        expect(dateRange.getEndDate()).toEqual(endDate);
    })
    it('Deve lançar um erro se a data de termino for menor que a data de inicio', () => {
        expect(() => {
            new DateRange(new Date('2025-06-22'), new Date('2025-06-20'));
        }).toThrow('Data de término não pode ser menor que a data de início');
    });

    it("Deve calcular o total de noites entre as datas", () => {
        const startDate = new Date('2025-06-20');
        const endDate = new Date('2025-06-22');
        const dateRange = new DateRange(startDate, endDate);

        const totalNights = dateRange.getTotalNights();
        expect(totalNights).toBe(2);
    });
});