import {
  Entity, PrimaryColumn, Column, CreateDateColumn,
  ManyToOne, OneToOne, JoinColumn, BeforeInsert,
} from 'typeorm'
import { uuidv7 } from 'uuidv7'
import type { GiftList } from './GiftList.entity'
import type { GiftClaim } from './GiftClaim.entity'

@Entity()
export class GiftItem {
  @PrimaryColumn('uuid')
  id!: string

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv7()
  }

  @ManyToOne('GiftList', 'items')
  @JoinColumn()
  list!: GiftList

  @Column()
  listId!: string

  @Column()
  title!: string

  @Column()
  url!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar', nullable: true })
  price!: string | null

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null

  @Column({ default: 1 })
  priority!: number

  @Column({ type: 'text', nullable: true })
  note!: string | null

  @CreateDateColumn()
  createdAt!: Date

  @OneToOne('GiftClaim', 'item')
  claim!: GiftClaim | null
}
