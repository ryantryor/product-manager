# 用户故事生成器

> 填入角色、目标和原因，生成标准 User Story 和验收标准。

<script setup>
import { ref, computed } from 'vue'

const role = ref('产品经理')
const action = ref('查看 AI 功能的月度成本报告')
const benefit = ref('评估 AI 投入产出比并向管理层汇报')
const priority = ref('high')
const storyPoints = ref(5)
const acceptanceCriteria = ref([
  '报告包含各模型的调用量和费用明细',
  '支持按时间范围筛选（日/周/月）',
  '显示成本趋势图表',
  '可以导出为 PDF 或 CSV',
])

const newCriteria = ref('')
function addCriteria() {
  if (newCriteria.value.trim()) {
    acceptanceCriteria.value.push(newCriteria.value.trim())
    newCriteria.value = ''
  }
}
function removeCriteria(i) { acceptanceCriteria.value.splice(i, 1) }

const stories = ref([])

function saveStory() {
  stories.value.push({
    role: role.value,
    action: action.value,
    benefit: benefit.value,
    priority: priority.value,
    storyPoints: storyPoints.value,
    criteria: [...acceptanceCriteria.value],
    id: Date.now(),
  })
}

const priorityColors = {
  critical: '#dc3545',
  high: '#fd7e14',
  medium: '#ffc107',
  low: '#28a745',
}
const priorityLabels = {
  critical: 'P0 紧急',
  high: 'P1 高',
  medium: 'P2 中',
  low: 'P3 低',
}
</script>

<div class="pm-tool">

### 编写用户故事

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>作为（角色）</label>
  <input class="pm-input" v-model="role" placeholder="产品经理 / 终端用户 / 管理员...">
</div>
<div class="pm-input-group">
  <label>我想要（行为/功能）</label>
  <input class="pm-input" v-model="action" placeholder="描述用户想做什么...">
</div>
<div class="pm-input-group">
  <label>以便于（价值/目标）</label>
  <input class="pm-input" v-model="benefit" placeholder="描述为什么要做...">
</div>
<div class="pm-input-group">
  <label>优先级</label>
  <div class="pm-radio-group">
    <div v-for="(label, key) in priorityLabels" :key="key" class="pm-radio-btn" :class="{ active: priority === key }" @click="priority = key">{{ label }}</div>
  </div>
</div>
<div class="pm-input-group">
  <label>故事点数</label>
  <div class="pm-radio-group">
    <div v-for="sp in [1,2,3,5,8,13,21]" :key="sp" class="pm-radio-btn" :class="{ active: storyPoints === sp }" @click="storyPoints = sp">{{ sp }}</div>
  </div>
</div>
</div>

<div class="pm-divider"></div>

### 验收标准（Acceptance Criteria）

<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
  <input class="pm-input" v-model="newCriteria" placeholder="添加验收标准..." @keyup.enter="addCriteria" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addCriteria">添加</button>
</div>
<div v-for="(c, i) in acceptanceCriteria" :key="i" style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid var(--vp-c-border);">
  <span style="color:#28a745;">✓</span>
  <span style="flex:1;font-size:0.9rem;">{{ c }}</span>
  <button class="pm-btn pm-btn-secondary" @click="removeCriteria(i)" style="padding:0.2rem 0.5rem;font-size:0.7rem;">×</button>
</div>

<button class="pm-btn pm-btn-primary" @click="saveStory" style="margin-top:1rem;">保存到列表</button>

</div>

<div class="pm-result">
<div class="pm-result-title">Story 卡片预览</div>

<div style="padding:1.5rem;background:var(--vp-c-bg);border-radius:12px;border-left:4px solid;" :style="{ borderColor: priorityColors[priority] }">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
    <span class="pm-tag" :style="{ background: priorityColors[priority] + '22', color: priorityColors[priority] }">{{ priorityLabels[priority] }}</span>
    <span style="font-weight:700;font-size:1.1rem;background:var(--vp-c-bg-soft);padding:0.2rem 0.6rem;border-radius:999px;">{{ storyPoints }} SP</span>
  </div>

  <div style="font-size:1.1rem;line-height:1.6;margin-bottom:1rem;">
    <strong>作为</strong> {{ role }}，<br>
    <strong>我想要</strong> {{ action }}，<br>
    <strong>以便于</strong> {{ benefit }}。
  </div>

  <div style="font-weight:700;margin-bottom:0.3rem;">验收标准：</div>
  <div v-for="(c, i) in acceptanceCriteria" :key="i" style="font-size:0.9rem;padding:0.2rem 0;">
    <span style="color:#28a745;margin-right:0.3rem;">☑</span> {{ c }}
  </div>
</div>
</div>

<div v-if="stories.length" class="pm-result" style="margin-top:1rem;">
<div class="pm-result-title">已保存的 Stories（{{ stories.length }}）</div>
<div v-for="s in stories" :key="s.id" style="padding:0.8rem;border-bottom:1px solid var(--vp-c-border);">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <span>
      <span class="pm-tag" :style="{ background: priorityColors[s.priority] + '22', color: priorityColors[s.priority] }" style="margin-right:0.3rem;">{{ priorityLabels[s.priority] }}</span>
      <strong>作为</strong> {{ s.role }}，<strong>我想要</strong> {{ s.action }}
    </span>
    <span style="font-weight:600;">{{ s.storyPoints }} SP</span>
  </div>
</div>
</div>
