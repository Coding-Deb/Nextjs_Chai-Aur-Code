import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
    // if (request.method !== 'GET') {
    //     return Response.json(
    //         {
    //           success: false,
    //           message: "Not Allowed",
    //         },
    //         {
    //           status: 405,
    //         }
    //       );
    // }
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // vaslidate with jod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;

    const ExistingUser = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (ExistingUser) {
      return Response.json(
        {
          success: false,
          message: "Username Taken",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Username Available",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.log(error);
    console.log("Error checking....");
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      {
        status: 500,
      }
    );
  }
}
