import { Button, Select } from "@radix-ui/themes";
import Link from "next/link";
import Tag from "~/components/Tag";
import { api } from "~/utils/api";
import { GoArrowUp } from "react-icons/go";
import { useRouter } from "next/router";
import { Status } from "@prisma/client";
import SelectMenu from "~/components/RadixUI/SelectMenu";

type QueryParams = {
  status?: Status;
  orderBy?: string;
};

const items = [
  { value: "all", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CLOSED", label: "Closed" },
];

const tableHeads = [
  { title: "Issue", type: "title" },
  { title: "Status", type: "status" },
  { title: "Created", type: "time" },
];

const IssuesPage = () => {
  const { push, query } = useRouter();

  const status = query.status as undefined | Status;
  const orderOption = query.orderBy;

  const { data: issueQuery } = api.issue.getAll.useQuery({
    status,
    orderOption,
  });

  function filterAndSort(
    newStatus: Status | undefined,
    newOrder: string | undefined,
  ) {
    const queryParams: QueryParams = {};

    if (newStatus) {
      queryParams["status"] = newStatus;
    }

    if (newOrder) {
      queryParams["orderBy"] = newOrder;
    }

    push({
      pathname: "/issues",
      query: queryParams,
    });
  }

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <SelectMenu
          items={items}
          onValueChange={(newValue) => {
            newValue === "all"
              ? push("/issues")
              : push(`issues?status=${newValue}`);
          }}
        />
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded border">
        <table className="w-full">
          <thead className="w-full bg-black/10">
            <tr className="rounded border-b">
              {tableHeads.map((th) => (
                <th
                  onClick={() => filterAndSort(status, th.type)}
                  className="cursor-pointer p-4 text-start"
                >
                  <span className="flex items-center gap-2">
                    {th.title}
                    {query.orderBy === th.type && (
                      <GoArrowUp className="h-5 w-5" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issueQuery?.map((issue) => (
              <tr
                onClick={() => push(`/issues/${issue.id}`)}
                key={issue.id}
                className="cursor-pointer border-b px-4 transition-all last:border-none hover:bg-black/5"
              >
                <td className="w-[60%] p-4">{issue.title}</td>
                <td className="w-[20%]">
                  <Tag>{issue.status}</Tag>
                </td>
                <td className="w-[20%]">
                  {issue.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default IssuesPage;
