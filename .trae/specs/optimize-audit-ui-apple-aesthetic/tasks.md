# 审计 UI 优化 —— Apple 高级感 任务清单

- [x] Task 1: 建立 Apple 风格审计色彩体系与 CSS 变量
  - [x] 在全局 CSS 中定义审计语义色彩变量（`--audit-low`、`--audit-medium`、`--audit-high`）使用 Apple 风格色值
  - [x] 定义对应半透明背景色变量（`--audit-low-bg`、`--audit-medium-bg`、`--audit-high-bg`）
  - [x] 添加暗色模式下的色彩变体（`@media (prefers-color-scheme: dark)`）
  - [x] 定义审计专用阴影变量（`--audit-shadow-sm`、`--audit-shadow-md`、`--audit-shadow-lg`）

- [x] Task 2: 升级字体与排版系统
  - [x] 在审计相关 CSS 中引入 SF 风格字体栈（`-apple-system, 'SF Pro Display'` / `'SF Pro Text'` / `'SF Mono'`）
  - [x] 调整审计界面的卡片内边距、间距、行高、标题间距为 Apple 呼吸感标准
  - [x] 统一审计界面的字号层级（标题 20px/正文 15px/辅助 13px）

- [x] Task 3: 实现毛玻璃审计面板样式
  - [x] 创建 `.glass-panel` 通用 CSS 类（`backdrop-filter: blur(20px)` + 半透明背景 + 圆角 + 阴影）
  - [x] 创建 `.glass-panel-deep` 用于弹窗层（更高模糊度 + 更深阴影）
  - [x] 创建 `.glass-toolbar` 用于悬浮操作栏（`position: sticky` + 毛玻璃）

- [x] Task 4: 重构 Diff 审核面板为卡片式布局
  - [x] 每条变更渲染为独立 `.audit-card` 组件（`border-radius: 16px`、毛玻璃背景、4px 左侧彩色指示条）
  - [x] 高风险卡片实现呼吸光晕动画（`@keyframes breathe` 微弱红色阴影脉冲）
  - [x] 卡片内 diff 对比视图使用圆角代码块样式
  - [x] 实现顶部悬浮操作栏（"全部接受"/"全部拒绝" + 变更计数）

- [x] Task 5: 实现审计微动效系统
  - [x] 接受变更 spring 动画（`cubic-bezier(0.34, 1.56, 0.64, 1)` 缩小 + 淡出）
  - [x] 拒绝变更抖动动画（`@keyframes shake` + 淡出）
  - [x] 卡片悬停效果（`scale(1.01)` + 阴影加深，200ms 过渡）
  - [x] 相邻卡片列表动画（`layout` 动画平滑填补空位）

- [x] Task 6: 重构计划审核器视觉
  - [x] 工作流步骤圆角连接线 + 节点样式（实心/描边/警告三种状态）
  - [x] 人在回路审核节点突出样式（柔和边框 + 图标 + 说明文字）
  - [x] 审核操作区展开/收起动画

- [x] Task 7: 重构 Dashboard 审计卡片
  - [x] 待审核变更卡片毛玻璃背景
  - [x] 风险分布小圆点颜色指示器
  - [x] 最近变更摘要展示
  - [x] 点击跳转审计面板

# 任务依赖
- Task 2 依赖 Task 1（色彩变量定义后字体才能统一引用）
- Task 3 依赖 Task 1（毛玻璃面板依赖语义色彩变量）
- Task 4 依赖 Task 3（Diff 卡片依赖毛玻璃面板样式）
- Task 5 依赖 Task 4（微动效依赖卡片组件完成）
- Task 6 和 Task 7 可与 Task 2-5 并行开发