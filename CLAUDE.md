# LoveTI - 恋爱倾向测试系统架构设计

## 系统工程视角下的完整架构视图

---

## 一、系统愿景与边界

**产品定义**：面向中国 Z 世代（15-30岁）的恋爱倾向测试系统，通过 51 道中性化题目输出 24 种基于 ABCD 全序列人格的个性化结果。

**核心价值主张**：
- 全序列优先级判定（4! = 24 种唯一排列）
- 末位维度作为"浪漫盲区"的精确区分
- 心理测量学支撑的题目设计
- 现代柔和极简 + 玻璃拟态的视觉体验

**不做**：
- 不做人格标签的简单叠加（如 "你是 A 型人"）
- 不做娱乐化/游戏化的测试结果
- 不依赖性别刻板印象的题目

---

## 二、模块拆解 (Module Decomposition)

```
LoveTI System
├── 题目引擎 (Question Engine)
│   ├── 题目库 (Question Bank)
│   ├── 题目分发器 (Question Dispatcher)
│   └── 维度映射器 (Dimension Mapper)
├── 计算核心 (Calculation Core)
│   ├── 频次统计器 (Frequency Counter)
│   ├── 全排列生成器 (Full Ranking Generator)
│   └── 序列判定器 (Sequence Determinator)
├── 结果生成器 (Result Generator)
│   ├── 人格档案库 (Persona Library)
│   ├── 文案渲染器 (Copy Renderer)
│   └── 标签提取器 (Tag Extractor)
├── 可视化层 (Visualization Layer)
│   ├── 雷达图生成器 (Radar Chart)
│   ├── 序列条渲染器 (Sequence Bar)
│   └── 动画控制器 (Animation Controller)
└── 前端展示 (Frontend)
    ├── 题目录入 (Question Input)
    ├── 进度指示 (Progress Indicator)
    └── 结果页 (Result Page)
```

---

## 三、模块交互关系 (Module Interaction)

```
用户交互流：
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [题目录入] ──▶ [题目引擎] ──▶ [计算核心] ──▶ [结果生成器] │
│       │              │              │              │       │
│       ▼              ▼              ▼              ▼       │
│  [前端展示] ◀── [可视化层] ◀── [结果数据] ◀── [人格档案]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

数据流：
1. 用户选择答案 → 题目引擎记录 (Q_id, dimension)
2. 全部答题完成 → 计算核心统计 A/B/C/D 频次
3. 频次排序 → 全排列生成器输出唯一序列
4. 序列匹配 → 结果生成器查找人格档案
5. 人格档案 → 文案渲染 + 标签提取
6. 可视化数据 + 文案 → 前端渲染
```

**模块依赖矩阵**：

| 模块 | 依赖模块 | 数据输入 | 数据输出 |
|------|----------|----------|----------|
| 题目引擎 | 无 | 题目库 | 用户答案列表 |
| 计算核心 | 题目引擎 | 答案列表 | 频次统计 + 序列 |
| 结果生成器 | 计算核心 | 序列 | 人格档案JSON |
| 可视化层 | 结果生成器 | 人格档案 | 图表数据 |
| 前端展示 | 可视化层 | 图表数据 + 文案 | 页面渲染 |

---

## 四、核心算法设计

### 4.1 全序列判定算法

```python
# 核心逻辑
def determine_sequence(answers):
    # Step 1: 统计各维度频次
    frequency = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    for answer in answers:
        frequency[answer.dimension] += 1

    # Step 2: 构建加权排序键
    # 频次高 = 排名靠前，但需要处理相等情况
    sorted_dims = sorted(
        frequency.items(),
        key=lambda x: (-x[1], x[0])  # 频次降序，字母升序
    )

    # Step 3: 生成完整序列（考虑频次相等时的字典序）
    sequence = ''.join([dim for dim, _ in sorted_dims])

    # Step 4: 24 序列映射（确保唯一性）
    return SEQUENCE_MAP[sequence]  # 如 'BACD' → 'CBAD'
```

### 4.2 序列冲突解决机制

```python
# 相近序列区分逻辑
def resolve_sequence_conflict(sequence_candidate, frequencies):
    """
    解决前两位相同但末位不同的序列冲突
    例如: CBAD vs CBDA
    """
    # CBAD: 末位 D → 逃避现实/拒绝承诺
    # CBDA: 末位 A → 去仪式化/直戳本质

    if frequencies['D'] > frequencies['A']:
        return sequence_candidate  # 倾向于 CBAD
    else:
        return swap_last_two(sequence_candidate)  # 转为 CBDA
```

---

## 五、技术依赖 (Technical Dependencies)

### 5.1 前端技术栈

| 技术 | 用途 | 版本要求 |
|------|------|----------|
| React 18+ | UI 框架 | 最新稳定版 |
| TypeScript | 类型安全 | 5.x |
| Tailwind CSS | 样式系统 | 3.x |
| Framer Motion | 动画交互 | 11.x |
| Recharts | 雷达图 | 2.x |
| Zustand | 状态管理 | 4.x |
| Vite | 构建工具 | 5.x |

### 5.2 后端技术栈（可选/SSR场景）

| 技术 | 用途 | 说明 |
|------|------|------|
| Next.js 14 | SSR/SSG | 结果页 SEO |
| Supabase | 数据库 | 人格档案存储 |
| Vercel | 部署 | 边缘节点 |

### 5.3 数据存储

| 数据类型 | 存储方案 |
|----------|----------|
| 题目内容 | JSON 文件（静态） |
| 人格档案 | JSON 文件（静态） |
| 用户答案（匿名） | LocalStorage |
| 分析统计（聚合） | Supabase Analytics |

---

## 六、数据模型设计

### 6.1 题目数据结构

```typescript
interface Question {
  id: number;                    // 1-51
  content: string;               // 题目文本（中性化）
  options: {
    A: { text: string; dimension: 'A' };
    B: { text: string; dimension: 'B' };
    C: { text: string; dimension: 'C' };
    D: { text: string; dimension: 'D' };
  };
  lifePhase: 'firstMeet' | 'passion' | 'conflict' | 'stable' | 'distance' | 'longTerm';
}
```

### 6.2 人格档案结构

```typescript
interface Persona {
  sequence: string;             // 如 'CBAD'
  sequenceRank: number;           // 1-24
  name: string;                  // '精神漫游癖'
  tags: string[];                // ['#氛围至上', '#精神自由', ...]
  loveFilter: {
    worldColor: string;           // 世界色彩描述
    perceptionOfLove: string;    // 对爱的感知方式
  };
  perfectMatch: {
    sequences: string[];         // ['DBCA', 'DCBA']
    reason: string;             // 互补逻辑说明
  };
  warningSign: {
    blindSpot: string;          // 浪漫盲区
    incompatibleTypes: string[]; // 不合拍类型
    tone: 'humorous' | 'sharp';  // 文案调性
  };
  visualConfig: {
    primaryColor: string;         // 主色调
    accentColor: string;          // 强调色
    chartType: 'radar' | 'bar';  // 推荐图表
  };
}
```

---

## 七、瓶颈与难点分析

### 7.1 核心难点

| 难点 | 描述 | 解决方案 |
|------|------|----------|
| **序列冲突** | ABCD 频次相等时如何判定唯一序列 | 字典序 + 用户行为特征回溯 |
| **末位区分** | CBAD vs CBDA 等相近序列的精确区分 | 以末位维度作为"排斥元素"的核心区分点 |
| **中性化题目** | 避免所有性别刻板印象词汇 | 建立禁用词库 + AI 辅助检查 |
| **人格唯一性** | 24 种人格必须有明显可感知的差异 | 每种人格的"第四位盲区"必须有独特表达 |

### 7.2 心理测量学挑战

| 挑战 | 描述 | 解决方案 |
|------|------|----------|
| **题目信度** | 同一维度多次测量应得一致结果 | 同维度题目分散在 51 题中 |
| **题目效度** | 题目确实测量了目标维度 | 专家评审 + 预测试验 |
| **社会期望偏差** | 用户可能选"社会期望"答案而非真实偏好 | 选项模糊化 + 情境化题目 |
| **极端响应** | 用户倾向选极端选项 | 题目平衡正负向表述 |

---

## 八、整体串联逻辑 (Integration Logic)

### 8.1 用户旅程状态机

```
[START] ──▶ [LOADING] ──▶ [ANSWERING] ──▶ [CALCULATING] ──▶ [RESULT]
                   │             │              │              │
                   │             ▼              ▼              │
                   │        [PROGRESS]     [ANIMATING]         │
                   │             │              │              │
                   │             ▼              ▼              ▼
                   └──────────────────────────────────────────[RESTART]
```

### 8.2 核心流程伪代码

```python
def main_flow():
    # 1. 初始化
    questionBank = load_questions()
    personaLibrary = load_personas()

    # 2. 题目录入
    answers = []
    for q in questionBank.questions:
        answer = present_question(q)
        answers.append(answer)

    # 3. 序列计算
    frequencies = count_dimensions(answers)
    ranking = generate_full_ranking(frequencies)
    sequence = map_to_persona_sequence(ranking)

    # 4. 结果获取
    persona = personaLibrary.find(sequence)

    # 5. 可视化渲染
    chartData = build_chart_data(frequencies, ranking)
    rendered = render_persona_copy(persona)

    # 6. 页面展示
    display_result(rendered, chartData)
```

---

## 九、可落地软件视图

### 9.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
├──────────────┬──────────────┬───────────────┬───────────────────┤
│  QuestionUI  │ ProgressBar  │ ResultPage    │ ShareCard        │
├──────────────┴──────────────┴───────────────┴───────────────────┤
│                      State Management (Zustand)                 │
│                    [answers, currentQ, result]                   │
├─────────────────────────────────────────────────────────────────┤
│                         Core Engine                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Question    │  │ Calculation │  │ Result                  │  │
│  │ Engine      │──▶│ Core        │──▶│ Generator               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                         Data Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ questions   │  │ personas    │  │ dimension_weights       │  │
│  │ .json       │  │ .json       │  │ .json                   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 文件结构

```
LoveTI/
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RadarChart.tsx
│   │   ├── SequenceBar.tsx
│   │   ├── ResultCard.tsx
│   │   └── ShareCard.tsx
│   ├── engine/
│   │   ├── questionEngine.ts
│   │   ├── calculationCore.ts
│   │   └── resultGenerator.ts
│   ├── data/
│   │   ├── questions.json      # 51道题目
│   │   ├── personas.json       # 24种人格档案
│   │   └── dimensionConfig.json
│   ├── stores/
│   │   └── quizStore.ts
│   ├── hooks/
│   │   └── useQuizFlow.ts
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── assets/
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md (this file)
```

---

## 十、开发优先级

### Phase 1: 核心引擎 MVP
- [ ] 题目数据结构定义
- [ ] 51 道题目生成
- [ ] 计算核心（全序列算法）
- [ ] 24 种人格档案

### Phase 2: 前端实现
- [ ] 题目录入界面
- [ ] 进度指示
- [ ] 结果页
- [ ] 雷达图/序列条

### Phase 3: 视觉优化
- [ ] Glassmorphism 效果
- [ ] 动画交互
- [ ] 移动端适配

### Phase 4: 高级功能
- [ ] 分享卡片生成
- [ ] 结果持久化
- [ ] 预测试验

---

## 十一、配置权限

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash",
      "Glob",
      "Grep",
      "Agent",
      "TaskCreate",
      "TaskUpdate",
      "TaskList",
      "TaskStop",
      "TaskGet",
      "TaskOutput",
      "WebFetch",
      "WebSearch"
    ],
    "defaultMode": "acceptEdits"
  },
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "~/.claude/projects/LoveTI/memory/",
  "respectGitignore": false,
  "language": "zh-CN"
}
```

---

## 十二、思考后行动原则

**在开始任何代码生成前，必须确认**：
1. 模块边界是否清晰
2. 数据流是否可追溯
3. 边界情况是否考虑
4. 测试用例是否设计

**当遇到模糊需求时**：
1. 先查询人格档案库，确认是否已有定义
2. 先思考算法，再动手实现
3. 先写接口契约，再写实现代码
