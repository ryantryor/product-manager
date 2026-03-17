# AI 产品成熟度评估

> 20 道评估题，测量你的 AI 产品在各维度的成熟度并生成改进路线。

<script setup>
import { ref, computed } from 'vue'

const dimensions = ref([
  {
    name: '数据基础',
    icon: '📊',
    questions: [
      { text: '是否建立了统一的数据采集和存储体系？', score: 1 },
      { text: '数据质量是否有监控和治理机制？', score: 1 },
      { text: '是否有数据标注流程和质量标准？', score: 1 },
      { text: '数据安全和隐私保护是否合规？', score: 1 },
    ],
  },
  {
    name: '模型能力',
    icon: '🤖',
    questions: [
      { text: '是否有模型选型和评估的标准流程？', score: 1 },
      { text: '模型上线前是否有系统的测试评估？', score: 1 },
      { text: '是否建立了模型监控和迭代机制？', score: 1 },
      { text: '是否有 Prompt 管理和版本控制？', score: 1 },
    ],
  },
  {
    name: '产品体验',
    icon: '✨',
    questions: [
      { text: 'AI 功能是否有清晰的用户价值主张？', score: 1 },
      { text: '是否设计了合理的人机协作流程？', score: 1 },
      { text: '用户是否能理解 AI 的能力边界？', score: 1 },
      { text: 'AI 出错时是否有优雅的兜底方案？', score: 1 },
    ],
  },
  {
    name: '团队组织',
    icon: '👥',
    questions: [
      { text: 'PM 是否具备基本的 AI 技术理解？', score: 1 },
      { text: '产品和算法团队是否有高效的协作机制？', score: 1 },
      { text: '是否有 AI 产品的专属迭代流程？', score: 1 },
      { text: '是否有跨职能的 AI 产品评审机制？', score: 1 },
    ],
  },
  {
    name: '商业闭环',
    icon: '💰',
    questions: [
      { text: '是否能量化 AI 功能的商业价值？', score: 1 },
      { text: '是否建立了数据飞轮（使用→数据→优化→更好体验）？', score: 1 },
      { text: 'AI 能力是否形成了竞争壁垒？', score: 1 },
      { text: '是否有清晰的 AI 产品路线图？', score: 1 },
    ],
  },
])

const scoreLabels = ['未开始', '初步探索', '已实践', '成体系', '行业领先']

const results = computed(() => {
  return dimensions.value.map(d => {
    const total = d.questions.reduce((s, q) => s + Number(q.score), 0)
    const max = d.questions.length * 4
    const pct = Math.round(total / max * 100)
    let level, color
    if (pct >= 80) { level = '领先'; color = '#28a745' }
    else if (pct >= 60) { level = '成熟'; color = '#007bff' }
    else if (pct >= 40) { level = '发展中'; color = '#ffc107' }
    else if (pct >= 20) { level = '起步'; color = '#fd7e14' }
    else { level = '未开始'; color = '#dc3545' }
    return { name: d.name, icon: d.icon, total, max, pct, level, color }
  })
})

const overallScore = computed(() => {
  const total = results.value.reduce((s, r) => s + r.pct, 0)
  return Math.round(total / results.value.length)
})

const overallLevel = computed(() => {
  const s = overallScore.value
  if (s >= 80) return { label: 'L5 AI Native', color: '#28a745', desc: '恭喜！你的 AI 产品已达到行业领先水平' }
  if (s >= 60) return { label: 'L4 AI 驱动', color: '#007bff', desc: 'AI 已融入核心产品，持续优化中' }
  if (s >= 40) return { label: 'L3 AI 增强', color: '#ffc107', desc: 'AI 功能已上线，但体系化不足' }
  if (s >= 20) return { label: 'L2 AI 探索', color: '#fd7e14', desc: '正在尝试引入 AI，需加速建设' }
  return { label: 'L1 传统模式', color: '#dc3545', desc: '尚未开始 AI 转型，建议尽快行动' }
})
</script>

<div class="pm-tool">

### 逐维度评估

<div class="desc" style="margin-bottom:1rem;">对每项打分：0=未开始 1=初步探索 2=已实践 3=成体系 4=行业领先</div>

<div v-for="(d, di) in dimensions" :key="di" style="margin-bottom:1.5rem;padding:1rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:8px;">
  <div style="font-weight:700;font-size:1rem;margin-bottom:0.5rem;">{{ d.icon }} {{ d.name }}</div>

  <div v-for="(q, qi) in d.questions" :key="qi" style="padding:0.4rem 0;border-bottom:1px solid var(--vp-c-border);">
    <div style="font-size:0.9rem;margin-bottom:0.3rem;">{{ q.text }}</div>
    <div class="pm-radio-group" style="gap:0.3rem;">
      <div v-for="n in 5" :key="n" class="pm-radio-btn" :class="{ active: q.score === n - 1 }" @click="q.score = n - 1" style="padding:0.2rem 0.5rem;font-size:0.75rem;">
        {{ n - 1 }}
      </div>
    </div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">成熟度评估结果</div>

<div style="text-align:center;margin:1.5rem 0;">
  <div style="font-size:3rem;font-weight:800;" :style="{ color: overallLevel.color }">{{ overallScore }}%</div>
  <div style="font-size:1.2rem;font-weight:700;margin:0.3rem 0;" :style="{ color: overallLevel.color }">{{ overallLevel.label }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">{{ overallLevel.desc }}</div>
</div>

<div class="pm-divider"></div>

<div v-for="r in results" :key="r.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem;">
    <span style="font-weight:600;">{{ r.icon }} {{ r.name }}</span>
    <span class="pm-tag" :style="{ background: r.color + '22', color: r.color }">{{ r.level }} {{ r.pct }}%</span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill" :class="r.pct >= 60 ? 'pm-bar-green' : r.pct >= 40 ? 'pm-bar-yellow' : 'pm-bar-red'" :style="{ width: r.pct + '%' }"></div>
  </div>
</div>

</div>

## 成熟度阶梯

| 等级 | 名称 | 特征 |
|------|------|------|
| **L5** | AI Native | AI 是核心竞争力，数据飞轮高速运转 |
| **L4** | AI 驱动 | AI 融入核心流程，有系统的评估和迭代 |
| **L3** | AI 增强 | 有 AI 功能上线，但缺乏体系化管理 |
| **L2** | AI 探索 | 正在 POC，团队在学习中 |
| **L1** | 传统模式 | 尚未引入 AI 能力 |
