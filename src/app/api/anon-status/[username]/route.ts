import dbConnect from "@/libs/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request, { params }: { params: { username: string } }) {
  await dbConnect();
  
  try {
    const { username } = params;  

    if (!username) {
      return new Response(
        JSON.stringify({ success: false, message: 'Username is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user.anonShield) {
      return new Response(
        JSON.stringify({ success: false, message: 'User has anon shield disabled' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        anonShield: user.anonShield,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving Anon Shield status:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error retrieving Anon Shield status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
