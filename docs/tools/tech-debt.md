# 技术债评估器

> 评估和量化技术债，生成偿还优先级和计划。

<script setup>
import { ref, computed } from 'vue'

const debts = ref([
  { name: '旧版 API 未迁移', impact: 3, effort: 2, risk: 4, frequency: 3 },
  { name: '测试覆盖率低（<30%）', impact: 4, effort: 3, risk: 5, frequency: 5 },
  { name: '前端框架过旧', impact: 3, effort: 4, risk: 3, frequency: 2 },
  { name: '数据库查询未优化', impact: 5, effort: 2, risk: 4, frequency: 4 },
  { name: '代码重复率高', impact: 2, effort: 3, risk: 2, frequency: 3 },
])

const newName = ref('')

function addDebt() {
  const n = newName.value.trim() || '技术债 ' + (debts.value.length + 1)
  debts.value.push({ name: n, impact: 3, effort: 3, risk: 3, frequency: 3 })
  newName.value = ''
}

function removeDebt(i) { debts.value.splice(i, 1) }

const ranked = computed(() => {
  return debts.value.map(d => {
    const urgency = (Number(d.impact) * 0.3 + Number(d.risk) * 0.3 + Number(d.frequency) * 0.2) / Number(d.effort) * 10
    const totalScore = (Number(d.impact) + Number(d.risk) + Number(d.frequency)) * 10 / 3
    let priority, color, action
    if (urgency >= 6) { priority = '立即修复'; color = '#dc3545'; action = '本 Sprint 安排' }
    else if (urgency >= 4) { priority = '尽快处理'; color = '#fd7e14'; action = '下 1-2 个 Sprint' }
    else if (urgency >= 2.5) { priority = '计划偿还'; color = '#ffc107'; action = '排入路线图' }
    else { priority = '持续关注'; color = '#28a745'; action = '定期评估' }
    return { ...d, urgency: urgency.toFixed(1), totalScore: totalScore.toFixed(0), priority, color, action }
  }).sort((a, b) => Number(b.urgency) - Number(a.urgency))
})

const maxUrgency = computed(() => Math.max(...ranked.value.map(r => Number(r.urgency)), 1))

const totalEffort = computed(() => debts.value.reduce((s, d) => s + Number(d.effort), 0))

const summary = computed(() => {
  const critical = ranked.value.filter(r => Number(r.urgency) >= 6).length
  const high = ranked.value.filter(r => Number(r.urgency) >= 4 && Number(r.urgency) < 6).length
  const medium = ranked.value.filter(r => Number(r.urgency) >= 2.5 && Number(r.urgency) < 4).length
  const low = ranked.value.filter(r => Number(r.urgency) < 2.5).length
  const avgScore = ranked.value.reduce((s, r) => s + Number(r.totalScore), 0) / (ranked.value.length || 1)

  let health, healthColor
  if (avgScore <= 30) { health = '健康'; healthColor = '#28a745' }
  else if (avgScore <= 50) { health = '可控'; healthColor = '#ffc107' }
  else if (avgScore <= 70) { health = '需关注'; healthColor = '#fd7e14' }
  else { health = '危险'; healthColor = '#dc3545' }

  return { critical, high, medium, low, avgScore: avgScore.toFixed(0), health, healthColor }
})
</script>

<div class="pm-tool">

### 添加技术债

<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
  <input class="pm-input" v-model="newName" placeholder="描述技术债..." @keyup.enter="addDebt" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addDebt">添加</button>
</div>

### 逐项评估

<div class="desc" style="margin-bottom:0.5rem;">对每项打分 1-5：1=很低 3=中等 5=很高</div>

<div v-for="(d, i) in debts" :key="i" style="padding:0.8rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:8px;margin-bottom:0.5rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
    <input class="pm-input" v-model="d.name" style="font-weight:700;border:none;padding:0;background:transparent;flex:1;">
    <button class="pm-btn pm-btn-secondary" @click="removeDebt(i)" style="font-size:0.8rem;padding:0.2rem 0.5rem;">×</button>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;">
    <div style="flex:1;min-width:100px;">
      <label style="font-size:0.8rem;color:var(--vp-c-text-3);">业务影响</label>
      <input class="pm-slider" type="range" v-model="d.impact" min="1" max="5" step="1">
      <span style="font-size:0.8rem;font-weight:600;">{{ d.impact }}</span>
    </div>
    <div style="flex:1;min-width:100px;">
      <label style="font-size:0.8rem;color:var(--vp-c-text-3);">修复成本</label>
      <input class="pm-slider" type="range" v-model="d.effort" min="1" max="5" step="1">
      <span style="font-size:0.8rem;font-weight:600;">{{ d.effort }}</span>
    </div>
    <div style="flex:1;min-width:100px;">
      <label style="font-size:0.8rem;color:var(--vp-c-text-3);">恶化风险</label>
      <input class="pm-slider" type="range" v-model="d.risk" min="1" max="5" step="1">
      <span style="font-size:0.8rem;font-weight:600;">{{ d.risk }}</span>
    </div>
    <div style="flex:1;min-width:100px;">
      <label style="font-size:0.8rem;color:var(--vp-c-text-3);">影响频率</label>
      <input class="pm-slider" type="range" v-model="d.frequency" min="1" max="5" step="1">
      <span style="font-size:0.8rem;font-weight:600;">{{ d.frequency }}</span>
    </div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">技术债健康度</div>

<div style="text-align:center;margin:1rem 0;">
  <div style="font-size:2rem;font-weight:800;" :style="{ color: summary.healthColor }">{{ summary.health }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">平均严重度 {{ summary.avgScore }}/100</div>
</div>

<div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:1rem;">
  <div style="text-align:center;">
    <div style="font-size:1.2rem;font-weight:700;color:#dc3545;">{{ summary.critical }}</div>
    <div style="font-size:0.75rem;color:var(--vp-c-text-3);">立即修复</div>
  </div>
  <div style="text-align:center;">
    <div style="font-size:1.2rem;font-weight:700;color:#fd7e14;">{{ summary.high }}</div>
    <div style="font-size:0.75rem;color:var(--vp-c-text-3);">尽快处理</div>
  </div>
  <div style="text-align:center;">
    <div style="font-size:1.2rem;font-weight:700;color:#ffc107;">{{ summary.medium }}</div>
    <div style="font-size:0.75rem;color:var(--vp-c-text-3);">计划偿还</div>
  </div>
  <div style="text-align:center;">
    <div style="font-size:1.2rem;font-weight:700;color:#28a745;">{{ summary.low }}</div>
    <div style="font-size:0.75rem;color:var(--vp-c-text-3);">持续关注</div>
  </div>
</div>

<div class="pm-divider"></div>
<div class="pm-result-title">偿还优先级排名</div>

<div v-for="(r, i) in ranked" :key="r.name" style="margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem;">
    <span>
      <span style="font-weight:700;margin-right:0.3rem;">{{ i + 1 }}.</span>
      <span style="font-weight:600;">{{ r.name }}</span>
    </span>
    <span class="pm-tag" :style="{ background: r.color + '22', color: r.color }">{{ r.priority }}</span>
  </div>
  <div class="pm-bar">
    <div class="pm-bar-fill" :class="Number(r.urgency) >= 6 ? 'pm-bar-red' : Number(r.urgency) >= 4 ? 'pm-bar-yellow' : 'pm-bar-green'" :style="{ width: (Number(r.urgency) / maxUrgency * 100) + '%' }">
      {{ r.urgency }}
    </div>
  </div>
  <div style="font-size:0.8rem;color:var(--vp-c-text-3);">
    建议：{{ r.action }} · 影响:{{ r.impact }} 成本:{{ r.effort }} 风险:{{ r.risk }} 频率:{{ r.frequency }}
  </div>
</div>

</div>

## 技术债管理建议

- **每个 Sprint 预留 15-20%** 的产能用于偿还技术债
- **优先偿还高频+高影响+低成本** 的债务（投入产出比最高）
- **避免积累** — 新增代码要求代码评审，减少新增技术债
- **定期盘点** — 每季度全面评估一次技术债状况
