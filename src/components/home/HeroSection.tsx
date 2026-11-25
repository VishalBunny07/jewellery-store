
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="section-container py-4 sm:py-6">
      <div className="relative isolate min-h-540px overflow-hidden bg-[#EDE1D9] sm:min-h- 580px lg:min-h-560px">

        {/* Background Image */}
        <Image
          src="/images/banners/hero.jpg"
          alt="Elegant jewellery collection"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
          className="object-cover object-[62%_center]"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent sm:bg-linear-to-r sm:from-black/55 sm:via-black/15 sm:to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-540px flex-col justify-end px-6 pb-10 text-white sm:min-h-580px sm:px-12 sm:pb-14 lg:min-h-560px lg:max-w-650px lg:justify-center lg:px-16 lg:pb-0">

          <span className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E9CFAD] sm:text-xs">
            Discover the Collection
          </span>

          <h1 className="max-w-420px font-serif text-[42px] leading-[1.08] sm:text-6xl lg:text-[68px]">
            Everyday
            <br />
            Elegance
          </h1>

          <p className="mt-4 max-w-[320px] text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            Beautifully crafted jewellery for every moment,
            every occasion and every version of you.
          </p>

          <div className="mt-7">
            <Link
              href="/collections"
              className="inline-flex min-h-12 items-center gap-4 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-[#F1E5E2]"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] tracking-wide text-white/90 sm:text-xs">
            <span>✦ Thoughtful Designs</span>
            <span>✦ Beautifully Crafted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
