# LTV 与单位经济模型

> 计算用户生命周期价值和盈亏平衡点，验证商业模式是否成立。

<script setup>
import { ref, computed } from 'vue'

const arpu = ref(99)
const grossMargin = ref(70)
const monthlyChurn = ref(5)
const cac = ref(300)
const monthlyGrowth = ref(10)
const currentUsers = ref(1000)

const results = computed(() => {
  const margin = Number(grossMargin.value) / 100
  const churn = Number(monthlyChurn.value) / 100
  const avgLifeMonths = churn > 0 ? 1 / churn : 999
  const ltv = Number(arpu.value) * margin * avgLifeMonths
  const ltvCacRatio = ltv / Number(cac.value)
  const cacPaybackMonths = Number(cac.value) / (Number(arpu.value) * margin)
  const monthlyRevPerUser = Number(arpu.value) * margin
  const annualRev = Number(currentUsers.value) * Number(arpu.value) * 12
  const annualGrossProfit = annualRev * margin

  let health = ''
  let healthColor = ''
  if (ltvCacRatio >= 3) { health = '健康'; healthColor = '#28a745' }
  else if (ltvCacRatio >= 1) { health = '需关注'; healthColor = '#ffc107' }
  else { health = '危险'; healthColor = '#dc3545' }

  let paybackHealth = ''
  let paybackColor = ''
  if (cacPaybackMonths <= 6) { paybackHealth = '优秀'; paybackColor = '#28a745' }
  else if (cacPaybackMonths <= 12) { paybackHealth = '合理'; paybackColor = '#ffc107' }
  else { paybackHealth = '过长'; paybackColor = '#dc3545' }

  return {
    avgLifeMonths: avgLifeMonths.toFixed(1),
    ltv: ltv.toFixed(0),
    ltvCacRatio: ltvCacRatio.toFixed(1),
    cacPaybackMonths: cacPaybackMonths.toFixed(1),
    monthlyRevPerUser: monthlyRevPerUser.toFixed(0),
    annualRev: annualRev.toLocaleString(),
    annualGrossProfit: annualGrossProfit.toLocaleString(),
    health,
    healthColor,
    paybackHealth,
    paybackColor,
  }
})
</script>

<div class="pm-tool">

### 核心参数

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>月均 ARPU（元）</label>
  <div class="desc">每用户每月平均收入</div>
  <input class="pm-input" type="number" v-model="arpu" min="1">
</div>
<div class="pm-input-group">
  <label>毛利率（%）</label>
  <input class="pm-slider" type="range" v-model="grossMargin" min="10" max="95" step="5">
  <span style="font-weight:600;">{{ grossMargin }}%</span>
</div>
<div class="pm-input-group">
  <label>月流失率（%）</label>
  <div class="desc">每月流失的用户比例</div>
  <input class="pm-input" type="number" v-model="monthlyChurn" min="0.1" max="100" step="0.5">
</div>
<div class="pm-input-group">
  <label>获客成本 CAC（元）</label>
  <div class="desc">获取一个新用户的成本</div>
  <input class="pm-input" type="number" v-model="cac" min="0">
</div>
<div class="pm-input-group">
  <label>当前用户数</label>
  <input class="pm-input" type="number" v-model="currentUsers" min="1">
</div>
<div class="pm-input-group">
  <label>月增长率（%）</label>
  <input class="pm-input" type="number" v-model="monthlyGrowth" min="0" step="1">
</div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">单位经济分析</div>

<div class="pm-tool-grid" style="text-align:center;margin-bottom:1rem;">
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">用户生命周期</div>
  <div style="font-size:1.8rem;font-weight:800;">{{ results.avgLifeMonths }}<span class="pm-result-unit">个月</span></div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">LTV（生命周期价值）</div>
  <div style="font-size:1.8rem;font-weight:800;">¥{{ results.ltv }}</div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">LTV/CAC 比率</div>
  <div style="font-size:1.8rem;font-weight:800;" :style="{ color: results.healthColor }">
    {{ results.ltvCacRatio }}x
  </div>
  <span class="pm-tag" :class="results.health === '健康' ? 'pm-tag-green' : results.health === '需关注' ? 'pm-tag-yellow' : 'pm-tag-red'">{{ results.health }}</span>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">CAC 回本周期</div>
  <div style="font-size:1.8rem;font-weight:800;" :style="{ color: results.paybackColor }">
    {{ results.cacPaybackMonths }}<span class="pm-result-unit">个月</span>
  </div>
  <span class="pm-tag" :class="results.paybackHealth === '优秀' ? 'pm-tag-green' : results.paybackHealth === '合理' ? 'pm-tag-yellow' : 'pm-tag-red'">{{ results.paybackHealth }}</span>
</div>
</div>

<div class="pm-divider"></div>

<div class="pm-result-row">
  <span class="pm-result-label">每用户月度毛利</span>
  <span class="pm-result-data">¥{{ results.monthlyRevPerUser }}</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">年度总收入（当前用户）</span>
  <span class="pm-result-data">¥{{ results.annualRev }}</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">年度毛利润</span>
  <span class="pm-result-data" style="color:#28a745;">¥{{ results.annualGrossProfit }}</span>
</div>
</div>

## 健康基准

| 指标 | 危险 | 需关注 | 健康 |
|------|------|--------|------|
| **LTV/CAC** | < 1x | 1-3x | > 3x |
| **CAC 回本周期** | > 12 月 | 6-12 月 | < 6 月 |
| **月流失率（SaaS）** | > 8% | 3-8% | < 3% |
| **毛利率（SaaS）** | < 50% | 50-70% | > 70% |
