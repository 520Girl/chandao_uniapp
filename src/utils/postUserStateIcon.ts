/**
 * 动态情绪 `userState` 与 iconfont 图标后缀的映射（不含 `icon-` 前缀）。
 * 字典若新增 value，未配置时回退为 Cloudy。
 */

/**
 * @param value 动态 `userState`（字典 value）
 * @returns iconfont 类名后缀，如 `Cloudy`
 */
export function postUserStateIconClassSuffix(value: number): string {
  switch (value) {
    case 1:
      return "Cloudy";
    case 2:
      return "ink-water-drop";
    case 3:
      return "wind";
    case 4:
      return "lightbulb";
    case 5:
      return "Wind";
    case 6:
      return "zap-fast";
    default:
      return "Cloudy";
  }
}
