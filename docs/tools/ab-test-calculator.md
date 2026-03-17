# A/B 测试样本量计算器

> 在跑实验之前，先算清楚需要多少样本量和多长时间。

<script setup>
import { ref, computed } from 'vue'

const baselineRate = ref(5)
const mde = ref(10)
const significance = ref(95)
const power = ref(80)
const dailyTraffic = ref(10000)
const splitRatio = ref(50)

function getZScore(confidence) {
  const z = { 90: 1.645, 95: 1.96, 99: 2.576 }
  return z[confidence] || 1.96
}

function getZBeta(power) {
  const z = { 80: 0.842, 85: 1.036, 90: 1.282, 95: 1.645 }
  return z[power] || 0.842
}

const results = computed(() => {
  const p = Number(baselineRate.value) / 100
  const mdeAbs = p * (Number(mde.value) / 100)
  const zAlpha = getZScore(Number(significance.value))
  const zBeta = getZBeta(Number(power.value))
  const newRate = p + mdeAbs

  const n = Math.ceil(
    (Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) + zBeta * Math.sqrt(p * (1 - p) + newRate * (1 - newRate)), 2))
    / Math.pow(mdeAbs, 2)
  )

  const totalSample = n * 2
  const ratio = Number(splitRatio.value) / 100
  const dailyExperiment = Number(dailyTraffic.value) * ratio
  const daysNeeded = Math.ceil(totalSample / dailyExperiment)

  return {
    samplePerGroup: n.toLocaleString(),
    totalSample: totalSample.toLocaleString(),
    daysNeeded,
    weeksNeeded: (daysNeeded / 7).toFixed(1),
    expectedNewRate: (newRate * 100).toFixed(2),
    absoluteDiff: (mdeAbs * 100).toFixed(3),
  }
})
</script>

<div class="pm-tool">

### 实验参数

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>基线转化率（%）</label>
  <div class="desc">当前版本的转化率</div>
  <input class="pm-input" type="number" v-model="baselineRate" min="0.1" max="100" step="0.1">
</div>
<div class="pm-input-group">
  <label>最小可检测提升（MDE %）</label>
  <div class="desc">希望检测到的最小相对提升</div>
  <input class="pm-input" type="number" v-model="mde" min="1" max="100" step="1">
</div>
<div class="pm-input-group">
  <label>统计显著性</label>
  <select class="pm-select" v-model="significance">
    <option :value="90">90%（宽松）</option>
    <option :value="95">95%（标准）</option>
    <option :value="99">99%（严格）</option>
  </select>
</div>
<div class="pm-input-group">
  <label>统计功效（Power）</label>
  <select class="pm-select" v-model="power">
    <option :value="80">80%（标准）</option>
    <option :value="85">85%</option>
    <option :value="90">90%（推荐）</option>
    <option :value="95">95%（严格）</option>
  </select>
</div>
<div class="pm-input-group">
  <label>日均流量</label>
  <input class="pm-input" type="number" v-model="dailyTraffic" min="100">
</div>
<div class="pm-input-group">
  <label>实验分流比例（%）</label>
  <div class="desc">总流量中参与实验的比例</div>
  <input class="pm-slider" type="range" v-model="splitRatio" min="10" max="100" step="10">
  <span style="font-weight:600;">{{ splitRatio }}%</span>
</div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">实验方案</div>

<div class="pm-tool-grid" style="text-align:center;margin-bottom:1rem;">
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">每组所需样本</div>
  <div style="font-size:1.8rem;font-weight:800;">{{ results.samplePerGroup }}</div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">总样本量</div>
  <div style="font-size:1.8rem;font-weight:800;">{{ results.totalSample }}</div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">预计运行天数</div>
  <div style="font-size:1.8rem;font-weight:800;" :style="{ color: results.daysNeeded > 30 ? '#dc3545' : '#28a745' }">{{ results.daysNeeded }}<span class="pm-result-unit">天</span></div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">约</div>
  <div style="font-size:1.8rem;font-weight:800;">{{ results.weeksNeeded }}<span class="pm-result-unit">周</span></div>
</div>
</div>

<div class="pm-divider"></div>

<div class="pm-result-row">
  <span class="pm-result-label">基线转化率</span>
  <span class="pm-result-data">{{ baselineRate }}%</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">期望新转化率</span>
  <span class="pm-result-data" style="color:#28a745;">{{ results.expectedNewRate }}%</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">绝对差异</span>
  <span class="pm-result-data">{{ results.absoluteDiff }} 个百分点</span>
</div>
</div>

## 注意事项

::: warning 常见误区
- **过早结束实验**：看到显著就停止，会导致假阳性率飙升
- **样本量不足**：样本不够会导致无法检测到真实差异
- **多重比较**：同时测试多个指标需要做校正（Bonferroni）
- **新奇效应**：至少运行 1-2 个完整周期，排除新鲜感
:::
