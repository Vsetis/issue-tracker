import { Select } from "@radix-ui/themes";

const SelectMenu = ({
  items,
  onValueChange,
  defaultValue,
}: {
  items: { value: string; label: string }[];
  onValueChange?: (param: string) => void;
  defaultValue?: string;
}) => {
  return (
    <div>
      <Select.Root
        defaultValue={defaultValue ?? items[0]!.value}
        onValueChange={onValueChange}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            {items.map((item, i) => (
              <Select.Item key={i} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default SelectMenu;
