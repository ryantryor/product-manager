# AI 功能 ROI 计算器

> 量化 AI 功能的投资回报，帮你用数据说服老板。

<script setup>
import { ref, computed } from 'vue'

const humanCount = ref(5)
const humanSalary = ref(15000)
const taskHoursPerDay = ref(6)
const automationRate = ref(70)

const devCost = ref(100000)
const monthlyInfra = ref(5000)
const monthlyToken = ref(3000)
const devMonths = ref(2)

const results = computed(() => {
  const monthlyHumanCost = Number(humanCount.value) * Number(humanSalary.value)
  const savedHumanCost = monthlyHumanCost * (Number(automationRate.value) / 100)
  const monthlyAICost = Number(monthlyInfra.value) + Number(monthlyToken.value)
  const monthlySaving = savedHumanCost - monthlyAICost
  const totalDevCost = Number(devCost.value)
  const breakEvenMonths = monthlySaving > 0 ? (totalDevCost / monthlySaving) : Infinity
  const yearROI = monthlySaving > 0 ? ((monthlySaving * 12 - totalDevCost) / totalDevCost * 100) : -100
  const reducedHeadcount = Number(humanCount.value) * (Number(automationRate.value) / 100)

  return {
    monthlyHumanCost: monthlyHumanCost.toLocaleString(),
    savedHumanCost: savedHumanCost.toLocaleString(),
    monthlyAICost: monthlyAICost.toLocaleString(),
    monthlySaving: monthlySaving.toLocaleString(),
    breakEvenMonths: breakEvenMonths === Infinity ? '不可回本' : breakEvenMonths.toFixed(1),
    yearROI: yearROI.toFixed(0),
    reducedHeadcount: reducedHeadcount.toFixed(1),
    isPositive: monthlySaving > 0,
    breakEvenOk: breakEvenMonths <= 12,
  }
})
</script>

<div class="pm-tool">

### 当前人力成本

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>执行该任务的人数</label>
  <input class="pm-input" type="number" v-model="humanCount" min="1">
</div>
<div class="pm-input-group">
  <label>平均月薪（含社保，元）</label>
  <input class="pm-input" type="number" v-model="humanSalary" min="0">
</div>
<div class="pm-input-group">
  <label>每人每天花在该任务的小时数</label>
  <input class="pm-input" type="number" v-model="taskHoursPerDay" min="1" max="8">
</div>
<div class="pm-input-group">
  <label>AI 预期自动化率（%）</label>
  <div class="desc">AI 能替代多少比例的工作</div>
  <input class="pm-slider" type="range" v-model="automationRate" min="10" max="100" step="5">
  <span style="font-weight:600;">{{ automationRate }}%</span>
</div>
</div>

<div class="pm-divider"></div>

### AI 方案成本

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>开发总成本（元）</label>
  <div class="desc">含人力、外包、工具等一次性投入</div>
  <input class="pm-input" type="number" v-model="devCost" min="0">
</div>
<div class="pm-input-group">
  <label>开发周期（月）</label>
  <input class="pm-input" type="number" v-model="devMonths" min="1">
</div>
<div class="pm-input-group">
  <label>月度基础设施费用（元）</label>
  <div class="desc">服务器、数据库等</div>
  <input class="pm-input" type="number" v-model="monthlyInfra" min="0">
</div>
<div class="pm-input-group">
  <label>月度模型调用费用（元）</label>
  <div class="desc">Token 消耗费用</div>
  <input class="pm-input" type="number" v-model="monthlyToken" min="0">
</div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">投资回报分析</div>

<div class="pm-result-row">
  <span class="pm-result-label">当前月度人力成本</span>
  <span class="pm-result-data">¥{{ results.monthlyHumanCost }}</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">AI 替代后节省人力成本</span>
  <span class="pm-result-data" style="color:#28a745;">¥{{ results.savedHumanCost }}/月</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">AI 方案月度运营成本</span>
  <span class="pm-result-data" style="color:#dc3545;">¥{{ results.monthlyAICost }}/月</span>
</div>
<div class="pm-result-row">
  <span class="pm-result-label">月度净节省</span>
  <span class="pm-result-data" :style="{ color: results.isPositive ? '#28a745' : '#dc3545' }">¥{{ results.monthlySaving }}/月</span>
</div>

<div class="pm-divider"></div>

<div class="pm-tool-grid" style="text-align:center;margin-top:1rem;">
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">回本周期</div>
  <div style="font-size:1.8rem;font-weight:800;" :style="{ color: results.breakEvenOk ? '#28a745' : '#dc3545' }">
    {{ results.breakEvenMonths }}<span class="pm-result-unit">个月</span>
  </div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">首年 ROI</div>
  <div style="font-size:1.8rem;font-weight:800;" :style="{ color: Number(results.yearROI) > 0 ? '#28a745' : '#dc3545' }">
    {{ results.yearROI }}%
  </div>
</div>
<div>
  <div style="font-size:0.85rem;color:var(--vp-c-text-3);">等效减少人力</div>
  <div style="font-size:1.8rem;font-weight:800;">{{ results.reducedHeadcount }}<span class="pm-result-unit">人</span></div>
</div>
</div>

</div>

## ROI 汇报模板

```
项目：[AI 功能名称]
投入：开发 ¥[X] + 月运营 ¥[Y]
回报：月节省人力成本 ¥[Z]，等效 [N] 个人力
回本周期：[M] 个月
首年 ROI：[R]%
```
