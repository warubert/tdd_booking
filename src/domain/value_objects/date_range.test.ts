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

    it('Deve verificar se dois intervalos de datas se sobrepõem', () => {
        const dateRange1 = new DateRange(new Date('2025-06-20'), new Date('2025-06-22'));
        const dateRange2 = new DateRange(new Date('2025-06-21'), new Date('2025-06-23'));

        const overlaps = dateRange1.overlaps(dateRange2);
        expect(overlaps).toBe(true);

    });

    it('Deve lançar erro se a data de inicio e termino forem iguais', () => {
        const date = new Date('2025-06-20');
        expect(() => {
            new DateRange(date, date);
        }).toThrow('Data de término não pode ser igual à data de início');
    })
});