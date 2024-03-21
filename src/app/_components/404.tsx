
export default  function Error(props: {
  code?: number
  message: string
}) {
  return (
      <div className=" flex w-full h-full  place-self-center text-2xl  flex-col gap-3 place-content-center place-items-center ">
        {props.message}
    </div>
  );
}