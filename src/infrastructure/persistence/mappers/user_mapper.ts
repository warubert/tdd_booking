import { User } from "../../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User(
            entity.id,
            entity.name
        );
    }

    static toPersistence(domain: User): UserEntity {
        const entity = new UserEntity();
        entity.id = domain.getId();
        entity.name = domain.getName();
        return entity;
    }
}