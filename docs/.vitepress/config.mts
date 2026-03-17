import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI Native 产品经理',
  description: '成为 AI Native 产品经理的知识沉淀',
  lang: 'zh-CN',
  base: '/product-manager/',

  head: [
    ['link', { rel: 'icon', href: '/product-manager/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '入门指南', link: '/guide/what-is-ai-native-pm' },
      {
        text: '知识体系',
        items: [
          { text: 'AI 技术基础', link: '/ai-foundations/overview' },
          { text: 'AI 工具链', link: '/ai-tools/overview' },
          { text: 'AI 产品设计', link: '/product-design/overview' },
          { text: '产品方法论', link: '/methodology/overview' },
        ],
      },
      {
        text: '进阶',
        items: [
          { text: 'AI 产品战略', link: '/strategy/overview' },
          { text: 'AI 伦理与治理', link: '/ethics/overview' },
        ],
      },
      { text: '实战案例', link: '/cases/overview' },
      { text: '工具箱', link: '/tools/overview' },
      { text: '学习资源', link: '/resources/overview' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '什么是 AI Native 产品经理', link: '/guide/what-is-ai-native-pm' },
            { text: '传统 PM vs AI Native PM', link: '/guide/traditional-vs-ai-native' },
            { text: '学习路径', link: '/guide/learning-path' },
            { text: '面试攻略', link: '/guide/interview-guide' },
          ],
        },
      ],
      '/ai-foundations/': [
        {
          text: 'AI 技术基础',
          items: [
            { text: '概览', link: '/ai-foundations/overview' },
            { text: '机器学习核心概念', link: '/ai-foundations/ml-basics' },
            { text: 'LLM 深度理解', link: '/ai-foundations/llm-deep-dive' },
            { text: 'AI 应用架构模式', link: '/ai-foundations/architecture-patterns' },
            { text: '数据策略', link: '/ai-foundations/data-strategy' },
            { text: 'AI 产品四层架构', link: '/ai-foundations/four-layer-architecture' },
            { text: '模型选型实战指南', link: '/ai-foundations/model-selection-guide' },
            { text: 'LLM 训练原理与 RLHF', link: '/ai-foundations/llm-training-rlhf' },
          ],
        },
      ],
      '/ai-tools/': [
        {
          text: 'AI 工具链',
          items: [
            { text: '概览', link: '/ai-tools/overview' },
            { text: 'LLM 基础认知', link: '/ai-tools/llm-basics' },
            { text: 'Prompt Engineering', link: '/ai-tools/prompt-engineering' },
            { text: 'AI 产品设计工具', link: '/ai-tools/design-tools' },
            { text: 'AI 辅助产品设计工作流', link: '/ai-tools/ai-workflow' },
            { text: '高级 Prompt Engineering', link: '/ai-tools/advanced-prompt-engineering' },
            { text: 'RAG 深度实战指南', link: '/ai-tools/rag-deep-dive' },
          ],
        },
      ],
      '/product-design/': [
        {
          text: 'AI 产品设计与体验',
          items: [
            { text: '概览', link: '/product-design/overview' },
            { text: '人机交互准则', link: '/product-design/human-ai-interaction' },
            { text: 'AI UX 设计原则', link: '/product-design/ai-ux-principles' },
            { text: 'AI 设计模式', link: '/product-design/ai-design-patterns' },
            { text: '信任与安全设计', link: '/product-design/trust-and-safety' },
          ],
        },
      ],
      '/methodology/': [
        {
          text: '产品方法论',
          items: [
            { text: '概览', link: '/methodology/overview' },
            { text: 'AI 产品需求分析', link: '/methodology/requirements' },
            { text: 'AI 功能设计模式', link: '/methodology/design-patterns' },
            { text: '数据驱动决策', link: '/methodology/data-driven' },
            { text: '知识库自进化机制', link: '/methodology/knowledge-management' },
            { text: '复盘驱动的知识沉淀', link: '/methodology/retrospective' },
          ],
        },
      ],
      '/strategy/': [
        {
          text: 'AI 产品战略',
          items: [
            { text: '概览', link: '/strategy/overview' },
            { text: '产品战略框架', link: '/strategy/product-strategy' },
            { text: '商业化与定价', link: '/strategy/monetization' },
            { text: '路线图规划', link: '/strategy/roadmap' },
            { text: '跨职能协作', link: '/strategy/cross-functional' },
          ],
        },
      ],
      '/ethics/': [
        {
          text: 'AI 伦理与治理',
          items: [
            { text: '概览', link: '/ethics/overview' },
            { text: '负责任 AI 原则', link: '/ethics/responsible-ai' },
            { text: '合规与监管', link: '/ethics/compliance' },
            { text: 'AI 评估体系', link: '/ethics/evaluation' },
          ],
        },
      ],
      '/cases/': [
        {
          text: '实战案例',
          items: [
            { text: '概览', link: '/cases/overview' },
            { text: 'AI 辅助产品设计系统', link: '/cases/product-design-system' },
          ],
        },
      ],
      '/tools/': [
        {
          text: 'AI 产品经理工具',
          items: [
            { text: '工具箱总览', link: '/tools/overview' },
            { text: 'AI 推理成本计算器', link: '/tools/ai-cost-calculator' },
            { text: 'AI 功能 ROI 计算器', link: '/tools/roi-calculator' },
            { text: '技术方案决策器', link: '/tools/tech-decision' },
            { text: '模型选型推荐器', link: '/tools/model-selector' },
            { text: 'Token 用量估算器', link: '/tools/token-estimator' },
            { text: 'Build vs Buy 决策器', link: '/tools/build-vs-buy' },
            { text: 'Prompt 质量评分卡', link: '/tools/prompt-scorecard' },
            { text: 'AI 产品成熟度评估', link: '/tools/ai-maturity' },
          ],
        },
        {
          text: '需求与优先级',
          items: [
            { text: 'RICE 评分计算器', link: '/tools/rice-calculator' },
            { text: 'KANO 模型分析器', link: '/tools/kano-analyzer' },
            { text: 'MoSCoW 优先级矩阵', link: '/tools/moscow-matrix' },
            { text: '用户故事生成器', link: '/tools/user-story-generator' },
            { text: '用户画像生成器', link: '/tools/persona-generator' },
          ],
        },
        {
          text: '数据与商业分析',
          items: [
            { text: 'A/B 测试计算器', link: '/tools/ab-test-calculator' },
            { text: '漏斗转化率分析', link: '/tools/funnel-calculator' },
            { text: 'LTV 与单位经济模型', link: '/tools/ltv-calculator' },
            { text: 'NPS 计算器', link: '/tools/nps-calculator' },
            { text: 'TAM/SAM/SOM 市场规模', link: '/tools/tam-calculator' },
            { text: '定价策略模拟器', link: '/tools/pricing-simulator' },
            { text: '北极星指标设计器', link: '/tools/northstar-designer' },
            { text: '竞品分析雷达图', link: '/tools/competitor-radar' },
          ],
        },
        {
          text: '体验与项目管理',
          items: [
            { text: 'SUS 可用性评分', link: '/tools/sus-calculator' },
            { text: '工时估算工具', link: '/tools/estimate-calculator' },
            { text: '面试题练习器', link: '/tools/interview-practice' },
          ],
        },
      ],
      '/resources/': [
        {
          text: '学习资源',
          items: [
            { text: '资源汇总', link: '/resources/overview' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryantryor/product-manager' },
    ],

    footer: {
      message: '用 AI 思维做产品',
      copyright: '© 2026 AI Native 产品经理知识库',
    },

    search: {
      provider: 'local',
    },

    outline: {
      label: '目录',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
