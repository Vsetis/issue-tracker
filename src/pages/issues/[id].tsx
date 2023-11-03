import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import Tag from "~/components/Tag";
import { api } from "~/utils/api";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-12 max-w-xl rounded bg-black/20" />
      <div className="mb-6 h-6 max-w-[80px] rounded bg-black/20" />
      <div className="max-w-xl rounded border p-6">
        <div className="mb-2 h-4 max-w-xl rounded bg-black/20" />
        <div className="mb-2 h-4 max-w-xl rounded bg-black/20" />
        <div className=" h-4 max-w-md rounded bg-black/20" />
      </div>
    </div>
  );
}

const IssuePage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const issueQuery = api.issue.getById.useQuery(
    { id },
    { enabled: router.isReady },
  );
  const { mutate: deleteIssue } = api.issue.delete.useMutation({
    onSuccess: () => {
      void router.push("/issues");
    },
  });
  const issue = issueQuery.data;

  if (!issueQuery.isLoading && !issueQuery.data) {
    return <>404 Issue not found</>;
  }

  return (
    <main>
      <div className="flex justify-between gap-16">
        <div className="w-full">
          {issueQuery.isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div>
              <div className="mb-8 flex flex-col justify-between gap-8 md:flex-row">
                <div className="w-full ">
                  <h1 className="mb-2 text-3xl font-semibold">
                    {issue?.title}
                  </h1>
                  <div className="mb-4 flex items-center gap-4">
                    <Tag>{issue?.status}</Tag>
                    <p>{issue?.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className=" w-full rounded border p-4 lg:w-[70%]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {issue?.description}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className=" flex w-full flex-col gap-2 md:max-w-[200px]">
                  <Link className="w-full" href={`/issues/edit/${id}`}>
                    <Button className="w-full cursor-pointer py-5">
                      <FiEdit className="h-4 w-4" />
                      Edit Issue
                    </Button>
                  </Link>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                      <Button
                        color="red"
                        className="w-full cursor-pointer bg-red-500 py-5 transition-all hover:bg-red-600"
                      >
                        Delete Issue
                      </Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content style={{ maxWidth: 450 }}>
                      <AlertDialog.Title>Delete Issue</AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Are you sure you want to delete this issue? This action
                        cannot be undone.
                      </AlertDialog.Description>

                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                          <Button
                            variant="soft"
                            color="gray"
                            className="bg-gray-200 transition-all hover:bg-gray-300"
                          >
                            Cancel
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button
                            onClick={() => deleteIssue({ id })}
                            className="trnasition-all w-max bg-red-500 hover:bg-red-600"
                          >
                            Delete Issue
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default IssuePage;
