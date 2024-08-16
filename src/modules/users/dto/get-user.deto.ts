import { IsString, Validate } from 'class-validator'
import { Schema } from 'mongoose'
import { IDValidator } from 'src/common/validators/ID-validator'

export class GetUserDto {
  @IsString()
  @Validate(IDValidator)
  _id: Schema.Types.ObjectId
}
