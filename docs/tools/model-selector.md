# 模型选型推荐器

> 根据你的场景需求，推荐最合适的 AI 模型。

<script setup>
import { ref, computed } from 'vue'

const language = ref('')
const task = ref('')
const budget = ref('')
const latency = ref('')
const privacy = ref('')
const context = ref('')

const models = [
  { name: 'Claude Opus 4', strengths: ['推理', '代码', '指令遵循', '长文本', '中文'], cost: 'high', latency: 'slow', deploy: 'api', context: 'long' },
  { name: 'Claude Sonnet 4', strengths: ['推理', '代码', '指令遵循', '长文本', '中文', '多模态'], cost: 'medium', latency: 'medium', deploy: 'api', context: 'long' },
  { name: 'GPT-4o', strengths: ['推理', '多模态', '代码', '指令遵循'], cost: 'medium', latency: 'medium', deploy: 'api', context: 'long' },
  { name: 'GPT-4o-mini', strengths: ['指令遵循', '多模态'], cost: 'low', latency: 'fast', deploy: 'api', context: 'long' },
  { name: 'Gemini Flash', strengths: ['多模态', '长文本'], cost: 'low', latency: 'fast', deploy: 'api', context: 'very-long' },
  { name: 'DeepSeek-V3', strengths: ['推理', '代码', '中文'], cost: 'low', latency: 'medium', deploy: 'both', context: 'long' },
  { name: 'Qwen-Max', strengths: ['中文', '推理', '代码', '指令遵循'], cost: 'low', latency: 'medium', deploy: 'both', context: 'long' },
  { name: 'Llama 3.1 405B', strengths: ['推理', '代码'], cost: 'self', latency: 'varies', deploy: 'self', context: 'long' },
  { name: 'Llama 3.1 70B', strengths: ['推理', '代码'], cost: 'self', latency: 'medium', deploy: 'self', context: 'long' },
  { name: 'Phi-3 / Gemma', strengths: ['轻量'], cost: 'self', latency: 'fast', deploy: 'self', context: 'short' },
]

const results = computed(() => {
  if (!language.value || !task.value || !budget.value || !latency.value || !privacy.value) return null

  return models.map(m => {
    let score = 50

    // Language match
    if (language.value === 'chinese') {
      if (m.strengths.includes('中文')) score += 20
      else score -= 10
    }

    // Task match
    if (m.strengths.includes(task.value)) score += 25
    if (task.value === '多模态' && !m.strengths.includes('多模态')) score -= 30

    // Budget
    if (budget.value === 'low') {
      if (m.cost === 'low' || m.cost === 'self') score += 15
      else if (m.cost === 'high') score -= 25
    } else if (budget.value === 'high') {
      score += 5
    }

    // Latency
    if (latency.value === 'fast') {
      if (m.latency === 'fast') score += 15
      else if (m.latency === 'slow') score -= 20
    }

    // Privacy
    if (privacy.value === 'strict') {
      if (m.deploy === 'self' || m.deploy === 'both') score += 20
      else score -= 15
    }

    // Context
    if (context.value === 'long') {
      if (m.context === 'very-long') score += 10
      else if (m.context === 'long') score += 5
      else score -= 15
    }

    return { ...m, score: Math.max(score, 0) }
  }).sort((a, b) => b.score - a.score)
})

const maxScore = computed(() => results.value ? Math.max(...results.value.map(r => r.score), 1) : 1)
</script>

<div class="pm-tool">

### 你的场景需求

<div class="pm-input-group">
  <label>主要语言</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: language === 'chinese' }" @click="language = 'chinese'">中文为主</div>
    <div class="pm-radio-btn" :class="{ active: language === 'english' }" @click="language = 'english'">英文为主</div>
    <div class="pm-radio-btn" :class="{ active: language === 'multi' }" @click="language = 'multi'">多语言</div>
  </div>
</div>

<div class="pm-input-group">
  <label>核心任务</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: task === '推理' }" @click="task = '推理'">复杂推理/分析</div>
    <div class="pm-radio-btn" :class="{ active: task === '代码' }" @click="task = '代码'">代码生成/审查</div>
    <div class="pm-radio-btn" :class="{ active: task === '指令遵循' }" @click="task = '指令遵循'">指令遵循/格式化输出</div>
    <div class="pm-radio-btn" :class="{ active: task === '多模态' }" @click="task = '多模态'">图像/多模态理解</div>
    <div class="pm-radio-btn" :class="{ active: task === '长文本' }" @click="task = '长文本'">长文档处理</div>
  </div>
</div>

<div class="pm-input-group">
  <label>月度预算</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: budget === 'low' }" @click="budget = 'low'">低（<$500）</div>
    <div class="pm-radio-btn" :class="{ active: budget === 'medium' }" @click="budget = 'medium'">中（$500-5K）</div>
    <div class="pm-radio-btn" :class="{ active: budget === 'high' }" @click="budget = 'high'">高（>$5K）</div>
  </div>
</div>

<div class="pm-input-group">
  <label>延迟要求</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: latency === 'fast' }" @click="latency = 'fast'">低延迟（<1s）</div>
    <div class="pm-radio-btn" :class="{ active: latency === 'normal' }" @click="latency = 'normal'">正常（1-5s 可接受）</div>
    <div class="pm-radio-btn" :class="{ active: latency === 'slow' }" @click="latency = 'slow'">不敏感（离线/批处理）</div>
  </div>
</div>

<div class="pm-input-group">
  <label>数据安全要求</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: privacy === 'normal' }" @click="privacy = 'normal'">可以用云端 API</div>
    <div class="pm-radio-btn" :class="{ active: privacy === 'strict' }" @click="privacy = 'strict'">需要私有化部署</div>
  </div>
</div>

<div class="pm-input-group">
  <label>上下文长度需求</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: context === 'short' }" @click="context = 'short'">短文本（<4K tokens）</div>
    <div class="pm-radio-btn" :class="{ active: context === 'normal' }" @click="context = 'normal'">中等（4K-32K）</div>
    <div class="pm-radio-btn" :class="{ active: context === 'long' }" @click="context = 'long'">长文本（>32K）</div>
  </div>
</div>

</div>

<div class="pm-result" v-if="results">
<div class="pm-result-title">推荐排名</div>

<div v-for="(r, i) in results.slice(0, 6)" :key="r.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem;">
    <span>
      <span style="font-weight:700;margin-right:0.3rem;">{{ i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1) }}</span>
      <span style="font-weight:600;">{{ r.name }}</span>
      <span v-if="i === 0" class="pm-tag pm-tag-green" style="margin-left:0.3rem;">最佳匹配</span>
    </span>
    <span style="font-weight:700;">{{ r.score }}分</span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill" :class="i === 0 ? 'pm-bar-green' : i === 1 ? 'pm-bar-blue' : 'pm-bar-yellow'" :style="{ width: (r.score / maxScore * 100) + '%' }">
    </div>
  </div>
  <div style="font-size:0.8rem;color:var(--vp-c-text-3);">
    优势：{{ r.strengths.join(' · ') }}
  </div>
</div>

</div>
