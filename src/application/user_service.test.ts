import { UserService } from "./user_service";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
import { User } from "../domain/entities/user";
describe("UserService", () => {
    let userService: UserService;
    let fakeUserRepository: FakeUserRepository;

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        userService = new UserService(fakeUserRepository);
    })
    it("DEVE RETORNAR NULL QUANDO UM ID INVALIDO FOR PASSADO", async () => {
        const user = await userService.findUserById("999");
        expect(user).toBeNull();
    });

    it("DEVE RETORNAR user QUANDO UM ID VALIDO FOR PASSADO", async () => {
        const user = await userService.findUserById("1");
        expect(user).not.toBeNull();
        expect(user?.getId()).toBe("1");
        expect(user?.getName()).toBe("João");
    });

    it("Deve salvar um novo usuário com sucesso usando repositório fake e buscando novamente", async () => {
        const newUser = new User("3", "Test User")
        await fakeUserRepository.save(newUser)

        const user = await userService.findUserById("3");
        expect(user).not.toBeNull();
        expect(user?.getId()).toBe("3");
        expect(user?.getName()).toBe("Test User");
    });
});