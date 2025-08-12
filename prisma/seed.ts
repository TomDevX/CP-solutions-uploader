/**
 * Database seed script
 * Creates admin user and sample data for development
 */

import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = 'TomWeb1@'
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'tomdev@example.com' },
    update: {},
    create: {
      email: 'tomdev@example.com',
      username: 'TomDev',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isAnonymousAllowed: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.username)

  // Create sample problems and solutions
  const sampleProblems = [
    {
      problemCode: '148A',
      title: 'Insomnia cure',
      content: 'A simple counting problem...',
      isPublic: true,
      isAnonymous: false,
    },
    {
      problemCode: '1000A',
      title: 'Codehorses T-shirts',
      content: 'A matching problem...',
      isPublic: true,
      isAnonymous: false,
    },
    {
      problemCode: 'CF-148A',
      title: 'Codeforces 148A - Skibidi',
      content: 'A competitive programming problem...',
      isPublic: false,
      isAnonymous: true,
    },
  ]

  for (const problem of sampleProblems) {
    const solution = await prisma.solution.upsert({
      where: { 
        id: `sample-${problem.problemCode}` 
      },
      update: {},
      create: {
        id: `sample-${problem.problemCode}`,
        problemCode: problem.problemCode,
        title: problem.title,
        contentMarkdown: problem.content,
        contentHtml: `<p>${problem.content}</p>`,
        authorId: adminUser.id,
        isPublic: problem.isPublic,
        isAnonymous: problem.isAnonymous,
        isDraft: false,
      },
    })

    console.log(`✅ Sample solution created: ${solution.problemCode}`)
  }

  // Create sample reactions
  const reactions = [
    { type: 'LIKE' as const, solutionId: 'sample-148A' },
    { type: 'HELPFUL' as const, solutionId: 'sample-148A' },
    { type: 'BOOKMARK' as const, solutionId: 'sample-1000A' },
  ]

  for (const reaction of reactions) {
    await prisma.reaction.upsert({
      where: {
        solutionId_userId_type: {
          solutionId: reaction.solutionId,
          userId: adminUser.id,
          type: reaction.type,
        },
      },
      update: {},
      create: {
        solutionId: reaction.solutionId,
        userId: adminUser.id,
        type: reaction.type,
      },
    })
  }

  console.log('✅ Sample reactions created')

  console.log('🎉 Database seeding completed!')
  console.log('📝 Admin credentials:')
  console.log('   Email: tomdev@example.com')
  console.log('   Username: TomDev')
  console.log('   Password: TomWeb1@')
  console.log('⚠️  IMPORTANT: Change these credentials before production!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
