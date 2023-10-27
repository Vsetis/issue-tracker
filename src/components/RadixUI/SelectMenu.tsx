import { Select } from "@radix-ui/themes";

const SelectMenu = ({
  status,
  setStatus,
}: {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div>
      <Select.Root
        defaultValue={status}
        onValueChange={(newValue) => setStatus(newValue)}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="open">Open</Select.Item>
            <Select.Item value="progress">In Progress</Select.Item>
            <Select.Item value="closed">Closed</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default SelectMenu;
