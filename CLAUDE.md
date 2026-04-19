## 多 Agent 工作流规范

- **仅当用户明确发出 `code review` 请求时**（如"帮我 review"、"做一次代码审查"、"review 一下"、"code review"等），才调用 reviewer / code-reviewer agent 审查
- **未收到明确 review 指令时**，正常代码修改后**不要自动发起 review**
- 若用户明确要求 review，则审查完成后，再根据审查意见决定是否调用 fixer 修复

## 三视角并行 Review 规范

**仅当用户明确发出 code review 请求时**（如"帮我 review"、"做一次代码审查"、"review 一下"、"code review"等），才启动以下三个 reviewer agent，在各自独立线程中完成审查：

- **red-reviewer**：安全/风险/漏洞视角，结果写入 `review-opinion/red-review-opinion.md`
- **yellow-reviewer**：实用主义/落地性视角，结果写入 `review-opinion/yellow-review-opinion.md`
- **green-reviewer**：用户体验/产品逻辑视角，结果写入 `review-opinion/green-review-opinion.md`

**并行启动方式**：在同一条消息中同时调用三个 Agent，不得串行等待。
三个 reviewer 互相独立，不得互相等待或依赖对方的结论。
每个 reviewer 完成后自行将报告写入对应文件（覆盖上次内容）。

待三个 reviewer **全部完成**写入后，**必须**启动 **leader-reviewer**：
- 读取三份报告，在各条意见末尾追加提出者标注
- 输出权重排序后的汇总报告到 `review-opinion/leader-review-summary.md`
