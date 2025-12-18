import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { User, Uid } from '@/lib/mongodb-types'

// GET all users with their UIDs
export async function GET() {
  try {
    const userCollection = await collections.users()
    const users = await userCollection.find({}).toArray()

    // Get UIDs for each user
    const uidCollection = await collections.uids()
    const uids = await uidCollection.find({}).toArray()

    // Attach UIDs to users
    const usersWithUids = users.map(user => ({
      ...user,
      uids: uids.filter(uid => uid.userId === user._id?.toString())
    }))

    return NextResponse.json({ users: usersWithUids })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new UID for user
export async function POST(request: NextRequest) {
  try {
    const { userId, gameUID, licenseKey } = await request.json()

    if (!userId || !gameUID || !licenseKey) {
      return NextResponse.json(
        { error: 'User ID, Game UID, and License Key are required' },
        { status: 400 }
      )
    }

    // Check if license exists and is valid
    const licenseCollection = await collections.licenses()
    const license = await licenseCollection.findOne({ licenseKey })

    if (!license) {
      return NextResponse.json(
        { error: 'Invalid license key' },
        { status: 400 }
      )
    }

    if (license.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'License is not active' },
        { status: 400 }
      )
    }

    if (license.usedCount >= license.maxUsage) {
      return NextResponse.json(
        { error: 'License usage limit reached' },
        { status: 400 }
      )
    }

    // Create UID
    const uidCollection = await collections.uids()
    const uid = await uidCollection.insertOne({
      userId,
      gameUID,
      licenseKey,
      expireDate: license.expireDate,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Update license usage count
    await licenseCollection.updateOne(
      { licenseKey },
      { $set: { usedCount: license.usedCount + 1 } }
    )

    return NextResponse.json({ 
      success: true, 
      uid: {
        ...uid,
        id: uid.insertedId?.toString()
      }
    })
  } catch (error) {
    console.error('Create UID error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}