import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertRuleAPI } from '@/services/notificationApi'
import toast from 'react-hot-toast'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import * as Icons from '@/components/icons'

const ruleTypes = [
  { value: 'ctr_low', label: 'Low CTR Alert' },
  { value: 'budget_high', label: 'Budget Threshold Alert' },
  { value: 'spend_rate', label: 'Daily Spend Limit' },
  { value: 'impressions_drop', label: 'Impressions Drop Alert' },
]

const severityOptions = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
]

const defaultConditions = {
  ctr_low: { threshold: 0.01, periodDays: 3 },
  budget_high: { threshold: 0.9 },
  spend_rate: { dailySpendLimit: 500 },
  impressions_drop: { dropPercent: 0.5 },
}

const AlertRules = () => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [editRule, setEditRule] = useState(null)

  const { data: rulesData } = useQuery({
    queryKey: ['alert-rules'],
    queryFn: alertRuleAPI.getAll,
  })
  const rules = rulesData?.data?.rules || []

  const createMutation = useMutation({
    mutationFn: alertRuleAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['alert-rules'])
      toast.success('Alert rule created')
      setIsCreating(false)
    },
    onError: () => toast.error('Failed to create rule'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => alertRuleAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['alert-rules'])
      toast.success('Alert rule updated')
      setEditRule(null)
    },
    onError: () => toast.error('Failed to update rule'),
  })

  const deleteMutation = useMutation({
    mutationFn: alertRuleAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['alert-rules'])
      toast.success('Alert rule deleted')
    },
    onError: () => toast.error('Failed to delete rule'),
  })

  const handleToggle = (rule) => {
    updateMutation.mutate({ id: rule.id, data: { isEnabled: !rule.isEnabled } })
  }

  const RuleForm = ({ rule, onSubmit, onCancel }) => {
    const [form, setForm] = useState(rule || {
      name: '',
      type: 'ctr_low',
      condition: { threshold: 0.01, periodDays: 3 },
      severity: 'warning',
      cooldownMinutes: 60,
    })

    useEffect(() => {
      if (form.type && JSON.stringify(form.condition) === JSON.stringify({})) {
        setForm(prev => ({
          ...prev,
          condition: defaultConditions[prev.type] || {},
        }))
      }
    }, [form.type])

    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(form)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="My Alert Rule"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value, condition: defaultConditions[e.target.value] || {} })}
              className="input-field"
            >
              {ruleTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="input-field"
            >
              {severityOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooldown (minutes)</label>
            <input
              type="number"
              value={form.cooldownMinutes}
              onChange={(e) => setForm({ ...form, cooldownMinutes: parseInt(e.target.value) })}
              className="input-field"
              min={5}
              max={1440}
            />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Condition</p>
          {form.type === 'ctr_low' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">CTR Threshold</label>
                <input
                  type="number"
                  step="0.001"
                  value={form.condition.threshold}
                  onChange={(e) => setForm({ ...form, condition: { ...form.condition, threshold: parseFloat(e.target.value) } })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Period (days)</label>
                <input
                  type="number"
                  value={form.condition.periodDays}
                  onChange={(e) => setForm({ ...form, condition: { ...form.condition, periodDays: parseInt(e.target.value) } })}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {form.type === 'budget_high' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Budget Threshold (%)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={form.condition.threshold}
                onChange={(e) => setForm({ ...form, condition: { ...form.condition, threshold: parseFloat(e.target.value) } })}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">{(form.condition.threshold * 100).toFixed(0)}% of budget spent</p>
            </div>
          )}

          {form.type === 'spend_rate' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Daily Spend Limit ($)</label>
              <input
                type="number"
                value={form.condition.dailySpendLimit}
                onChange={(e) => setForm({ ...form, condition: { ...form.condition, dailySpendLimit: parseFloat(e.target.value) } })}
                className="input-field"
              />
            </div>
          )}

          {form.type === 'impressions_drop' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Drop Percentage</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={form.condition.dropPercent}
                onChange={(e) => setForm({ ...form, condition: { ...form.condition, dropPercent: parseFloat(e.target.value) } })}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">{(form.condition.dropPercent * 100).toFixed(0)}% drop triggers alert</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button type="submit" className="btn-primary text-sm">
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alert Rules</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Configure automated notification alerts for your campaigns.</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditRule(null) }}>
          <Icons.Target className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardContent className="pt-6">
            <RuleForm
              onSubmit={(data) => createMutation.mutate(data)}
              onCancel={() => setIsCreating(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{rule.name}</h3>
                  <span className={rule.isEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium px-2 py-0.5 rounded'}>
                    {rule.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{ruleTypes.find(t => t.value === rule.type)?.label || rule.type}</span>
                  <span>Cooldown: {rule.cooldownMinutes}m</span>
                  {rule.lastTriggeredAt && (
                    <span>Last triggered: {new Date(rule.lastTriggeredAt).toLocaleDateString()}</span>
                  )}
                </div>
                <pre className="mt-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {JSON.stringify(rule.condition)}
                </pre>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(rule)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${rule.isEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${rule.isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>

                <button
                  onClick={() => { setEditRule(rule); setIsCreating(false) }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Icons.Eye className="w-4 h-4 text-gray-500" />
                </button>

                <button
                  onClick={() => deleteMutation.mutate(rule.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Icons.X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {editRule?.id === rule.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-5">
                <RuleForm
                  rule={rule}
                  onSubmit={(data) => updateMutation.mutate({ id: rule.id, data })}
                  onCancel={() => setEditRule(null)}
                />
              </div>
            )}
          </Card>
        ))}

        {rules.length === 0 && !isCreating && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Icons.Target className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No alert rules configured</p>
              <p className="text-xs mt-1">Create your first rule to start receiving alerts</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AlertRules
