
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-primary px-3 py-2 text-center text-white">
      <div className="flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.12em] sm:text-xs">
        <span>FREE SHIPPING ON ALL ORDERS</span>

        <span className="hidden text-accent sm:inline">|</span>

        <span className="hidden sm:inline">
          DISCOVER TIMELESS ELEGANCE
        </span>

        <ArrowRight size={13} className="text-accent" />
      </div>
    </div>
  );
}
