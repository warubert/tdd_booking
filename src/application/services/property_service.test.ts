import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { Property } from "../../domain/entities/property";

describe("PropertyService", () => {
    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    });

    it("DEVE RETORNAR NULL QUANDO UM ID INVALIDO FOR PASSADO", async () => {
        const property = await propertyService.findPropertyById("999");
        expect(property).toBeNull();
    });

    it("DEVE RETORNAR property QUANDO UM ID VALIDO FOR PASSADO", async () => {
        const property = await propertyService.findPropertyById("1");
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("1");
        expect(property?.getName()).toBe("Apartamento");
    });

    it("Deve salvar um novo usuário com sucesso usando repositório fake e buscando novamente", async () => {
        const newProperty = new Property("3", "Test Property", "c", 4, 100)
        await fakePropertyRepository.save(newProperty)

        const property = await propertyService.findPropertyById("3");
        expect(property).not.toBeNull();
        expect(property?.getId()).toBe("3");
        expect(property?.getName()).toBe("Test Property");
    });
});