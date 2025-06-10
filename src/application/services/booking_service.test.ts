import { Booking } from "../../domain/entities/booking";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import { CreateBookingDto } from "../dtos/create_booking_dto";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";

jest.mock("./property_service");
jest.mock("./user_service");
describe("BookingService", () => {
    let bookingService: BookingService;
    let fakeBookingRepository: FakeBookingRepository;
    let mockPropertyService: jest.Mocked<PropertyService>;
    let mockUserService: jest.Mocked<UserService>;

    beforeEach(() => {
        const mockPropertyRepository = {} as any;
        const mockUserRepository = {} as any;
        
        mockPropertyService = new PropertyService(mockPropertyRepository) as jest.Mocked<PropertyService>;
        mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;

        fakeBookingRepository = new FakeBookingRepository();

        bookingService = new BookingService(fakeBookingRepository, mockPropertyService, mockUserService);
    });

    it("Deve criar uma reserva usando repositório fake", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockResolvedValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDto: CreateBookingDto = {
            userId: "1",
            propertyId: "1",
            startTime: new Date("2025-12-20"),
            endTime: new Date("2025-12-25"),
            guestCount: 2
        }

        const result = await bookingService.createBooking(bookingDto);

        expect(result).toBeInstanceOf(Booking);
        expect(result.getStatus()).toBe("CONFIRMED");
        expect(result.getTotalPrice()).toBe(500);

        const savedBooking = await fakeBookingRepository.findById(result.getId());
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(result.getId());
    })

    it("Deve lançar erro quando a propriedade não é encontrada", async () => {
        mockPropertyService.findPropertyById.mockResolvedValue(null);

        const bookingDto: CreateBookingDto = {
            userId: "1",
            propertyId: "1",
            startTime: new Date("2025-12-20"),
            endTime: new Date("2025-12-25"),
            guestCount: 2
        }

        await expect(bookingService.createBooking(bookingDto)).rejects.toThrow("Propriedade não encontrada.");
    })

    it("Deve lançar erro quando user não é encontrada", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(null);

        const bookingDto: CreateBookingDto = {
            userId: "1",
            propertyId: "1",
            startTime: new Date("2025-12-20"),
            endTime: new Date("2025-12-25"),
            guestCount: 2
        }

        await expect(bookingService.createBooking(bookingDto)).rejects.toThrow("Usuário não encontrado.");
    })

    it("Deve lançar um erro ao tentar criar reserva em período indisponível", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockResolvedValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDto: CreateBookingDto = {
            userId: "1",
            propertyId: "1",
            startTime: new Date("2025-12-20"),
            endTime: new Date("2025-12-25"),
            guestCount: 2
        }

        await bookingService.createBooking(bookingDto);

        mockProperty.isAvailable = jest.fn().mockResolvedValue(false);
        mockProperty.addBooking.mockImplementationOnce(() => {
            throw new Error("Propriedade não disponível nesse período.");
        })

        await expect(bookingService.createBooking(bookingDto)).rejects.toThrow("Propriedade não disponível nesse período.");
    })

    it("Deve cancelar uma reserva usando repositório fake", async () => {
        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockResolvedValue(true),
            validateGuestCount: jest.fn(),
            calculateTotalPrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn(),
        } as any;

        const mockUser = {
            getId: jest.fn().mockReturnValue("1"),
        } as any;

        mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
        mockUserService.findUserById.mockResolvedValue(mockUser);

        const bookingDto: CreateBookingDto = {
            userId: "1",
            propertyId: "1",
            startTime: new Date("2025-12-20"),
            endTime: new Date("2025-12-25"),
            guestCount: 2
        }

        const booking = await bookingService.createBooking(bookingDto);
        const spyFindById = jest.spyOn(fakeBookingRepository, "findById");
        await bookingService.cancelBooking(booking.getId());
        const canceledBooking = await fakeBookingRepository.findById(booking.getId());
        expect(canceledBooking?.getStatus()).toBe("CANCELLED");
        expect(spyFindById).toHaveBeenCalledWith(booking.getId());
        spyFindById.mockRestore();
    })
});