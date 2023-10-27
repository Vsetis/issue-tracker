import { Badge, Button } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import SelectMenu from "~/components/RadixUI/SelectMenu";
import Tag from "~/components/Tag";
import { api } from "~/utils/api";
import { GoArrowUp } from "react-icons/go";
import { useRouter } from "next/router";

const IssuesPage = () => {
  const { push } = useRouter();

  const [status, setStatus] = useState("all");
  const [orderOption, setOrderOption] = useState("time");

  const { data: issueQuery } = api.issue.getAll.useQuery({
    status: status,
    orderOption: orderOption,
  });

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <SelectMenu status={status} setStatus={setStatus} />
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded border">
        <table className="w-full">
          <thead className="w-full bg-black/10">
            <tr className="rounded border-b">
              <th
                onClick={() => setOrderOption("title")}
                className="cursor-pointer p-4 text-start"
              >
                <span className="flex items-center gap-2">
                  Issue
                  {orderOption === "title" && <GoArrowUp className="h-5 w-5" />}
                </span>
              </th>
              <th
                onClick={() => setOrderOption("status")}
                className="cursor-pointer text-start"
              >
                <span className="flex cursor-pointer items-center gap-2">
                  Status
                  {orderOption === "status" && (
                    <GoArrowUp className="h-5 w-5" />
                  )}
                </span>
              </th>
              <th onClick={() => setOrderOption("time")} className="text-start">
                <span className="flex cursor-pointer items-center gap-2">
                  Created
                  {orderOption === "time" && <GoArrowUp className="h-5 w-5" />}
                </span>
              </th>
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
