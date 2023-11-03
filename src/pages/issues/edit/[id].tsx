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
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { db } from "~/server/db";

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

const IssueEditPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { id } = props;
  const router = useRouter();

  const issueQuery = api.issue.getById.useQuery(
    { id: id },
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

  const [status, setStatus] = useState<Status>(issue?.status ?? "OPEN");

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
    <div className="flex flex-col justify-between md:flex-row">
      <div className="order-2 w-full md:order-1 md:w-[70%]">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <form className="space-y-3" onSubmit={onSubmit}>
          <TextField.Root>
            <TextField.Input
              className="px-4 py-6 text-lg font-semibold"
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
          <Button className="cursor-pointer px-8" disabled={isSubmitting}>
            {isSubmitting ? <>Loading...</> : "Edit"}
          </Button>
        </form>
      </div>
      <div className="order-1 mb-6 flex gap-8  border-b border-black/50 pb-2 md:order-2 md:flex-col md:gap-0 md:border-none">
        <div className="mb-4">
          <h2 className="mb-2 font-semibold">Edited</h2>
          <p>{issue?.updatedAt.toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 font-semibold">Status</h2>
          <SelectMenu
            defaultValue={issue?.status}
            items={statusList}
            onValueChange={(newValue) => setStatus(newValue as Status)}
          ></SelectMenu>
        </div>
      </div>
    </div>
  );
};

export default IssueEditPage;
//SSR
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db,
    },
    transformer: SuperJSON,
  });
  const id = parseInt(context.params!.id, 10);

  await helpers.issue.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}
