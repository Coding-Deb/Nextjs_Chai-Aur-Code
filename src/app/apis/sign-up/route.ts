import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { senderVerification } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedBYUserName = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedBYUserName) {
      return Response.json(
        {
          success: false,
          message: "User Found",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User Already Exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashhedPassword = await bcrypt.hash(password, 10);
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashhedPassword,
        verifyCode,
        verifyCodeExpiry: expireDate,
        isVerified: false,
        isAccept: true,
        message: [],
      });
      await newUser.save();
    }
    // Send Verification Email
    const emailResponse = await senderVerification(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verify yourself",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error in --", error);
    return (
      Response.json({
        success: false,
        message: "Error in --",
      }),
      {
        status: 500,
      }
    );
  }
}
