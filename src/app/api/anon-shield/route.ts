import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/libs/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { anonShield } = await request.json();

  console.log('Updating anonShield for user:', userId);
  console.log('New anonShield value:', anonShield);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { anonShield: anonShield } },
      {new: true, upsert: true }
    );

    console.log('Updated user:', updatedUser);
    console.log('anonShield value after update:', updatedUser?.anonShield);

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update Anon Shield status',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: `Anon Shield ${anonShield ? 'enabled' : 'disabled'}`,
        updatedUser: updatedUser.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating Anon Shield status:', error);
    return Response.json(
      { success: false, message: 'Error updating Anon Shield status' },
      { status: 500 }
    );
  }
}


