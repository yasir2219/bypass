import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { ObjectId } from 'mongodb' // Import ObjectId

// Define the interface for a tutorial item, including database fields
interface TutorialItem {
  _id: ObjectId;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET all tutorials
export async function GET() {
  try {
    const tutorialCollection = await collections.tutorials()
    const tutorials = await tutorialCollection.find({}).toArray()

    // Format the response to convert ObjectId to string
    const formattedTutorials = tutorials.map((tutorial: TutorialItem) => ({
      id: tutorial._id.toString(),
      title: tutorial.title,
      description: tutorial.description,
      youtubeLink: tutorial.youtubeLink,
      thumbnail: tutorial.thumbnail,
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt
    }))

    return NextResponse.json({ success: true, tutorials: formattedTutorials })
  } catch (error) {
    console.error('Get tutorials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create a new tutorial
export async function POST(request: NextRequest) {
  try {
    const tutorialData = await request.json()

    if (!tutorialData.title || !tutorialData.youtubeLink) {
      return NextResponse.json(
        { error: 'Title and YouTube link are required' },
        { status: 400 }
      )
    }

    const tutorialCollection = await collections.tutorials()
    const result = await tutorialCollection.insertOne({
      ...tutorialData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Fetch the newly created tutorial to return it
    const newTutorial = await tutorialCollection.findOne({ _id: result.insertedId })

    if (!newTutorial) {
        return NextResponse.json(
            { error: 'Failed to retrieve the created tutorial' },
            { status: 500 }
        )
    }

    // Format the response
    const formattedTutorial = {
      id: newTutorial._id.toString(),
      title: newTutorial.title,
      description: newTutorial.description,
      youtubeLink: newTutorial.youtubeLink,
      thumbnail: newTutorial.thumbnail,
      createdAt: newTutorial.createdAt,
      updatedAt: newTutorial.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      tutorial: formattedTutorial
    })
  } catch (error) {
    console.error('Create tutorial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update a tutorial
export async function PUT(request: NextRequest) {
  try {
    const { tutorialId, ...updateData } = await request.json()

    if (!tutorialId) {
      return NextResponse.json(
        { error: 'Tutorial ID is required' },
        { status: 400 }
      )
    }

    const tutorialCollection = await collections.tutorials()
    
    // Convert string ID to ObjectId for the query
    const result = await tutorialCollection.updateOne(
      { _id: new ObjectId(tutorialId) },
      { 
        $set: { ...updateData, updatedAt: new Date() }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Tutorial not found or no changes made' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tutorial updated successfully!'
    })
  } catch (error) {
    console.error('Update tutorial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE a tutorial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tutorialId = searchParams.get('tutorialId')

    if (!tutorialId) {
      return NextResponse.json(
        { error: 'Tutorial ID is required' },
        { status: 400 }
      )
    }

    const tutorialCollection = await collections.tutorials()
    
    // Convert string ID to ObjectId for the query
    const result = await tutorialCollection.deleteOne({ _id: new ObjectId(tutorialId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tutorial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tutorial deleted successfully!'
    })
  } catch (error) {
    console.error('Delete tutorial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}