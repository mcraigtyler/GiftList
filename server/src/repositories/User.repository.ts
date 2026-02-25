import { AppDataSource } from '../lib/dataSource'
import { User } from '../entities/User.entity'

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOne({ where: { email } })
  },

  findById(id: string) {
    return this.findOne({ where: { id } })
  },

  search(query: string) {
    return this.createQueryBuilder('user')
      .where('user.email ILIKE :q OR user.displayName ILIKE :q', { q: `%${query}%` })
      .limit(20)
      .getMany()
  },
})
