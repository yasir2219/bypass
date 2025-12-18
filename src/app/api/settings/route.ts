import { NextRequest, NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb' // Import ObjectId for robust queries

// GET all settings
export async function GET() {
  try {
    const settingsCollection = await collections.settings()
    const settings = await settingsCollection.findOne({})

    // If no settings document exists, return a default object to prevent errors
    if (!settings) {
      return NextResponse.json({ 
        success: true, 
        settings: { discordServerLink: '' } 
      })
    }

    // Format the response to convert the MongoDB ObjectId to a string
    const formattedSettings = {
      id: settings._id.toString(),
      discordServerLink: settings.discordServerLink || '',
      // Add any other settings fields your application uses
    }

    return NextResponse.json({ success: true, settings: formattedSettings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update settings (handles both general settings and password changes)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { discordServerLink, currentPassword, newPassword } = body

    // --- Handle Password Update ---
    // If both passwords are provided, we assume it's a password change request
    if (currentPassword && newPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required' },
          { status: 400 }
        )
      }

      const adminCollection = await collections.admins()
      // It's better to find by a specific field if possible, e.g., { username: 'admin' }
      // For now, we'll stick to the logic of finding the first document.
      const admin = await adminCollection.findOne({})

      if (!admin || !admin.passwordHash) {
        return NextResponse.json(
          { error: 'Admin account not found or not configured properly' },
          { status: 404 }
        )
      }

      // Verify the current password against the stored hash
      const isValidPassword = await bcrypt.compare(currentPassword, admin.passwordHash)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash the new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      // Update the password in the database
      await adminCollection.updateOne(
        { _id: admin._id }, // Be specific with the ID to avoid updating the wrong document
        { 
          $set: { passwordHash: newPasswordHash, updatedAt: new Date() }
        }
      )

      return NextResponse.json({ 
        success: true,
        message: 'Admin password updated successfully!'
      })
    } 
    // --- Handle General Settings Update ---
    // If discordServerLink is provided, we assume it's a general settings update
    else if (discordServerLink !== undefined) {
      const settingsCollection = await collections.settings()
      
      // Use `upsert: true` to update the existing document or create a new one if it doesn't exist
      await settingsCollection.updateOne(
        {}, // Query to find the document (empty for a singleton collection)
        { 
          $set: { discordServerLink, updatedAt: new Date() }
        },
        { upsert: true } // This is key for robustness
      )

      return NextResponse.json({ 
        success: true,
        message: 'Discord server link updated successfully!'
      })
    } 
    // --- Handle Invalid Request ---
    else {
      return NextResponse.json(
        { error: 'Invalid request. Please provide either a discordServerLink or both currentPassword and newPassword.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}