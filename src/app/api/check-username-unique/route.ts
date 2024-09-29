import dbConnect from "@/libs/dbConnect"
import UserModel from '@/model/User'
import {z} from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'


const usernameQuerySchema = z.object({
    username: usernameValidation
})


//to check unique username functionality

export async function GET(request: Request) {

    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }
        //validate with zod
        const result = usernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            const UsernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: UsernameError?.length > 0 ? UsernameError.join(", ") : "Invalid query parameters",
            }, {status: 400})
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username, isVerified: true})

            if(existingVerifiedUser){
                return Response.json({
                    success: false,
                    message: "Username is already taken",
                }, {status: 400})
            } 

            return Response.json({
                success: true,
                message: "Username is unique"
            }, {status: 200})
    } catch (error) {
        console.error(error);
        return Response.json({
            message: "Error checking username"
        }, {status: 500})
    }
}