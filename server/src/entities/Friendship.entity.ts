import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { User } from './User.entity'

export enum FriendshipStatus {
  PENDING  = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Entity()
@Unique(['requesterId', 'addresseeId'])
export class Friendship {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @ManyToOne('User', 'sentRequests')
  @JoinColumn()
  requester!: User

  @Column()
  requesterId!: string

  @ManyToOne('User', 'receivedRequests')
  @JoinColumn()
  addressee!: User

  @Column()
  addresseeId!: string

  @Column({ type: 'enum', enum: FriendshipStatus, default: FriendshipStatus.PENDING })
  status!: FriendshipStatus

  @CreateDateColumn()
  createdAt!: Date
}
