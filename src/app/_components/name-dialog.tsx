"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import EditForm from "./edit-form";
import { X } from "lucide-react";

export default function EditDialog(props: {open: boolean, setOpen: (open: boolean) => void}) {
return (
<Dialog open={props.open}>
  <DialogContent  className="z-[999] w-[20rem] lg:w-full rounded bg-purple-950/80 ">
    <DialogHeader>
      <DialogTitle className="flex justify-between place-items-center place-content-center">
        <span>
            What's your name?
            </span>
            <DialogTrigger onClick={() => {
              props.setOpen(false)
            }}  >
              <button className="aspect-square  flex place-self-end" ><X /></button>
            </DialogTrigger>
      </DialogTitle>
      <DialogDescription  className=" flex place-content-center place-items-center w-[16.8rem]">
        <EditForm />
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>)

}