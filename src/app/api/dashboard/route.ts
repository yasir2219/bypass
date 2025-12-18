import { NextResponse } from 'next/server'
import { collections } from '@/lib/mongodb'

export async function GET() {
  try {
    // Get collections
    const userCollection = await collections.users()
    const licenseCollection = await collections.licenses()
    const uidCollection = await collections.uids()

    // Get counts
    const totalUsers = await userCollection.countDocuments()
    const totalLicenses = await licenseCollection.countDocuments()
    const activeLicenses = await licenseCollection.countDocuments({
      status: 'ACTIVE',
      expireDate: { $gt: new Date() }
    })
    const expiredLicenses = await licenseCollection.countDocuments({
      $or: [
        { status: 'EXPIRED' },
        { status: 'USED_UP' },
        { expireDate: { $lt: new Date() } }
      ]
    })
    const bannedUids = await uidCollection.countDocuments({ status: 'BANNED' })
    const pausedUids = await uidCollection.countDocuments({ status: 'PAUSED' })

    // Get recent activity (last 10 UIDs)
    const recentActivity = await uidCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Get user details for activity
    const users = await userCollection.find({}).toArray()
    const activityWithUsers = recentActivity.map(activity => ({
      ...activity,
      user: users.find(user => user._id?.toString() === activity.userId)
    }))

    return NextResponse.json({
      stats: {
        totalUsers,
        totalLicenses,
        activeLicenses,
        expiredLicenses,
        bannedUids,
        pausedUids
      },
      recentActivity: activityWithUsers
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}