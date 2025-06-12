import { DataSource } from "typeorm";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { Property } from "../../domain/entities/property";
describe("TypeORMBookingRepository", () => {
    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [BookingEntity, PropertyEntity, UserEntity],
            synchronize: true,
            logging: false,
        });
        await dataSource.initialize();
        bookingRepository = new TypeORMBookingRepository(
            dataSource.getRepository(BookingEntity)
        );
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("Deve salvar uma reserva com sucesso", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa",
            description: "Uma bela casa",
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1",
            "Casa",
            "Uma bela casa",
            6,
            200,
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        })
        await userRepository.save(userEntity);

        const user = new User("1", "João");
        const dateRange = new DateRange(
            new Date("2024-12-20"),
            new Date("2025-01-25")
        )

        const booking = new Booking("1", property, user, dateRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById("1");
        expect(savedBooking).toBeDefined();
        expect(savedBooking?.getId()).toBe("1");
        expect(savedBooking?.getProperty().getId()).toBe("1");
        expect(savedBooking?.getUser().getId()).toBe("1");
    });

    it('Deve retornar null se a reserva não existir', async () => {
        const booking = await bookingRepository.findById("non-existent-id");
        expect(booking).toBeNull();
    })

    it("Deve salvar uma reserva com sucesso - fazendo cancelamento posterior", async () => {
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userRepository = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "Casa",
            description: "Uma bela casa",
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property(
            "1",
            "Casa",
            "Uma bela casa",
            6,
            200,
        );

        const userEntity = userRepository.create({
            id: "1",
            name: "João",
        })
        await userRepository.save(userEntity);

        const user = new User("1", "João");
        const dateRange = new DateRange(
            new Date("2025-12-20"),
            new Date("2025-12-25")
        )

        const booking = new Booking("1", property, user, dateRange, 4);
        await bookingRepository.save(booking);

        booking.cancel(new Date("2025-12-15"));
        await bookingRepository.save(booking);

        const updatedBooking = await bookingRepository.findById("1");
        expect(updatedBooking).toBeDefined();
        expect(updatedBooking?.getStatus()).toBe("CANCELLED");
    });
})