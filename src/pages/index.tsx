import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import Tag from "~/components/Tag";

import { api } from "~/utils/api";

const colors = ["#f87171", "#fb923c", "#4ade80"];

export default function Home() {
  const latestIssues = api.issue.getLatest.useQuery();
  const issueData = latestIssues.data;

  const data = useMemo(() => {
    const open = issueData?.filter((i) => i.status === "OPEN");
    const progress = issueData?.filter((i) => i.status === "IN_PROGRESS");
    const closed = issueData?.filter((i) => i.status === "CLOSED");

    return {
      data: [
        { status: "OPEN", count: open?.length ?? 0 },
        {
          status: "IN PROGRESS",
          count: progress?.length ?? 0,
        },
        { status: "CLOSED", count: closed?.length ?? 0 },
      ],
    };
  }, [issueData]);

  return (
    <main className="py-8">
      <div className="flex flex-col gap-14 lg:flex-row">
        <div className="w-full md:min-w-[50%]">
          <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-8">
            {data.data.map((issue, i) => (
              <div key={i} className="w-full rounded border p-4">
                <p>{issue.status}</p>
                <p className="font-semibold">{issue.count}</p>
              </div>
            ))}
          </div>
          <div className="h-[350px] rounded border p-4 md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.data}>
                <YAxis />
                <XAxis dataKey="status" />
                <Bar
                  dataKey="count"
                  barSize={80}
                  className="relative"
                  fill="#15803d"
                >
                  {data.data.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full rounded border  p-4">
          <h1 className="mb-4 text-xl font-semibold">Latest Issues</h1>
          <div className="flex flex-col">
            {issueData ? (
              issueData.map((issue) => (
                <div
                  key={issue.id}
                  className="mb-4 border-b px-5 pb-4 last:border-none"
                >
                  <h3 className="mb-1">{issue.title}</h3>
                  <Tag>{issue.status}</Tag>
                </div>
              ))
            ) : (
              <p>No Issue!</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
