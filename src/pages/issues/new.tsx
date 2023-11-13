import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { createIssueSchema } from "~/utils/validationScehmas";

type IssueForm = z.infer<typeof createIssueSchema>;

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // This disables server-side rendering for the component
});

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
        <p>{}</p>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact
              className="editor"
              placeholder="Description"
              {...field}
            />
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
