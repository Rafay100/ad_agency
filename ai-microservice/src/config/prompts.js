const generateCopyPrompt = (data) => ({
  contents: [{
    role: 'user',
    parts: [{
      text: `You are an expert advertising copywriter. Generate ${data.count} ${data.format} ad copy variation(s) based on the brief provided. Respond with valid JSON only.

Product: ${data.product}
Description: ${data.description}
Target Audience: ${data.audience}
Tone: ${data.tone}
Format: ${data.format}
Language: ${data.language}

Generate ${data.count} variation(s). Each should be distinctly different.

Return JSON format:
{
  "variations": [
    {
      "headline": "...",
      "body": "...",
      "cta": "..."
    }
  ]
}`
    }]
  }],
  generationConfig: {
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.8,
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 2048,
  },
})

const generateCopyStreamPrompt = (data) => ({
  contents: [{
    role: 'user',
    parts: [{
      text: `You are an expert advertising copywriter. Generate ${data.count} ${data.format} ad copy variation(s). Stream your response token by token.

Product: ${data.product}
Description: ${data.description}
Target Audience: ${data.audience}
Tone: ${data.tone}
Format: ${data.format}

Generate ${data.count} distinct variation(s). Make each unique with different angles.`
    }]
  }],
  generationConfig: {
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.8,
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 2048,
  },
})

const generateSocialPrompt = (data) => ({
  contents: [{
    role: 'user',
    parts: [{
      text: `You are an expert social media strategist. Create ${data.count} social media post(s) optimized for ${data.platform}. Respond with valid JSON only.

Product/Brand: ${data.product}
Key Message: ${data.message}
${data.audience ? `Target Audience: ${data.audience}` : ''}
Tone: ${data.tone}
Platform: ${data.platform}
${data.includeHashtags ? 'Include relevant hashtags.' : 'Do not include hashtags.'}
${data.includeEmojis ? 'Use emojis appropriately.' : 'Do not use emojis.'}

Generate ${data.count} post(s). Each should be optimized for ${data.platform}.

Return JSON format:
{
  "posts": [
    {
      "content": "...",
      "hashtags": ["#tag1", "#tag2"],
      "characterCount": 0
    }
  ]
}`
    }]
  }],
  generationConfig: {
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.8,
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 2048,
  },
})

const generateHashtagPrompt = (data) => ({
  contents: [{
    role: 'user',
    parts: [{
      text: `You are an expert hashtag strategist. Generate relevant, high-engagement hashtags for ${data.platform}. Respond with valid JSON only.

Topic: ${data.topic}
${data.niche ? `Niche: ${data.niche}` : ''}
Platform: ${data.platform}
Count: ${data.count}
${data.exclude && data.exclude.length > 0 ? `Exclude: ${data.exclude.join(', ')}` : ''}

Generate a mix of:
- Trending/popular hashtags (high volume)
- Niche-specific hashtags (medium volume)
- Long-tail hashtags (low competition)

Return JSON format:
{
  "hashtags": [
    { "tag": "#example", "category": "trending|niche|longtail", "estimatedReach": "high|medium|low" }
  ],
  "total": 0
}`
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  },
})

module.exports = {
  generateCopyPrompt,
  generateCopyStreamPrompt,
  generateSocialPrompt,
  generateHashtagPrompt,
}
