"use client";
import { AvatarSwitcher } from "./avatat_switcher";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export default function EditForm() {
  const [name, setName] = useLocalStorage<string>("NAME", "Guest");
  return (
    <div className="flex flex-col gap-5 max-w-[400px]">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300  border-opacity-40 bg-black/10 px-[0.75rem] py-[0.32rem] indent-2 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
        type="text"
        name="name"
        id="rounds"
        placeholder="Your name"
        required
      />
        <AvatarSwitcher />
    </div>
  );
}
