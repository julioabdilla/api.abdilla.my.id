import { Table, Column, DataType, Model } from 'sequelize-typescript';


@Table({ 
  tableName: 'bookmark', 
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Bookmark extends Model {
  public static REPOSITORY_NAME = 'BOOKMARK_MODEL';

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    field: 'uuid',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  uuid: string;

  @Column({
    field: 'name',
    type: DataType.STRING
  })
  name: string;

  @Column({
    field: 'description',
    type: DataType.STRING
  })
  description: string;

  @Column({
    field: 'link',
    type: DataType.STRING
  })
  link: string;

  @Column({
    field: 'thumbnail',
    type: DataType.BLOB
  })
  thumbnail: Buffer;

  @Column({
    field: 'tags',
    type: DataType.STRING
  })
  tags: string;
}
