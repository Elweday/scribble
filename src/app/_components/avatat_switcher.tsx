"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
  } from "./ui/carousel"
  import { useEffect, useState } from "react"
  import { avatars, AvatarName } from "~/constants/avatars";
  import { Avatar } from "./avatar"
  import { player } from "~/constants/game";

  export const AvatarSwitcher =  () =>{
    const [api, setApi] = useState<CarouselApi>()
    const {avatar} = player.use()
    const setAvatar  = (a: AvatarName) => player.set("avatar", a)

    useEffect(() => {
      api?.scrollTo(avatars.indexOf(avatar), true)
      api?.on("select", () => {
        const idx = api.selectedScrollSnap();
        setAvatar(avatars[idx] as AvatarName)
      })
    }, [api])
    
    return (<Carousel setApi={setApi} opts={{ loop: true }} className="w-full place-content-center place-items-center">
      <CarouselContent >
        {avatars.map((av) => (
          <CarouselItem  key={av} className="flex w-full justify-center place-content-center place-items-center">
            <Avatar key={av} size="large" avatar={av} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="size-8 left-2"  />
      <CarouselNext className="size-8 right-2" />
    </Carousel>)
  }