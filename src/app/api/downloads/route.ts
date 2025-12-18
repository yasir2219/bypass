import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import { ObjectId } from 'mongodb' // Import ObjectId

// Define the interface for a download item, including database fields
interface DownloadItem {
  _id: ObjectId;
  fileName: string;
  description: string;
  version: string;
  fileSize: string;
  downloadLink: string;
  createdAt: Date;
  updatedAt: Date;
}

// GET all downloads
export async function GET() {
  try {
    const downloadCollection = await collections.downloads()
    const downloads = await downloadCollection.find({}).toArray()

    // Format the response to convert ObjectId to string
    const formattedDownloads = downloads.map((download: DownloadItem) => ({
      id: download._id.toString(),
      fileName: download.fileName,
      description: download.description,
      version: download.version,
      fileSize: download.fileSize,
      downloadLink: download.downloadLink,
      createdAt: download.createdAt,
      updatedAt: download.updatedAt
    }))

    return NextResponse.json({ success: true, downloads: formattedDownloads })
  } catch (error) {
    console.error('Get downloads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create a new download
export async function POST(request: NextRequest) {
  try {
    const downloadData = await request.json()

    if (!downloadData.fileName || !downloadData.downloadLink) {
      return NextResponse.json(
        { error: 'File name and download link are required' },
        { status: 400 }
      )
    }

    const downloadCollection = await collections.downloads()
    const result = await downloadCollection.insertOne({
      ...downloadData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Fetch the newly created download to return it
    const newDownload = await downloadCollection.findOne({ _id: result.insertedId })

    if (!newDownload) {
        return NextResponse.json(
            { error: 'Failed to retrieve the created download' },
            { status: 500 }
        )
    }

    // Format the response
    const formattedDownload = {
      id: newDownload._id.toString(),
      fileName: newDownload.fileName,
      description: newDownload.description,
      version: newDownload.version,
      fileSize: newDownload.fileSize,
      downloadLink: newDownload.downloadLink,
      createdAt: newDownload.createdAt,
      updatedAt: newDownload.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      download: formattedDownload
    })
  } catch (error) {
    console.error('Create download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update a download
export async function PUT(request: NextRequest) {
  try {
    const { downloadId, ...updateData } = await request.json()

    if (!downloadId) {
      return NextResponse.json(
        { error: 'Download ID is required' },
        { status: 400 }
      )
    }

    const downloadCollection = await collections.downloads()
    
    // Convert string ID to ObjectId for the query
    const result = await downloadCollection.updateOne(
      { _id: new ObjectId(downloadId) },
      { 
        $set: { ...updateData, updatedAt: new Date() }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Download not found or no changes made' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Download updated successfully!'
    })
  } catch (error) {
    console.error('Update download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE a download
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const downloadId = searchParams.get('downloadId')

    if (!downloadId) {
      return NextResponse.json(
        { error: 'Download ID is required' },
        { status: 400 }
      )
    }

    const downloadCollection = await collections.downloads()
    
    // Convert string ID to ObjectId for the query
    const result = await downloadCollection.deleteOne({ _id: new ObjectId(downloadId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Download not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Download deleted successfully!'
    })
  } catch (error) {
    console.error('Delete download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}