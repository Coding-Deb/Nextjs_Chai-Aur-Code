import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  created: Date;
}

const MesasageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  created: { type: Date, default: Date.now, required: true },
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAccept: boolean;
    message: Message[];
  }

  const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: [true , "Email is Required"], unique:true , match: [/.+\@.+\..+/,'Please Enter Valid Email']},
    password: { type: String, required: [true,"Password Required"] },
    verifyCode: { type: String , required:true },
    verifyCodeExpiry: { type: Date },
    isVerified: { type: Boolean },
    isAccept: { type: Boolean, default: false },
    message: [MesasageSchema],

  });


const userModel =  (mongoose.models.User as mongoose.Model<User>)|| (mongoose.model<User>("User",UserSchema));

export default userModel;