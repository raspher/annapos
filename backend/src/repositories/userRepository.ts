import annaposDataSource from "../db/dataSource.js";
import { User } from "../db/entities/User.js";

export class UserRepository {
  repo = annaposDataSource.getRepository(User);

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}

const userRepository = new UserRepository();
export default userRepository;
