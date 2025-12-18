import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all active UIDs for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    // In a real app, you'd get the userId from authentication
    // For now, we'll return all active UIDs
    const uidCollection = await collections.uids()
    
    let query = {}
    if (userId) {
      query = { userId: new ObjectId(userId) }
    }
    
    const uids = await uidCollection.find(query).toArray()
    
    // Check for expired UIDs and update their status
    const now = new Date()
    const updatedUids: { id: string; _id: ObjectId; }[] = []
    
    for (const uid of uids) {
      // Check if UID has expired
      if (uid.expireDate && new Date(uid.expireDate) < now && uid.status === 'ACTIVE') {
        // Update UID status to expired in database
        await uidCollection.updateOne(
          { _id: uid._id },
          { $set: { status: 'EXPIRED', updatedAt: new Date() } }
        )
        uid.status = 'EXPIRED'
      }
      
      // Convert ObjectId to string for JSON response
      updatedUids.push({
        ...uid,
        id: uid._id.toString()
      })
    }
    
    return NextResponse.json({
      success: true,
      uids: updatedUids
    })
  } catch (error) {
    console.error('Get UIDs error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('UID activation attempt...')
    
    const { gameUID, licenseKey, userId } = await request.json()

    // Validate input
    if (!gameUID || !licenseKey) {
      return NextResponse.json(
        { error: 'Game UID and License Key are required' },
        { status: 400 }
      )
    }

    // Basic format validation
    if (gameUID.length < 6 || gameUID.length > 12) {
      return NextResponse.json(
        { error: 'Invalid Game UID format' },
        { status: 400 }
      )
    }

    // Get collections
    const licenseCollection = await collections.licenses()
    const uidCollection = await collections.uids()

    // Check if license exists and is valid in the database
    const license = await licenseCollection.findOne({ licenseKey })
    
    if (!license) {
      console.log('License not found:', licenseKey)
      return NextResponse.json(
        { error: 'Invalid license key!' },
        { status: 404 }
      )
    }

    if (license.status !== 'ACTIVE') {
      console.log('License not active:', licenseKey)
      return NextResponse.json(
        { error: 'License key is not active!' },
        { status: 400 }
      )
    }

    // Check if license has expired
    if (license.expireDate && new Date(license.expireDate) < new Date()) {
      console.log('License expired:', licenseKey)
      return NextResponse.json(
        { error: 'License has expired!' },
        { status: 400 }
      )
    }

    // Check if license has reached max usage
    if (license.usedCount >= license.maxUsage) {
      console.log('License max usage reached:', licenseKey)
      return NextResponse.json(
        { error: 'This license has reached its maximum usage limit!' },
        { status: 400 }
      )
    }

    // Check if UID already exists
    const existingUid = await uidCollection.findOne({ gameUID })
    if (existingUid) {
      console.log('UID already exists:', gameUID)
      return NextResponse.json(
        { error: 'This Game UID is already activated!' },
        { status: 400 }
      )
    }

    // Calculate expiration date
    let expireDate = null
    if (license.licenseType !== 'LIFETIME') {
      // Set expiration to 30 days from now for non-lifetime licenses
      expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }

    // Create new UID entry
    const newUid = {
      gameUID,
      licenseKey,
      licenseType: license.licenseType,
      status: 'ACTIVE',
      activatedAt: new Date(),
      expireDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add userId if provided (from authentication)
    if (userId) {
      newUid.userId = new ObjectId(userId)
    }

    // Insert new UID into database
    const result = await uidCollection.insertOne(newUid)
    
    // Update license usage count in database
    await licenseCollection.updateOne(
      { _id: license._id },
      { 
        $inc: { usedCount: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    console.log('UID activated successfully:', gameUID)

    // Return the newly created UID with string ID
    return NextResponse.json({
      success: true,
      uid: {
        ...newUid,
        id: result.insertedId.toString()
      },
      message: license.licenseType === 'LIFETIME' 
        ? 'Lifetime UID activated successfully!' 
        : 'UID activated successfully!'
    })

  } catch (error) {
    console.error('UID activation error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE endpoint to deactivate a UID
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
    
    // Find the UID to get its license key
    const uid = await uidCollection.findOne({ _id: new ObjectId(uidId) })
    
    if (!uid) {
      return NextResponse.json(
        { error: 'UID not found' },
        { status: 404 }
      )
    }
    
    // Delete the UID
    await uidCollection.deleteOne({ _id: new ObjectId(uidId) })
    
    // Decrement license usage count
    await licenseCollection.updateOne(
      { licenseKey: uid.licenseKey },
      { 
        $inc: { usedCount: -1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({
      success: true,
      message: 'UID deactivated successfully'
    })
  } catch (error) {
    console.error('UID deactivation error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}