import { createMemo, createSignal, For } from "solid-js";
import { parse } from "smol-toml";
import { ModelTable } from "./model";
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
    <>
      <h1>词元费用计算器</h1>
      <form>
        <select
          value={selectedKey()}
          onChange={(e) => setKey(e.currentTarget.value)}
        >
          <For each={Object.keys(models())}>
            {(key: string) => <option value={key}>{models()[key].name}</option>}
          </For>
        </select>
        <br />

        <For each={["-", "k", "M"]}>
          {(u) => (
            <label>
              <input
                type="radio"
                name="unit"
                checked={unit() === u}
                onClick={() => setUnit(u)}
              />
              <span>{u}</span>
            </label>
          )}
        </For>
        <br />

        <label>
          <span>输入</span>
          <input
            type="number"
            value={input()}
            onInput={(e) => setInput(parseFloat(e.currentTarget.value))}
          />
        </label>
        <br />

        <label>
          <span>输出</span>
          <input
            type="number"
            value={output()}
            onInput={(e) => setOutput(parseFloat(e.currentTarget.value))}
          />
        </label>
        <br />

        <label>
          <span>缓存读取</span>
          <input
            type="number"
            value={cacheRead()}
            onInput={(e) => setCacheRead(parseFloat(e.currentTarget.value))}
          />
        </label>
        <br />

        <label>
          <span>缓存写入</span>
          <input
            type="number"
            value={cacheWrite()}
            onInput={(e) => setCacheWrite(parseFloat(e.currentTarget.value))}
          />
        </label>
        <br />
      </form>

      <section>
        <h2>费用</h2>
        <strong>{total().toFixed(2)}</strong>
      </section>
    </>
  );
}

const fetchModels = async () => {
  const resp = await fetch("/models.toml");
  const content = await resp.text();
  const data = parse(content);
  const models = ModelTable.assert(data);

  return models;
};
