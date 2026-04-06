import { create } from 'zustand'
import { campaignAPI } from '@/services/api'

export const useCampaignStore = create((set) => ({
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  pagination: { page: 1, limit: 10, total: 0 },

  fetchCampaigns: async (params = {}) => {
    set({ isLoading: true })
    try {
      const { data } = await campaignAPI.getAll(params)
      set({ campaigns: data.campaigns, pagination: data.pagination, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchCampaign: async (id) => {
    set({ isLoading: true })
    try {
      const { data } = await campaignAPI.getById(id)
      set({ currentCampaign: data.campaign, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  createCampaign: async (data) => {
    const { data: response } = await campaignAPI.create(data)
    set((state) => ({ campaigns: [response.campaign, ...state.campaigns] }))
    return response
  },

  updateCampaign: async (id, data) => {
    const { data: response } = await campaignAPI.update(id, data)
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...response.campaign } : c)),
      currentCampaign: state.currentCampaign?.id === id ? { ...state.currentCampaign, ...response.campaign } : state.currentCampaign,
    }))
    return response
  },

  deleteCampaign: async (id) => {
    await campaignAPI.delete(id)
    set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) }))
  },

  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),
  clearCurrentCampaign: () => set({ currentCampaign: null }),
}))
