import React, { useState } from "react";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import { createIssueSchema } from "~/utils/validationScehmas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Button, Callout, TextField } from "@radix-ui/themes";
import dynamic from "next/dynamic";

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMDEWithDynamicImport = dynamic(
  () => import("react-simplemde-editor"),
  {
    ssr: false,
  },
);

const NewIssuePage = () => {
  const { mutateAsync: createIssue } = api.issue.create.useMutation({});
  const { push } = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueForm>({ resolver: zodResolver(createIssueSchema) });
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createIssue(data);
      await push("/issues");
    } catch (error) {
      setError("An unexpeced error occured.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDEWithDynamicImport placeholder="Description" {...field} />
          )}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <Button disabled={isSubmitting}>
          {isSubmitting ? <>Loading...</> : "New Issue"}
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
