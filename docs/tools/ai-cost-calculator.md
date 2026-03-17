# AI 推理成本计算器

> 估算 AI 产品的月度推理成本，对比不同模型的费用差异。

<script setup>
import { ref, computed } from 'vue'

const dau = ref(10000)
const callsPerDay = ref(5)
const inputTokens = ref(1500)
const outputTokens = ref(500)
const systemPromptTokens = ref(1000)

const models = [
  { name: 'Claude Opus 4', input: 15, output: 75 },
  { name: 'Claude Sonnet 4', input: 3, output: 15 },
  { name: 'GPT-4o', input: 2.5, output: 10 },
  { name: 'GPT-4o-mini', input: 0.15, output: 0.6 },
  { name: 'Gemini Flash', input: 0.075, output: 0.3 },
  { name: 'DeepSeek-V3', input: 0.27, output: 1.1 },
]

const results = computed(() => {
  const totalInputPerCall = Number(inputTokens.value) + Number(systemPromptTokens.value)
  const totalOutputPerCall = Number(outputTokens.value)
  const dailyCalls = Number(dau.value) * Number(callsPerDay.value)
  const dailyInputTokens = dailyCalls * totalInputPerCall
  const dailyOutputTokens = dailyCalls * totalOutputPerCall

  return models.map(m => {
    const dailyCost = (dailyInputTokens / 1_000_000 * m.input) + (dailyOutputTokens / 1_000_000 * m.output)
    const monthlyCost = dailyCost * 30
    const costPerUser = monthlyCost / Number(dau.value)
    return {
      name: m.name,
      dailyCost: dailyCost.toFixed(2),
      monthlyCost: monthlyCost.toFixed(0),
      costPerUser: costPerUser.toFixed(3),
    }
  })
})

const dailyTotalTokens = computed(() => {
  const dailyCalls = Number(dau.value) * Number(callsPerDay.value)
  const total = dailyCalls * (Number(inputTokens.value) + Number(systemPromptTokens.value) + Number(outputTokens.value))
  return (total / 1_000_000).toFixed(1)
})

const maxMonthlyCost = computed(() => {
  return Math.max(...results.value.map(r => Number(r.monthlyCost)), 1)
})
</script>

<div class="pm-tool">

### 输入参数

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>日活用户数（DAU）</label>
  <input class="pm-input" type="number" v-model="dau" min="1">
</div>
<div class="pm-input-group">
  <label>每用户日均调用次数</label>
  <input class="pm-input" type="number" v-model="callsPerDay" min="1">
</div>
<div class="pm-input-group">
  <label>每次用户输入 Token 数</label>
  <div class="desc">用户消息平均长度</div>
  <input class="pm-input" type="number" v-model="inputTokens" min="1">
</div>
<div class="pm-input-group">
  <label>每次输出 Token 数</label>
  <div class="desc">模型回复平均长度</div>
  <input class="pm-input" type="number" v-model="outputTokens" min="1">
</div>
<div class="pm-input-group">
  <label>System Prompt Token 数</label>
  <div class="desc">系统提示词 + RAG 上下文</div>
  <input class="pm-input" type="number" v-model="systemPromptTokens" min="0">
</div>
<div class="pm-input-group">
  <label>每日 Token 消耗总量</label>
  <div style="font-size:1.5rem;font-weight:700;margin-top:0.5rem;">{{ dailyTotalTokens }}M</div>
</div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">各模型月度成本对比</div>

<div v-for="r in results" :key="r.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem;">
    <span style="font-weight:600;font-size:0.9rem;">{{ r.name }}</span>
    <span style="font-weight:700;">${{ r.monthlyCost }}/月 <span style="color:var(--vp-c-text-3);font-weight:400;font-size:0.8rem;">(${{ r.costPerUser }}/用户)</span></span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill pm-bar-blue" :style="{ width: (Number(r.monthlyCost) / maxMonthlyCost * 100) + '%' }">
    </div>
  </div>
</div>

</div>

## 成本优化建议

| 优化手段 | 预期节省 | 实施难度 |
|---------|---------|---------|
| **Prompt 缓存** | 减少 60-90% 重复 System Prompt 费用 | 低 |
| **模型路由** | 简单问题用小模型，节省 50-70% | 中 |
| **结果缓存** | 相似问题直接返回，节省 20-40% | 低 |
| **Token 精简** | 优化 Prompt 长度，节省 10-30% | 低 |
| **批处理** | 非实时场景打包处理，节省 30-50% | 中 |
