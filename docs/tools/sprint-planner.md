# 版本排期计算器

> 输入需求列表和团队人力，自动排出迭代计划。

<script setup>
import { ref, computed } from 'vue'

const sprintDays = ref(10)
const teamMembers = ref([
  { name: '前端开发', count: 2, efficiency: 0.7 },
  { name: '后端开发', count: 2, efficiency: 0.7 },
  { name: '设计', count: 1, efficiency: 0.8 },
  { name: '测试', count: 1, efficiency: 0.8 },
])

const tasks = ref([
  { name: '用户登录优化', days: 5, role: '前端开发', priority: 1 },
  { name: 'API 重构', days: 8, role: '后端开发', priority: 1 },
  { name: '搜索功能', days: 12, role: '后端开发', priority: 2 },
  { name: '新首页设计', days: 4, role: '设计', priority: 1 },
  { name: '数据看板', days: 6, role: '前端开发', priority: 2 },
  { name: '性能测试', days: 3, role: '测试', priority: 2 },
  { name: 'AI 推荐', days: 15, role: '后端开发', priority: 3 },
])

const newTask = ref({ name: '', days: 3, role: '前端开发', priority: 2 })

function addTask() {
  const n = newTask.value.name.trim() || '任务 ' + (tasks.value.length + 1)
  tasks.value.push({ ...newTask.value, name: n })
  newTask.value = { name: '', days: 3, role: '前端开发', priority: 2 }
}

function removeTask(i) { tasks.value.splice(i, 1) }

function addMember() {
  teamMembers.value.push({ name: '角色 ' + (teamMembers.value.length + 1), count: 1, efficiency: 0.7 })
}

function removeMember(i) {
  if (teamMembers.value.length > 1) teamMembers.value.splice(i, 1)
}

const roleCapacity = computed(() => {
  const cap = {}
  teamMembers.value.forEach(m => {
    cap[m.name] = Number(m.count) * Number(sprintDays.value) * Number(m.efficiency)
  })
  return cap
})

const sprintPlan = computed(() => {
  const sorted = [...tasks.value].sort((a, b) => a.priority - b.priority)
  const capacity = { ...roleCapacity.value }
  const sprints = []
  let currentSprint = { id: 1, tasks: [], roleUsage: {} }

  sorted.forEach(t => {
    const role = t.role
    const needed = Number(t.days)
    const available = capacity[role] || 0

    if (available >= needed) {
      currentSprint.tasks.push(t)
      capacity[role] = available - needed
      if (!currentSprint.roleUsage[role]) currentSprint.roleUsage[role] = 0
      currentSprint.roleUsage[role] += needed
    } else {
      // Overflow to next sprint
      if (currentSprint.tasks.length > 0) {
        sprints.push(currentSprint)
        // Reset capacity
        Object.keys(roleCapacity.value).forEach(k => { capacity[k] = roleCapacity.value[k] })
        currentSprint = { id: sprints.length + 1, tasks: [], roleUsage: {} }
      }
      currentSprint.tasks.push(t)
      capacity[role] = (capacity[role] || roleCapacity.value[role] || 0) - needed
      if (!currentSprint.roleUsage[role]) currentSprint.roleUsage[role] = 0
      currentSprint.roleUsage[role] += needed
    }
  })

  if (currentSprint.tasks.length > 0) sprints.push(currentSprint)
  return sprints
})

const totalDays = computed(() => tasks.value.reduce((s, t) => s + Number(t.days), 0))
const totalSprints = computed(() => sprintPlan.value.length)
const totalCalendarDays = computed(() => totalSprints.value * Number(sprintDays.value))

const priorityColors = { 1: '#dc3545', 2: '#fd7e14', 3: '#007bff' }
const priorityLabels = { 1: 'P0', 2: 'P1', 3: 'P2' }
</script>

<div class="pm-tool">

### 迭代配置

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>Sprint 周期（工作日）</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: sprintDays === 5 }" @click="sprintDays = 5">1 周</div>
    <div class="pm-radio-btn" :class="{ active: sprintDays === 10 }" @click="sprintDays = 10">2 周</div>
    <div class="pm-radio-btn" :class="{ active: sprintDays === 15 }" @click="sprintDays = 15">3 周</div>
  </div>
</div>
</div>

### 团队人力

<table class="pm-table">
  <thead><tr><th>角色</th><th>人数</th><th>效率系数</th><th>Sprint 可用人天</th><th></th></tr></thead>
  <tbody>
    <tr v-for="(m, i) in teamMembers" :key="i">
      <td><input class="pm-input" v-model="m.name" style="border:none;background:transparent;font-weight:600;padding:0;"></td>
      <td><input class="pm-input" type="number" v-model="m.count" min="1" style="width:60px;text-align:center;"></td>
      <td><input class="pm-input" type="number" v-model="m.efficiency" min="0.1" max="1" step="0.1" style="width:70px;text-align:center;"></td>
      <td style="font-weight:600;">{{ (Number(m.count) * Number(sprintDays) * Number(m.efficiency)).toFixed(0) }} 天</td>
      <td><button v-if="teamMembers.length > 1" class="pm-btn pm-btn-secondary" @click="removeMember(i)" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button></td>
    </tr>
  </tbody>
</table>
<button class="pm-btn pm-btn-secondary" @click="addMember" style="margin-top:0.3rem;">+ 添加角色</button>

<div class="pm-divider"></div>

### 需求列表

<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">
  <input class="pm-input" v-model="newTask.name" placeholder="需求名称" style="flex:1;min-width:120px;" @keyup.enter="addTask">
  <input class="pm-input" type="number" v-model="newTask.days" min="1" style="width:70px;" placeholder="人天">
  <select class="pm-select" v-model="newTask.role" style="width:110px;">
    <option v-for="m in teamMembers" :key="m.name" :value="m.name">{{ m.name }}</option>
  </select>
  <select class="pm-select" v-model="newTask.priority" style="width:70px;">
    <option :value="1">P0</option><option :value="2">P1</option><option :value="3">P2</option>
  </select>
  <button class="pm-btn pm-btn-primary" @click="addTask">添加</button>
</div>

<table class="pm-table">
  <thead><tr><th>需求</th><th>人天</th><th>负责角色</th><th>优先级</th><th></th></tr></thead>
  <tbody>
    <tr v-for="(t, i) in tasks" :key="i">
      <td><input class="pm-input" v-model="t.name" style="border:none;background:transparent;font-weight:600;padding:0;"></td>
      <td><input class="pm-input" type="number" v-model="t.days" min="1" style="width:60px;text-align:center;"></td>
      <td>
        <select class="pm-select" v-model="t.role" style="padding:0.2rem;font-size:0.85rem;">
          <option v-for="m in teamMembers" :key="m.name" :value="m.name">{{ m.name }}</option>
        </select>
      </td>
      <td>
        <span class="pm-tag" :style="{ background: priorityColors[t.priority] + '22', color: priorityColors[t.priority] }">{{ priorityLabels[t.priority] }}</span>
      </td>
      <td><button class="pm-btn pm-btn-secondary" @click="removeTask(i)" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button></td>
    </tr>
  </tbody>
</table>

</div>

<div class="pm-result">
<div class="pm-result-title">排期结果</div>

<div class="pm-tool-grid" style="text-align:center;margin-bottom:1rem;">
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">总工作量</div>
    <div style="font-size:1.5rem;font-weight:800;">{{ totalDays }}<span class="pm-result-unit">人天</span></div>
  </div>
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">需要迭代数</div>
    <div style="font-size:1.5rem;font-weight:800;">{{ totalSprints }}<span class="pm-result-unit">个 Sprint</span></div>
  </div>
  <div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">预计日历天</div>
    <div style="font-size:1.5rem;font-weight:800;">{{ totalCalendarDays }}<span class="pm-result-unit">工作日</span></div>
  </div>
</div>

<div class="pm-divider"></div>

<div v-for="sprint in sprintPlan" :key="sprint.id" style="margin-bottom:1rem;padding:1rem;background:var(--vp-c-bg);border-radius:8px;border-left:3px solid var(--vp-c-brand-1);">
  <div style="font-weight:700;margin-bottom:0.5rem;">Sprint {{ sprint.id }}（{{ sprintDays }} 工作日）</div>
  <div v-for="t in sprint.tasks" :key="t.name" style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0;font-size:0.9rem;">
    <span>
      <span class="pm-tag" :style="{ background: priorityColors[t.priority] + '22', color: priorityColors[t.priority] }" style="margin-right:0.3rem;">{{ priorityLabels[t.priority] }}</span>
      {{ t.name }}
    </span>
    <span style="color:var(--vp-c-text-3);">{{ t.role }} · {{ t.days }}天</span>
  </div>
</div>
</div>
