import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { creativeAPI } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { FiSparkles, FiCheck, FiX } from 'react-icons/fi'

const creativeSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  type: z.enum(['text', 'image', 'video']),
  tone: z.enum(['professional', 'casual', 'humorous', 'urgent']),
  platform: z.enum(['google', 'facebook', 'instagram', 'linkedin', 'tiktok']),
})

const CreativeStudio = () => {
  const queryClient = useQueryClient()
  const [generatedCreative, setGeneratedCreative] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(creativeSchema),
    defaultValues: { type: 'text', tone: 'professional', platform: 'google' },
  })

  const { data: history } = useQuery({
    queryKey: ['creative-history'],
    queryFn: () => creativeAPI.getAll({ limit: 10 }),
  })

  const generateMutation = useMutation({
    mutationFn: creativeAPI.generate,
    onSuccess: (data) => {
      setGeneratedCreative(data.data)
      queryClient.invalidateQueries(['creative-history'])
      toast.success('Creative generated successfully')
    },
    onError: () => toast.error('Failed to generate creative'),
  })

  const onSubmit = async (data) => {
    setIsGenerating(true)
    try {
      await generateMutation.mutateAsync(data)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Creative Studio</h1>
        <p className="text-gray-600">AI-powered ad creative generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Creative</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                <Input
                  as="textarea"
                  rows={4}
                  error={errors.prompt?.message}
                  {...register('prompt')}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select {...register('type')} className="input-field">
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <select {...register('tone')} className="input-field">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select {...register('platform')} className="input-field">
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
              </div>

              <Button type="submit" isLoading={isGenerating} className="w-full">
                <FiSparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCreative ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{generatedCreative.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="flex-1">
                    <FiCheck className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <FiX className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                Generated creative will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history?.data?.creatives?.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.prompt}</p>
                  <p className="text-sm text-gray-600">{item.type} • {item.platform}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreativeStudio
