const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Create test user with predictable UUID
    const testUser = await prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000', // Fixed UUID for demo
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'hashed_password_here',
      },
    });

    console.log('Test user created:', testUser);

    // Create some sample journal entries
    const journalEntries = await prisma.journalEntry.createMany({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          userId: testUser.id,
          content: 'Today was a productive day. I completed several tasks and learned something new.',
          mood: 'productive',
          energyLevel: 8,
          tags: ['work', 'learning'],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          userId: testUser.id,
          content: 'Feeling a bit tired today, but managed to get some work done.',
          mood: 'tired',
          energyLevel: 5,
          tags: ['work', 'rest'],
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          userId: testUser.id,
          content: 'Great day! Everything went smoothly and I felt very energetic.',
          mood: 'happy',
          energyLevel: 9,
          tags: ['mood', 'energy'],
        },
      ],
    });

    console.log('Sample journal entries created:', journalEntries);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
