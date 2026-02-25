import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { User } from './User.entity'
import type { GiftItem } from './GiftItem.entity'
import type { ListInvite } from './ListInvite.entity'

export enum ListVisibility {
  PRIVATE = 'PRIVATE',
  FRIENDS = 'FRIENDS',
}

@Entity()
export class GiftList {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @ManyToOne('User', 'lists')
  @JoinColumn()
  owner!: User

  @Column()
  ownerId!: string

  @Column()
  name!: string

  @Column({ nullable: true })
  description!: string

  @Column({ type: 'enum', enum: ListVisibility, default: ListVisibility.PRIVATE })
  visibility!: ListVisibility

  @CreateDateColumn()
  createdAt!: Date

  @OneToMany('GiftItem', 'list')
  items!: GiftItem[]

  @OneToMany('ListInvite', 'list')
  invites!: ListInvite[]
}
