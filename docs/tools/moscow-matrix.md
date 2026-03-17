# MoSCoW 优先级矩阵

> 拖拽式四象限需求分类，快速达成团队共识。

<script setup>
import { ref } from 'vue'

const newFeature = ref('')
const features = ref({
  must: ['用户登录/注册', '核心搜索功能', '数据安全合规'],
  should: ['AI 智能推荐', '多语言支持'],
  could: ['暗色模式', '自定义仪表盘'],
  wont: ['AR 预览功能'],
})

const categories = {
  must: { label: 'Must Have', desc: '必须有，没有就不能上线', color: '#dc3545', emoji: '🔴' },
  should: { label: 'Should Have', desc: '应该有，重要但不致命', color: '#fd7e14', emoji: '🟠' },
  could: { label: 'Could Have', desc: '可以有，锦上添花', color: '#007bff', emoji: '🔵' },
  wont: { label: "Won't Have", desc: '这次不做，明确排除', color: '#6c757d', emoji: '⚪' },
}

const addTarget = ref('must')

const categoryKeys = ['must', 'should', 'could', 'wont']

function otherKeys(current) {
  return categoryKeys.filter(k => k !== current)
}

function addFeature() {
  if (newFeature.value.trim()) {
    features.value[addTarget.value].push(newFeature.value.trim())
    newFeature.value = ''
  }
}

function moveFeature(from, index, to) {
  const item = features.value[from].splice(index, 1)[0]
  features.value[to].push(item)
}

function removeFeature(cat, index) {
  features.value[cat].splice(index, 1)
}

const totalCount = ref(0)
</script>

<ClientOnly>
<div class="pm-tool">

### 添加需求

<div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
  <input class="pm-input" v-model="newFeature" placeholder="输入需求名称" @keyup.enter="addFeature" style="flex:1;">
  <select class="pm-select" v-model="addTarget" style="width:150px;">
    <option v-for="(c, k) in categories" :key="k" :value="k">{{ c.emoji }} {{ c.label }}</option>
  </select>
  <button class="pm-btn pm-btn-primary" @click="addFeature">添加</button>
</div>

</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;">
  <div v-for="(cat, key) in categories" :key="key" style="padding:1rem;border-radius:10px;border:2px solid;" :style="{ borderColor: cat.color }">
    <div style="font-weight:700;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.3rem;">
      <span>{{ cat.emoji }}</span>
      <span :style="{ color: cat.color }">{{ cat.label }}</span>
      <span style="font-size:0.75rem;color:var(--vp-c-text-3);margin-left:auto;">{{ features[key].length }}</span>
    </div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);margin-bottom:0.5rem;">{{ cat.desc }}</div>

    <div v-for="(f, i) in features[key]" :key="f + i" style="display:flex;align-items:center;gap:0.3rem;padding:0.4rem 0.5rem;background:var(--vp-c-bg);border-radius:6px;margin-bottom:0.3rem;font-size:0.85rem;">
      <span style="flex:1;">{{ f }}</span>
      <select class="pm-select" style="width:auto;padding:0.15rem 0.3rem;font-size:0.7rem;" @change="(e) => { moveFeature(key, i, e.target.value); e.target.value = key; }">
        <option :value="key">移动到…</option>
        <option v-for="k2 in otherKeys(key)" :key="k2" :value="k2">{{ categories[k2].emoji }} {{ categories[k2].label }}</option>
      </select>
      <button @click="removeFeature(key, i)" style="background:none;border:none;cursor:pointer;color:var(--vp-c-text-3);font-size:0.8rem;">×</button>
    </div>

    <div v-if="!features[key].length" style="text-align:center;padding:1rem;color:var(--vp-c-text-3);font-size:0.85rem;">
      暂无需求
    </div>
  </div>
</div>

<div class="pm-result">
<div class="pm-result-title">分布统计</div>
<div style="display:flex;gap:1rem;flex-wrap:wrap;">
  <div v-for="(cat, key) in categories" :key="key" style="text-align:center;">
    <div style="font-size:1.5rem;font-weight:800;" :style="{ color: cat.color }">{{ features[key].length }}</div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">{{ cat.label }}</div>
  </div>
  <div style="text-align:center;">
    <div style="font-size:1.5rem;font-weight:800;">{{ features.must.length + features.should.length + features.could.length + features.wont.length }}</div>
    <div style="font-size:0.8rem;color:var(--vp-c-text-3);">总计</div>
  </div>
</div>
</div>
</ClientOnly>

## 使用建议

- **Must** 控制在总需求的 **30-40%**，避免什么都是 P0
- **Should** 是版本核心竞争力，约 **30%**
- **Could** 是弹性空间，**20%**
- **Won't** 一定要明确列出来，**避免范围蔓延**
