// MongoDB Document Types
export interface Admin {
  _id?: string
  username: string
  passwordHash: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: string
  discordId: string
  username: string
  avatar?: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface License {
  _id?: string
  licenseKey: string
  expireDate: Date
  maxUsage: number
  usedCount: number
  status: 'ACTIVE' | 'EXPIRED' | 'USED_UP'
  createdAt: Date
  updatedAt: Date
}

export interface Uid {
  _id?: string
  userId: string
  gameUID: string
  licenseKey: string
  expireDate: Date
  status: 'ACTIVE' | 'PAUSED' | 'BANNED' | 'EXPIRED'
  createdAt: Date
  updatedAt: Date
}

export interface Download {
  _id?: string
  fileName: string
  description: string
  version: string
  fileSize: string
  downloadLink: string
  createdAt: Date
  updatedAt: Date
}

export interface Tutorial {
  _id?: string
  title: string
  description: string
  youtubeLink: string
  thumbnail: string
  createdAt: Date
  updatedAt: Date
}

export interface Settings {
  _id?: string
  discordServerLink: string
  createdAt: Date
  updatedAt: Date
}