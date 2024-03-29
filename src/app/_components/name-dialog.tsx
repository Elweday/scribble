"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import EditForm from "./edit-form";
import { X } from "lucide-react";

export default function EditDialog(props: {open: boolean, setOpen: (open: boolean) => void}) {
return (
<Dialog open={props.open}>
  <DialogContent  className="z-[999] w-[90%] flex place-content-center  lg:w-full rounded bg-purple-950/80 ">
    <DialogHeader>
      <DialogTitle className="flex justify-between place-items-center place-content-center">
            What's your name?
            <DialogTrigger onClick={() => {
              props.setOpen(false)
            }}  >
              <button className="aspect-square  flex place-self-end" ><X /></button>
            </DialogTrigger>
      </DialogTitle>
      <DialogDescription  className=" flex place-content-center place-items-center w-full">
        <EditForm />
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
)
}
