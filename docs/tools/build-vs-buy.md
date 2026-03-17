# Build vs Buy 决策器

> 自研还是买？回答关键问题，量化你的最优选择。

<script setup>
import { ref, computed } from 'vue'

const questions = ref([
  { label: '该功能是否是核心竞争力？', build: 10, buy: 2, answer: 5 },
  { label: '团队是否具备相关技术能力？', build: 8, buy: 3, answer: 5 },
  { label: '市场上有成熟方案吗？', build: 2, buy: 9, answer: 5 },
  { label: '数据安全要求有多高？', build: 8, buy: 3, answer: 5 },
  { label: '需要深度定制吗？', build: 9, buy: 2, answer: 5 },
  { label: '预算是否充裕？', build: 3, buy: 8, answer: 5 },
  { label: '时间是否紧迫？', build: 2, buy: 9, answer: 5 },
  { label: '长期维护成本接受度？', build: 7, buy: 4, answer: 5 },
])

const result = computed(() => {
  let buildScore = 0, buyScore = 0
  questions.value.forEach(q => {
    const w = Number(q.answer) / 10
    buildScore += q.build * w
    buyScore += q.buy * (1 - w)
  })
  const total = buildScore + buyScore
  const buildPct = Math.round(buildScore / total * 100)
  const buyPct = 100 - buildPct

  let recommendation, color, detail
  if (buildPct >= 65) {
    recommendation = '建议自研（Build）'
    color = '#007bff'
    detail = '核心竞争力强，技术可控，长期收益更高'
  } else if (buyPct >= 65) {
    recommendation = '建议外采（Buy）'
    color = '#28a745'
    detail = '市场方案成熟，快速上线更重要'
  } else {
    recommendation = '混合方案（Build + Buy）'
    color = '#fd7e14'
    detail = '核心模块自研，非核心模块外采'
  }

  return { buildPct, buyPct, recommendation, color, detail, buildScore: buildScore.toFixed(0), buyScore: buyScore.toFixed(0) }
})
</script>

<div class="pm-tool">

### 评估维度

<div class="desc" style="margin-bottom:1rem;">拖动滑块：左侧偏向 Build（自研），右侧偏向 Buy（外采）</div>

<div v-for="(q, i) in questions" :key="i" style="margin-bottom:1.2rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
    <label style="font-weight:600;font-size:0.9rem;">{{ q.label }}</label>
  </div>
  <div style="display:flex;align-items:center;gap:0.5rem;">
    <span style="font-size:0.75rem;color:#007bff;white-space:nowrap;">Build</span>
    <input class="pm-slider" type="range" v-model="q.answer" min="0" max="10" step="1">
    <span style="font-size:0.75rem;color:#28a745;white-space:nowrap;">Buy</span>
  </div>
</div>

</div>

<div class="pm-result">
<div style="text-align:center;margin-bottom:1rem;">
  <div style="font-size:1.5rem;font-weight:800;" :style="{ color: result.color }">{{ result.recommendation }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-top:0.3rem;">{{ result.detail }}</div>
</div>

<div style="display:flex;height:40px;border-radius:20px;overflow:hidden;margin:1rem 0;">
  <div :style="{ width: result.buildPct + '%', background: '#007bff' }" style="display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;">
    {{ result.buildPct > 15 ? 'Build ' + result.buildPct + '%' : '' }}
  </div>
  <div :style="{ width: result.buyPct + '%', background: '#28a745' }" style="display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;">
    {{ result.buyPct > 15 ? 'Buy ' + result.buyPct + '%' : '' }}
  </div>
</div>
</div>

## Build vs Buy 决策框架

| 倾向 Build | 倾向 Buy |
|-----------|---------|
| 核心差异化能力 | 非核心功能 |
| 强技术团队 | 市场方案成熟 |
| 高数据安全要求 | 时间紧迫 |
| 需要深度定制 | 预算有限 |
| 长期战略投入 | 快速验证 |
