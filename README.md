# Claude Style UI

A reusable Codex skill for Claude-inspired web interfaces: warm neutral surfaces, readable typography, light/dark themes, and thoughtful interaction patterns.

一个可复用的 Claude 风格界面设计 skill。让 Codex 在现有项目里实现配色、排版、组件和交互，无需操作 Figma。当前版本：**2.0.0**。

![Claude-inspired local interface preview](docs/preview.png)

## 下载与安装

**[下载 v2.0.0 技能 ZIP](https://github.com/7Wilf7/claude-style-ui/releases/download/v2.0.0/claude-style-ui-v2.0.0.zip)** · [版本发布页](https://github.com/7Wilf7/claude-style-ui/releases/tag/v2.0.0)

最方便的方式是在 Codex 中发送：

```text
使用 $skill-installer，安装这个仓库中的 claude-style-ui：
https://github.com/7Wilf7/claude-style-ui/tree/main/skills/claude-style-ui
```

也可以手动解压 ZIP，把其中的 `claude-style-ui` 文件夹放进 `~/.agents/skills/`，或目标项目的 `.agents/skills/`。正确结构为：

```text
~/.agents/skills/claude-style-ui/SKILL.md
```

同名技能已经存在时，先备份并确认要替换的版本，避免重复安装。Codex 会发现新技能；若列表未更新，重启 Codex。安装位置与发现行为参见 [OpenAI 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

## 使用

在目标项目里告诉 Codex：

```text
使用 $claude-style-ui，把这个项目做成 Claude 风格，保留现有功能，
并检查手机布局、深色模式和键盘操作。
```

可以限定某个页面、卡片或输入区。技能会保留项目已有的框架和业务流程，不要求接入 Claude API。基础配色和组件无需新增框架或网络依赖。

## 包含什么

- **设计规范**：两套明确区分的配色、系统字体回退、层级、间距、圆角、装饰细线和可读的控件边界。
- **组件示例**：导航、按钮、表单、卡片、表格、消息、输入区、附件，以及空白、加载、错误等状态。
- **进阶交互**：可选的滚动跟随和双栏调整工具，包含键盘操作、取消回退、窄屏堆叠与卸载清理。
- **实现指南**：按需查阅动效、中文输入法、命令/引用、异步草稿、弹窗焦点和实际 MCP App 适配。

## 离线预览

下载并解压技能后，直接在浏览器打开：

- `claude-style-ui/assets/preview.html`：基础组件和本地交互。
- `claude-style-ui/assets/interaction-preview.html`：模拟内容更新与双栏调整。

这些预览使用打包在一起的 CSS/JavaScript，不依赖 CDN、远程字体、API key 或 AI 服务。模拟消息、文件名和更新会明确标注，草稿不会发送到服务器。

## 来源与第三方许可

本项目为独立编写的 Claude-inspired 技能，参考：

- Anthropic 的 [MCP Apps for Claude Figma kit](https://www.figma.com/community/file/1597641111449594397/mcp-apps-for-claude) 与公开设计指南。
- [Claude Storybook 社区参考](https://claude-storybook.bystanderss.chatgpt.site/)。
- [Caho1/open-claude-ui](https://github.com/Caho1/open-claude-ui/tree/2834bc158a4849f21c97cbb2e0b10525f6e646f1)，固定检查提交 `2834bc158a4849f21c97cbb2e0b10525f6e646f1`。

详细范围、来源区别和归属见 [sources.md](skills/claude-style-ui/references/sources.md)。上游 Open Claude UI 的 [MIT 版权与许可](skills/claude-style-ui/references/licenses/open-claude-ui-MIT.txt) 随技能保留。未打包 Anthropic 专有字体、标志或原始 Figma 文件；社区重建的代码与宣传不作为官方规格。

## 验证范围

v2 已在独立 Chrome 中检查 1440、390、320 像素的浅色和深色布局，基础预览、15 项进阶交互及清理行为通过。必要输入边界继续保留至少 3:1 的已测对比度。下载包经过文件完整性和离线运行检查。

Safari、真实手机、真实中文输入法、屏幕阅读器、iframe 跨界拖动和真实服务流式输出，需要在目标项目内另行验收。示例分栏的辅助技术数值文案为英文，正式中文产品采用时应本地化。

## 仓库结构

```text
skills/claude-style-ui/   # 可安装的完整技能
docs/preview.png         # 仓库说明截图
```

维护时以 `skills/claude-style-ui/` 为技能源文件目录。安装器只需下载该目录；README 和截图不属于技能运行依赖。
