import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { collections } from '@/lib/mongodb'
import { Admin } from '@/lib/mongodb-types'

export async function POST(request: NextRequest) {
  try {
    console.log('Admin login attempt...')
    
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find admin in MongoDB
    const adminCollection = await collections.admins()
    const admin = await adminCollection.findOne({ username })

    if (!admin) {
      console.log('Admin not found:', username)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    
    if (!isValidPassword) {
      console.log('Invalid password for:', username)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Admin login successful:', username)

    // Create session token (simplified for demo)
    const token = Buffer.from(`${admin._id}:${admin.username}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin._id?.toString(),
        username: admin.username,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}