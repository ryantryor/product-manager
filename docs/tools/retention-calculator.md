# 留存率计算器

> 输入各时段回访数据，生成留存曲线，判断产品健康度。

<script setup>
import { ref, computed } from 'vue'

const cohortSize = ref(10000)
const period = ref('日')
const retentionData = ref([
  { day: 1, users: 4000 },
  { day: 2, users: 2800 },
  { day: 3, users: 2200 },
  { day: 7, users: 1500 },
  { day: 14, users: 1100 },
  { day: 30, users: 800 },
  { day: 60, users: 600 },
  { day: 90, users: 500 },
])

function addRow() {
  const lastDay = retentionData.value.length > 0 ? retentionData.value[retentionData.value.length - 1].day + 30 : 1
  const lastUsers = retentionData.value.length > 0 ? Math.round(retentionData.value[retentionData.value.length - 1].users * 0.8) : 5000
  retentionData.value.push({ day: lastDay, users: lastUsers })
}

function removeRow(i) {
  if (retentionData.value.length > 2) retentionData.value.splice(i, 1)
}

const analysis = computed(() => {
  const base = Number(cohortSize.value)
  return retentionData.value.map((d, i) => {
    const rate = (Number(d.users) / base * 100)
    const prevRate = i > 0 ? (Number(retentionData.value[i-1].users) / base * 100) : 100
    const dropFromPrev = prevRate - rate
    return {
      day: d.day,
      users: Number(d.users),
      rate: rate.toFixed(1),
      dropFromPrev: dropFromPrev.toFixed(1),
    }
  })
})

const d1Retention = computed(() => {
  const d1 = retentionData.value.find(d => d.day === 1)
  return d1 ? (Number(d1.users) / Number(cohortSize.value) * 100).toFixed(1) : '-'
})

const d7Retention = computed(() => {
  const d7 = retentionData.value.find(d => d.day === 7)
  return d7 ? (Number(d7.users) / Number(cohortSize.value) * 100).toFixed(1) : '-'
})

const d30Retention = computed(() => {
  const d30 = retentionData.value.find(d => d.day === 30)
  return d30 ? (Number(d30.users) / Number(cohortSize.value) * 100).toFixed(1) : '-'
})

const healthGrade = computed(() => {
  const d1 = Number(d1Retention.value)
  if (d1 >= 60) return { label: '优秀', color: '#28a745' }
  if (d1 >= 40) return { label: '良好', color: '#007bff' }
  if (d1 >= 25) return { label: '一般', color: '#ffc107' }
  return { label: '需改进', color: '#dc3545' }
})

// SVG chart dimensions
const chartW = 500
const chartH = 200
const padding = 40

const chartPoints = computed(() => {
  const base = Number(cohortSize.value)
  const maxDay = Math.max(...retentionData.value.map(d => d.day), 1)
  const points = retentionData.value.map(d => {
    const x = padding + (d.day / maxDay) * (chartW - padding * 2)
    const y = padding + (1 - Number(d.users) / base) * (chartH - padding * 2)
    return { x, y, day: d.day, rate: (Number(d.users) / base * 100).toFixed(1) }
  })
  // Add starting point
  return [{ x: padding, y: padding, day: 0, rate: '100.0' }, ...points]
})

const chartPath = computed(() => {
  return chartPoints.value.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ')
})

const chartArea = computed(() => {
  const bottom = chartH - padding
  const first = chartPoints.value[0]
  const last = chartPoints.value[chartPoints.value.length - 1]
  return chartPath.value + ' L' + last.x + ',' + bottom + ' L' + first.x + ',' + bottom + ' Z'
})
</script>

<div class="pm-tool">

### 基础设置

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>初始用户数（Cohort Size）</label>
  <input class="pm-input" type="number" v-model="cohortSize" min="1">
</div>
<div class="pm-input-group">
  <label>时间维度</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: period === '日' }" @click="period = '日'">日留存</div>
    <div class="pm-radio-btn" :class="{ active: period === '周' }" @click="period = '周'">周留存</div>
    <div class="pm-radio-btn" :class="{ active: period === '月' }" @click="period = '月'">月留存</div>
  </div>
</div>
</div>

### 留存数据

<table class="pm-table">
  <thead>
    <tr>
      <th>第 N {{ period }}</th>
      <th>回访用户数</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(d, i) in retentionData" :key="i">
      <td><input class="pm-input" type="number" v-model="d.day" min="1" style="width:80px;text-align:center;border:none;background:transparent;"></td>
      <td><input class="pm-input" type="number" v-model="d.users" min="0" style="text-align:center;"></td>
      <td><button v-if="retentionData.length > 2" class="pm-btn pm-btn-secondary" @click="removeRow(i)" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button></td>
    </tr>
  </tbody>
</table>

<button class="pm-btn pm-btn-secondary" @click="addRow" style="margin-top:0.5rem;">+ 添加时间点</button>

</div>

<div class="pm-result">
<div class="pm-result-title">留存曲线</div>

<div style="text-align:center;overflow:auto;">
<svg :width="chartW" :height="chartH" :viewBox="'0 0 ' + chartW + ' ' + chartH">
  <line :x1="padding" :y1="padding" :x2="padding" :y2="chartH - padding" stroke="var(--vp-c-border)" stroke-width="1"/>
  <line :x1="padding" :y1="chartH - padding" :x2="chartW - padding" :y2="chartH - padding" stroke="var(--vp-c-border)" stroke-width="1"/>
  <line v-for="pct in [25, 50, 75]" :key="pct" :x1="padding" :y1="padding + (1 - pct/100) * (chartH - padding*2)" :x2="chartW - padding" :y2="padding + (1 - pct/100) * (chartH - padding*2)" stroke="var(--vp-c-border)" stroke-width="0.5" stroke-dasharray="4"/>
  <text v-for="pct in [0, 25, 50, 75, 100]" :key="'t'+pct" :x="padding - 5" :y="padding + (1 - pct/100) * (chartH - padding*2) + 4" text-anchor="end" font-size="10" fill="var(--vp-c-text-3)">{{ pct }}%</text>
  <path :d="chartArea" fill="url(#retGrad)" opacity="0.3"/>
  <path :d="chartPath" fill="none" stroke="#007bff" stroke-width="2.5"/>
  <circle v-for="p in chartPoints" :key="p.day" :cx="p.x" :cy="p.y" r="4" fill="#007bff"/>
  <text v-for="p in chartPoints.slice(1)" :key="'l'+p.day" :x="p.x" :y="p.y - 10" text-anchor="middle" font-size="9" fill="var(--vp-c-text-2)">{{ p.rate }}%</text>
  <defs>
    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#007bff"/>
      <stop offset="100%" stop-color="#007bff" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>
</div>

<div class="pm-divider"></div>

<div class="pm-tool-grid" style="text-align:center;margin:1rem 0;">
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">次{{ period }}留存</div>
    <div style="font-size:1.8rem;font-weight:800;" :style="{ color: healthGrade.color }">{{ d1Retention }}%</div>
    <span class="pm-tag" :style="{ background: healthGrade.color + '22', color: healthGrade.color }">{{ healthGrade.label }}</span>
  </div>
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">7{{ period }}留存</div>
    <div style="font-size:1.8rem;font-weight:800;">{{ d7Retention }}%</div>
  </div>
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">30{{ period }}留存</div>
    <div style="font-size:1.8rem;font-weight:800;">{{ d30Retention }}%</div>
  </div>
</div>

<div class="pm-divider"></div>
<div class="pm-result-title">详细数据</div>

<table class="pm-table">
  <thead>
    <tr><th>时间点</th><th>回访用户</th><th>留存率</th><th>环比流失</th></tr>
  </thead>
  <tbody>
    <tr v-for="a in analysis" :key="a.day">
      <td style="font-weight:600;">第 {{ a.day }} {{ period }}</td>
      <td>{{ a.users.toLocaleString() }}</td>
      <td :style="{ color: Number(a.rate) >= 30 ? '#28a745' : Number(a.rate) >= 15 ? '#ffc107' : '#dc3545', fontWeight: 600 }">{{ a.rate }}%</td>
      <td style="color:#dc3545;">-{{ a.dropFromPrev }}%</td>
    </tr>
  </tbody>
</table>
</div>

## 行业留存基准

| 产品类型 | 次日留存 | 7日留存 | 30日留存 |
|---------|---------|--------|---------|
| **社交** | 50-65% | 30-45% | 20-35% |
| **电商** | 25-35% | 15-25% | 10-20% |
| **工具** | 35-50% | 20-35% | 15-25% |
| **游戏** | 35-50% | 15-25% | 5-15% |
| **SaaS** | 80-95% | 70-85% | 60-80% |
