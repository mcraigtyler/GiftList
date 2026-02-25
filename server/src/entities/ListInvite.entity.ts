import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { GiftList } from './GiftList.entity'
import type { User } from './User.entity'

export enum InviteStatus {
  PENDING  = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

@Entity()
export class ListInvite {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @ManyToOne('GiftList', 'invites')
  @JoinColumn()
  list!: GiftList

  @Column()
  listId!: string

  @Column()
  inviteeEmail!: string

  @ManyToOne('User', 'listInvites', { nullable: true })
  invitee!: User | null

  @Column({ type: 'uuid', nullable: true })
  inviteeId!: string | null

  @Column({ type: 'enum', enum: InviteStatus, default: InviteStatus.PENDING })
  status!: InviteStatus

  @CreateDateColumn()
  createdAt!: Date
}
