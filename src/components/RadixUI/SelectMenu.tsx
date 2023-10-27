import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";

const SelectMenu = ({
  state,
  status,
  setStatus,
  setState,
  items,
}: {
  state?: string;
  status?: Status;
  setStatus?: React.Dispatch<React.SetStateAction<Status>>;
  setState?: React.Dispatch<React.SetStateAction<string>>;
  items: { value: string; label: string }[];
}) => {
  return (
    <div>
      <Select.Root
        defaultValue={state ?? status}
        onValueChange={(newValue) => {
          if (setState && typeof newValue === "string") {
            setState(newValue);
          } else if (
            setStatus &&
            (newValue === "OPEN" ||
              newValue === "IN_PROGRESS" ||
              newValue === "CLOSED")
          ) {
            setStatus(newValue);
          }
        }}
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
