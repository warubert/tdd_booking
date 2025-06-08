import { DateRange } from '../value_objects/date_range';
import { Property } from './property';
import { User } from './user';
import { Booking } from './booking';
describe("Booking Entity", ()=> {
    it('Deve criar uma instancia de booking com todos os atributos', () => {
        const property = new Property("1", "Casa", "Desc", 4, 100)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-25"))

        const booking = new Booking("1", property, user, dateRange, 2)

        expect(booking.getId()).toBe("1")
        expect(booking.getProperty()).toBe(property)
        expect(booking.getUser()).toBe(user)
        expect(booking.getDateRange()).toBe(dateRange)
        expect(booking.getGuestCount()).toBe(2)
    })

    it('deve lançar um erro se o numero de hospedes 0', ()=>{
        const property = new Property("1", "Casa", "Desc", 4, 100)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-25"))

        expect(()=>{
            new Booking('1', property, user, dateRange, 0);
        }).toThrow('O numero de hospedes deve ser maior que 0');
    })

    it('deve lançar um erro se o numero de hospedes for acima do permitido', ()=>{
        const property = new Property("1", "Casa", "Desc", 4, 100)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-25"))

        expect(()=>{
            new Booking('1', property, user, dateRange, 5);
        }).toThrow("Número máximo de hospedes excedido. Máximo permitido é 4");
    })

    it('deve calcular o preço total com desconto', ()=>{
        //Arrange
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-21"), new Date("2025-06-30"))

        //Act
        const booking = new Booking('1', property, user, dateRange, 4);

        //Assert
        expect(booking.getTotalPrice()).toBe(300*9*.9)
    })

    it('Não deve agendar uma propriedade quando ela estiver indisponível', ()=>{
        //Arrange
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-21"), new Date("2025-06-30"))
        const dateRange2 = new DateRange(new Date("2025-06-22"), new Date("2025-06-28"))

        //Act
        const booking = new Booking('1', property, user, dateRange, 4);

        //Assert
        expect(() => {new Booking('2', property, user, dateRange2, 4)}).toThrow("A propriedade não está disponível para o período selecionado")
    })

    it('Deve cancelar uma reserva sem reembolso quando falta menos de um dia para o checkin', ()=>{
        //Arrange
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-22"))

        //Act
        const booking = new Booking('1', property, user, dateRange, 4);
        const currentDate = new Date("2025-06-20");
        booking.cancel(currentDate)

        //Assert
        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(600);
    })

    it('Deve cancelar uma reserva com reembolso total quando a data for superior a 7 dias antes do checkin', ()=>{
        //Arrange
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-22"))

        //Act
        const booking = new Booking('1', property, user, dateRange, 4);
        const currentDate = new Date("2025-06-10");
        booking.cancel(currentDate)

        //Assert
        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(0);
    })

    it('Deve cancelar uma reserva com reembolso parcial quando a data for entre 1 a 7 dias antes do checkin', ()=>{
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-22"))

        const booking = new Booking('1', property, user, dateRange, 4);
        const currentDate = new Date("2025-06-15");
        booking.cancel(currentDate)

        expect(booking.getStatus()).toBe("CANCELLED");
        expect(booking.getTotalPrice()).toBe(600/2);
    })

    it('Não deve permitir cancelar a mesma reserva mais de uma vez', ()=>{
        const property = new Property("1", "Casa", "Desc", 4, 300)
        const user = new User("1", "João")
        const dateRange = new DateRange(new Date("2025-06-20"), new Date("2025-06-22"))

        const booking = new Booking('1', property, user, dateRange, 4);
        const currentDate = new Date("2025-06-15");
        booking.cancel(currentDate)
        expect(() => {
            booking.cancel(currentDate)
        }).toThrow("Reserva já cancelada")
    })
});