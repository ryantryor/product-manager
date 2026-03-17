# RICE 评分计算器

> 用量化方法为需求排优先级，告别"拍脑袋"决策。

<script setup>
import { ref, computed } from 'vue'

const features = ref([
  { name: '智能搜索', reach: 5000, impact: 2, confidence: 80, effort: 3 },
  { name: 'AI 摘要', reach: 3000, impact: 3, confidence: 70, effort: 2 },
  { name: '个性化推荐', reach: 8000, impact: 2, confidence: 60, effort: 5 },
])

const newName = ref('')

function addFeature() {
  const n = newName.value.trim() || '新需求 ' + (features.value.length + 1)
  features.value.push({ name: n, reach: 1000, impact: 2, confidence: 70, effort: 2 })
  newName.value = ''
}

function removeFeature(index) {
  features.value.splice(index, 1)
}

const rankedFeatures = computed(() => {
  return features.value.map(f => {
    const score = (Number(f.reach) * Number(f.impact) * (Number(f.confidence) / 100)) / Number(f.effort)
    return { ...f, score: Math.round(score) }
  }).sort((a, b) => b.score - a.score)
})

const maxScore = computed(() => Math.max(...rankedFeatures.value.map(f => f.score), 1))

const impactLabels = { 0.25: '极小', 0.5: '小', 1: '中', 2: '大', 3: '极大' }
</script>

<div class="pm-tool">

### 添加需求

<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
  <input class="pm-input" v-model="newName" placeholder="输入需求名称" @keyup.enter="addFeature" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addFeature">添加</button>
</div>

### 需求评分

<div v-for="(f, i) in features" :key="i" style="padding:1rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:8px;margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
    <input class="pm-input" v-model="f.name" style="font-weight:700;width:auto;flex:1;margin-right:0.5rem;">
    <button class="pm-btn pm-btn-secondary" @click="removeFeature(i)" style="font-size:0.8rem;">删除</button>
  </div>

  <div class="pm-tool-grid">
    <div class="pm-input-group">
      <label>Reach（触达人数/季度）</label>
      <input class="pm-input" type="number" v-model="f.reach" min="0">
    </div>
    <div class="pm-input-group">
      <label>Impact（影响程度）</label>
      <select class="pm-select" v-model="f.impact">
        <option :value="3">3 - 极大影响</option>
        <option :value="2">2 - 大影响</option>
        <option :value="1">1 - 中等影响</option>
        <option :value="0.5">0.5 - 小影响</option>
        <option :value="0.25">0.25 - 极小影响</option>
      </select>
    </div>
    <div class="pm-input-group">
      <label>Confidence（信心 %）</label>
      <input class="pm-slider" type="range" v-model="f.confidence" min="10" max="100" step="10">
      <span style="font-weight:600;">{{ f.confidence }}%</span>
    </div>
    <div class="pm-input-group">
      <label>Effort（人月）</label>
      <input class="pm-input" type="number" v-model="f.effort" min="0.5" step="0.5">
    </div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">优先级排名（RICE = Reach × Impact × Confidence / Effort）</div>

<div v-for="(f, i) in rankedFeatures" :key="f.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem;">
    <span>
      <span style="font-weight:700;margin-right:0.3rem;">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1) }}</span>
      <span style="font-weight:600;">{{ f.name }}</span>
    </span>
    <span style="font-weight:700;font-size:1.1rem;">{{ f.score.toLocaleString() }}</span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill" :class="i === 0 ? 'pm-bar-green' : i === 1 ? 'pm-bar-blue' : 'pm-bar-yellow'" :style="{ width: (f.score / maxScore * 100) + '%' }">
    </div>
  </div>
</div>
</div>

## RICE 评分说明

| 维度 | 含义 | 如何估算 |
|------|------|---------|
| **Reach** | 每个季度能触达多少用户 | 基于数据分析和用户画像 |
| **Impact** | 对单个用户的影响程度 | 3=极大 2=大 1=中 0.5=小 0.25=极小 |
| **Confidence** | 对以上估算的信心 | 有数据支撑=100%，有案例=80%，直觉=50% |
| **Effort** | 需要投入的人月数 | 包含设计+开发+测试+上线 |
