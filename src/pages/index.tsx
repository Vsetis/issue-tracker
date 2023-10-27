import { Button } from "@radix-ui/themes";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <main>
        <h1>Hello world</h1>
        <Button>New Issue</Button>
      </main>
    </>
  );
}
