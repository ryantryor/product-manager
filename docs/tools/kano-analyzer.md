# KANO 模型分析器

> 输入问卷结果，自动分类需求为兴奋型、期望型、基本型等类别。

<script setup>
import { ref, computed } from 'vue'

const features = ref([
  { name: '智能搜索', positive: 'like', negative: 'expect' },
  { name: '多语言支持', positive: 'expect', negative: 'dislike' },
  { name: '数据导出', positive: 'neutral', negative: 'dislike' },
])

const newName = ref('')

const options = [
  { value: 'like', label: '非常喜欢' },
  { value: 'expect', label: '理应如此' },
  { value: 'neutral', label: '无所谓' },
  { value: 'tolerate', label: '能忍受' },
  { value: 'dislike', label: '不喜欢' },
]

function addFeature() {
  const n = newName.value.trim() || '功能 ' + (features.value.length + 1)
  features.value.push({ name: n, positive: 'neutral', negative: 'neutral' })
  newName.value = ''
}

function removeFeature(i) { features.value.splice(i, 1) }

const kanoMatrix = {
  'like-like': 'Q', 'like-expect': 'A', 'like-neutral': 'A', 'like-tolerate': 'A', 'like-dislike': 'O',
  'expect-like': 'R', 'expect-expect': 'I', 'expect-neutral': 'I', 'expect-tolerate': 'I', 'expect-dislike': 'M',
  'neutral-like': 'R', 'neutral-expect': 'I', 'neutral-neutral': 'I', 'neutral-tolerate': 'I', 'neutral-dislike': 'M',
  'tolerate-like': 'R', 'tolerate-expect': 'I', 'tolerate-neutral': 'I', 'tolerate-tolerate': 'I', 'tolerate-dislike': 'M',
  'dislike-like': 'R', 'dislike-expect': 'R', 'dislike-neutral': 'R', 'dislike-tolerate': 'R', 'dislike-dislike': 'Q',
}

const categoryMap = {
  'A': { name: '兴奋型（Attractive）', desc: '有了会惊喜，没有也不会不满', color: '#28a745', tag: 'pm-tag-green', priority: '差异化竞争力' },
  'O': { name: '期望型（One-dimensional）', desc: '越好越满意，越差越不满', color: '#007bff', tag: 'pm-tag-blue', priority: '核心竞争力' },
  'M': { name: '基本型（Must-be）', desc: '必须有，没有会非常不满', color: '#dc3545', tag: 'pm-tag-red', priority: '必须实现' },
  'I': { name: '无差异型（Indifferent）', desc: '有没有都无所谓', color: '#6c757d', tag: 'pm-tag-yellow', priority: '低优先级' },
  'R': { name: '反向型（Reverse）', desc: '有了反而不满', color: '#e83e8c', tag: 'pm-tag-red', priority: '避免实现' },
  'Q': { name: '可疑结果（Questionable）', desc: '回答矛盾，数据可能有问题', color: '#ffc107', tag: 'pm-tag-yellow', priority: '需重新调研' },
}

const results = computed(() => {
  return features.value.map(f => {
    const key = f.positive + '-' + f.negative
    const cat = kanoMatrix[key] || 'Q'
    return { name: f.name, category: cat, ...categoryMap[cat] }
  })
})
</script>

<div class="pm-tool">

### KANO 问卷录入

<div class="desc" style="margin-bottom:1rem;">
对每个功能回答两个问题：<br>
<strong>正向问题</strong>：如果有这个功能，你的感受？ <strong>反向问题</strong>：如果没有这个功能，你的感受？
</div>

<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
  <input class="pm-input" v-model="newName" placeholder="输入功能名称" @keyup.enter="addFeature" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addFeature">添加</button>
</div>

<div v-for="(f, i) in features" :key="i" style="padding:1rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-border);border-radius:8px;margin-bottom:0.8rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
    <input class="pm-input" v-model="f.name" style="font-weight:700;flex:1;margin-right:0.5rem;">
    <button class="pm-btn pm-btn-secondary" @click="removeFeature(i)" style="font-size:0.8rem;padding:0.3rem 0.6rem;">删除</button>
  </div>
  <div class="pm-tool-grid">
    <div class="pm-input-group">
      <label>如果有这个功能？（正向）</label>
      <select class="pm-select" v-model="f.positive">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>
    <div class="pm-input-group">
      <label>如果没有这个功能？（反向）</label>
      <select class="pm-select" v-model="f.negative">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>
  </div>
</div>

</div>

<div class="pm-result" v-if="results.length">
<div class="pm-result-title">分类结果</div>

<div v-for="r in results" :key="r.name" style="display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid var(--vp-c-border);">
  <div>
    <span style="font-weight:600;">{{ r.name }}</span>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">{{ r.desc }}</div>
  </div>
  <div style="text-align:right;">
    <span class="pm-tag" :class="r.tag">{{ r.name_label || r.category }}</span>
    <div style="font-size:0.8rem;font-weight:600;" :style="{ color: r.color }">{{ r.name }}</div>
    <div style="font-size:0.75rem;color:var(--vp-c-text-3);">{{ r.priority }}</div>
  </div>
</div>

</div>

## KANO 优先级策略

```
实现优先级：基本型 > 期望型 > 兴奋型 > 无差异型

基本型：不做用户会走，但做了用户觉得理所当然
期望型：做得越好用户越满意，核心竞争维度
兴奋型：用户没预期到的惊喜，差异化利器
```
