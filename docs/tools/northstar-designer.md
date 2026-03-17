# 北极星指标设计器

> 选择产品类型，推荐北极星指标并生成三层指标体系。

<script setup>
import { ref, computed } from 'vue'

const productType = ref('')

const templates = {
  saas: {
    name: 'B2B SaaS',
    northStar: '周活跃用户中完成核心动作的比例',
    examples: ['Slack: 每日发送消息数', 'Notion: 周活跃团队数', 'Figma: 协作编辑时长'],
    l1: ['周活跃用户数（WAU）', '核心功能使用率', '付费转化率'],
    l2: ['新用户激活率', '功能渗透率', 'NPS', '扩展收入率（Net Dollar Retention）', '用户留存率（D7/D30）'],
    l3: ['注册完成率', '引导完成率', '页面加载时间', '工单响应时间', '功能使用深度', 'API 调用成功率'],
  },
  consumer: {
    name: '消费者应用',
    northStar: '日活用户参与核心行为的次数',
    examples: ['抖音: 日均观看时长', 'Instagram: 日发布 Stories 数', '微信: 日消息发送量'],
    l1: ['DAU/MAU 比率', '人均使用时长', '次日留存率'],
    l2: ['内容创作量', '社交互动率', '推送打开率', '搜索使用率', '分享率'],
    l3: ['冷启动完成率', '首次体验时长', 'Crash 率', '推荐算法点击率', '加载速度'],
  },
  ecommerce: {
    name: '电商/交易',
    northStar: '月度复购用户的 GMV',
    examples: ['淘宝: GMV', '拼多多: 月购买用户数', '美团: 月订单量'],
    l1: ['GMV', '月购买用户数', '客单价'],
    l2: ['购物车转化率', '复购率', '退货率', 'SKU 丰富度', '配送满意度'],
    l3: ['搜索结果相关性', '商品详情页跳出率', '支付成功率', '物流时效', '客服响应时间'],
  },
  ai_product: {
    name: 'AI 产品',
    northStar: '用户采纳 AI 建议/输出的比例',
    examples: ['Copilot: 代码建议采纳率', 'ChatGPT: 周活对话用户', 'Midjourney: 日生成图片数'],
    l1: ['AI 输出采纳率', '人均对话/使用次数', '任务完成率'],
    l2: ['响应准确率', '首次正确率', '用户满意度评分', 'Token 效率', '幻觉率'],
    l3: ['响应延迟 P95', '模型调用成功率', 'RAG 检索相关性', '上下文命中率', '安全过滤误拦率'],
  },
  marketplace: {
    name: '平台/市场',
    northStar: '成功匹配并完成交易的比例',
    examples: ['Uber: 完成行程数', 'Airbnb: 预订间夜数', '滴滴: 完成订单量'],
    l1: ['成交量', '供需匹配率', '双边留存率'],
    l2: ['供给端活跃率', '需求端转化率', '匹配速度', '取消率', '评价满意度'],
    l3: ['供给端注册转化', '需求端搜索结果率', '价格竞争力', '履约准时率', '争议解决时效'],
  },
}

const selectedTemplate = computed(() => productType.value ? templates[productType.value] : null)
</script>

<div class="pm-tool">

### 选择产品类型

<div class="pm-radio-group" style="margin-bottom:1rem;">
  <div v-for="(t, k) in templates" :key="k" class="pm-radio-btn" :class="{ active: productType === k }" @click="productType = k">
    {{ t.name }}
  </div>
</div>

</div>

<div v-if="selectedTemplate" class="pm-result">
<div class="pm-result-title">{{ selectedTemplate.name }} 指标体系</div>

<div style="text-align:center;padding:1.5rem;background:var(--vp-c-bg-soft);border-radius:10px;margin:1rem 0;">
  <div style="font-size:0.8rem;color:var(--vp-c-text-3);margin-bottom:0.3rem;">⭐ 北极星指标</div>
  <div style="font-size:1.3rem;font-weight:800;color:var(--vp-c-brand-1);">{{ selectedTemplate.northStar }}</div>
  <div style="font-size:0.8rem;color:var(--vp-c-text-3);margin-top:0.5rem;">
    业界案例：{{ selectedTemplate.examples.join(' | ') }}
  </div>
</div>

<div style="margin-top:1.5rem;">
  <div style="font-weight:700;margin-bottom:0.5rem;color:#007bff;">📊 L1 核心指标（决策层关注）</div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
    <span v-for="m in selectedTemplate.l1" :key="m" class="pm-tag pm-tag-blue">{{ m }}</span>
  </div>

  <div style="font-weight:700;margin-bottom:0.5rem;color:#28a745;">📈 L2 过程指标（产品团队关注）</div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
    <span v-for="m in selectedTemplate.l2" :key="m" class="pm-tag pm-tag-green">{{ m }}</span>
  </div>

  <div style="font-weight:700;margin-bottom:0.5rem;color:#fd7e14;">🔧 L3 健康指标（工程团队关注）</div>
  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
    <span v-for="m in selectedTemplate.l3" :key="m" class="pm-tag pm-tag-yellow">{{ m }}</span>
  </div>
</div>

</div>

## 北极星指标设计原则

1. **反映核心价值** — 用户从你的产品中获得的核心价值
2. **可衡量** — 有明确的数据采集方式
3. **可行动** — 团队可以通过产品迭代影响它
4. **先导性** — 能预示长期商业成功（收入、留存）
5. **简单** — 全公司都能理解
