"use client";

// The project guide, shown on the storefront (/guide) and in the admin panel
// (/admin/guide). English by default; the English / বাংলা switch is saved in
// localStorage so both pages remember it.
import { useSyncExternalStore } from "react";
import { HiOutlineArrowRight, HiOutlineArrowUp, HiOutlineInformationCircle, HiOutlineExclamationTriangle } from "react-icons/hi2";
import Link from "next/link";
import { GUIDE_SECTIONS, GUIDE_UI, type GuideBlock, type GuideLang, type GuideText } from "./guideContent";

type Translate = (text: GuideText | string | null | undefined) => string;

const LANG_KEY = "notension-guide-lang";
const LANG_EVENT = "notension-guide-lang";
const LANGS: { id: GuideLang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "bn", label: "বাংলা" },
];

const subscribe = (onChange: () => void) => {
  window.addEventListener(LANG_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANG_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const readLang = (): GuideLang => {
  try {
    return localStorage.getItem(LANG_KEY) === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
};

const saveLang = (lang: GuideLang) => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Storage blocked: the switch can't be remembered, so English stays.
  }
  window.dispatchEvent(new Event(LANG_EVENT));
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

function LanguageSwitch({ lang }: { lang: GuideLang }) {
  return (
    <div role="group" aria-label={`${GUIDE_UI.language.en} / ${GUIDE_UI.language.bn}`} className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-pressed={lang === l.id}
          onClick={() => saveLang(l.id)}
          className={cx(
            "min-h-9 rounded-full px-4 text-sm font-medium transition-colors",
            lang === l.id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function Flow({ items, tr }: { items: GuideText[]; tr: Translate }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-900">{tr(item)}</span>
          {i < items.length - 1 ? <HiOutlineArrowRight aria-hidden="true" className="shrink-0 text-gray-400" /> : null}
        </li>
      ))}
    </ol>
  );
}

function Block({ block, tr }: { block: GuideBlock; tr: Translate }) {
  switch (block.type) {
    case "h":
      return <h3 className="pt-2 text-base font-semibold text-gray-900">{tr(block.text)}</h3>;
    case "p":
      return <p className="leading-relaxed text-gray-700">{tr(block.text)}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-gray-700 marker:text-gray-400">
          {block.items.map((item, i) => (
            <li key={i}>{tr(item)}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{i + 1}</span>
              <div className="min-w-0 pt-0.5">
                <p className="font-semibold text-gray-900">{tr(item.title)}</p>
                <p className="mt-0.5 leading-relaxed text-gray-700">{tr(item.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "flow":
      return <Flow items={block.items} tr={tr} />;
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="px-3 py-2.5 font-semibold">
                    {tr(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {block.rows.map((row, r) => (
                <tr key={r} className="align-top">
                  {row.map((cell, c) => (
                    <td key={c} className={cx("px-3 py-2.5 leading-relaxed", c === 0 ? "font-medium whitespace-nowrap text-gray-900" : "text-gray-700")}>
                      {tr(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note": {
      const warn = block.tone === "warn";
      const Icon = warn ? HiOutlineExclamationTriangle : HiOutlineInformationCircle;
      return (
        <div
          className={cx(
            "flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm leading-relaxed",
            warn ? "border-amber-200 bg-amber-50 text-amber-900" : "border-blue-200 bg-blue-50 text-blue-900",
          )}
        >
          <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-lg" />
          <p>{tr(block.text)}</p>
        </div>
      );
    }
    case "links":
      return (
        <div className="flex flex-wrap gap-2">
          {block.items.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              {tr(l.label)} <HiOutlineArrowRight />
            </Link>
          ))}
        </div>
      );
    case "faq":
      return (
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
          {block.items.map((item, i) => (
            <details key={i} className="group px-4 py-3">
              <summary className="cursor-pointer list-none font-medium text-gray-900 marker:hidden">
                <span className="flex items-center justify-between gap-3">
                  {tr(item.q)}
                  <span aria-hidden="true" className="text-gray-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 leading-relaxed text-gray-700">{tr(item.a)}</p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}

// `stickyTop`: Tailwind class for the contents list's offset (below the
// storefront navbar, or near the top inside the admin panel).
type Props = { stickyTop?: string };

export default function Guide({ stickyTop = "lg:top-24" }: Props) {
  const lang = useSyncExternalStore<GuideLang>(subscribe, readLang, () => "en");
  const tr: Translate = (text) => (typeof text === "string" ? text : (text?.[lang] ?? text?.en ?? ""));

  return (
    <div lang={lang} id="guide-top">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{tr(GUIDE_UI.title)}</h1>
          <p className="mt-2 leading-relaxed text-gray-600">{tr(GUIDE_UI.subtitle)}</p>
          <p className="mt-1 text-xs text-gray-500">{tr(GUIDE_UI.updated)}</p>
        </div>
        <LanguageSwitch lang={lang} />
      </header>

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <nav aria-label={tr(GUIDE_UI.contents)} className={cx("mb-6 lg:sticky lg:mb-0 lg:self-start", stickyTop)}>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">{tr(GUIDE_UI.contents)}</p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-0.5 lg:overflow-visible lg:pb-0">
            {GUIDE_SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="block rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-100 hover:text-gray-900 lg:rounded-lg lg:border-0 lg:bg-transparent lg:px-2.5 lg:whitespace-normal"
                >
                  {tr(s.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-5">
          {GUIDE_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-4 md:p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-900 md:text-xl">{tr(s.title)}</h2>
              <div className="space-y-4">
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} tr={tr} />
                ))}
              </div>
            </section>
          ))}
          <a href="#guide-top" className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary hover:underline">
            <HiOutlineArrowUp /> {tr(GUIDE_UI.backToTop)}
          </a>
        </div>
      </div>
    </div>
  );
}
