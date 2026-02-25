import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  OneToMany, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { GiftList } from './GiftList.entity'
import type { Friendship } from './Friendship.entity'
import type { ListInvite } from './ListInvite.entity'
import type { GiftClaim } from './GiftClaim.entity'

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @Column({ unique: true })
  email!: string

  @Column()
  passwordHash!: string

  @Column()
  displayName!: string

  @Column({ nullable: true })
  avatarUrl!: string

  @CreateDateColumn()
  createdAt!: Date

  @OneToMany('GiftList', 'owner')
  lists!: GiftList[]

  @OneToMany('Friendship', 'requester')
  sentRequests!: Friendship[]

  @OneToMany('Friendship', 'addressee')
  receivedRequests!: Friendship[]

  @OneToMany('ListInvite', 'invitee')
  listInvites!: ListInvite[]

  @OneToMany('GiftClaim', 'claimedBy')
  claims!: GiftClaim[]
}
