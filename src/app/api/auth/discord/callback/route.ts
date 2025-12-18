import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    // Redirect to Discord OAuth
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback')}&response_type=code&scope=identify%20email`
    
    return NextResponse.redirect(discordAuthUrl)
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback',
      }),
    })
    
    const tokenData = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    
    const userData = await userResponse.json()
    
    // For demo purposes, create or find user in database
    // In production, you'd store the Discord access token securely
    
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?discord_user=${encodeURIComponent(JSON.stringify({
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      discriminator: userData.discriminator
    }))}`)
    
  } catch (error) {
    console.error('Discord OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=discord_auth_failed`)
  }
}