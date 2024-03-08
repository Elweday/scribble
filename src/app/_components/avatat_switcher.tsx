"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "./ui/carousel"
  import { useState } from "react"

  import { avatars, Avatar as AvatarName } from "~/machine"
  import { Avatar } from "./avatar"
  

  export const AvatarSwitcher =  () =>{
    const [avatar, setAvatar] = useState<AvatarName>("arab")
    return (<Carousel className="w-full place-content-center place-items-center">
      <CarouselContent >
        {avatars.map((av) => (
          <CarouselItem key={av} className="flex w-full justify-center place-content-center place-items-center">
            <Avatar key={av} size="large" avatar={av} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="size-8 left-2"  />
      <CarouselNext className="size-8 right-2" />
    </Carousel>)
  }