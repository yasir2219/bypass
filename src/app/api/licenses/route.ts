import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all licenses
export async function GET() {
  try {
    const licenseCollection = await collections.licenses()
    const licenses = await licenseCollection.find({}).toArray()

    // Convert ObjectId to string for JSON serialization
    const formattedLicenses = licenses.map(license => ({
      ...license,
      id: license._id.toString()
    }))

    return NextResponse.json({ success: true, licenses: formattedLicenses })
  } catch (error) {
    console.error('Get licenses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new license
export async function POST(request: NextRequest) {
  try {
    const { expireDate, maxUsage, licenseType, maxUsers } = await request.json()

    if (!expireDate || !maxUsage) {
      return NextResponse.json(
        { error: 'Expire date and max usage are required' },
        { status: 400 }
      )
    }

    // Generate license key
    const generateLicenseKey = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const segments: string[] = []
      for (let i = 0; i < 5; i++) {
        let segment: string = ''
        for (let j = 0; j < 4; j++) {
          segment += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        segments.push(segment)
      }
      return segments.join('-')
    }

    const licenseKey = generateLicenseKey()

    const licenseCollection = await collections.licenses()
    const result = await licenseCollection.insertOne({
      licenseKey,
      expireDate: new Date(expireDate),
      maxUsage: parseInt(maxUsage),
      usedCount: 0,
      status: 'ACTIVE',
      licenseType: licenseType || 'STANDARD',
      maxUsers: parseInt(maxUsers) || 5,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Fetch the newly created license to return it
    const newLicense = await licenseCollection.findOne({ _id: result.insertedId })

    return NextResponse.json({ 
      success: true, 
      license: {
        ...newLicense,
        id: newLicense._id.toString()
      }
    })
  } catch (error) {
    console.error('Create license error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update license
export async function PUT(request: NextRequest) {
  try {
    const { licenseId, status } = await request.json()

    if (!licenseId || !status) {
      return NextResponse.json(
        { error: 'License ID and status are required' },
        { status: 400 }
      )
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(licenseId)

    const licenseCollection = await collections.licenses()
    const result = await licenseCollection.updateOne(
      { _id: objectId },
      { 
        $set: { status, updatedAt: new Date() }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      license: { id: licenseId, status }
    })
  } catch (error) {
    console.error('Update license error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE license
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const licenseId = searchParams.get('licenseId')

    if (!licenseId) {
      return NextResponse.json(
        { error: 'License ID is required' },
        { status: 400 }
      )
    }

    // Convert string ID to ObjectId
    const objectId = new ObjectId(licenseId)

    const licenseCollection = await collections.licenses()
    const result = await licenseCollection.deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'License deleted successfully!'
    })
  } catch (error) {
    console.error('Delete license error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}