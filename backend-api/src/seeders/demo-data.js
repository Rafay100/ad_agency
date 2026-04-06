const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface) => {
    const passwordHash = await bcrypt.hash('password123', 12)
    const now = new Date()

    await queryInterface.bulkInsert('users', [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Admin User',
        email: 'admin@adagency.com',
        password_hash: passwordHash,
        company: 'Ad Agency Inc',
        role: 'admin',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'Manager User',
        email: 'manager@adagency.com',
        password_hash: passwordHash,
        company: 'Ad Agency Inc',
        role: 'manager',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ], {})

    await queryInterface.bulkInsert('clients', [
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        name: 'John Doe',
        email: 'john@techcorp.com',
        company: 'TechCorp',
        phone: '+1234567890',
        industry: 'Technology',
        is_active: true,
        metadata: JSON.stringify({}),
        created_at: now,
        updated_at: now,
      },
    ], {})

    await queryInterface.bulkInsert('campaigns', [
      {
        id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        client_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        name: 'Google Search Campaign',
        description: 'High-performing search campaign',
        status: 'active',
        budget: 10000,
        spent: 3500,
        start_date: now,
        platform: 'google',
        objective: 'conversions',
        targeting: JSON.stringify({ locations: ['US'], ageRange: '25-54' }),
        metrics: JSON.stringify({ impressions: 50000, clicks: 2500, conversions: 150, ctr: 0.05, conversion_rate: 0.06, cpc: 1.40, cpa: 23.33 }),
        created_at: now,
        updated_at: now,
      },
      {
        id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
        user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        client_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        name: 'Facebook Brand Awareness',
        description: 'Brand awareness campaign on Facebook',
        status: 'draft',
        budget: 5000,
        spent: 0,
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        platform: 'facebook',
        objective: 'awareness',
        targeting: JSON.stringify({ locations: ['US', 'UK'], interests: ['technology'] }),
        metrics: JSON.stringify({ impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversion_rate: 0, cpc: 0, cpa: 0 }),
        created_at: now,
        updated_at: now,
      },
    ], {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('campaigns', null, {})
    await queryInterface.bulkDelete('clients', null, {})
    await queryInterface.bulkDelete('users', null, {})
  },
}
