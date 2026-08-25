export function getActiveAIModelBadge(): { name: string; shortName: string; color: string } {
  try {
    const provider = localStorage.getItem('ai_agent_provider') || 'gemini';
    const model = localStorage.getItem('ai_agent_model') || 'gemini-3.7-flash';

    if (provider === 'gemini') {
      if (model.includes('3.7')) return { name: 'Gemini 3.7 Flash', shortName: 'Gemini 3.7', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' };
      if (model.includes('2.5-pro')) return { name: 'Gemini 2.5 Pro', shortName: 'Gemini Pro', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' };
      return { name: 'Gemini Flash', shortName: 'Gemini AI', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' };
    }

    if (provider === 'openai') {
      if (model.includes('o3-mini')) return { name: 'OpenAI o3-mini', shortName: 'o3-mini', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      if (model.includes('4o-mini')) return { name: 'GPT-4o mini', shortName: 'GPT-4o mini', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
      return { name: 'GPT-4o', shortName: 'GPT-4o', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
    }

    if (provider === 'claude') {
      if (model.includes('haiku')) return { name: 'Claude Haiku', shortName: 'Claude Haiku', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
      return { name: 'Claude 3.5 Sonnet', shortName: 'Claude 3.5', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
    }

    if (provider === 'deepseek') {
      if (model.includes('reasoner')) return { name: 'DeepSeek-R1', shortName: 'DeepSeek R1', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
      return { name: 'DeepSeek-V3', shortName: 'DeepSeek V3', color: 'bg-blue-500/20 text-blue-300 border-blue-400/40' };
    }

    if (provider === 'custom') {
      return { name: model || 'Custom AI', shortName: model ? (model.length > 10 ? model.slice(0, 10) + '…' : model) : 'Custom AI', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
    }
  } catch {
    // fallback
  }

  return { name: 'Gemini 3.7 Flash', shortName: 'Gemini 3.7', color: 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/40' };
}
