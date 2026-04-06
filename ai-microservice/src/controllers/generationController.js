const model = require('../config/openai')
const {
  generateCopyPrompt,
  generateCopyStreamPrompt,
  generateSocialPrompt,
  generateHashtagPrompt,
} = require('../config/prompts')
const { sseHeaders } = require('../middleware')

const generateCopy = async (req, res, next) => {
  try {
    const data = req.validatedBody
    req.logger.info({ event: 'copy_generation_started', ...data })

    const result = await model.generateContent(generateCopyPrompt(data))
    const text = result.response.text()
    const content = JSON.parse(text)

    req.logger.info({
      event: 'copy_generation_completed',
      variations: content.variations?.length,
      tokensUsed: result.response.usageMetadata?.totalTokenCount,
    })

    res.json({
      success: true,
      data: {
        variations: content.variations,
        metadata: {
          model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
          tokensUsed: result.response.usageMetadata?.totalTokenCount,
          generatedAt: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    req.logger.error({ event: 'copy_generation_failed', error: error.message })
    next(error)
  }
}

const generateCopyStream = async (req, res, next) => {
  try {
    const data = req.validatedBody
    req.logger.info({ event: 'copy_stream_started', ...data })

    sseHeaders(res)

    const result = await model.generateContentStream(generateCopyStreamPrompt(data))

    res.write(`event: start\ndata: ${JSON.stringify({ message: 'Generation started' })}\n\n`)

    let fullContent = ''
    let tokenCount = 0

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        fullContent += text
        tokenCount++
        res.write(`event: token\ndata: ${JSON.stringify({ token: text })}\n\n`)
      }
    }

    res.write(`event: done\ndata: ${JSON.stringify({
      message: 'Generation completed',
      totalTokens: tokenCount,
    })}\n\n`)

    req.logger.info({
      event: 'copy_stream_completed',
      totalTokens: tokenCount,
      contentLength: fullContent.length,
    })
  } catch (error) {
    req.logger.error({ event: 'copy_stream_failed', error: error.message })
    if (!res.headersSent) {
      next(error)
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`)
      res.end()
    }
  }
}

const generateSocial = async (req, res, next) => {
  try {
    const data = req.validatedBody
    req.logger.info({ event: 'social_generation_started', platform: data.platform })

    const result = await model.generateContent(generateSocialPrompt(data))
    const text = result.response.text()
    const content = JSON.parse(text)

    req.logger.info({
      event: 'social_generation_completed',
      posts: content.posts?.length,
      platform: data.platform,
      tokensUsed: result.response.usageMetadata?.totalTokenCount,
    })

    res.json({
      success: true,
      data: {
        posts: content.posts,
        platform: data.platform,
        metadata: {
          model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
          tokensUsed: result.response.usageMetadata?.totalTokenCount,
          generatedAt: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    req.logger.error({ event: 'social_generation_failed', error: error.message })
    next(error)
  }
}

const generateHashtags = async (req, res, next) => {
  try {
    const data = req.validatedBody
    req.logger.info({ event: 'hashtag_generation_started', topic: data.topic })

    const result = await model.generateContent(generateHashtagPrompt(data))
    const text = result.response.text()
    const content = JSON.parse(text)

    req.logger.info({
      event: 'hashtag_generation_completed',
      hashtags: content.hashtags?.length || content.total,
      platform: data.platform,
      tokensUsed: result.response.usageMetadata?.totalTokenCount,
    })

    res.json({
      success: true,
      data: {
        hashtags: content.hashtags,
        total: content.total,
        topic: data.topic,
        metadata: {
          model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
          tokensUsed: result.response.usageMetadata?.totalTokenCount,
          generatedAt: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    req.logger.error({ event: 'hashtag_generation_failed', error: error.message })
    next(error)
  }
}

module.exports = {
  generateCopy,
  generateCopyStream,
  generateSocial,
  generateHashtags,
}
