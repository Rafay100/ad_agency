import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import StepIndicator from '@/components/forms/StepIndicator'
import StepClientDetails from '@/components/forms/steps/StepClientDetails'
import StepCampaignObjective from '@/components/forms/steps/StepCampaignObjective'
import StepCreativePreferences from '@/components/forms/steps/StepCreativePreferences'
import StepReview from '@/components/forms/steps/StepReview'
import AICampaignOutput from '@/components/forms/AICampaignOutput'
import { campaignBriefSchema, reviewSchema } from '@/validations/campaignBrief.validation'
import { cn } from '@/lib/utils'

const stepComponents = {
  1: StepClientDetails,
  2: StepCampaignObjective,
  3: StepCreativePreferences,
  4: StepReview,
}

const CampaignBrief = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [aiOutput, setAiOutput] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const form = useForm({
    resolver: zodResolver(currentStep === 4 ? reviewSchema : campaignBriefSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: '', clientEmail: '', companyName: '', industry: '',
      targetAudience: '', budget: 1000,
      campaignName: '', objective: 'awareness', keyMessage: '', uniqueSellingPoint: '',
      targetRegions: [], campaignDuration: '1month',
      tone: 'professional', channels: [], brandColors: '', visualStyle: 'minimal',
      competitors: '', additionalNotes: '',
      agreeToTerms: false,
    },
  })

  const validateStep = useCallback(async () => {
    if (currentStep < 4) {
      const fieldsForStep = {
        1: ['clientName', 'clientEmail', 'companyName', 'industry', 'targetAudience', 'budget'],
        2: ['campaignName', 'objective', 'keyMessage', 'uniqueSellingPoint', 'targetRegions', 'campaignDuration'],
        3: ['tone', 'channels', 'visualStyle'],
      }
      const result = await form.trigger(fieldsForStep[currentStep])
      return result
    }
    return true
  }, [currentStep, form])

  const nextStep = async () => {
    const isValid = await validateStep()
    if (isValid) {
      setCurrentStep(prev => Math.min(4, prev + 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data) => {
    if (currentStep === 4) {
      if (!data.agreeToTerms) {
        form.setError('agreeToTerms', { message: 'You must agree to proceed' })
        return
      }

      setIsGenerating(true)
      try {
        const response = await axios.post(`${import.meta.env.VITE_AI_URL || 'http://localhost:5000'}/generate`, {
          prompt: buildPrompt(data),
          type: 'text',
          tone: data.tone,
          platform: data.channels[0] || 'google',
        })

        const parsed = parseAIResponse(response.data.content)
        setAiOutput(parsed)
        setIsComplete(true)
        toast.success('Campaign generated successfully!')
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to generate campaign. Using mock output.')
        const mockOutput = generateMockOutput(data)
        setAiOutput(mockOutput)
        setIsComplete(true)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const buildPrompt = (data) => {
    return `Create a comprehensive advertising campaign brief with the following details:

Client: ${data.clientName} from ${data.companyName} (${data.industry})
Budget: $${Number(data.budget).toLocaleString()}
Target Audience: ${data.targetAudience}

Campaign: ${data.campaignName}
Objective: ${data.objective}
Key Message: ${data.keyMessage}
Unique Selling Proposition: ${data.uniqueSellingPoint}
Target Regions: ${data.targetRegions.join(', ')}
Duration: ${data.campaignDuration}

Tone: ${data.tone}
Visual Style: ${data.visualStyle}
Channels: ${data.channels.join(', ')}
${data.brandColors ? `Brand Colors: ${data.brandColors}` : ''}
${data.competitors ? `Competitors to differentiate from: ${data.competitors}` : ''}

Please provide:
1. A compelling campaign title
2. Three distinct ad headlines
3. A detailed tone guide explaining how the brand voice should sound
4. Budget allocation percentages across the selected channels (must total 100%)
5. Visual direction describing the design aesthetic, color approach, and imagery style

Respond in JSON format only.`
  }

  const parseAIResponse = (content) => {
    try {
      if (typeof content === 'object') return content
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      return generateMockOutput(form.getValues())
    }
  }

  const generateMockOutput = (data) => ({
    title: `${data.campaignName} - ${data.objective.charAt(0).toUpperCase() + data.objective.slice(1)} Campaign`,
    headlines: [
      `Transform Your ${data.industry} Experience Today`,
      `Discover What Makes ${data.companyName} Different`,
      `Join Thousands Who Already Trust ${data.companyName}`,
    ],
    toneGuide: `The campaign should maintain a ${data.tone} voice throughout all touchpoints. Use ${data.tone === 'professional' ? 'authoritative language backed by data and case studies' : data.tone === 'casual' ? 'conversational phrases that feel like talking to a friend' : 'emotionally resonant messaging that drives immediate action'}. Avoid jargon unless targeting industry professionals. Keep sentences punch and benefit-focused.`,
    channelBudget: distributeBudget(data.channels),
    visualDirection: `Adopt a ${data.visualStyle} visual approach that aligns with ${data.industry} industry expectations. ${data.brandColors ? `Prioritize the brand colors: ${data.brandColors}.` : 'Use a complementary color palette that evokes trust and innovation.'} Imagery should feature real people in authentic scenarios rather than stock photography. Maintain consistent visual hierarchy across all ad formats.`,
  })

  const distributeBudget = (channels) => {
    if (!channels || channels.length === 0) return []
    const equal = Math.floor(100 / channels.length)
    const remainder = 100 - (equal * channels.length)
    return channels.map((ch, i) => ({
      channel: ch,
      percentage: i === 0 ? equal + remainder : equal,
    }))
  }

  const CurrentStepComponent = stepComponents[currentStep]
  const formData = form.getValues()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Brief Generator</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Create AI-powered campaign strategies in minutes.</p>
      </div>

      {!isComplete && <StepIndicator currentStep={currentStep} />}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="card p-6 sm:p-8">
          <CurrentStepComponent form={form} data={formData} />

          {currentStep === 4 && !isComplete && (
            <label className="mt-6 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...form.register('agreeToTerms')}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  I confirm all information is accurate and agree to AI generation
                </span>
                {form.formState.errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{form.formState.errors.agreeToTerms.message}</p>
                )}
              </div>
            </label>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              'btn-secondary',
              currentStep === 1 && 'invisible'
            )}
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Continue
            </button>
          ) : !isComplete ? (
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Campaign'
              )}
            </button>
          ) : null}
        </div>
      </form>

      <AICampaignOutput
        output={aiOutput}
        brief={formData}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default CampaignBrief
