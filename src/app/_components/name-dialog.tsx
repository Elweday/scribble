"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import EditForm from "./edit-form";
import { X } from "lucide-react";

export default function EditDialog(props: { open: boolean, close: () => void }) {
return (
<Dialog  open={props.open}>
  <DialogContent  className="z-[999] p-5 w-[80%] rounded bg-purple-950/80 ">
    <DialogHeader>
      <DialogTitle className="flex justify-between place-items-center place-content-center">
        <span>
            What's your name?
            </span>
        <button className="aspect-square  flex place-self-end" onClick={props.close}><X /></button>
      </DialogTitle>
      <DialogDescription >
      <div className="flex place-content-center place-items-center">
        <EditForm />
      </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>)

}