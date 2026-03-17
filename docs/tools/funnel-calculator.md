# 漏斗转化率分析

> 可视化用户转化漏斗，精准定位流失瓶颈。

<script setup>
import { ref, computed } from 'vue'

const steps = ref([
  { name: '访问首页', count: 10000 },
  { name: '浏览商品', count: 6500 },
  { name: '加入购物车', count: 2000 },
  { name: '开始结算', count: 1200 },
  { name: '完成支付', count: 800 },
])

function addStep() {
  const lastCount = steps.value[steps.value.length - 1]?.count || 100
  steps.value.push({ name: '步骤 ' + (steps.value.length + 1), count: Math.round(lastCount * 0.7) })
}

function removeStep(i) {
  if (steps.value.length > 2) steps.value.splice(i, 1)
}

const analysis = computed(() => {
  const first = Number(steps.value[0]?.count) || 1
  return steps.value.map((s, i) => {
    const count = Number(s.count)
    const prevCount = i > 0 ? Number(steps.value[i-1].count) : count
    const stepRate = i > 0 ? (count / prevCount * 100) : 100
    const overallRate = (count / first * 100)
    const dropoff = i > 0 ? prevCount - count : 0
    const dropoffRate = i > 0 ? (dropoff / prevCount * 100) : 0
    return {
      name: s.name,
      count,
      stepRate: stepRate.toFixed(1),
      overallRate: overallRate.toFixed(1),
      dropoff,
      dropoffRate: dropoffRate.toFixed(1),
      widthPercent: (count / first * 100),
      isBottleneck: i > 0 && dropoffRate > 50,
    }
  })
})

const worstStep = computed(() => {
  let worst = null
  let worstRate = 0
  analysis.value.forEach((a, i) => {
    if (i > 0 && Number(a.dropoffRate) > worstRate) {
      worstRate = Number(a.dropoffRate)
      worst = a
    }
  })
  return worst
})

const colors = ['#007bff', '#28a745', '#fd7e14', '#dc3545', '#6f42c1', '#20c997', '#e83e8c', '#17a2b8']
</script>

<div class="pm-tool">

### 漏斗步骤

<div v-for="(s, i) in steps" :key="i" style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
  <span style="width:2rem;text-align:center;font-weight:600;color:var(--vp-c-text-3);">{{ i + 1 }}</span>
  <input class="pm-input" v-model="s.name" style="flex:1;">
  <input class="pm-input" type="number" v-model="s.count" min="0" style="width:120px;">
  <button v-if="steps.length > 2" class="pm-btn pm-btn-secondary" @click="removeStep(i)" style="font-size:0.8rem;padding:0.3rem 0.6rem;">×</button>
</div>

<button class="pm-btn pm-btn-secondary" @click="addStep" style="margin-top:0.5rem;">+ 添加步骤</button>

</div>

<div class="pm-result">
<div class="pm-result-title">漏斗可视化</div>

<div class="pm-funnel">
  <div v-for="(a, i) in analysis" :key="i" class="pm-funnel-step" :style="{ width: Math.max(a.widthPercent, 15) + '%', background: colors[i % colors.length] }">
    {{ a.name }} · {{ a.count.toLocaleString() }} ({{ a.overallRate }}%)
  </div>
</div>

<div class="pm-divider"></div>
<div class="pm-result-title">转化分析</div>

<table class="pm-table">
  <thead>
    <tr>
      <th>步骤</th>
      <th>人数</th>
      <th>步骤转化率</th>
      <th>流失人数</th>
      <th>流失率</th>
      <th>整体转化率</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(a, i) in analysis" :key="i" :style="a.isBottleneck ? { background: '#fff3cd' } : {}">
      <td style="font-weight:600;">{{ a.isBottleneck ? '⚠️ ' : '' }}{{ a.name }}</td>
      <td>{{ a.count.toLocaleString() }}</td>
      <td>{{ i === 0 ? '-' : a.stepRate + '%' }}</td>
      <td>{{ i === 0 ? '-' : a.dropoff.toLocaleString() }}</td>
      <td :style="{ color: Number(a.dropoffRate) > 50 ? '#dc3545' : 'inherit', fontWeight: Number(a.dropoffRate) > 50 ? '700' : '400' }">{{ i === 0 ? '-' : a.dropoffRate + '%' }}</td>
      <td>{{ a.overallRate }}%</td>
    </tr>
  </tbody>
</table>

<div v-if="worstStep" style="margin-top:1rem;padding:1rem;background:#fff3cd;border-radius:8px;border:1px solid #ffc107;">
  <strong>最大瓶颈：</strong>「{{ worstStep.name }}」流失率 {{ worstStep.dropoffRate }}%，流失 {{ worstStep.dropoff.toLocaleString() }} 人。优先优化此步骤可获得最大收益。
</div>

</div>
