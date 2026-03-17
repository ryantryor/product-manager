# 定价策略模拟器

> 模拟不同定价对收入的影响，找到最优价格点。

<script setup>
import { ref, computed } from 'vue'

const baseCost = ref(50)
const competitorPrice = ref(199)
const elasticity = ref(1.5)
const baseUsers = ref(10000)
const strategy = ref('value')

const pricePoints = computed(() => {
  const points = []
  const base = Number(competitorPrice.value)
  const e = Number(elasticity.value)
  const users = Number(baseUsers.value)
  const cost = Number(baseCost.value)

  for (let pct = 40; pct <= 200; pct += 10) {
    const price = Math.round(base * pct / 100)
    const priceDiff = (price - base) / base
    const demandMultiplier = Math.pow(1 - priceDiff, e)
    const demand = Math.max(Math.round(users * demandMultiplier), 0)
    const revenue = price * demand
    const profit = (price - cost) * demand
    const margin = price > 0 ? ((price - cost) / price * 100) : 0

    points.push({
      price,
      pct,
      demand: demand.toLocaleString(),
      revenue: revenue.toLocaleString(),
      profit: profit.toLocaleString(),
      profitNum: profit,
      revenueNum: revenue,
      margin: margin.toFixed(0),
    })
  }
  return points
})

const maxProfit = computed(() => Math.max(...pricePoints.value.map(p => p.profitNum), 1))
const maxRevenue = computed(() => Math.max(...pricePoints.value.map(p => p.revenueNum), 1))
const optimalPrice = computed(() => pricePoints.value.reduce((best, p) => p.profitNum > best.profitNum ? p : best))

const strategies = {
  penetration: { name: '渗透定价', desc: '低价快速获客，适合新市场', factor: 0.6 },
  value: { name: '价值定价', desc: '基于用户感知价值，利润最优', factor: 1 },
  premium: { name: '高端定价', desc: '高价高利润，适合差异化产品', factor: 1.3 },
  freemium: { name: 'Freemium', desc: '基础免费+高级付费', factor: 0.8 },
}
</script>

<div class="pm-tool">

### 基础参数

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>单位成本（元）</label>
  <div class="desc">包含推理成本、基础设施等</div>
  <input class="pm-input" type="number" v-model="baseCost" min="0">
</div>
<div class="pm-input-group">
  <label>竞品/参考定价（元）</label>
  <input class="pm-input" type="number" v-model="competitorPrice" min="1">
</div>
<div class="pm-input-group">
  <label>价格弹性系数</label>
  <div class="desc">越高表示价格变动对需求影响越大</div>
  <input class="pm-slider" type="range" v-model="elasticity" min="0.5" max="3" step="0.1">
  <span style="font-weight:600;">{{ elasticity }}</span>
</div>
<div class="pm-input-group">
  <label>参考价下的预期用户数</label>
  <input class="pm-input" type="number" v-model="baseUsers" min="100">
</div>
</div>

<div class="pm-divider"></div>

### 定价策略

<div class="pm-radio-group">
  <div v-for="(s, k) in strategies" :key="k" class="pm-radio-btn" :class="{ active: strategy === k }" @click="strategy = k">
    {{ s.name }}
  </div>
</div>
<div style="font-size:0.85rem;color:var(--vp-c-text-3);margin-top:0.5rem;">{{ strategies[strategy].desc }}</div>

</div>

<div class="pm-result">
<div class="pm-result-title">最优价格点</div>

<div style="text-align:center;margin:1rem 0;">
  <div style="font-size:2.5rem;font-weight:800;color:#28a745;">¥{{ optimalPrice.price }}</div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">最大利润 ¥{{ optimalPrice.profit }}，毛利率 {{ optimalPrice.margin }}%</div>
</div>

<div class="pm-divider"></div>
<div class="pm-result-title">价格-利润模拟</div>

<div style="overflow-x:auto;">
<table class="pm-table" style="font-size:0.85rem;">
  <thead>
    <tr>
      <th>定价</th>
      <th>vs 竞品</th>
      <th>预估用户</th>
      <th>收入</th>
      <th>利润</th>
      <th>利润占比</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="p in pricePoints" :key="p.price" :style="p.price === optimalPrice.price ? { background: '#d4edda' } : {}">
      <td style="font-weight:600;">¥{{ p.price }}</td>
      <td>{{ p.pct }}%</td>
      <td>{{ p.demand }}</td>
      <td>¥{{ p.revenue }}</td>
      <td style="font-weight:600;">¥{{ p.profit }}</td>
      <td>
        <div class="pm-bar" style="height:16px;min-width:80px;">
          <div class="pm-bar-fill pm-bar-green" :style="{ width: Math.max(p.profitNum / maxProfit * 100, 0) + '%', height: '100%' }"></div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</div>

</div>

## 定价策略对照表

| 策略 | 适用场景 | AI 产品案例 |
|------|---------|------------|
| **渗透定价** | 新市场，需快速获客 | ChatGPT Free |
| **价值定价** | 有明确 ROI | GitHub Copilot |
| **高端定价** | 企业级，强差异化 | OpenAI API |
| **Freemium** | 高转化漏斗 | Notion AI |
