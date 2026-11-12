import { createEffect, createMemo, createSignal, For } from "solid-js";
import { parse } from "smol-toml";
import { applyTheme, getInitialThemeIsDark } from "./theme";
import { ModelTable } from "./model";
import "virtual:uno.css";

interface NumberFieldProps {
  label: string;
  value: number;
  onInput: (value: number) => void;
};

function NumberField(props: NumberFieldProps) {
  return (
    <label
      un-col-span="6 sm:3"
      un-flex="~ col"
      un-gap="2"
      un-min-w="0"
      un-text="lg sm:2xl zinc-600 dark:zinc-300"
    >
      <span>{props.label}</span>
      <input
        type="number"
        un-w="full"
        un-h="12 sm:16"
        un-rounded="xl"
        un-border="~ zinc-300 focus:indigo-500 dark:zinc-600 dark:focus:indigo-400"
        un-bg="zinc-50 dark:zinc-800"
        un-px="4 sm:6"
        un-text="right lg sm:2xl zinc-900 dark:zinc-100"
        un-outline="none"
        un-ring="focus:2 focus:indigo-500/30 dark:focus:indigo-400/40"
        un-transition="colors"
        value={props.value}
        onInput={(e) => props.onInput(parseFloat(e.currentTarget.value))}
      />
    </label>
  );
}

export default function App() {
  const models = createMemo(() => fetchModels());

  const [isDark, setIsDark] = createSignal(getInitialThemeIsDark());
  const theme = () => isDark() ? "dark" : "light";

  createEffect(
    isDark,
    (value) => applyTheme(value),
  );

  const toggleTheme = () => {
    setIsDark((b) => !b);
    try {
      window.localStorage.setItem("theme", theme());
    } catch {
      // Ignore storage errors (for example in privacy mode).
    }
  };

  const [selectedKey, setKey] = createSignal(() => Object.keys(models())[0]);
  const [unit, setUnit] = createSignal("-");
  const [input, setInput] = createSignal(0);
  const [output, setOutput] = createSignal(0);
  const [cacheRead, setCacheRead] = createSignal(0);
  const [cacheWrite, setCacheWrite] = createSignal(0);

  const model = () => models()[selectedKey()];

  const factor = () => {
    const M = 1_000_000;
    switch (unit()) {
      case "-":
        return 1.0 / M;
      case "k":
        return 1_000.0 / M;
      case "M":
        return 1_000_000.0 / M;
      default:
        return 1.0 / M;
    }
  };

  const total = () =>
    factor() *
    (input() * model()["input"] +
      output() * model()["output"] +
      cacheRead() * model()["cache-read"] +
      cacheWrite() * model()["cache-write"]);

  return (
    <main
      un-min-h="screen"
      un-bg="zinc-100 dark:zinc-800"
      un-px="4 sm:6"
      un-py="8 sm:12"
      un-text="zinc-700 dark:zinc-200"
    >
      <header
        un-mx="auto"
        un-max-w="4xl"
        un-flex="~"
        un-items="center"
        un-justify="between"
        un-gap="4"
      >
        <h1
          un-min-w="0"
          un-text="4xl sm:5xl zinc-900 dark:zinc-100"
          un-font="normal"
          un-leading="tight"
        >
          词元费用计算器
        </h1>
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
          un-bg="white hover:zinc-50 dark:zinc-700 dark:hover:zinc-600"
          un-text="zinc-600 hover:indigo-600 dark:zinc-300 dark:hover:indigo-400"
          un-ring="focus-visible:2 focus-visible:indigo-500/40 dark:focus-visible:indigo-400/40"
          un-transition="colors"
          un-cursor="pointer"
        >
          <span
            aria-hidden="true"
            class={isDark() ? "i-lucide-sun" : "i-lucide-moon"}
            un-h="5 w-5 sm:h-6 sm:w-6"
            un-shrink="0"
          />
        </button>
      </header>

      <form
        un-mx="auto"
        un-mt="8"
        un-max-w="4xl"
        un-grid="~ cols-6"
        un-gap="x-3 y-5 sm:x-4 sm:y-6"
        un-rounded="2xl sm:3xl"
        un-border="~ zinc-200 dark:zinc-600"
        un-bg="white dark:zinc-700"
        un-p="5 sm:8"
      >
        <select
          un-col-span="6"
          un-w="full"
          un-h="12 sm:16"
          un-rounded="xl"
          un-border="~ zinc-300 focus:indigo-500 dark:zinc-600 dark:focus:indigo-400"
          un-bg="zinc-50 hover:zinc-100 dark:zinc-600 dark:hover:zinc-500"
          un-px="4 sm:6"
          un-text="lg sm:2xl zinc-900 dark:zinc-100"
          un-outline="none"
          un-ring="focus:2 focus:indigo-500/30 dark:focus:indigo-400/40"
          un-transition="colors"
          un-cursor="pointer"
          value={selectedKey()}
          onChange={(e) => setKey(e.currentTarget.value)}
        >
          <For each={Object.keys(models())}>
            {(key: string) => <option value={key}>{models()[key].name}</option>}
          </For>
        </select>

        <For each={["-", "k", "M"]}>
          {(u) => (
            <label
              un-col-span="2"
              un-flex="~"
              un-items="center"
              un-justify="center"
              un-h="12 sm:16"
              un-rounded="xl"
              un-border="~ zinc-300 has-[:checked]:zinc-400 dark:zinc-600 dark:has-[:checked]:zinc-500"
              un-bg="zinc-50 has-[:checked]:zinc-200 dark:zinc-800 dark:has-[:checked]:zinc-600"
              un-text="lg sm:2xl zinc-500 has-[:checked]:zinc-900 dark:zinc-300 dark:has-[:checked]:zinc-50"
              un-font="semibold"
              un-cursor="pointer"
              un-ring="has-[:focus-visible]:2 has-[:focus-visible]:indigo-500/50 dark:has-[:focus-visible]:indigo-400/60"
              un-transition="colors"
            >
              <input
                type="radio"
                name="unit"
                checked={unit() === u}
                onClick={() => setUnit(u)}
                un-w="0"
                un-h="0"
                un-m="0"
                un-p="0"
                un-opacity="0"
                un-appearance="none"
              />
              <span>{u}</span>
            </label>
          )}
        </For>

        <NumberField label="输入" value={input()} onInput={setInput} />

        <NumberField label="输出" value={output()} onInput={setOutput} />

        <NumberField
          label="缓存读取"
          value={cacheRead()}
          onInput={setCacheRead}
        />

        <NumberField
          label="缓存写入"
          value={cacheWrite()}
          onInput={setCacheWrite}
        />
      </form>

      <section
        un-mx="auto"
        un-mt="6"
        un-max-w="4xl"
        un-flex="~ col"
        un-gap="4"
        un-rounded="2xl sm:3xl"
        un-border="~ indigo-500/60"
        un-bg="indigo-600"
        un-p="6 sm:8"
        un-text="indigo-50"
      >
        <h2 un-text="lg sm:2xl" un-font="normal">
          费用
        </h2>
        <strong
          un-self="end"
          un-text="5xl sm:6xl"
          un-font="bold"
          un-leading="none"
          un-tracking="tight"
        >
          {total().toFixed(2)}
        </strong>
      </section>
    </main>
  );
}

const fetchModels = async () => {
  const resp = await fetch("/models.toml");
  const content = await resp.text();
  const data = parse(content);
  const models = ModelTable.assert(data);

  return models;
};
