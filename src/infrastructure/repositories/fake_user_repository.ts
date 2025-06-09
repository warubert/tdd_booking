import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class FakeUserRepository implements UserRepository {
    private users: User[] = [
        new User("1", "João"),
        new User("2", "Maria")
    ]

    async findById(id: string): Promise<User | null> {
        return this.users.find((user) => user.getId() === id) || null;
    }

    async save(user: User): Promise<void> {
        this.users.push(user);
    }
}