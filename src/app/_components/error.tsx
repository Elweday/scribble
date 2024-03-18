
export default  function Error404(props: {message: string}) {
  return (
    <main className="w-full h-full place-content-center place-items-center">
      <div className=" flex w-full h-full  place-self-center text-2xl  flex-col gap-3 place-content-center place-items-center ">
      {props.message}
    </div>
    </main>
  );
}