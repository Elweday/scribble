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
  import { local } from "~/constants/game";
import { cn } from "~/utils/cn";

  export const AvatarSwitcher =  () =>{
    const [api, setApi] = useState<CarouselApi>()
    const {avatar} = local.use()
    const setAvatar  = (a: AvatarName) => local.set("avatar", a)
    const currentIndex = avatars.indexOf(avatar);
    useEffect(() => {
      api?.on("scroll", () => {
        const idx = api.selectedScrollSnap();
        setAvatar(avatars[idx] as AvatarName)
      })
      api?.scrollTo(currentIndex)
    }, [api])
    
    return (<Carousel setApi={setApi} opts={{ loop: true }} className="block w-full place-content-center place-items-center max-w-80">
      <CarouselContent >
        {avatars.map((av, i) => (
          <CarouselItem  key={av} className="flex py-5 w-full place-content-center place-items-center basis-1/5">
            <div className={cn(" transition-all ",{
              "scale-[2] duration-500": i === api?.selectedScrollSnap()
            })}>
            <Avatar key={i} size="xl" avatar={av} />
            </div>  
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="size-8 left-2"  />
      <CarouselNext className="size-8 right-2" />
    </Carousel>)
  }