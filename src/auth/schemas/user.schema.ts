import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, "Duplicate email entered"] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phoneNumber: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
