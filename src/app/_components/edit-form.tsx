"use client";
import { AvatarSwitcher } from "./avatat_switcher";
import { local } from "~/constants/game";

export default function EditForm() {
  const {name} = local.use()
  const setName  = (n: string) => local.set("name", n)
  return (
    <div className="flex flex-col gap-5 w-full h-full  place-self-center  place-items-center">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-md focus:border-skin-accent  block w-full justify-self-center rounded-lg border border-gray-300  border-opacity-40 bg-black/10 px-[0.75rem] py-[0.32rem] indent-2 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
        type="text"
        name="name"
        id="rounds"
        placeholder="Your name"
        maxLength={20}
        min={3}
        required
      />
        <AvatarSwitcher />
    </div>
  );
}
