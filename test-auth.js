const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'tomdev@example.com' }
    })
    
    if (!adminUser) {
      console.log('Admin user not found!')
      return
    }
    
    console.log('Admin user found:', {
      id: adminUser.id,
      email: adminUser.email,
      username: adminUser.username,
      role: adminUser.role,
      hasPassword: !!adminUser.passwordHash
    })
    
    // Test password verification
    const testPassword = 'TomWeb1@'
    const isValid = await bcrypt.compare(testPassword, adminUser.passwordHash)
    console.log('Password valid:', isValid)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
