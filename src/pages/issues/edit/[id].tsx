import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, TextField } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { createIssueSchema } from "~/utils/validationScehmas";

import "easymde/dist/easymde.min.css";
import SelectMenu from "~/components/RadixUI/SelectMenu";
import { Status } from "@prisma/client";

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMDEWithDynamicImport = dynamic(
  () => import("react-simplemde-editor"),
  {
    ssr: false,
  },
);

const statusList = [
  { label: "Open", value: "OPEN" },
  { label: "Closed", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

const assignmentList = [{ label: "Unassignment", value: "unassignment" }];

const IssueEditPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string);

  const issueQuery = api.issue.getById.useQuery(
    { id },
    {
      enabled: router.isReady,
    },
  );
  const issue = issueQuery.data;

  const { mutateAsync: edit } = api.issue.edit.useMutation({
    onSuccess: () => {
      void router.push("/issues");
    },
  });

  const { push } = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueForm>({ resolver: zodResolver(createIssueSchema) });

  const [error, setError] = useState("");

  const [status, setStatus] = useState<Status>(issue?.status ?? "OPEN"); // todo get serverside props
  const [assignment, setAssignment] = useState("unassignment");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await edit({ id: id, ...data, status: status });
      await push("/issues");
    } catch (error) {
      setError("An unexpeced error occured.");
    }
  });
  if (!issueQuery.isLoading && !issueQuery.data) {
    return <>404 Issue not found</>;
  }

  return (
    <div className="flex justify-between">
      <div className="w-[70%]">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <form className="space-y-3" onSubmit={onSubmit}>
          <TextField.Root>
            <TextField.Input
              defaultValue={issue?.title}
              placeholder="Title"
              {...register("title")}
            />
          </TextField.Root>
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
          <Controller
            name="description"
            control={control}
            defaultValue={issue?.description}
            render={({ field }) => (
              <SimpleMDEWithDynamicImport
                placeholder="Description"
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          <Button disabled={isSubmitting}>
            {isSubmitting ? <>Loading...</> : "Edit"}
          </Button>
        </form>
      </div>
      <div>
        <div className="mb-4">
          <h2 className="mb-2 font-semibold">Edited</h2>
          <p>{issue?.udpatedAt.toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 font-semibold">Status</h2>
          <SelectMenu
            items={statusList}
            onValueChange={(newValue) => setStatus(newValue as Status)}
          ></SelectMenu>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Assignment</h2>
          <SelectMenu
            items={assignmentList}
            onValueChange={(newValue) => setAssignment(newValue)}
          ></SelectMenu>
        </div>
      </div>
    </div>
  );
};

export default IssueEditPage;
