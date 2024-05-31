import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { cn } from "~/lib/utils";

export default function Header({
  fontSans,
}: {
  fontSans: NextFontWithVariable;
}) {
  return (
    <head
      className={cn(
        " justify-betweenpx-4 flex h-[45px] w-full flex-row items-end py-2 font-sans antialiased",
        fontSans.variable,
      )}
    >
      <h1 className=" ml-2 text-xl">ProSights</h1>
    </head>
  );
}
