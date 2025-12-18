import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Fallback in-memory storage for demo purposes
const fallbackStorage = {
  admin: {
    username: 'yasir22193150',
    passwordHash: '', // Will be set on first run
    role: 'ADMIN'
  },
  licenses: [
    {
      id: '1',
      licenseKey: 'YASIR-hHYE-YArGE-HSas-GasO',
      expireDate: '2024-12-31',
      maxUsage: 100,
      usedCount: 0,
      status: 'ACTIVE'
    },
    {
      id: '2', 
      licenseKey: 'DEMO-1234-ABCD-5678-EFGH',
      expireDate: '2024-11-30',
      maxUsage: 50,
      usedCount: 5,
      status: 'ACTIVE'
    }
  ]
}

export async function POST() {
  try {
    console.log('Starting fallback database seeding...')
    
    // Create default admin user
    if (!fallbackStorage.admin.passwordHash) {
      fallbackStorage.admin.passwordHash = await bcrypt.hash('TYer2219@#', 10)
      console.log('Password hashed successfully')
    }

    console.log('Created fallback admin user:', fallbackStorage.admin.username)

    return NextResponse.json({ 
      success: true, 
      message: 'Fallback database seeded successfully!',
      admin: { username: 'yasir22193150', password: 'TYer2219@#' },
      fallback: true
    })
  } catch (error) {
    console.error('Error seeding fallback database:', error)
    return NextResponse.json(
      { error: 'Failed to seed fallback database: ' + error.message },
      { status: 500 }
    )
  }
}