"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { useState, useEffect } from "react";

export default function NameDialog() {

const [open, setOpen] = useState(true);
const [name, setName] = useState("Ahmed");
useEffect(() => {
    const storedName = window.localStorage.getItem("name");
    storedName && setName(storedName);

}, [])
useEffect(() => {
    name && window.localStorage.setItem("name", name);
}, [name]);

return (
<Dialog  open={open}>
  <DialogContent  className="z-[999] p-5">
    <DialogHeader>
      <DialogTitle className="flex justify-between place-items-center place-content-center">
        <span>
            What's your name?
            </span>
        <button className="aspect-square  flex place-self-end" onClick={() => setOpen(false)}>X</button>

      </DialogTitle>
      <DialogDescription>
        <input value={name} onChange={(e) => setName(e.target.value)} className="text-md block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem] indent-2 placeholder:italic placeholder:text-slate-400/80 focus:border-skin-accent focus:outline-none" type="text" name="name" id="rounds" placeholder="Your name" required />
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>)

}