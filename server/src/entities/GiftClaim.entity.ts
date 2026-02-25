import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  OneToOne, ManyToOne, JoinColumn, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { GiftItem } from './GiftItem.entity'
import type { User } from './User.entity'

@Entity()
export class GiftClaim {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @OneToOne('GiftItem', 'claim')
  @JoinColumn()
  item!: GiftItem

  @Column()
  itemId!: string

  @ManyToOne('User', 'claims')
  claimedBy!: User

  @Column()
  userId!: string

  @CreateDateColumn()
  createdAt!: Date
}
