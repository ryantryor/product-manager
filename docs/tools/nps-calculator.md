# NPS 计算器

> 净推荐值（Net Promoter Score）计算与行业基准对比。

<script setup>
import { ref, computed } from 'vue'

const scores = ref([0, 0, 0, 0, 0, 0, 5, 10, 25, 35, 25])

const results = computed(() => {
  const total = scores.value.reduce((sum, v) => sum + Number(v), 0)
  if (total === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0, total: 0, grade: '-', gradeColor: '#6c757d' }

  const detractors = scores.value.slice(0, 7).reduce((sum, v) => sum + Number(v), 0)
  const passives = scores.value.slice(7, 9).reduce((sum, v) => sum + Number(v), 0)
  const promoters = scores.value.slice(9, 11).reduce((sum, v) => sum + Number(v), 0)

  const detractorPct = detractors / total * 100
  const passivePct = passives / total * 100
  const promoterPct = promoters / total * 100
  const nps = Math.round(promoterPct - detractorPct)

  let grade, gradeColor
  if (nps >= 70) { grade = '卓越'; gradeColor = '#28a745' }
  else if (nps >= 50) { grade = '优秀'; gradeColor = '#20c997' }
  else if (nps >= 30) { grade = '良好'; gradeColor = '#007bff' }
  else if (nps >= 0) { grade = '需改进'; gradeColor = '#ffc107' }
  else { grade = '危险'; gradeColor = '#dc3545' }

  return {
    nps,
    promoters: promoterPct.toFixed(1),
    passives: passivePct.toFixed(1),
    detractors: detractorPct.toFixed(1),
    total,
    grade,
    gradeColor,
  }
})
</script>

<div class="pm-tool">

### 输入各评分人数

<div class="desc" style="margin-bottom:1rem;">请输入每个评分（0-10 分）的回答人数</div>

<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
  <div v-for="(_, i) in scores" :key="i" style="text-align:center;">
    <div style="font-size:0.75rem;font-weight:600;margin-bottom:0.2rem;" :style="{ color: i <= 6 ? '#dc3545' : i <= 8 ? '#ffc107' : '#28a745' }">{{ i }}分</div>
    <input class="pm-input" type="number" v-model="scores[i]" min="0" style="width:60px;text-align:center;">
    <div style="font-size:0.7rem;color:var(--vp-c-text-3);">{{ i <= 6 ? '贬损' : i <= 8 ? '中立' : '推荐' }}</div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">NPS 结果</div>

<div style="text-align:center;margin:1rem 0;">
  <div style="font-size:3rem;font-weight:800;" :style="{ color: results.gradeColor }">{{ results.nps }}</div>
  <span class="pm-tag" :style="{ background: results.gradeColor + '22', color: results.gradeColor }">{{ results.grade }}</span>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-top:0.5rem;">总回复：{{ results.total }} 人</div>
</div>

<div style="display:flex;height:32px;border-radius:16px;overflow:hidden;margin:1rem 0;">
  <div :style="{ width: results.detractors + '%', background: '#dc3545' }" style="display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:600;">
    {{ results.detractors > 5 ? results.detractors + '%' : '' }}
  </div>
  <div :style="{ width: results.passives + '%', background: '#ffc107' }" style="display:flex;align-items:center;justify-content:center;color:#333;font-size:0.75rem;font-weight:600;">
    {{ results.passives > 5 ? results.passives + '%' : '' }}
  </div>
  <div :style="{ width: results.promoters + '%', background: '#28a745' }" style="display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:600;">
    {{ results.promoters > 5 ? results.promoters + '%' : '' }}
  </div>
</div>

<div style="display:flex;justify-content:space-between;font-size:0.8rem;">
  <span style="color:#dc3545;">贬损者 {{ results.detractors }}%</span>
  <span style="color:#856404;">中立者 {{ results.passives }}%</span>
  <span style="color:#28a745;">推荐者 {{ results.promoters }}%</span>
</div>

</div>

## 行业 NPS 基准

| 行业 | 平均 NPS | 优秀线 |
|------|---------|-------|
| **SaaS** | 30-40 | 50+ |
| **电商** | 35-45 | 55+ |
| **金融科技** | 25-35 | 45+ |
| **社交媒体** | 10-20 | 35+ |
| **电信运营商** | 0-15 | 25+ |

**NPS = 推荐者比例 - 贬损者比例**（范围 -100 到 +100）
