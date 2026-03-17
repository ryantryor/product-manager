# 用户画像生成器

> 填写关键信息，生成结构化的 Persona 卡片。

<script setup>
import { ref, computed } from 'vue'

const persona = ref({
  name: '张明',
  age: 32,
  gender: '男',
  job: '互联网产品经理',
  company: '中型 SaaS 公司',
  income: '25-35K',
  city: '上海',
  education: '本科',
  goals: ['提升团队效率', '用 AI 优化产品体验', '建立数据驱动文化'],
  pains: ['AI 技术快速迭代跟不上', '难以评估 AI 功能的 ROI', '与算法团队沟通困难'],
  behaviors: ['每天使用 ChatGPT 辅助工作', '关注 AI 产品动态', '定期参加行业会议'],
  tools: ['Figma', 'Notion', 'ChatGPT', 'JIRA', '飞书'],
  quote: '我不需要成为 AI 专家，但需要知道 AI 能解决什么问题。',
  techLevel: 60,
  aiLevel: 40,
})

const newGoal = ref('')
const newPain = ref('')
const newBehavior = ref('')
const newTool = ref('')

function addItem(list, inputRef) {
  if (inputRef.value.trim()) {
    list.push(inputRef.value.trim())
    inputRef.value = ''
  }
}
function removeItem(list, i) { list.splice(i, 1) }

const techLabel = computed(() => {
  if (persona.value.techLevel >= 80) return '技术专家'
  if (persona.value.techLevel >= 60) return '技术熟练'
  if (persona.value.techLevel >= 40) return '基本了解'
  return '技术小白'
})

const aiLabel = computed(() => {
  if (persona.value.aiLevel >= 80) return 'AI 专家'
  if (persona.value.aiLevel >= 60) return 'AI 熟练用户'
  if (persona.value.aiLevel >= 40) return 'AI 初学者'
  return 'AI 零基础'
})
</script>

<div class="pm-tool">

### 基本信息

<div class="pm-tool-grid">
<div class="pm-input-group">
  <label>姓名</label>
  <input class="pm-input" v-model="persona.name">
</div>
<div class="pm-input-group">
  <label>年龄</label>
  <input class="pm-input" type="number" v-model="persona.age" min="1">
</div>
<div class="pm-input-group">
  <label>性别</label>
  <div class="pm-radio-group">
    <div class="pm-radio-btn" :class="{ active: persona.gender === '男' }" @click="persona.gender = '男'">男</div>
    <div class="pm-radio-btn" :class="{ active: persona.gender === '女' }" @click="persona.gender = '女'">女</div>
  </div>
</div>
<div class="pm-input-group">
  <label>职位</label>
  <input class="pm-input" v-model="persona.job">
</div>
<div class="pm-input-group">
  <label>公司/行业</label>
  <input class="pm-input" v-model="persona.company">
</div>
<div class="pm-input-group">
  <label>月收入</label>
  <input class="pm-input" v-model="persona.income">
</div>
<div class="pm-input-group">
  <label>城市</label>
  <input class="pm-input" v-model="persona.city">
</div>
<div class="pm-input-group">
  <label>学历</label>
  <select class="pm-select" v-model="persona.education">
    <option>高中</option><option>大专</option><option>本科</option><option>硕士</option><option>博士</option>
  </select>
</div>
</div>

<div class="pm-divider"></div>

### 能力水平
<div class="pm-input-group">
  <label>技术理解 — {{ techLabel }}</label>
  <input class="pm-slider" type="range" v-model="persona.techLevel" min="0" max="100">
</div>
<div class="pm-input-group">
  <label>AI 熟练度 — {{ aiLabel }}</label>
  <input class="pm-slider" type="range" v-model="persona.aiLevel" min="0" max="100">
</div>

<div class="pm-divider"></div>

### 用户目标
<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
  <input class="pm-input" v-model="newGoal" placeholder="添加目标" @keyup.enter="addItem(persona.goals, newGoal)" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addItem(persona.goals, newGoal)">添加</button>
</div>
<div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
  <span v-for="(g, i) in persona.goals" :key="i" class="pm-tag pm-tag-green" style="cursor:pointer;" @click="removeItem(persona.goals, i)">{{ g }} ×</span>
</div>

### 痛点
<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;margin-top:0.5rem;">
  <input class="pm-input" v-model="newPain" placeholder="添加痛点" @keyup.enter="addItem(persona.pains, newPain)" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addItem(persona.pains, newPain)">添加</button>
</div>
<div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
  <span v-for="(p, i) in persona.pains" :key="i" class="pm-tag pm-tag-red" style="cursor:pointer;" @click="removeItem(persona.pains, i)">{{ p }} ×</span>
</div>

### 行为特征
<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;margin-top:0.5rem;">
  <input class="pm-input" v-model="newBehavior" placeholder="添加行为" @keyup.enter="addItem(persona.behaviors, newBehavior)" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addItem(persona.behaviors, newBehavior)">添加</button>
</div>
<div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
  <span v-for="(b, i) in persona.behaviors" :key="i" class="pm-tag pm-tag-blue" style="cursor:pointer;" @click="removeItem(persona.behaviors, i)">{{ b }} ×</span>
</div>

### 常用工具
<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;margin-top:0.5rem;">
  <input class="pm-input" v-model="newTool" placeholder="添加工具" @keyup.enter="addItem(persona.tools, newTool)" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addItem(persona.tools, newTool)">添加</button>
</div>
<div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
  <span v-for="(t, i) in persona.tools" :key="i" class="pm-tag pm-tag-yellow" style="cursor:pointer;" @click="removeItem(persona.tools, i)">{{ t }} ×</span>
</div>

### 代表性语录
<div class="pm-input-group" style="margin-top:0.5rem;">
  <input class="pm-input" v-model="persona.quote" placeholder="这个用户会说什么...">
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">Persona 卡片预览</div>

<div style="padding:1.5rem;background:var(--vp-c-bg);border-radius:12px;border:2px solid var(--vp-c-brand-1);">
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
    <div style="width:60px;height:60px;border-radius:50%;background:var(--vp-c-brand-1);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;font-weight:700;">
      {{ persona.name[0] }}
    </div>
    <div>
      <div style="font-size:1.3rem;font-weight:800;">{{ persona.name }}</div>
      <div style="color:var(--vp-c-text-3);">{{ persona.age }}岁 · {{ persona.gender }} · {{ persona.city }}</div>
      <div style="color:var(--vp-c-text-2);font-weight:600;">{{ persona.job }} @ {{ persona.company }}</div>
    </div>
  </div>

  <div style="font-style:italic;color:var(--vp-c-text-2);padding:0.8rem;background:var(--vp-c-bg-soft);border-radius:8px;border-left:3px solid var(--vp-c-brand-1);margin-bottom:1rem;">
    "{{ persona.quote }}"
  </div>

  <div class="pm-tool-grid">
    <div>
      <div style="font-weight:700;margin-bottom:0.3rem;">🎯 目标</div>
      <ul style="margin:0;padding-left:1.2rem;font-size:0.9rem;">
        <li v-for="g in persona.goals" :key="g">{{ g }}</li>
      </ul>
    </div>
    <div>
      <div style="font-weight:700;margin-bottom:0.3rem;">😫 痛点</div>
      <ul style="margin:0;padding-left:1.2rem;font-size:0.9rem;">
        <li v-for="p in persona.pains" :key="p">{{ p }}</li>
      </ul>
    </div>
  </div>

  <div style="margin-top:1rem;">
    <div style="font-weight:700;margin-bottom:0.3rem;">🛠️ 常用工具</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
      <span v-for="t in persona.tools" :key="t" class="pm-tag pm-tag-blue">{{ t }}</span>
    </div>
  </div>

  <div style="margin-top:1rem;">
    <div style="display:flex;gap:2rem;">
      <div style="flex:1;">
        <div style="font-size:0.8rem;color:var(--vp-c-text-3);margin-bottom:0.2rem;">技术理解 {{ techLabel }}</div>
        <div class="pm-bar" style="height:12px;"><div class="pm-bar-fill pm-bar-blue" :style="{ width: persona.techLevel + '%' }"></div></div>
      </div>
      <div style="flex:1;">
        <div style="font-size:0.8rem;color:var(--vp-c-text-3);margin-bottom:0.2rem;">AI 熟练度 {{ aiLabel }}</div>
        <div class="pm-bar" style="height:12px;"><div class="pm-bar-fill pm-bar-purple" :style="{ width: persona.aiLevel + '%' }"></div></div>
      </div>
    </div>
  </div>
</div>

</div>
