# gstack 实战：用 AI 构建虚拟工程团队

::: tip 核心价值
Y Combinator CEO Garry Tan 开源的 gstack 框架，将 Claude Code 变成一支 **13 人虚拟工程团队**，实现"一个人 = 一支20人团队"的产出效率。这不是概念验证，而是一个已在真实生产环境中创造 **60 天内 60万行代码** 的工程实践。
:::

## 一、为什么 PM 必须理解 gstack

作为 AI Native 产品经理，你不需要自己写代码，但你必须理解：

| 维度 | 传统模式 | gstack 模式 | PM 启示 |
|------|---------|------------|---------|
| 团队规模 | 8-15 人 | 1 人 + AI | 产品规划的人力假设需要重估 |
| 开发周期 | 2-4 周 sprint | 小时级交付 | 需求拆分和排期模型需要重构 |
| 质量保障 | 人工 code review | 结构化 AI 审查 | 测试策略和上线流程需要重新设计 |
| 文档维护 | 经常滞后 | 自动同步 | 文档管理不再是瓶颈 |

**对 PM 的直接影响**：当工程团队的产出效率提升 10-50 倍时，产品经理的需求供给能力、优先级判断、用户验证速度都必须跟上。

## 二、gstack 架构深度拆解

### 2.1 核心设计理念：治理而非混乱

gstack 的设计哲学是 **"Governance Over Chaos"**（治理优于混乱）：

```
❌ 传统 AI 编程：把所有事情交给一个 AI Agent → 混乱输出
✅ gstack 方式：13 个专业角色 + 结构化工作流 → 可控高质量输出
```

这与产品管理的核心原则完全一致：**分工、流程、质量门禁**。

### 2.2 十三专家角色矩阵

gstack 将软件工程的完整流程拆分为 13 个专家角色：

#### 📋 规划阶段（Planning Phase）

| 角色 | 命令 | 核心能力 | 对应传统角色 |
|------|------|---------|------------|
| CEO / 创始人 | `/plan-ceo-review` | 将需求重构为"10 星体验"；四种模式：扩展、选择性扩展、保持范围、缩减 | 产品负责人 |
| 工程经理 | `/plan-eng-review` | 架构图、数据流、测试矩阵、安全威胁建模 | 技术架构师 |
| 高级设计师 | `/plan-design-review` | 80 项设计审计、AI 模式检测、设计系统推断 | UX Lead |
| 设计合伙人 | `/design-consultation` | 竞品调研 + 创意方案（安全方案 + 大胆方案） | 产品设计顾问 |

#### 🔨 开发与审查阶段（Dev & Review Phase）

| 角色 | 命令 | 核心能力 | 对应传统角色 |
|------|------|---------|------------|
| 资深工程师 | `/review` | 深度代码分析、自动修复明显问题、标记竞态条件 | Staff Engineer |
| 发布工程师 | `/ship` | 同步主分支、运行测试、审计覆盖率、发起 PR | Release Manager |
| 设计开发者 | `/design-review` | 设计审计 + 实现 + 前后截图对比 | 前端 Tech Lead |

#### 🧪 质量保证阶段（QA Phase）

| 角色 | 命令 | 核心能力 | 对应传统角色 |
|------|------|---------|------------|
| QA 工程师 | `/browse` | 真实 Chromium 浏览器交互（~100ms/命令）| QA Automation |
| QA 负责人 | `/qa` | 端到端测试 → 发现 Bug → 修复 → 原子提交 → 回归测试 | QA Lead |
| QA 报告员 | `/qa-only` | 同 `/qa` 但仅输出报告，不做修改 | QA Analyst |

#### 📝 运维阶段（Ops Phase）

| 角色 | 命令 | 核心能力 | 对应传统角色 |
|------|------|---------|------------|
| Session Manager | `/setup-browser-cookies` | 从真实浏览器导入 Cookies 用于认证测试 | DevOps |
| 工程经理(汇报) | `/retro` | 周维度回顾：按人分解、趋势分析 | Engineering Manager |
| 技术作者 | `/document-release` | 自动检测和更新所有文档使之与代码同步 | Technical Writer |

### 2.3 工作流全景图

```
需求输入
    │
    ▼
┌─────────────────────────────────────────────┐
│           📋 PLANNING PHASE                  │
│                                             │
│  /plan-ceo-review    → 产品视角重构需求       │
│       │                                     │
│  /plan-design-review → 80 项设计审计          │
│       │                                     │
│  /plan-eng-review    → 架构 + 数据流 + 测试   │
│       │                                     │
│  /design-consultation→ 竞品调研 + 创意方案     │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│           🔨 DEVELOPMENT PHASE               │
│                                             │
│  Claude Code 基于规划输出编写代码             │
│  结构化角色提示替代通用指令                    │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│           🔍 REVIEW PHASE                    │
│                                             │
│  /review    → 代码深度分析 + 自动修复         │
│  智能路由   → 判断哪些审查是必要的             │
│  审查仪表盘 → 跟踪完成状态                    │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│           🧪 QA PHASE                        │
│                                             │
│  /qa     → 真实浏览器端到端测试               │
│  /browse → 截图 + 交互验证                    │
│  自动生成回归测试 → 每个 Bug 修复一个测试      │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│           🚀 SHIPPING PHASE                  │
│                                             │
│  /ship            → 测试 + 覆盖率审计 + PR   │
│  /document-release→ 文档自动同步              │
│  /retro           → 回顾与数据分析            │
└─────────────────────────────────────────────┘
```

## 三、技术架构精析

### 3.1 三层架构设计

gstack 的浏览器自动化采用三层架构，解决两个关键问题：**亚秒级延迟** 和 **状态持久化**。

```
┌──────────────────────────────────────┐
│  Layer 1: CLI（编译后的 Bun 二进制）    │
│  读取状态文件 → POST 命令到服务器       │
├──────────────────────────────────────┤
│  Layer 2: Server（Bun.serve）         │
│  分发命令 → Chrome DevTools Protocol   │
├──────────────────────────────────────┤
│  Layer 3: Chromium Headless           │
│  持久化标签页、Cookies、登录会话        │
│  30 分钟空闲超时自动关闭               │
└──────────────────────────────────────┘
```

**关键设计决策**：

| 决策 | 选择 | 原因 |
|------|------|------|
| 运行时 | Bun（而非 Node.js）| 编译为 ~58MB 单文件、原生 SQLite、原生 TypeScript |
| 通信协议 | HTTP（而非 WebSocket）| 更简单、curl 可调试、足够快 |
| 元素定位 | Accessibility Tree Refs（而非 CSS 选择器）| 不受 CSP 限制、不影响 DOM、跨 Shadow DOM |
| 错误处理 | 面向 AI Agent 的错误信息 | 让 AI 能自我纠正，而非给人看堆栈信息 |

### 3.2 引用系统（@refs）—— 创新的元素定位方式

传统自动化依赖脆弱的 CSS 选择器或 XPath，gstack 发明了基于可访问性树的引用系统：

```
传统方式：document.querySelector('#app > div:nth-child(3) > button.submit')
gstack：@e3（第3个可访问元素）
```

**为什么这很重要**：
- **不注入 DOM**：不会破坏 CSP 策略或框架 hydration
- **过期检测**：页面变化后 ~5ms 内检测到引用失效
- **cursor 交互引用**：`-C` 标志捕获 ARIA 树之外的可点击元素

### 3.3 安全架构

gstack 的安全设计值得产品经理学习：

```
安全层级：
├── Localhost 绑定 → 网络不可达
├── Bearer Token → 每个会话随机 UUID
├── Cookie 处理 → 内存解密，不持久化明文
├── 数据库只读 → 复制临时文件，不修改原始数据
├── 日志脱敏 → Cookie 值截断，只记录元数据
└── Shell 注入防护 → 硬编码路径 + 显式参数数组
```

## 四、PM 视角：gstack 对产品管理的颠覆性影响

### 4.1 重新定义"最小可行团队"

传统互联网产品的最小团队：
```
产品经理 × 1 + 设计师 × 1 + 前端 × 2 + 后端 × 2 + QA × 1 = 7 人
月成本：约 35-70 万（一线城市）
```

gstack 模式的最小团队：
```
技术型创始人 × 1 + gstack = 等效 20 人团队
月成本：Claude Pro $200 + 基础设施
```

**PM 必须思考的问题**：
- 你的产品路线图是基于 7 人团队的产出假设，还是 1+AI 的产出假设？
- 竞品如果采用了这种模式，你的迭代速度差距有多大？
- 需求积压（Backlog）的管理逻辑是否需要重构？

### 4.2 新的质量保证范式

gstack 的 QA 流程对 PM 的启示：

| 传统 QA | gstack QA | PM 策略调整 |
|---------|-----------|------------|
| 手动测试用例 | AI 自动探索测试 | 减少测试用例编写时间，重点关注场景覆盖 |
| 截图人工比对 | 自动截图 + AI 审计 | 视觉回归测试可以更频繁 |
| Bug → 修复 → 再测 | Bug → 修复 → 原子提交 → 自动回归测试 | 热修复的信心和速度大幅提升 |
| 覆盖率报告人工检查 | `/ship` 自动审计覆盖率 | 将覆盖率指标纳入 Definition of Done |

### 4.3 设计优先的开发流程

gstack 强制实施 **"Design-First Architecture"**（设计优先架构）：

```
/plan-design-review（80 项审计）
        │
        ▼ 设计决策向下传导
/plan-eng-review（架构必须遵循设计）
        │
        ▼
开发实现（设计系统约束代码）
        │
        ▼
/design-review（前后截图对比验证）
```

**对 PM 的启示**：在 AI 加速开发的时代，设计质量是最容易被牺牲的环节。gstack 通过流程设计确保"快"不以"好"为代价。

## 五、实操指南：如何将 gstack 理念应用到产品管理

### 5.1 构建你的 PM 版 gstack

受 gstack 启发，产品经理可以构建自己的 AI 专家团队：

```markdown
# PM gstack：AI 产品经理的虚拟团队

## /pm-user-voice — 用户之声分析师
输入用户反馈 → 分类、聚类、提取洞察 → 输出优先级建议

## /pm-spec-review — 需求审查专家
输入 PRD → 检查完整性、一致性、可行性 → 输出审查报告

## /pm-data-detective — 数据侦探
输入数据指标 → 异常检测、归因分析 → 输出可行动洞察

## /pm-competitor-scan — 竞品雷达
输入竞品更新 → 功能对比、战略分析 → 输出威胁/机会评估

## /pm-release-notes — 发版沟通专家
输入代码变更日志 → 生成面向用户的发版说明 → 面向不同受众优化

## /pm-retro — 迭代复盘主持人
输入 sprint 数据 → 趋势分析、改进建议 → 输出复盘报告
```

### 5.2 需求文档中融入 gstack 工作流

当你的工程团队使用 gstack 时，PRD 应该包含：

```markdown
## gstack 集成指引

### 规划阶段
- [ ] 需求已通过 /plan-ceo-review 的产品视角验证
- [ ] 设计方案已通过 /plan-design-review 的 80 项审计
- [ ] 技术方案已通过 /plan-eng-review 的架构评审

### 质量门禁
- [ ] /qa 端到端测试通过
- [ ] /review 代码审查无严重问题
- [ ] /ship 覆盖率审计达标（>80%）
- [ ] /document-release 文档已同步

### 发布标准
- [ ] /retro 回顾数据已记录
- [ ] 设计前后截图对比已确认
```

### 5.3 评估团队是否适合引入 gstack

<script setup>
import { ref, computed } from 'vue'

const dimensions = ref([
  { name: '团队技术能力', description: '团队成员对 AI 编程工具的熟悉程度', score: 3 },
  { name: '产品迭代速度需求', description: '当前迭代速度是否满足市场需求', score: 3 },
  { name: '工程质量标准', description: '对代码质量和测试覆盖率的要求', score: 3 },
  { name: '团队规模压力', description: '是否面临人力不足或成本控制压力', score: 3 },
  { name: '技术栈现代化程度', description: '当前技术栈是否支持 AI 集成', score: 3 },
  { name: '团队开放度', description: '团队对新工具和新流程的接受程度', score: 3 },
])

const totalScore = computed(() => dimensions.value.reduce((sum, d) => sum + d.score, 0))
const maxScore = computed(() => dimensions.value.length * 5)
const readiness = computed(() => {
  const pct = (totalScore.value / maxScore.value) * 100
  if (pct >= 80) return { level: '🟢 强烈推荐', color: '#10b981', msg: '你的团队非常适合引入 gstack。建议立即开始试点，预期能显著提升产出效率。' }
  if (pct >= 60) return { level: '🟡 适合试点', color: '#f59e0b', msg: '团队具备基本条件。建议选择一个非关键项目先行试点，积累经验后逐步推广。' }
  if (pct >= 40) return { level: '🟠 需要准备', color: '#f97316', msg: '部分条件尚不成熟。建议先在技术能力和团队培训上投入，3-6 个月后重新评估。' }
  return { level: '🔴 暂不建议', color: '#ef4444', msg: '当前条件差距较大。建议先完成基础技术栈升级和团队 AI 技能培训。' }
})
</script>

<div class="pm-tool">
<h4>gstack 引入就绪度评估</h4>
<p style="color: #666; margin-bottom: 16px;">对每个维度进行 1-5 分评分（1=很差，5=优秀）</p>

<div v-for="d in dimensions" :key="d.name" style="margin-bottom: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
    <strong>{{ d.name }}</strong>
    <span style="color: #6366f1; font-weight: bold; font-size: 18px;">{{ d.score }}</span>
  </div>
  <div style="color: #666; font-size: 13px; margin-bottom: 6px;">{{ d.description }}</div>
  <input type="range" :min="1" :max="5" v-model.number="d.score" style="width: 100%; cursor: pointer;" />
  <div style="display: flex; justify-content: space-between; font-size: 12px; color: #999;">
    <span>1 - 很差</span>
    <span>3 - 一般</span>
    <span>5 - 优秀</span>
  </div>
</div>

<div class="pm-result" style="margin-top: 24px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <span style="font-size: 20px; font-weight: bold;">综合得分：{{ totalScore }} / {{ maxScore }}</span>
    <span :style="{ color: readiness.color, fontWeight: 'bold', fontSize: '18px' }">{{ readiness.level }}</span>
  </div>
  <div style="background: #f1f5f9; border-radius: 12px; height: 16px; overflow: hidden; margin-bottom: 12px;">
    <div :style="{ width: (totalScore / maxScore * 100) + '%', height: '100%', background: readiness.color, borderRadius: '12px', transition: 'all 0.3s' }"></div>
  </div>
  <p style="color: #475569; line-height: 1.6;">{{ readiness.msg }}</p>
</div>
</div>

## 六、gstack 的产品化思维解析

从产品经理视角看，gstack 本身就是一个优秀的产品设计范例：

### 6.1 极致的安装体验

```bash
# 30 秒安装 —— 一行命令
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

**产品设计启示**：好产品的 Time-to-Value 应该尽可能短。

### 6.2 渐进式学习曲线

```
初级用户：/qa /review /ship  → 3 个命令覆盖 80% 场景
中级用户：+ /plan-* 系列    → 加入规划能力
高级用户：+ /retro + 并行   → 完整工作流 + 10 个并行会话
```

**产品设计启示**：功能丰富不等于上手困难，核心路径必须简洁。

### 6.3 用户导向的沟通

gstack 的 CHANGELOG 写作规范：

```
❌ 技术导向："Refactored daemon lifecycle management module"
✅ 用户导向："You can now run 10 parallel sessions without port conflicts"
```

**产品设计启示**：永远从用户价值角度沟通变更。

## 七、关键数据与成果

Garry Tan 公开的生产力数据：

| 指标 | 数值 | 说明 |
|------|------|------|
| 总代码量 | 60 万+ 行 | 60 天内完成 |
| 日均可用代码 | 10,000 - 20,000 行 | 兼职（同时担任 YC CEO） |
| 7 天产出 | 140,751 行新增 | 362 次提交，净增 ~115K 行 |
| 安装时间 | 30 秒 | 一行命令 |
| 命令响应 | 100-200ms | 首次 ~3s（启动 Chromium） |
| 设计审计项 | 80 项 | `/plan-design-review` |
| 专家角色 | 13 个 | 全部为 Markdown 技能文件 |
| 许可证 | MIT | 完全免费开源 |

## 八、延伸思考

### 对产品行业的影响

1. **小团队的黄金时代**：gstack 证明了 1 个技术型创始人可以达到 20 人团队的产出。这意味着更多 "Solo Founder" 产品会出现。

2. **PM 角色的进化**：当开发效率不再是瓶颈时，产品经理的核心价值从"需求管理"转向"用户洞察"和"战略判断"。

3. **质量标准的提升**：AI 辅助 QA 使得全面测试成为默认选项而非奢侈品，用户对产品质量的期望会提升。

4. **文档的自动化**：`/document-release` 解决了"文档永远滞后于代码"的行业痛点。

### 需要警惕的风险

| 风险 | 描述 | 缓解策略 |
|------|------|---------|
| 过度依赖 AI | 团队丧失底层工程能力 | 保持核心技术人才的代码审查职责 |
| 质量幻觉 | AI 通过测试 ≠ 真正好用 | 坚持用户测试和真人体验审查 |
| 安全盲区 | AI 生成代码可能引入安全漏洞 | 引入独立安全审计流程 |
| 需求膨胀 | "反正开发很快"导致功能堆砌 | 坚持 MVP 思维和用户价值验证 |

---

::: info 相关资源
- **GitHub 仓库**：[github.com/garrytan/gstack](https://github.com/garrytan/gstack)
- **许可证**：MIT（免费开源）
- **前置要求**：Claude Code + Git + Bun v1.0+
:::
