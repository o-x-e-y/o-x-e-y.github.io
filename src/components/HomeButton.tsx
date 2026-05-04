import { A } from '@solidjs/router';

export default function HomeButton() {
  return (
    <div class="absolute top-0 left-0">
      <div class="relative w-32 h-16 border-r border-b border-[#666] rounded-br-lg bg-[#393939] flex items-center justify-center">
        <span class="font-bold text-[#ddd] text-2xl">Home</span>
        <A href="/" class="absolute inset-0" />
      </div>
    </div>
  );
}
