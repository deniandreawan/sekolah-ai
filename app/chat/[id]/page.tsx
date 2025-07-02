"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import {
  ArrowLeftIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
  SparklesIcon,
} from "lucide-react";
import Textarea from "react-textarea-autosize";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { data } from "@/lib/data";

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const path = pathname.slice("/chat/".length);
  const getData = data.filter((item) => item.id === Number(path));

  useEffect(() => {
    if (getData[0] === undefined) {
      router.push("/");
    }
  }, [getData, router]);

  const { messages, input, setInput, handleSubmit, status } = useChat({
    body: {
      topics: getData[0]?.title,
    },
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
    },
  });

  const examples = [
    "Saya ingin belajar",
    "Kasih saya pertanyaan",
    `Apa itu ${getData[0]?.title}?`,
  ];

  const disabled = status === "streaming" || input.length === 0;

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        <Link
          href="/"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <ArrowLeftIcon />
        </Link>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100"
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div className={clsx("bg-blue-600 p-1.5 text-white rounded-md")}>
                {message.role === "user" ? <UserIcon /> : <SparklesIcon />}
              </div>
              <div className="prose prose-p:leading-relaxed mt-1 w-full break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            {getData[0]?.image && (
              <Image
                src={`${getData[0].image}`}
                alt="Shooketh"
                width={40}
                height={40}
                className="h-16 w-16"
              />
            )}
            <h1 className="text-lg font-semibold text-black">
              Hai! Saya Guru {getData[0]?.title}
            </h1>
            <p className="text-gray-500">
              {`Selamat datang di dunia pengetahuan! Guru ${getData[0]?.title} hadir dengan salam
              hangat untuk membantu kamu mengeksplorasi segala sesuatu yang
              ingin kamu ketahui.`}
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-blue-600 hover:text-blue-600 active:bg-gray-50"
                onClick={() => {
                  setInput(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Ada yang mau kamu tanyain?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            disabled={disabled}
          >
            {status === "streaming" ? (
              <Loader2Icon className="animate-spin text-blue-600" />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white"
                )}
              />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">
          Dibuat oleh Sekolah AI
        </p>
      </div>
    </main>
  );
}
