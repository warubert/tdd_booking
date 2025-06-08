import { DateRange } from '../value_objects/date_range';
import { Booking } from './booking';
import { Property } from './property';
import { User } from './user';

describe("Property Entity", () => {
    it("Deve criar uma instancia de property com todos os atributos", () => {
        const property = new Property(
            '1',
            'Casa de praia',
            'Uma bela casa na praia',
            4,
            200
        );

        expect(property.getId()).toBe('1');
        expect(property.getName()).toBe('Casa de praia');
        expect(property.getDescription()).toBe('Uma bela casa na praia');
        expect(property.getMaxGuests()).toBe(4);
        expect(property.getBasePricePerNight()).toBe(200);
    });

    it('deve lançar um erro se nome for vazio', () => {
        expect(() => {
            new Property("1", "", "a", 4, 200);
        }).toThrow('Nome é obrigatório');
    });

    it('deve lançar um erro se numero de hospedes for 0 ou negativo for vazio', () => {
        expect(() => {
            new Property("1", "Casa", "a", 0, 200);
        }).toThrow('O numero maximo de hospedes deve ser maior que 0');
    });

    it('deve validar o numero máximo de hospedes', () => {
        const property = new Property("1", "Casa", "a", 5, 200);    
        expect(() => {
            property.validateGuestCount(6);
        }).toThrow('Número máximo de hospedes excedido. Máximo permitido é 5');
    });

    it('Não deve aplicar desconto para estadias menores que 7 noites', () => {
        const property = new Property("1", "Casa", "a", 5, 200);
        const startDate = new Date('2025-06-20');
        const endDate = new Date('2025-06-26');
        const dateRange = new DateRange(startDate, endDate);
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(1200);
    })

    it('Deve aplicar desconto para estadias de 7 noites ou mais', () => {
        const property = new Property("1", "Casa", "a", 5, 200);
        const startDate = new Date('2025-06-20');
        const endDate = new Date('2025-06-27');
        const dateRange = new DateRange(startDate, endDate);
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(1400*0.9);
    })

    it('Deve verificar disponibilidade da propriedade', () => {
        const property = new Property("1", "Casa", "a", 5, 200);
        const dateRange = new DateRange(new Date('2025-06-20'), new Date('2025-06-26'));
        const dateRange2 = new DateRange(new Date('2025-06-22'), new Date('2025-06-27'));
        const user = new User("1", "João");
        
        new Booking("1", property, user, dateRange, 2);

        expect(property.isAvailable(dateRange)).toBe(false);
        expect(property.isAvailable(dateRange2)).toBe(false);
    })
});