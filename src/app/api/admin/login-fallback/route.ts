import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Fallback in-memory storage
const fallbackStorage = {
  admin: {
    username: 'yasir22193150',
    passwordHash: '', // Will be set on first run
    role: 'ADMIN'
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Fallback admin login attempt...')
    
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Initialize password hash if not set
    if (!fallbackStorage.admin.passwordHash) {
      fallbackStorage.admin.passwordHash = await bcrypt.hash('TYer2219@#', 10)
    }

    // Check credentials
    if (username !== fallbackStorage.admin.username) {
      console.log('Admin not found:', username)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, fallbackStorage.admin.passwordHash)
    
    if (!isValidPassword) {
      console.log('Invalid password for:', username)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Fallback admin login successful:', username)

    // Create session token (simplified for demo)
    const token = Buffer.from(`${fallbackStorage.admin.username}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: 'fallback-admin',
        username: fallbackStorage.admin.username,
        role: fallbackStorage.admin.role
      },
      fallback: true
    })

  } catch (error) {
    console.error('Fallback admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}