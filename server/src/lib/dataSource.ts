import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()
import { DataSource } from 'typeorm'
import { User } from '../entities/User.entity'
import { Friendship } from '../entities/Friendship.entity'
import { GiftList } from '../entities/GiftList.entity'
import { ListInvite } from '../entities/ListInvite.entity'
import { GiftItem } from '../entities/GiftItem.entity'
import { GiftClaim } from '../entities/GiftClaim.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Friendship, GiftList, ListInvite, GiftItem, GiftClaim],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
})
