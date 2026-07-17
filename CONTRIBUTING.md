# Alethia AI 项目协作规范

> 让协作有章可循，让代码可追溯，让新人快速上手。
> 完整 HTML 版本：[alethia-contributing.html](https://alethia-docs/alethia-contributing/alethia-contributing.html)

---

## 1. Git 分支管理

采用 **Trunk-Based Development**（主干开发）。`main` 分支禁止直接 push，所有变更通过 PR 合并。

| 分支 | 用途 | 从哪拉 | 合并到哪 |
|------|------|--------|----------|
| `main` | 生产环境代码，受保护 | — | — |
| `develop` | 开发主分支，日常集成 | `main` | — |
| `feature/xxx` | 功能分支，kebab-case 命名 | `develop` | `develop` |
| `release/v0.x.0` | 发布分支，只修 Bug | `develop` | `main` + `develop` |
| `hotfix/xxx` | 紧急修复 | `main` | `main` + `develop` |

**命名示例**：`feature/add-vector-search`、`hotfix/fix-auth-token-leak`

---

## 2. 提交信息规范

强制采用 **Conventional Commits**（Angular 规范），通过 commitlint + husky 自动校验。

```
<type>(<scope>): <subject>
```

### type 定义

| type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(retrieval): 实现RRF融合多路检索结果排序` |
| `fix` | Bug 修复 | `fix(agent): 修复沙箱white-list权限校验绕过` |
| `perf` | 性能优化 | `perf(storage): 向量索引改用HNSW，搜索延迟降低60%` |
| `refactor` | 重构（不改变功能） | `refactor(brain): 提取BrainAPI公共中间件` |
| `docs` | 文档 | `docs(api): 补充BrainAPI JSDoc注释` |
| `style` | 格式（不影响逻辑） | `style(web): 统一组件缩进` |
| `test` | 测试 | `test(agent): 补充智能体沙箱单元测试` |
| `chore` | 构建/工具/依赖 | `chore(deps): 升级Bun到1.2.x` |
| `ci` | CI/CD | `ci: 新增shadow-eval流水线阶段` |

### scope 建议

使用 Alethia 模块名：`brain`、`web`、`cli`、`agent`、`dream`、`storage`、`retrieval`、`ingestion`、`orchestrator`

### subject 规则

- 中文描述，动词开头
- 不超过 72 字符
- 不加句号
- 回答"这个提交做了什么"而非"怎么做的"

---

## 3. 代码评审 (Code Review)

### 硬性门禁

所有代码合并进 `develop` 或 `main`，必须同时满足：
- 至少 **1 人 Approval**
- CI 流水线全部通过（lint → test → build）

### Review 检查清单

| 维度 | 检查点 |
|------|--------|
| 业务逻辑 | 是否正确实现了需求？边界条件是否覆盖？ |
| 安全 | 是否有 SQL 注入、XSS、权限绕过？敏感信息是否泄露？ |
| 性能 | 是否有 N+1 查询、不必要的循环、未使用索引的查询？ |
| 可读性 | 命名是否清晰？注释是否解释了"为什么"？复杂逻辑是否有说明？ |
| 测试 | 关键路径是否有测试？异常场景是否覆盖？ |

### PR 描述模板

```markdown
## 变更概述
（一句话描述这个 PR 做了什么）

## 关联 Issue
Close #xxx

## 测试方式
- [ ] 单元测试通过
- [ ] 手动测试步骤：...

## 风险点
（可能影响哪些已有功能？）
```

---

## 4. 版本号命名

严格遵循 **SemVer 2.0**：`v主版本号.次版本号.修订号`

| 版本号 | 变更类型 | 示例 |
|--------|----------|------|
| 主版本号 | 不兼容的 API 大改 | BrainAPI 接口签名变更 |
| 次版本号 | 向下兼容的功能新增 | 新增 Agent 类型 |
| 修订号 | 向下兼容的 Bug 修复 | 修复检索排序错误 |

### 发布流程

1. 从 `develop` 拉出 `release/vX.Y.0` 分支
2. 在 release 分支上只修 Bug 和更新版本号
3. 测试通过后合并到 `main`
4. 在 `main` 上打 `vX.Y.0` tag
5. 合并回 `develop`
6. 触发部署流水线

---

## 5. Bug 与 Issue 流转

### Issue 标题格式

```
[类型] 简短描述

类型: Bug / Feature / Enhancement / Question
```

### Bug Issue 必填

- **复现步骤**：一步一步描述如何触发
- **预期行为**：应该发生什么
- **实际行为**：实际发生了什么
- **环境信息**：OS、Bun 版本、浏览器

### 优先级

| 级别 | 说明 | 响应时效 |
|------|------|----------|
| P0 | 阻断核心功能 | 2 小时内 |
| P1 | 影响主要功能 | 24 小时内 |
| P2 | 次要功能异常 | 本周内 |
| P3 | 优化建议 | 纳入 backlog |

---

## 6. 新人入职清单

1. 阅读本规范（CONTRIBUTING.md）
2. 阅读代码写作规范（CODING_STYLE.md）
3. 安装 VS Code 推荐扩展（Prettier、ESLint、Error Lens）
4. 运行 `bun setup` 初始化开发环境
5. 完成第一个 Good First Issue（标签 `good-first-issue`）
6. 提交第一个 PR 并走完 Review 流程