import { Message } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: entries, isLoading } = trpc.useQuery(["example.getAll"]);
  const ctx = trpc.useContext();
  const [text, setText] = useState("");
  const create = trpc.useMutation("example.create", {
    onMutate: () => {
      ctx.cancelQuery(["example.getAll"]);
      const optimisticUpdate = ctx.getQueryData(["example.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["example.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["example.getAll"]);
    },
  });
  return (
    <>
      <Head>
        <title>App Runner Demo</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black p-2">
        <div className="container mx-auto max-w-md mb-10">
        <h1 className="my-4 text-center text-3xl font-bold leading-tight text-white md:text-left md:text-5xl">
          App Runner Demo
        </h1>
        <div className=" w-full rounded-lg bg-gray-900 px-8 pt-6 pb-8  shadow-lg mb-20">
          <form>
            <div className="relative">
              <input
                type="search"
                id="default-search"
                className="block w-full rounded border border-gray-600 bg-gray-700  p-4 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nachricht"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={50}
              />
            </div>
            <button
              onClick={async (e) => {
                e.preventDefault();
                await create.mutateAsync({
                  text: text
                });
                setText("");
              }}
              disabled={isLoading || text == ""}
              className="float-right mt-9 rounded-lg  bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
            >
              Absenden
            </button>
          </form>
        </div>
        {entries?.map((entry) => (
          <TextMessage key={entry.id} message={entry} />
        ))}
        </div>
      </main>
    </>
  );
};
interface TextMessageProps {
  message: Message;
}
const TextMessage: React.FC<TextMessageProps> = ({ message }) => {
  return (
    <div className="mb-4 max-w-md rounded-lg border  border-gray-700 bg-gray-800 p-6 shadow-md">
      <div>
        <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white">
          {message.text}
        </h5>
      </div>
    </div>
  );
};
export default Home;
