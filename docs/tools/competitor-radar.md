# 竞品分析雷达图

> 多维度评分对比竞品，生成可视化雷达图。

<script setup>
import { ref, computed } from 'vue'

const dims = ref(['产品体验', '技术能力', '价格竞争力', '市场份额', '品牌口碑', '生态丰富度'])
const products = ref([
  { name: '我们的产品', scores: [7, 6, 8, 4, 5, 6], color: '#007bff' },
  { name: '竞品 A', scores: [8, 9, 5, 8, 8, 7], color: '#dc3545' },
  { name: '竞品 B', scores: [6, 7, 9, 6, 6, 5], color: '#28a745' },
])

const newDim = ref('')
const newProduct = ref('')

function addDim() {
  if (newDim.value.trim()) {
    dims.value.push(newDim.value.trim())
    products.value.forEach(p => p.scores.push(5))
    newDim.value = ''
  }
}

function removeDim(i) {
  if (dims.value.length > 3) {
    dims.value.splice(i, 1)
    products.value.forEach(p => p.scores.splice(i, 1))
  }
}

const colors = ['#007bff', '#dc3545', '#28a745', '#fd7e14', '#6f42c1', '#e83e8c']

function addProduct() {
  const n = newProduct.value.trim() || '产品 ' + (products.value.length + 1)
  products.value.push({
    name: n,
    scores: dims.value.map(() => 5),
    color: colors[products.value.length % colors.length],
  })
  newProduct.value = ''
}

function removeProduct(i) {
  if (products.value.length > 1) products.value.splice(i, 1)
}

// SVG radar chart
const size = 300
const cx = size / 2
const cy = size / 2
const radius = size / 2 - 40

function polarToCart(angle, r) {
  const a = (angle - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

const axisPoints = computed(() => {
  const n = dims.value.length
  return dims.value.map((d, i) => {
    const angle = (360 / n) * i
    const end = polarToCart(angle, radius)
    const label = polarToCart(angle, radius + 20)
    return { angle, end, label, name: d }
  })
})

const gridPaths = computed(() => {
  const n = dims.value.length
  return [2, 4, 6, 8, 10].map(level => {
    const r = radius * level / 10
    const points = Array.from({ length: n }, (_, i) => {
      const angle = (360 / n) * i
      const p = polarToCart(angle, r)
      return `${p.x},${p.y}`
    }).join(' ')
    return points
  })
})

const productPaths = computed(() => {
  const n = dims.value.length
  return products.value.map(p => {
    const points = p.scores.map((s, i) => {
      const r = radius * Number(s) / 10
      const angle = (360 / n) * i
      const pt = polarToCart(angle, r)
      return `${pt.x},${pt.y}`
    }).join(' ')
    return { points, color: p.color, name: p.name }
  })
})

const advantages = computed(() => {
  if (products.value.length < 2) return []
  const us = products.value[0]
  return dims.value.map((d, i) => {
    const ourScore = Number(us.scores[i])
    const maxCompetitor = Math.max(...products.value.slice(1).map(p => Number(p.scores[i])))
    const diff = ourScore - maxCompetitor
    return { dim: d, ourScore, maxCompetitor, diff, isAdvantage: diff > 0 }
  }).sort((a, b) => b.diff - a.diff)
})
</script>

<div class="pm-tool">

### 评分维度

<div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.5rem;">
  <span v-for="(d, i) in dims" :key="i" class="pm-tag pm-tag-blue" style="cursor:pointer;" @click="removeDim(i)">{{ d }} ×</span>
</div>
<div style="display:flex;gap:0.5rem;">
  <input class="pm-input" v-model="newDim" placeholder="添加评分维度" @keyup.enter="addDim" style="flex:1;">
  <button class="pm-btn pm-btn-secondary" @click="addDim">添加</button>
</div>

<div class="pm-divider"></div>

### 产品评分

<div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
  <input class="pm-input" v-model="newProduct" placeholder="添加竞品" @keyup.enter="addProduct" style="flex:1;">
  <button class="pm-btn pm-btn-primary" @click="addProduct">添加</button>
</div>

<div v-for="(p, pi) in products" :key="pi" style="margin-bottom:1rem;padding:0.8rem;background:var(--vp-c-bg);border-radius:8px;border-left:3px solid;" :style="{ borderColor: p.color }">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
    <input class="pm-input" v-model="p.name" style="font-weight:700;border:none;padding:0;background:transparent;flex:1;">
    <button v-if="products.length > 1" class="pm-btn pm-btn-secondary" @click="removeProduct(pi)" style="font-size:0.8rem;">删除</button>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <div v-for="(d, di) in dims" :key="di" style="text-align:center;">
      <div style="font-size:0.75rem;color:var(--vp-c-text-3);">{{ d }}</div>
      <input class="pm-input" type="number" v-model="p.scores[di]" min="0" max="10" style="width:55px;text-align:center;">
    </div>
  </div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">雷达图对比</div>

<div style="text-align:center;overflow:auto;">
<svg :width="size" :height="size" :viewBox="'0 0 ' + size + ' ' + size">
  <polygon v-for="(g, i) in gridPaths" :key="i" :points="g" fill="none" stroke="var(--vp-c-border)" stroke-width="1"/>
  <line v-for="a in axisPoints" :key="a.name" :x1="cx" :y1="cy" :x2="a.end.x" :y2="a.end.y" stroke="var(--vp-c-border)" stroke-width="1"/>
  <text v-for="a in axisPoints" :key="'t'+a.name" :x="a.label.x" :y="a.label.y" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="var(--vp-c-text-2)">{{ a.name }}</text>
  <polygon v-for="p in productPaths" :key="p.name" :points="p.points" :fill="p.color + '33'" :stroke="p.color" stroke-width="2"/>
</svg>
</div>

<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-top:0.5rem;">
  <span v-for="p in products" :key="p.name" style="display:flex;align-items:center;gap:0.3rem;font-size:0.85rem;">
    <span style="width:12px;height:12px;border-radius:50%;display:inline-block;" :style="{ background: p.color }"></span>
    {{ p.name }}
  </span>
</div>

<div class="pm-divider"></div>
<div class="pm-result-title">竞争优劣势分析（第一个产品 vs 其他）</div>

<div v-for="a in advantages" :key="a.dim" style="margin-bottom:0.5rem;">
  <div style="display:flex;justify-content:space-between;font-size:0.9rem;">
    <span>{{ a.dim }}</span>
    <span :style="{ color: a.isAdvantage ? '#28a745' : '#dc3545', fontWeight: 600 }">
      {{ a.isAdvantage ? '+' : '' }}{{ a.diff }}
    </span>
  </div>
  <div class="pm-bar" style="height:12px;">
    <div class="pm-bar-fill" :class="a.isAdvantage ? 'pm-bar-green' : 'pm-bar-red'" :style="{ width: (Number(products[0]?.scores[dims.indexOf(a.dim)] || 0) / 10 * 100) + '%' }"></div>
  </div>
</div>
</div>
