import UserModel from "@/model/User";
import dbConnect from "@/libs/dbConnect";
import {Message} from "@/model/User"

export async function POST(request: Request) {
    await dbConnect();

    const {username, content}= await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }

        //check user accept messaging or not
        if(!user.isAcceptingMessages){
            return Response.json({
                sucess: false,
                message: "User is not accepting the messages"
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
            success: true,
            message: "Message Sent sucessfully"
        }, {status: 200})

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal Server error"
        }, {status: 500})
    }
}