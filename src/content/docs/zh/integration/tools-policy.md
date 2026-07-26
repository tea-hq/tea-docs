---
title: 工具与策略
description: 可移植工具契约、效应词表、有序策略组合，以及持久化审批与授权。
---

> **轨道：** `next` 预发布。

`tea-tools` 是可移植工具运行时；`tea-policy` 是纯粹策略引擎。两者刻意分离：策略在不依赖执行器的
前提下消费工具元数据。

## 工具契约层

- `ToolSpec` —— 身份、语义版本、模型可见描述与对象模式、效应、提示/UI 提示、超时、并发、
  幂等性与重试安全。
- `ToolInvocation` —— 完整但不可信的对象参数。
- `ValidatedToolInvocation` —— 仅在注册表模式校验与纯资源解析后可构造。
- `ToolExecutor` —— 仅接收已校验调用与共享取消的对象安全惰性流端口。
- `ToolResult` —— 模型可见文本/图像、有界机器输出、安全详情与可选工具特定用量。
- `ToolRegistry` —— 确定性注册、冲突检测、校验、解析、执行委派与输出契约执行。

输入输出模式使用 JSON Schema Draft 2020-12（有界大小与深度）。模式编译拒绝外部 `$ref` 获取，
绝不读取本地文件或发起网络请求。执行顺序为：

```text
untrusted invocation -> input schema validation -> pure resource resolution
  -> validated invocation -> executor stream -> output schema validation
  -> terminal result/failure
```

无效参数绝不到达执行器。缺失终态事件与无效输出被归一化为类型化契约失败。

## 效应与调度

已知效应为 `fs.read`、`fs.write`、`fs.delete`、`process.spawn`、`network.request`、
`credential.read`、`clipboard.read`、`user.interaction` 与 `external.mutation`。未知效应被保留但
失败关闭为策略必需、串行且不自动重试。调度分类仅使用声明效应与执行语义——绝不使用工具名。
非幂等工具不能声明自动重试；被中断的不确定操作不可自动回放。

## 策略组合

`PolicyInput` 只能从 `ValidatedToolInvocation` 构建。它快照执行者、配置、会话/运行/工作区、规范
工具名与版本、已校验参数、声明效应、已解析资源、执行面、有界环境元数据、调用方提供的评估时间与
候选授权。策略绝不读时钟——调用方提供 `now`，使到期行为确定。

规则按固定权限顺序执行：

```text
Platform -> Organization -> Product -> Workspace
```

决策收紧是单调的：`Allow < Redirect < Ask < Deny < HardDeny`。下层可收紧但不能放宽既有决策。
`HardDeny` 立即终止。为空或完全弃权的引擎失败关闭。`UnknownEffectPolicy` 硬拒绝运行时不理解的
命名空间效应。规则迹仅含有界规则 ID、层与决策——不含原始参数。`git status` 可被允许，而破坏性
命令请求审批，即使二者共用同一执行器。

## 授权与审批

`PolicyGrant` 可序列化，受执行者、配置、精确工具与版本、效应子集、资源 scheme/prefix/access、
范围（once、run、session-resource 或到期 persistent-resource）、签发、到期与可选撤销约束。授权仅可
满足 `Ask`——绝不覆盖 `Deny` 或 `HardDeny`。审批呈现递归脱敏密钥变体、凭据资源与 URL 查询值；
原始参数不变。

策略不是沙箱。原生执行器拥有进程的操作系统权限；强隔离需要单独执行目标。见
[安全](/zh/safety/security/) 与 [审批](/zh/safety/approvals/)。
