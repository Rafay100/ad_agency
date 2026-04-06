const openai = require('../config/openai')
const { generateTextPrompt, generateImagePrompt, generateVideoScript } = require('../config/prompts')
const logger = require('../config/logger')

exports.generate = async (req, res, next) => {
  try {
    const { prompt, type = 'text', tone = 'professional', platform = 'google' } = req.body

    let systemPrompt
    switch (type) {
      case 'text':
        systemPrompt = generateTextPrompt({ prompt, tone, platform })
        break
      case 'image':
        systemPrompt = generateImagePrompt({ prompt, tone, platform })
        break
      case 'video':
        systemPrompt = generateVideoScript({ prompt, tone, platform })
        break
      default:
        systemPrompt = generateTextPrompt({ prompt, tone, platform })
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert advertising creative assistant. Always respond with valid JSON.' },
        { role: 'user', content: systemPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1000,
    })

    const content = JSON.parse(completion.choices[0].message.content)

    logger.info({
      event: 'creative_generated',
      type,
      tone,
      platform,
      promptLength: prompt.length,
    })

    res.json({
      content,
      metadata: {
        model: process.env.OPENAI_MODEL || 'gpt-4',
        type,
        tone,
        platform,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error({ event: 'generation_failed', error: error.message })
    next(error)
  }
}
