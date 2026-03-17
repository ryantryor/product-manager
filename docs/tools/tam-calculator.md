# TAM/SAM/SOM 市场规模计算器

> 用自上而下和自下而上两种方法估算市场规模。

<script setup>
import { ref, computed } from 'vue'

const method = ref('topdown')

// Top-down
const totalMarket = ref(1000)
const marketUnit = ref('亿')
const tamPercent = ref(100)
const samPercent = ref(30)
const somPercent = ref(5)

// Bottom-up
const targetUsers = ref(1000000)
const penetration = ref(10)
const arpu = ref(200)
const frequency = ref(12)

const topDownResult = computed(() => {
  const tam = Number(totalMarket.value) * Number(tamPercent.value) / 100
  const sam = tam * Number(samPercent.value) / 100
  const som = tam * Number(somPercent.value) / 100
  return {
    tam: tam.toFixed(1),
    sam: sam.toFixed(1),
    som: som.toFixed(1),
    tamWidth: 100,
    samWidth: Math.max(Number(samPercent.value), 5),
    somWidth: Math.max(Number(somPercent.value), 3),
  }
})

const bottomUpResult = computed(() => {
  const users = Number(targetUsers.value)
  const pen = Number(penetration.value) / 100
  const a = Number(arpu.value)
  const f = Number(frequency.value)
  const som = users * pen * a * f
  const sam = som / pen * 0.3
  const tam = sam / 0.3
  return {
    som: (som / 100000000).toFixed(2),
    sam: (sam / 100000000).toFixed(2),
    tam: (tam / 100000000).toFixed(2),
    reachableUsers: Math.round(users * pen).toLocaleString(),
    annualRevPerUser: (a * f).toLocaleString(),
  }
})
</script>

<div class="pm-tool">

### 选择估算方法

<div class="pm-radio-group" style="margin-bottom:1rem;">
  <div class="pm-radio-btn" :class="{ active: method === 'topdown' }" @click="method = 'topdown'">自上而下（Top-Down）</div>
  <div class="pm-radio-btn" :class="{ active: method === 'bottomup' }" @click="method = 'bottomup'">自下而上（Bottom-Up）</div>
</div>

<div v-if="method === 'topdown'">
<div class="pm-tool-grid">
  <div class="pm-input-group">
    <label>行业总市场规模</label>
    <div style="display:flex;gap:0.5rem;">
      <input class="pm-input" type="number" v-model="totalMarket" min="1" style="flex:1;">
      <select class="pm-select" v-model="marketUnit" style="width:80px;">
        <option>万</option>
        <option>亿</option>
        <option>万亿</option>
      </select>
    </div>
  </div>
  <div class="pm-input-group">
    <label>TAM（全球/全行业占比 %）</label>
    <input class="pm-slider" type="range" v-model="tamPercent" min="10" max="100" step="5">
    <span style="font-weight:600;">{{ tamPercent }}%</span>
  </div>
  <div class="pm-input-group">
    <label>SAM（可服务市场占比 %）</label>
    <div class="desc">受地域、渠道、产品形态限制</div>
    <input class="pm-slider" type="range" v-model="samPercent" min="1" max="100" step="1">
    <span style="font-weight:600;">{{ samPercent }}%</span>
  </div>
  <div class="pm-input-group">
    <label>SOM（可获得市场占比 %）</label>
    <div class="desc">考虑竞争格局和执行力</div>
    <input class="pm-slider" type="range" v-model="somPercent" min="1" max="50" step="1">
    <span style="font-weight:600;">{{ somPercent }}%</span>
  </div>
</div>
</div>

<div v-else>
<div class="pm-tool-grid">
  <div class="pm-input-group">
    <label>目标用户总数</label>
    <input class="pm-input" type="number" v-model="targetUsers" min="1">
  </div>
  <div class="pm-input-group">
    <label>预期渗透率（%）</label>
    <input class="pm-slider" type="range" v-model="penetration" min="1" max="100" step="1">
    <span style="font-weight:600;">{{ penetration }}%</span>
  </div>
  <div class="pm-input-group">
    <label>客单价 ARPU（元）</label>
    <input class="pm-input" type="number" v-model="arpu" min="1">
  </div>
  <div class="pm-input-group">
    <label>年付费频次</label>
    <input class="pm-input" type="number" v-model="frequency" min="1">
  </div>
</div>
</div>

</div>

<div class="pm-result">
<div class="pm-result-title">市场规模估算</div>

<div v-if="method === 'topdown'">
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:1rem 0;">
    <div style="padding:0.8rem 1rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#6f42c1;" :style="{ width: topDownResult.tamWidth + '%' }">
      TAM {{ topDownResult.tam }} {{ marketUnit }}
    </div>
    <div style="padding:0.8rem 1rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#007bff;" :style="{ width: topDownResult.samWidth + '%' }">
      SAM {{ topDownResult.sam }} {{ marketUnit }}
    </div>
    <div style="padding:0.8rem 1rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#28a745;" :style="{ width: topDownResult.somWidth + '%' }">
      SOM {{ topDownResult.som }} {{ marketUnit }}
    </div>
  </div>
</div>

<div v-else>
  <div class="pm-result-row">
    <span class="pm-result-label">可触达用户数</span>
    <span class="pm-result-data">{{ bottomUpResult.reachableUsers }}</span>
  </div>
  <div class="pm-result-row">
    <span class="pm-result-label">年人均贡献</span>
    <span class="pm-result-data">¥{{ bottomUpResult.annualRevPerUser }}</span>
  </div>
  <div class="pm-divider"></div>
  <div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:1rem 0;">
    <div style="padding:0.8rem 2rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#6f42c1;width:90%;">
      TAM ≈ {{ bottomUpResult.tam }} 亿
    </div>
    <div style="padding:0.8rem 2rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#007bff;width:60%;">
      SAM ≈ {{ bottomUpResult.sam }} 亿
    </div>
    <div style="padding:0.8rem 2rem;border-radius:8px;text-align:center;color:#fff;font-weight:700;background:#28a745;width:35%;">
      SOM ≈ {{ bottomUpResult.som }} 亿
    </div>
  </div>
</div>

</div>

## 概念说明

| 层级 | 全称 | 含义 |
|------|------|------|
| **TAM** | Total Addressable Market | 全部潜在市场，理论上限 |
| **SAM** | Serviceable Addressable Market | 你的产品能服务的市场 |
| **SOM** | Serviceable Obtainable Market | 短期内实际能获取的份额 |
