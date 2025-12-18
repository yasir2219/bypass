import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { ObjectId } from 'mongodb' // Import ObjectId

// Define a more complete type for the response
interface UidWithDetails {
  id: string;
  gameUID: string;
  licenseKey: string;
  status: string;
  expireDate: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    discordId: string;
    username: string;
    avatar?: string;
    role: string;
  };
  license?: {
    id: string;
    licenseType: string;
    status: string;
  };
}

// GET all UIDs with populated user and license details
export async function GET() {
  try {
    const uidCollection = await collections.uids()
    
    // Use aggregation to join UIDs with Users and Licenses collections efficiently
    const uids = await uidCollection.aggregate<UidWithDetails>([
      {
        // Join with the 'users' collection
        $lookup: {
          from: 'users', // The name of the users collection
          localField: 'userId', // Field from the uids collection
          foreignField: '_id', // Field from the users collection
          as: 'user' // Output array field name
        }
      },
      {
        // Join with the 'licenses' collection
        $lookup: {
          from: 'licenses', // The name of the licenses collection
          localField: 'licenseKey', // Field from the uids collection
          foreignField: 'licenseKey', // Field from the licenses collection
          as: 'license' // Output array field name
        }
      },
      {
        // $lookup creates an array. $unwind deconstructs it.
        // preserveNullAndEmptyArrays ensures we keep UIDs even if no user/license is found.
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$license',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        // Reshape the documents to match the frontend's expected structure
        $project: {
          _id: 0, // Exclude the original _id
          id: { $toString: '$_id' }, // Convert _id to string and rename to 'id'
          gameUID: 1,
          licenseKey: 1,
          status: 1,
          expireDate: 1,
          createdAt: 1,
          updatedAt: 1,
          'user.id': { $toString: '$user._id' },
          'user.username': '$user.username',
          'user.discordId': '$user.discordId',
          'user.avatar': '$user.avatar',
          'user.role': '$user.role',
          'license.id': { $toString: '$license._id' },
          'license.licenseType': '$license.licenseType',
          'license.status': '$license.status'
        }
      }
    ]).toArray()

    return NextResponse.json({ success: true, uids })
  } catch (error) {
    console.error('Get UIDs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update UID status
export async function PUT(request: NextRequest) {
  try {
    const { uidId, status } = await request.json()

    if (!uidId || !status) {
      return NextResponse.json(
        { error: 'UID ID and status are required' },
        { status: 400 }
      )
    }

    const uidCollection = await collections.uids()
    // Convert string ID to ObjectId for the query
    const result = await uidCollection.updateOne(
      { _id: new ObjectId(uidId) },
      { 
        $set: { status, updatedAt: new Date() }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'UID not found or status not updated' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: `UID status updated to ${status} successfully!`
    })
  } catch (error) {
    console.error('Update UID error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE UID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uidId = searchParams.get('uidId')

    if (!uidId) {
      return NextResponse.json(
        { error: 'UID ID is required' },
        { status: 400 }
      )
    }

    const uidCollection = await collections.uids()
    const licenseCollection = await collections.licenses()

    // First, find the UID to get its licenseKey before deleting
    const uidToDelete = await uidCollection.findOne({ _id: new ObjectId(uidId) })

    if (!uidToDelete) {
      return NextResponse.json(
        { error: 'UID not found' },
        { status: 404 }
      )
    }

    // Delete the UID
    const deleteResult = await uidCollection.deleteOne({ _id: new ObjectId(uidId) })

    if (deleteResult.deletedCount === 0) {
        // This case should theoretically not be hit if the findOne above succeeded
        return NextResponse.json(
            { error: 'UID could not be deleted' },
            { status: 500 }
        )
    }

    // Decrement the license's usedCount to free up the slot
    await licenseCollection.updateOne(
      { licenseKey: uidToDelete.licenseKey },
      { 
        $inc: { usedCount: -1 }, // Decrement usedCount by 1
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({ 
      success: true,
      message: 'UID deleted successfully and license usage updated!'
    })
  } catch (error) {
    console.error('Delete UID error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}