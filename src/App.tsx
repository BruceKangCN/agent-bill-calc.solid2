import { createMemo, createSignal, For } from "solid-js";
import { fetchModels } from "./model";
import ThemeToggle from "./ThemeToggle";
import NumberField from "./NumberField";
import ToggleGroup from "./ToggleGroup";
import "virtual:uno.css";

export default function App() {
  const models = createMemo(() => fetchModels());

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
        <ThemeToggle />
      </header>

      <form
        un-mx="auto"
        un-mt="8"
        un-max-w="4xl"
        un-flex="~ col"
        un-gap="5 sm:6"
        un-rounded="2xl sm:3xl"
        un-border="~ zinc-200 dark:zinc-600"
        un-bg="white dark:zinc-700"
        un-p="5 sm:8"
      >
        <select
          un-w="full"
          un-h="12 sm:16"
          un-rounded="xl"
          un-border="~ zinc-300 focus:indigo-500 dark:(zinc-600 focus:indigo-400)"
          un-bg="zinc-50 hover:zinc-100 dark:(zinc-600 hover:zinc-500)"
          un-px="4 sm:6"
          un-text="lg sm:2xl zinc-900 dark:zinc-100"
          un-outline="none"
          un-ring="focus:2 focus:indigo-500/30 dark:focus:indigo-400/40"
          un-transition="colors"
          un-cursor="pointer"
          value={selectedKey()}
          onChange={(e) => setKey(e.currentTarget.value)}
        >
          <For each={Object.entries(models())}>
            {([key, value]) => <option value={key}>{value.name}</option>}
          </For>
        </select>

        <ToggleGroup
          value={unit()}
          options={["-", "k", "M"]}
          onChange={setUnit}
          name="unit"
        />

        <section un-grid="~ cols-1 sm:cols-2" un-gap="3 sm:4">
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
        </section>
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
        >
          {total().toFixed(2)}
        </strong>
      </section>
    </main>
  );
}
