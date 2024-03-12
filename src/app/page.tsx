"use client"
import NameForm from "./_components/name-form";

export default function Home() {
  return (
    <main className="w-full h-full flex place-content-center place-items-center ">
      <div className="place-self-center flex flex-col gap-3 w-[60%] min-w-6xl min-h-6xl bg-black/10 p-5   ">
      <NameForm />
      </div>
    </main>
  );
}


