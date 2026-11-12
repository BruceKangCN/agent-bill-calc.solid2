export interface NumberFieldProps {
  label: string;
  value: number;
  onInput: (value: number) => void;
};

export default function NumberField(props: NumberFieldProps) {
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
