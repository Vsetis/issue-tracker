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

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMDEWithDynamicImport = dynamic(
  () => import("react-simplemde-editor"),
  {
    ssr: false,
  },
);

const items = [
  { label: "Open", value: "OPEN" },
  { label: "Closed", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

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

  const [status, setStatus] = useState<"OPEN" | "IN_PROGRESS" | "CLOSED">(
    issue?.status ?? "OPEN",
  ); // todo get serverside props

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
    <div className="flex">
      <div>
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
            {isSubmitting ? <>Loading...</> : "Save"}
          </Button>
        </form>
      </div>
      <div>
        <SelectMenu
          status={status}
          setStatus={setStatus}
          items={items}
        ></SelectMenu>
      </div>
    </div>
  );
};

export default IssueEditPage;
