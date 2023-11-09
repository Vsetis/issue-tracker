import type { Status } from "@prisma/client";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoArrowUp } from "react-icons/go";
import SelectMenu from "~/components/RadixUI/SelectMenu";
import Tag from "~/components/Tag";
import { api } from "~/utils/api";

import { createServerSideHelpers } from "@trpc/react-query/server";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

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

const IssuesPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { status, orderOption } = props;
  const { push, query } = useRouter();

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
      queryParams.status = newStatus;
    }

    if (newOrder) {
      queryParams.orderBy = newOrder;
    }

    void push({
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
              ? void push("/issues")
              : void push(`issues?status=${newValue}`);
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
                  key={th.title}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const orderOption = query.orderBy ?? null;
  const status: Status | undefined = (query.status as Status) ?? null;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db,
    },
    transformer: SuperJSON,
  });

  await helpers.issue.getAll.prefetch({ status, orderOption });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      status,
      orderOption,
    },
  };
}
