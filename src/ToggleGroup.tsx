import { For } from "solid-js";

export interface ToggleGroupProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  name: string;
}

export default function ToggleGroup(props: ToggleGroupProps) {
  return (
    <div un-w="full" un-flex="~ row" un-gap="3 sm:4">
      <For each={props.options}>
        {(opt) => (
          <label
            un-flex="~"
            un-flex-grow="1"
            un-items="center"
            un-justify="center"
            un-h="12 sm:16"
            un-rounded="xl"
            un-border="~ zinc-300 has-[:checked]:zinc-400 dark:(zinc-600 has-[:checked]:zinc-500)"
            un-bg="zinc-50 has-[:checked]:zinc-200 dark:(zinc-800 has-[:checked]:zinc-600)"
            un-text="lg sm:2xl zinc-500 has-[:checked]:zinc-900 dark:(zinc-300 has-[:checked]:zinc-50)"
            un-font="semibold"
            un-cursor="pointer"
            un-ring="has-[:focus-visible]:(2 indigo-500/50 dark:indigo-400/60)"
            un-transition="colors"
          >
            <input
              type="radio"
              name={props.name}
              checked={props.value === opt}
              onClick={() => props.onChange(opt)}
              un-appearance="none"
            />
            <span>{opt}</span>
          </label>
        )}
      </For>
    </div>
  );
}
