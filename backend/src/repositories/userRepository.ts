import annaposDataSource from "../db/dataSource.ts";
import { User } from "../db/entities/User.ts";

export class UserRepository {
  repo = annaposDataSource.getRepository(User);

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}

const userRepository = new UserRepository();
export default userRepository;
