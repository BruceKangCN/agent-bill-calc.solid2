import { createEffect, createSignal } from "solid-js";
import { getInitialThemeIsDark, applyTheme } from "./theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(getInitialThemeIsDark());

  createEffect(isDark, (value) => applyTheme(value));

  const toggleTheme = () => {
    // HACK: Compute the expected value rather than read. Updates are staged and
    // they don't take effect immediately. A call to isDark will not get the
    // expected value but the stale one.
    const expectedIsDark = !isDark();
    setIsDark(expectedIsDark);
    const theme = expectedIsDark ? "dark" : "light";
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // Ignore storage errors (for example in privacy mode).
    }
  };

  return (
    <button
      type="button"
      aria-label={isDark() ? "切换到亮色主题" : "切换到暗色主题"}
      onClick={toggleTheme}
      un-flex="~"
      un-items="center"
      un-justify="center"
      un-h="12 sm:16"
      un-w="12 sm:16"
      un-shrink="0"
      un-rounded="xl"
      un-border="~ zinc-300 dark:zinc-600"
      un-bg="white hover:zinc-50 dark:(zinc-700 hover:zinc-600)"
      un-text="zinc-600 hover:indigo-600 dark:(zinc-300 hover:indigo-400)"
      un-ring="focus-visible:(2 indigo-500/40 dark:indigo-400/40)"
      un-transition="colors"
      un-cursor="pointer"
    >
      <span
        aria-hidden="true"
        // NOTE: DO NOT dynamically concat class names! UnoCSS need to see the
        // full names at compile time.
        class={isDark() ? "i-lucide-sun" : "i-lucide-moon"}
        un-h="5 w-5 sm:(h-6 w-6)"
        un-shrink="0"
      />
    </button>
  );
}
