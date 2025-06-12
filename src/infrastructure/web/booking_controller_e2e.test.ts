import express from 'express';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TypeORMBookingRepository } from '../repositories/typeorm_booking_repository';
import { TypeORMPropertyRepository } from '../repositories/typeorm_property_repository';
import { TypeORMUserRepository } from '../repositories/typeorm_user_repository';
import { BookingService } from '../../application/services/booking_service';
import { PropertyService } from '../../application/services/property_service';
import { UserService } from '../../application/services/user_service';
import { BookingController } from './booking_controller';
import { BookingEntity } from '../persistence/entities/booking_entity';
import { PropertyEntity } from '../persistence/entities/property_entity';
import { UserEntity } from '../persistence/entities/user_entity';

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

beforeAll(async () => {
    dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [
            BookingEntity,
            PropertyEntity,
            UserEntity
        ],
        synchronize: true,
        logging: false,
    });
    
    await dataSource.initialize();
    
    bookingRepository = new TypeORMBookingRepository(
        dataSource.getRepository(BookingEntity)
    );
    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity)
    );
    userRepository = new TypeORMUserRepository(
        dataSource.getRepository(UserEntity)
    );
    
    propertyService = new PropertyService(propertyRepository);
    userService = new UserService(userRepository);
    bookingService = new BookingService(
        bookingRepository, 
        propertyService,
        userService
    );

    bookingController = new BookingController(bookingService);

    app.post('/bookings', (req, res, next) => {
        bookingController.createBooking(req, res).catch((err) => next(err));
    });
    app.post('/bookings/:id/cancel', (req, res, next) => {
        bookingController.cancelBooking(req, res)
            .catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe('BookingController', () => {
    beforeAll(async () => {
        const propertRepo = dataSource.getRepository(PropertyEntity);
        const userRepo = dataSource.getRepository(UserEntity);
        const bookingRepo = dataSource.getRepository(BookingEntity);

        await bookingRepo.clear();
        await propertRepo.clear();
        await userRepo.clear();

        await propertRepo.save({
            id: '1',
            name: 'Test Property',
            description: 'A test property for booking',
            maxGuests: 5,
            basePricePerNight: 100
        });

        await userRepo.save({
            id: '1',
            name: 'Test User',
        });
    });

    it("Deve criar uma reserva com sucesso", async () => {
        const response = await request(app)
            .post('/bookings')
            .send({
                propertyId: '1',
                guestId: '1',
                startDate: '2025-12-20',
                endDate: '2025-12-25',
                guestCount: 2
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Reserva criada com sucesso');
        expect(response.body.booking).toHaveProperty('id');
        expect(response.body.booking).toHaveProperty('totalPrice');
    });

    it("Deve retorner 400 quando datas invalidas", async () => {
        const response = await request(app)
            .post('/bookings')
            .send({
                propertyId: '1',
                guestId: '1',
                startDate: 'invalid-date',
                endDate: '2025-12-25',
                guestCount: 2
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Datas invalidas');
    });

    it("Deve retornar 400 quando número de hospedes inválidos", async () => {
        const response = await request(app)
            .post('/bookings')
            .send({
                propertyId: '1',
                guestId: '1',
                startDate: '2025-12-20',
                endDate: '2025-12-25',
                guestCount: 0
            });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('O numero de hospedes deve ser maior que 0');
    });

    it("Deve cancelar uma reserva com sucesso", async () => {
        const response = await request(app)
            .post('/bookings')
            .send({
                propertyId: '1',
                guestId: '1',
                startDate: '2025-12-20',
                endDate: '2025-12-25',
                guestCount: 2
            });

        const bookingId = response.body.booking.id;
        const cancelResponse = await request(app)
            .post(`/bookings/${bookingId}/cancel`)
        
        expect(cancelResponse.status).toBe(200);
        expect(cancelResponse.body.message).toBe('Reserva cancelada com sucesso');
    });

    it("Deve cretornar erro ao tentar cancelar reserva inexistente", async () => {
        const cancelResponse = await request(app)
            .post(`/bookings/999/cancel`)
        
        expect(cancelResponse.status).toBe(400);
        expect(cancelResponse.body.message).toBe('Reserva não encontrada.');
    });
})