import { Select } from "@radix-ui/themes";
import { useState } from "react";

const SelectMenu = ({
  items,
  onValueChange,
  defaultValue,
}: {
  items: { value: string; label: string }[];
  onValueChange?: (param: string) => void;
  defaultValue?: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        className={`${
          show ? "" : "hidden"
        } absolute left-0 top-0 z-[10]  h-screen w-full`}
      />
      <Select.Root
        onOpenChange={() => setShow(false)}
        defaultValue={defaultValue ?? items[0]!.value}
        onValueChange={onValueChange}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            {items.map((item, i) => (
              <Select.Item
                onClick={() => setShow(!show)}
                key={i}
                value={item.value}
              >
                {item.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </>
  );
};

export default SelectMenu;
