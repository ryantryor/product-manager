# 工时估算工具

> 三点估算法，科学计算项目工时和置信区间。

<script setup>
import { ref, computed } from 'vue'

const tasks = ref([
  { name: '需求分析', optimistic: 2, likely: 3, pessimistic: 5 },
  { name: 'UI 设计', optimistic: 3, likely: 5, pessimistic: 10 },
  { name: '前端开发', optimistic: 5, likely: 8, pessimistic: 15 },
  { name: '后端开发', optimistic: 5, likely: 10, pessimistic: 20 },
  { name: '测试', optimistic: 2, likely: 4, pessimistic: 8 },
])

const newName = ref('')
const unit = ref('天')

function addTask() {
  const n = newName.value.trim() || '任务 ' + (tasks.value.length + 1)
  tasks.value.push({ name: n, optimistic: 1, likely: 3, pessimistic: 7 })
  newName.value = ''
}

function removeTask(i) { if (tasks.value.length > 1) tasks.value.splice(i, 1) }

const results = computed(() => {
  const analyzed = tasks.value.map(t => {
    const o = Number(t.optimistic)
    const m = Number(t.likely)
    const p = Number(t.pessimistic)
    const expected = (o + 4 * m + p) / 6
    const stddev = (p - o) / 6
    return { name: t.name, o, m, p, expected: expected.toFixed(1), stddev: stddev.toFixed(1) }
  })

  const totalExpected = analyzed.reduce((sum, t) => sum + Number(t.expected), 0)
  const totalVariance = analyzed.reduce((sum, t) => sum + Math.pow(Number(t.stddev), 2), 0)
  const totalStddev = Math.sqrt(totalVariance)

  const p50 = totalExpected
  const p68 = totalExpected + totalStddev
  const p95 = totalExpected + 2 * totalStddev
  const p99 = totalExpected + 3 * totalStddev

  return {
    tasks: analyzed,
    totalExpected: totalExpected.toFixed(1),
    totalStddev: totalStddev.toFixed(1),
    p50: p50.toFixed(1),
    p68: p68.toFixed(1),
    p95: p95.toFixed(1),
    p99: p99.toFixed(1),
  }
})
</script>

<div class="pm-tool">

### 任务列表

<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;align-items:center;">
  <input class="pm-input" v-model="newName" placeholder="输入任务名称" @keyup.enter="addTask" style="flex:1;">
  <select class="pm-select" v-model="unit" style="width:80px;">
    <option>小时</option>
    <option>天</option>
    <option>人天</option>
  </select>
  <button class="pm-btn pm-btn-primary" @click="addTask">添加</button>
</div>

<table class="pm-table" style="margin-top:1rem;">
  <thead>
    <tr>
      <th>任务</th>
      <th style="width:80px;">乐观</th>
      <th style="width:80px;">最可能</th>
      <th style="width:80px;">悲观</th>
      <th style="width:40px;"></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(t, i) in tasks" :key="i">
      <td><input class="pm-input" v-model="t.name" style="border:none;padding:0;background:transparent;font-weight:600;"></td>
      <td><input class="pm-input" type="number" v-model="t.optimistic" min="0.5" step="0.5" style="text-align:center;"></td>
      <td><input class="pm-input" type="number" v-model="t.likely" min="0.5" step="0.5" style="text-align:center;"></td>
      <td><input class="pm-input" type="number" v-model="t.pessimistic" min="0.5" step="0.5" style="text-align:center;"></td>
      <td><button v-if="tasks.length > 1" class="pm-btn pm-btn-secondary" @click="removeTask(i)" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button></td>
    </tr>
  </tbody>
</table>

</div>

<div class="pm-result">
<div class="pm-result-title">估算结果</div>

<table class="pm-table">
  <thead>
    <tr>
      <th>任务</th>
      <th>期望值</th>
      <th>标准差</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="t in results.tasks" :key="t.name">
      <td style="font-weight:600;">{{ t.name }}</td>
      <td>{{ t.expected }} {{ unit }}</td>
      <td>± {{ t.stddev }}</td>
    </tr>
    <tr style="font-weight:700;background:var(--vp-c-bg-soft);">
      <td>总计</td>
      <td>{{ results.totalExpected }} {{ unit }}</td>
      <td>± {{ results.totalStddev }}</td>
    </tr>
  </tbody>
</table>

<div class="pm-divider"></div>

<div class="pm-result-title">置信区间</div>

<div style="margin-top:0.5rem;">
  <div class="pm-result-row">
    <span class="pm-result-label">50% 概率完成</span>
    <span class="pm-result-data" style="color:#dc3545;">≤ {{ results.p50 }} {{ unit }}</span>
  </div>
  <div class="pm-result-row">
    <span class="pm-result-label">68% 概率完成</span>
    <span class="pm-result-data" style="color:#fd7e14;">≤ {{ results.p68 }} {{ unit }}</span>
  </div>
  <div class="pm-result-row">
    <span class="pm-result-label">95% 概率完成 <span class="pm-tag pm-tag-green">推荐承诺</span></span>
    <span class="pm-result-data" style="color:#28a745;">≤ {{ results.p95 }} {{ unit }}</span>
  </div>
  <div class="pm-result-row">
    <span class="pm-result-label">99% 概率完成</span>
    <span class="pm-result-data">≤ {{ results.p99 }} {{ unit }}</span>
  </div>
</div>

</div>

## 使用建议

- **对内沟通**用 68% 置信度（期望值 + 1σ）
- **对外承诺**用 95% 置信度（期望值 + 2σ）
- **公式**：期望值 = (乐观 + 4×最可能 + 悲观) / 6
