"use client";
import { useState } from "react";
import { useFirebase } from "@/utils/Firebase";
import {
  ArrowRight,BadgeCheck,BarChart3, Bot, BrainCircuit, CloudUpload,FileSpreadsheet,MoonStar,ShieldCheck,Sparkles,
  SunMedium,
  Workflow,
} from "lucide-react";
import CsvImporterModal from "@/components/CsvImporterModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ThemeMode = "light" | "dark";

const highlights = [
  {
    title: "AI-powered CSV extraction",
    description: "Uploads raw lead spreadsheets and converts them into structured CRM-ready records.",
    icon: Bot,
  },
  {
    title: "Structured validation",
    description: "Uses a strict schema to normalize email, mobile, status, source, and notes fields.",
    icon: ShieldCheck,
  },
  {
    title: "Batch processing with retry",
    description: "Processes records in safe batches and retries weak AI responses for better reliability.",
    icon: Workflow,
  },
];

const projectFeatures = [
  {
    title: "Lead ingestion workflow",
    description: "Upload bulk CSV files and import clean lead datasets in a single streamlined flow.",
    icon: CloudUpload,
  },
  {
    title: "CRM field mapping",
    description: "Map information such as owner, status, company, city, and source into a consistent CRM format.",
    icon: FileSpreadsheet,
  },
  {
    title: "Smart enrichment",
    description: "Store extra details in CRM notes so important records remain useful and export-ready.",
    icon: BrainCircuit,
  },
  {
    title: "Visibility & reporting",
    description: "Track high-value lead activity and conversion signals with a modern executive summary view.",
    icon: BarChart3,
  },
];

function BrandLogo({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-lg font-extrabold text-white shadow-lg shadow-violet-500/30">
        GE
      </div>
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.35em] ${
            isDark ? "text-cyan-300" : "text-violet-600"
          }`}
        >
          GROW EASY
        </p>
        <p className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          CRM
        </p>
      </div>
    </div>
  );
}

export default function Home() {

  const firebase=useFirebase();
  const Logout=async()=>{
    {
      await firebase.logout();
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const isDark = theme === "dark";

  const rootClass = isDark
    ? "min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_45%,_#020617_100%)] text-slate-50"
    : "min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#edf6ff_45%,_#f8fafc_100%)] text-slate-900";

  const panelClass = isDark
    ? "border border-slate-800 bg-slate-900/85 text-white"
    : "border border-violet-100 bg-white/90 text-slate-900";

  const mutedText = isDark ? "text-slate-300" : "text-slate-600";
  const softCard = isDark
    ? "border-slate-800 bg-slate-900/70"
    : "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50";
  const toggleClass = isDark
    ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
    : "border-violet-200 bg-white text-slate-800 hover:bg-violet-50";

  return (
    <main className={`${rootClass} px-4 py-4 sm:px-6 lg:px-8`}>
      <div className="mx-auto max-w-9xl">
        <header
          className={`mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border px-4 py-3 shadow-sm ${
            isDark ? "border-slate-800 bg-slate-950/70" : "border-violet-100 bg-white/85"
          }`}
        >
          <BrandLogo isDark={isDark} />

          <div className="flex items-center gap-3">
           

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${toggleClass}`}
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>

             <button
              type="button"
              onClick={Logout}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${toggleClass}`}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className={`${panelClass} rounded-[28px] p-6 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur md:p-8`}
          >
            <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-700 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                GrowEasy CRM
              </span>
              <span className={`block ${mutedText} mt-2`}>
                for faster lead conversion
              </span>
            </h1>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-transform duration-200 hover:-translate-y-0.5 hover:from-violet-800 hover:to-indigo-700"
              >
                Import Leads via CSV
                <ArrowRight className="h-4 w-4" />
              </button>

              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  isDark ? "border-slate-800 bg-slate-950/60 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                Compatible with bulk lead uploads and export-ready processing
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className={`rounded-2xl border p-4 ${softCard}`}
                >
                  <div
                    className={`mb-3 inline-flex rounded-xl p-2 shadow-sm ${
                      isDark
                        ? "bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-300"
                        : "bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {title}
                  </h2>
                  <p className={`mt-1 text-sm leading-6 ${mutedText}`}>{description}</p>
                </div>
              ))}
            </div>
          </div>

          <aside
            className={`rounded-[28px] p-6 md:p-8 ${
              isDark ? "bg-slate-950 text-white" : "bg-slate-900 text-white"
            } shadow-[0_20px_70px_-30px_rgba(15,23,42,0.85)]`}
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Tech stack
              </p>
              <h3 className="mt-3 text-2xl font-black text-white">
                Built with a modern full-stack AI workflow
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                GrowEasy CRM combines a Next.js frontend, an Express backend, CSV parsing, and Gemini-powered AI extraction to transform unstructured data into CRM-ready records.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                {
                  title: "Frontend",
                  items: ["Next.js 16", "React 19", "Tailwind CSS", "Lucide icons"],
                },
                {
                  title: "Backend",
                  items: ["Node.js", "Express", "Multer", "CSV parsing"],
                },
                {
                  title: "AI & validation",
                  items: ["Google Gemini", "Zod schema validation", "Batch retry logic"],
                },
                {
                  title: "Authentication",
                  items: ["Firebase Auth", "Email/password login", "Google OAuth"],
                }
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl bg-white/5 px-4 py-4"
                >
                  <p className="text-sm font-bold text-orange-300">{group.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-black tracking-tight">Project features</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {projectFeatures.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className={`rounded-[24px] border p-5 shadow-sm ${softCard}`}
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 p-3 text-white shadow-lg shadow-violet-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {title}
                </h3>
                <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className={`rounded-[24px] border p-6 ${softCard}`}>
            <h3 className="text-xl font-black">How the workflow works</h3>
            <div className="mt-4 space-y-3">
              {[
                "Upload a CSV file with leads, contacts, or property records.",
                "The backend parses the file and runs AI-assisted extraction in structured batches.",
                "Clean CRM output is returned with statuses, notes, and source tracking preserved.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl px-3 py-2"
                >
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <p className={`text-sm leading-6 ${mutedText}`}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[24px] border p-6 ${softCard}`}>
            <h3 className="text-xl font-black">Why it stands out</h3>
            <div className="mt-4 grid gap-3">
              {[
                "Professional, modern product presentation",
                "Color-rich gradient branding for GrowEasy",
                "Light and dark mode support for flexible viewing",
                "Clear emphasis on AI, data quality, and scalability",
              ].map((item) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                    isDark
                      ? "border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900"
                      : "border-violet-200/60 bg-gradient-to-r from-violet-50 to-cyan-50"
                  }`}
                >
                  <BadgeCheck
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      isDark ? "text-cyan-300" : "text-violet-600"
                    }`}
                  />
                  <p className={`text-sm leading-6 ${mutedText}`}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <CsvImporterModal onClose={() => setIsModalOpen(false)} />
      )}

      <ToastContainer position="bottom-right" theme={isDark ? "dark" : "light"} />
    </main>
  );
}