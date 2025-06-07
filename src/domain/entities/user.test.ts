import {User} from './user';

describe("User Entity", () => {
    it("deve criar uma nova instância do usuário com id e nome", () => {
        const user = new User("1", "João");
        expect(user.getId()).toBe("1");
        expect(user.getName()).toBe("João");
    });

    it('deve lançar um erro se nome for vazio', () => {
        expect(() => {
            new User("1", "");
        }).toThrow('Nome é obrigatório');
    });

        it('deve lançar um erro se id for vazio', () => {
        expect(() => {
            new User("", "João");
        }).toThrow('Id é obrigatório');
    });

})