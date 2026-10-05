import Image from "next/image";
import { nav, contact, footer, site } from "@/data/content";

/** Static footer — no client JS needed. */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-bone/10 bg-ink px-4 pb-10 pt-16 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/logo.png" alt="Art Attack Electric Tattooing" width={839} height={506} className="h-auto w-56" />
          <p className="mt-6 font-display text-2xl italic">{footer.tagline}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-6">
          <p className="label mb-4">Explore</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-bone/70">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-bone">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm text-bone/70 md:col-span-3 md:col-start-10">
          <p className="label mb-4">Studio</p>
          <p>
            {contact.street}
            <br />
            {contact.city}, {contact.region} {contact.postalCode}
          </p>
          <p className="mt-3">
            <a href={contact.phoneHref} className="hover:text-bone">
              {contact.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
      <div className="hairline mx-auto mt-14 max-w-[1600px]" />
      <div className="mx-auto mt-6 flex max-w-[1600px] flex-col justify-between gap-2 text-xs text-bone/45 md:flex-row">
        <p>
          © {new Date().getFullYear()} {site.legalName}. Regulated by the Forsyth County Health Department.
        </p>
        <p>{footer.credit}</p>
      </div>
    </footer>
  );
}
