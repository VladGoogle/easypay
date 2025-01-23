import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Model } from './base/model.entity.base';
import { User } from './user.entity';
import { Country } from '@libs/entities/country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('addresses')
export class Address extends Model {
  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'country_id',
    type: 'uuid',
  })
  countryId!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    type: 'text',
  })
  district!: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    type: 'text',
  })
  city!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Column({
    name: 'first_street_line',
    nullable: true,
    type: 'text',
  })
  firstStreetLine?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Column({
    name: 'second_street_line',
    nullable: true,
    type: 'text',
  })
  secondStreetLine?: string;

  @ApiProperty({
    type: String,
  })
  @Column({
    name: 'post_code',
    nullable: true,
    type: 'text',
  })
  postCode!: string;

  @OneToOne(() => User, (d) => d.address)
  user?: User;

  @ManyToOne(() => Country, (d) => d.address)
  @JoinColumn({ name: 'country_id' })
  country?: Country;
}
