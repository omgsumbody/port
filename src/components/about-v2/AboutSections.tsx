import { EXPERIENCE, GAMES, MOMENTS, SONGS } from "./about-data";

const heading = "font-perfectly-nineties text-[24px] font-semibold text-[#1b2330]";

export function AboutExperience() {
  return (
    <section aria-labelledby="experience-title" className="w-full px-6 pb-24 lg:px-16">
      <h2 id="experience-title" className={heading}>
        Experience
      </h2>
      <ul className="mt-6 border-t border-[#E0DDD6]">
        {EXPERIENCE.map((e) => (
          <li
            key={e.company}
            className="grid grid-cols-[48px_1fr] items-center gap-x-5 gap-y-1 border-b border-[#E0DDD6] py-5 sm:grid-cols-[48px_1fr_1fr_140px]"
          >
            <img src={e.logo} alt="" width={48} height={48} className="row-span-2 h-12 w-12 rounded-[10px] object-cover sm:row-span-1" />
            <span className="font-ui text-[16px] text-[#1b2330]">
              {e.company}
              {e.note && <span className="ml-2 text-[15px] text-ashen">({e.note})</span>}
            </span>
            <span className="font-ui text-[16px] text-[#3D495A]">{e.role}</span>
            <span className="font-ui text-[15px] text-ashen tabular-nums sm:text-right">{e.years}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Bill from Contra, prone along the top edge of the games grid: 3 screen px per NES pixel.
const BILL = { w: 379 * 0.3, h: 169 * 0.3 };

/** On repeat and Games that made me, side by side. */
export function AboutFavourites() {
  return (
    <section className="grid w-full grid-cols-1 gap-20 px-6 pb-28 lg:grid-cols-2 lg:gap-16 lg:px-16">
      <div aria-labelledby="repeat-title" role="group" className="flex flex-col gap-6">
        <h2 id="repeat-title" className={heading}>
          On repeat
        </h2>
        <ul className="grid grid-cols-3 gap-3">
          {SONGS.map((s, i) => {
            const inner = (
              <>
                <span aria-hidden className="block aspect-square w-full rounded-[10px] bg-[#E4E1DA]" />
                <span className="font-ui text-[16px] font-semibold text-[#1b2330]">{s.title}</span>
                <span className="font-ui text-[14px] text-ashen">{s.artist}</span>
              </>
            );
            return (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 rounded-[14px] border border-[#E6E3DC] bg-white p-3 transition-shadow hover:shadow-[0_8px_24px_rgba(27,35,48,0.1)]">
                    {inner}
                  </a>
                ) : (
                  <div className="flex flex-col gap-2 rounded-[14px] border border-[#E6E3DC] bg-white p-3">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="font-ui text-[13px] tracking-[0.08em] text-ashen uppercase">Favourite moments</h3>
          <ul className="flex flex-col gap-3 font-ui text-[16px] text-[#2e3a4a]">
            {MOMENTS.map((m, i) => (
              <li key={i}>
                <span className="font-semibold text-[#1b2330] tabular-nums">{m.time}</span> in {m.title} by {m.artist}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-labelledby="games-title" role="group" className="flex flex-col gap-6">
        <h2 id="games-title" className={heading}>
          Games that made me
        </h2>
        <div className="relative">
          <img
            src="/sprites/bill-prone.webp"
            alt=""
            aria-hidden
            width={BILL.w}
            height={BILL.h}
            className="pointer-events-none absolute right-6 z-10"
            style={{ bottom: "100%", marginBottom: `${-BILL.h * 0.06}px` }}
          />
          <ul className="grid grid-cols-2 gap-3">
            {GAMES.map((g) => (
              <li key={g.title} className="flex flex-col gap-1.5 rounded-[12px] border border-[#E6E3DC] bg-white p-4">
                <span className="font-ui text-[16px] font-semibold leading-snug text-[#1b2330]">{g.title}</span>
                {g.when && <span className="font-ui text-[13px] text-ashen">{g.when}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
