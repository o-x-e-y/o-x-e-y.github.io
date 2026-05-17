import { A } from "@solidjs/router";

export default function HomeButton() {
  return (
    <div class="absolute top-0 left-0">
      <div class="relative w-[10rem] h-[4vw] min-w-12 min-h-6 border-r border-b border-[#666] rounded-br-lg sm:rounded-br-[1.7vw] bg-[#393939] flex items-center justify-center contain-inline-size">
        <span class="font-bold text-[#ddd] text-[2.67cqw]">Home</span>
        <A href="/" class="absolute inset-0" />
      </div>
    </div>
  );
}
