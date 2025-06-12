import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
describe("TypeORMPropertyRepository", () => {
    let dataSource: DataSource;
    let propertyRepository: TypeORMPropertyRepository;
    let repository: Repository<PropertyEntity>;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity],
            synchronize: true,
            logging: false,
        });
        await dataSource.initialize();
        repository = dataSource.getRepository(PropertyEntity);
        propertyRepository = new TypeORMPropertyRepository(repository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("Deve salvar uma propriedade com sucesso", async () => {
        const property =  new Property("1", "Casa", "Uma bela casa", 6, 200);

        await propertyRepository.save(property);
        const savedProperty = await repository.findOne({ where: { id: "1" } });
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    })

    it("Deve retornar uma propriedade com id valido", async () => {
        const property =  new Property("1", "Casa", "Uma bela casa", 6, 200);

        await propertyRepository.save(property);
        const savedProperty = await propertyRepository.findById("1");
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe("1");
        expect(savedProperty?.getName()).toBe("Casa");
    })

    it("Deve retornar null com id invalido", async () => {
        const property = await propertyRepository.findById("999");
        expect(property).toBeNull();
    })
})