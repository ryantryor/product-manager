# 技术方案决策器

> 回答几个关键问题，帮你选择最合适的 AI 技术方案。

<script setup>
import { ref, computed } from 'vue'

const q1 = ref('')
const q2 = ref('')
const q3 = ref('')
const q4 = ref('')
const q5 = ref('')
const q6 = ref('')

const recommendation = computed(() => {
  if (!q1.value || !q2.value || !q3.value || !q4.value || !q5.value || !q6.value) return null

  let scores = { prompt: 0, rag: 0, finetune: 0, traditional: 0, rule: 0 }

  // Q1: 是否需要自然语言理解/生成
  if (q1.value === 'both') { scores.prompt += 3; scores.rag += 3; scores.finetune += 3 }
  else if (q1.value === 'understand') { scores.prompt += 2; scores.rag += 2; scores.finetune += 2; scores.traditional += 1 }
  else if (q1.value === 'generate') { scores.prompt += 3; scores.rag += 2; scores.finetune += 2 }
  else { scores.traditional += 3; scores.rule += 3 }

  // Q2: 是否需要最新/私有知识
  if (q2.value === 'realtime') { scores.rag += 4 }
  else if (q2.value === 'private') { scores.rag += 3; scores.finetune += 1 }
  else if (q2.value === 'general') { scores.prompt += 3 }

  // Q3: 输出格式要求
  if (q3.value === 'strict') { scores.finetune += 2; scores.rule += 2; scores.traditional += 1 }
  else if (q3.value === 'semi') { scores.prompt += 2; scores.rag += 1; scores.finetune += 1 }
  else { scores.prompt += 2; scores.rag += 2 }

  // Q4: 数据量
  if (q4.value === 'large') { scores.traditional += 3; scores.finetune += 2 }
  else if (q4.value === 'medium') { scores.finetune += 1; scores.rag += 2 }
  else { scores.prompt += 3; scores.rag += 1 }

  // Q5: 延迟要求
  if (q5.value === 'realtime') { scores.rule += 3; scores.traditional += 2; scores.finetune += 1 }
  else if (q5.value === 'fast') { scores.prompt += 1; scores.traditional += 1 }
  else { scores.prompt += 2; scores.rag += 2 }

  // Q6: 预算
  if (q6.value === 'low') { scores.rule += 3; scores.prompt += 2 }
  else if (q6.value === 'medium') { scores.prompt += 2; scores.rag += 2 }
  else { scores.rag += 2; scores.finetune += 3 }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const nameMap = {
    prompt: { name: 'Prompt Engineering', desc: '直接使用 LLM API + 精心设计的提示词', icon: '💬', color: '#28a745' },
    rag: { name: 'RAG（检索增强生成）', desc: '知识库检索 + LLM 生成', icon: '🔍', color: '#007bff' },
    finetune: { name: '微调（Fine-tuning）', desc: '基座模型 + 领域数据微调', icon: '🎯', color: '#6f42c1' },
    traditional: { name: '传统 ML 模型', desc: '分类/回归/聚类等经典机器学习', icon: '📊', color: '#fd7e14' },
    rule: { name: '规则引擎', desc: '基于规则的逻辑判断', icon: '⚙️', color: '#6c757d' },
  }

  return sorted.map(([key, score]) => ({
    ...nameMap[key],
    score,
    percent: Math.round(score / sorted[0][1] * 100),
  }))
})
</script>

<div class="pm-tool">

### 请回答以下问题

<div class="pm-input-group">
  <label>1. 你的任务是否需要自然语言理解或生成？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q1 === 'both' }" @click="q1 = 'both'">需要理解和生成</div>
    <div class="pm-radio-btn" :class="{ active: q1 === 'understand' }" @click="q1 = 'understand'">只需要理解</div>
    <div class="pm-radio-btn" :class="{ active: q1 === 'generate' }" @click="q1 = 'generate'">只需要生成</div>
    <div class="pm-radio-btn" :class="{ active: q1 === 'no' }" @click="q1 = 'no'">都不需要</div>
  </div>
</div>

<div class="pm-input-group">
  <label>2. 是否需要最新的或私有的领域知识？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q2 === 'realtime' }" @click="q2 = 'realtime'">需要实时更新的知识</div>
    <div class="pm-radio-btn" :class="{ active: q2 === 'private' }" @click="q2 = 'private'">需要私有领域知识</div>
    <div class="pm-radio-btn" :class="{ active: q2 === 'general' }" @click="q2 = 'general'">通用知识就够了</div>
  </div>
</div>

<div class="pm-input-group">
  <label>3. 输出格式要求如何？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q3 === 'strict' }" @click="q3 = 'strict'">严格固定格式（如 JSON）</div>
    <div class="pm-radio-btn" :class="{ active: q3 === 'semi' }" @click="q3 = 'semi'">半结构化</div>
    <div class="pm-radio-btn" :class="{ active: q3 === 'free' }" @click="q3 = 'free'">自然语言即可</div>
  </div>
</div>

<div class="pm-input-group">
  <label>4. 你有多少标注数据？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q4 === 'large' }" @click="q4 = 'large'">大量（>10,000 条）</div>
    <div class="pm-radio-btn" :class="{ active: q4 === 'medium' }" @click="q4 = 'medium'">中等（100-10,000 条）</div>
    <div class="pm-radio-btn" :class="{ active: q4 === 'small' }" @click="q4 = 'small'">很少（<100 条）</div>
  </div>
</div>

<div class="pm-input-group">
  <label>5. 延迟要求是什么？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q5 === 'realtime' }" @click="q5 = 'realtime'">实时（<100ms）</div>
    <div class="pm-radio-btn" :class="{ active: q5 === 'fast' }" @click="q5 = 'fast'">较快（<1s）</div>
    <div class="pm-radio-btn" :class="{ active: q5 === 'normal' }" @click="q5 = 'normal'">可接受等待（1-10s）</div>
  </div>
</div>

<div class="pm-input-group">
  <label>6. 月度预算范围？</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: q6 === 'low' }" @click="q6 = 'low'">低（<$500/月）</div>
    <div class="pm-radio-btn" :class="{ active: q6 === 'medium' }" @click="q6 = 'medium'">中（$500-5,000/月）</div>
    <div class="pm-radio-btn" :class="{ active: q6 === 'high' }" @click="q6 = 'high'">高（>$5,000/月）</div>
  </div>
</div>

</div>

<div class="pm-result" v-if="recommendation">
<div class="pm-result-title">推荐方案排名</div>

<div v-for="(r, i) in recommendation" :key="r.name" style="margin-bottom:1rem;">
  <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;">
    <span style="font-size:1.3rem;">{{ r.icon }}</span>
    <span style="font-weight:700;font-size:1rem;">{{ i === 0 ? '🏆 ' : '' }}{{ r.name }}</span>
    <span v-if="i === 0" class="pm-tag pm-tag-green">最佳推荐</span>
  </div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-bottom:0.3rem;">{{ r.desc }}</div>
  <div class="pm-bar">
    <div class="pm-bar-fill" :class="i === 0 ? 'pm-bar-green' : i === 1 ? 'pm-bar-blue' : 'pm-bar-yellow'" :style="{ width: r.percent + '%' }">
      {{ r.percent }}%
    </div>
  </div>
</div>

</div>
