import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { collections } from '@/lib/mongodb'
import { Admin, License, Settings } from '@/lib/mongodb-types'

export async function POST() {
  try {
    console.log('Starting database seeding...')
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('TYer2219@#', 10)
    console.log('Password hashed successfully')
    
    const adminCollection = await collections.admins()
    const admin = await adminCollection.findOneAndUpdate(
      { username: 'yasir22193150' },
      {
        $setOnInsert: {
          username: 'yasir22193150',
          passwordHash: hashedPassword,
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    )

    console.log('Created admin user:', admin.username)

    // Create some sample licenses
    const licenseCollection = await collections.licenses()
    const sampleLicenses: License[] = [
      {
        licenseKey: 'YASIR-hHYE-YArGE-HSas-GasO',
        expireDate: new Date('2024-12-31'),
        maxUsage: 100,
        usedCount: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        licenseKey: 'DEMO-1234-ABCD-5678-EFGH',
        expireDate: new Date('2024-11-30'),
        maxUsage: 50,
        usedCount: 5,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (const licenseData of sampleLicenses) {
      await licenseCollection.findOneAndUpdate(
        { licenseKey: licenseData.licenseKey },
        { $setOnInsert: licenseData },
        { upsert: true }
      )
    }

    console.log('Created sample licenses')

    // Create default settings
    const settingsCollection = await collections.settings()
    await settingsCollection.findOneAndUpdate(
      { discordServerLink: 'https://discord.gg/uidbypass' },
      {
        $setOnInsert: {
          discordServerLink: 'https://discord.gg/uidbypass',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    console.log('Created settings')

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      admin: { username: 'yasir22193150', password: 'TYer2219@#' }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    )
  }
}