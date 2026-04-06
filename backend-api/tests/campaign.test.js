const request = require('supertest')
const app = require('../src/server')
const { User, Campaign, RefreshToken } = require('../src/models')
const sequelize = require('../src/config/database')

beforeAll(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

describe('Authentication', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    company: 'Test Co',
  }

  let accessToken
  let refreshToken

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.email).toBe(userData.email)
      expect(res.body.data.accessToken).toBeDefined()
      expect(res.body.data.refreshToken).toBeDefined()

      accessToken = res.body.data.accessToken
      refreshToken = res.body.data.refreshToken
    })

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
    })

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'invalid', password: 'short' })

      expect(res.status).toBe(422)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.accessToken).toBeDefined()

      accessToken = res.body.data.accessToken
      refreshToken = res.body.data.refreshToken
    })

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: 'wrongpassword' })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return current user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.user.email).toBe(userData.email)
    })

    it('should reject without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')

      expect(res.status).toBe(401)
    })
  })
})

describe('Campaign Management', () => {
  let accessToken
  let campaignId

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
    accessToken = loginRes.body.data.accessToken
  })

  describe('POST /api/campaigns', () => {
    const campaignData = {
      name: 'Test Campaign',
      description: 'A test campaign',
      budget: 5000,
      startDate: new Date().toISOString(),
      platform: 'google',
      objective: 'conversions',
    }

    it('should create a campaign', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(campaignData)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.campaign.name).toBe(campaignData.name)

      campaignId = res.body.data.campaign.id
    })

    it('should reject invalid campaign data', async () => {
      const res = await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '', budget: -100 })

      expect(res.status).toBe(422)
    })
  })

  describe('GET /api/campaigns', () => {
    it('should get all campaigns', async () => {
      const res = await request(app)
        .get('/api/campaigns')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data.campaigns)).toBe(true)
      expect(res.body.data.pagination).toBeDefined()
    })

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/campaigns?filter[status]=draft')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.campaigns.every(c => c.status === 'draft')).toBe(true)
    })

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/campaigns?page=1&limit=5')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.pagination.limit).toBe(5)
    })
  })

  describe('GET /api/campaigns/:id', () => {
    it('should get campaign by id', async () => {
      const res = await request(app)
        .get(`/api/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.campaign.id).toBe(campaignId)
    })

    it('should return 404 for non-existent campaign', async () => {
      const res = await request(app)
        .get('/api/campaigns/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/campaigns/:id', () => {
    it('should update campaign', async () => {
      const res = await request(app)
        .put(`/api/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ budget: 6000 })

      expect(res.status).toBe(200)
      expect(res.body.data.campaign.budget).toBe('6000.00')
    })
  })

  describe('POST /api/campaigns/:id/pause', () => {
    it('should pause active campaign', async () => {
      await request(app)
        .put(`/api/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'active' })

      const res = await request(app)
        .post(`/api/campaigns/${campaignId}/pause`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.campaign.status).toBe('paused')
    })
  })

  describe('POST /api/campaigns/:id/resume', () => {
    it('should resume paused campaign', async () => {
      const res = await request(app)
        .post(`/api/campaigns/${campaignId}/resume`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.data.campaign.status).toBe('active')
    })
  })

  describe('DELETE /api/campaigns/:id', () => {
    it('should soft delete campaign', async () => {
      const res = await request(app)
        .delete(`/api/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('should not return deleted campaign', async () => {
      const res = await request(app)
        .get(`/api/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(res.status).toBe(404)
    })
  })
})
