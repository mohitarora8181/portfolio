"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Apps,
  AutoAwesome,
  Code,
  DarkMode,
  GitHub,
  LightMode,
  LinkedIn,
  Palette,
  RocketLaunch,
  Search,
  Tune,
  WorkOutline,
} from "@mui/icons-material";
import { getAppShowcases, getPortfolioData } from "@/src/services/portfolioData";

const data = getPortfolioData();
const appShowcases = getAppShowcases();

const nameLetters = data.meta.name.split("");

const letterColors = [
  "text-[#4285f4]",
  "text-[#ea4335]",
  "text-[#fbbc04]",
  "text-[#34a853]",
  "text-[#4285f4]",
  "text-[#ea4335]",
];

const appLogos: Record<string, string> = {
  YouTube: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
  WhatsApp: "https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg",
  Spotify: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
  LinkedIn: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128",
  "Google Meet": "https://www.google.com/s2/favicons?domain=meet.google.com&sz=128",
  "Google Maps": "https://www.google.com/s2/favicons?domain=maps.google.com&sz=128",
};

const stats = [
  { label: "Projects", value: data.projects.length, icon: <Code sx={{ fontSize: 18 }} /> },
  { label: "Roles", value: data.experience.length, icon: <WorkOutline sx={{ fontSize: 18 }} /> },
  { label: "Clones", value: appShowcases.length, icon: <Apps sx={{ fontSize: 18 }} /> },
];

const themes = {
  light: {
    label: "Light",
    icon: <LightMode sx={{ fontSize: 17 }} />,
    main: "bg-[#f8fafd] text-[#202124]",
    panel: "border-[#dfe1e5] bg-white/80 text-[#3c4043]",
    hover: "hover:bg-white",
    muted: "text-[#5f6368]",
    search: "border-[#dfe1e5] bg-white text-[#202124]",
    placeholder: "placeholder:text-[#5f6368]",
    shortcut: "hover:bg-white/85",
    shortcutIcon: "bg-white ring-[#dfe1e5]",
    shortcutText: "text-[#202124]",
    stat: "border-[#dfe1e5] bg-white/80 text-[#3c4043]",
    glow: "bg-[#8ab4f8]/22",
  },
  sepia: {
    label: "Sepia",
    icon: <AutoAwesome sx={{ fontSize: 17 }} />,
    main: "bg-[#f4ecd8] text-[#2b2118]",
    panel: "border-[#dbc9a4] bg-[#fff8e7]/80 text-[#3a2a1d]",
    hover: "hover:bg-[#fff8e7]",
    muted: "text-[#765f44]",
    search: "border-[#dbc9a4] bg-[#fff8e7] text-[#2b2118]",
    placeholder: "placeholder:text-[#765f44]",
    shortcut: "hover:bg-[#fff8e7]/90",
    shortcutIcon: "bg-[#fff8e7] ring-[#dbc9a4]",
    shortcutText: "text-[#2b2118]",
    stat: "border-[#dbc9a4] bg-[#fff8e7]/80 text-[#3a2a1d]",
    glow: "bg-[#c58b3b]/20",
  },
  dark: {
    label: "Dark",
    icon: <DarkMode sx={{ fontSize: 17 }} />,
    main: "bg-[#0f1115] text-[#f8fafd]",
    panel: "border-white/12 bg-[#1b1f27]/88 text-[#e8eaed]",
    hover: "hover:bg-[#242a35]",
    muted: "text-[#a8b3c7]",
    search: "border-white/12 bg-[#171b22] text-[#f8fafd]",
    placeholder: "placeholder:text-[#a8b3c7]",
    shortcut: "hover:bg-[#1b1f27]/90",
    shortcutIcon: "bg-[#1b1f27] ring-white/12",
    shortcutText: "text-[#f8fafd]",
    stat: "border-white/12 bg-[#1b1f27]/80 text-[#e8eaed]",
    glow: "bg-[#8ab4f8]/18",
  },
};

type ThemeKey = keyof typeof themes;
const THEME_STORAGE_KEY = "portfolio:selected-theme";

const isThemeKey = (value: string | null): value is ThemeKey => (
  Boolean(value && value in themes)
);

export default function Home() {
  const [query, setQuery] = useState("");
  const [themeKey, setThemeKey] = useState<ThemeKey>("light");
  const [themeReady, setThemeReady] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 22 });
  const glowX = useSpring(cursorX, { stiffness: 120, damping: 24 });
  const glowY = useSpring(cursorY, { stiffness: 120, damping: 24 });

  const backgroundX = useTransform(smoothX, [-0.5, 0.5], [-28, 28]);
  const backgroundY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const panelX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const panelY = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const theme = themes[themeKey];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeKey(savedTheme)) {
      setThemeKey(savedTheme);
    }
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeKey);
  }, [themeKey, themeReady]);

  const selectTheme = (key: ThemeKey) => {
    setThemeKey(key);
    window.localStorage.setItem(THEME_STORAGE_KEY, key);
  };

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return appShowcases;

    return appShowcases.filter((app) =>
      [app.name, app.description, ...app.skills].join(" ").toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <main
      className={`h-screen overflow-hidden ${theme.main}`}
      onMouseMove={(event) => {
        pointerX.set(event.clientX / window.innerWidth - 0.5);
        pointerY.set(event.clientY / window.innerHeight - 0.5);
        cursorX.set(event.clientX);
        cursorY.set(event.clientY);
      }}
    >
      <motion.div
        style={{ left: glowX, top: glowY }}
        className={`pointer-events-none fixed z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] ${theme.glow}`}
      />
      <section className="relative flex h-full flex-col items-center px-4 pt-[12vh] max-md:pt-[9vh] max-sm:pt-[15vh]">
        <motion.div
          style={{ x: backgroundX, y: backgroundY }}
          className="pointer-events-none absolute inset-0 opacity-70"
        >
          <div className={`absolute left-[8%] top-[18%] h-24 w-72 rounded-2xl border shadow-sm ${theme.panel}`} />
          <div className={`absolute right-[9%] top-[22%] h-28 w-64 rounded-2xl border shadow-sm ${theme.panel}`} />
          <div className={`absolute bottom-[18%] left-[14%] h-20 w-56 rounded-2xl border shadow-sm ${theme.panel}`} />
          <div className="absolute inset-0 bg-[linear-gradient(#e8eaed_1px,transparent_1px),linear-gradient(90deg,#e8eaed_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        </motion.div>

        <div className={`absolute left-6 top-5 z-10 flex items-center gap-2 rounded-full border px-2 py-2 shadow-sm backdrop-blur ${theme.panel}`}>
          <span className="grid h-8 w-8 place-items-center rounded-full">
            <Palette sx={{ fontSize: 18 }} />
          </span>
          {(Object.keys(themes) as ThemeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectTheme(key)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${themeKey === key ? "bg-[#1a73e8] text-white" : `${theme.hover}`
                }`}
            >
              {themes[key].icon}
              <span className="max-sm:hidden">{themes[key].label}</span>
            </button>
          ))}
        </div>

        <div className="absolute right-6 top-5 z-10 flex items-center gap-4 text-sm font-medium max-sm:hidden">
          <a href={data.meta.links.github} target="_blank" className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 ${theme.hover}`}>
            <GitHub sx={{ fontSize: 18 }} /> GitHub
          </a>
          <a href={data.meta.links.linkedin} target="_blank" className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 ${theme.hover}`}>
            <LinkedIn sx={{ fontSize: 18 }} /> LinkedIn
          </a>
          <button className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full ${theme.hover}`}>
            <Tune sx={{ fontSize: 21 }} />
          </button>
          <img src={data.meta.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-[#4285f4]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 flex w-full flex-col items-center"
        >
          <h1 className="select-none text-center text-[82px] font-semibold leading-none tracking-[-0.035em] max-md:text-[64px] max-sm:text-[42px]">
            {nameLetters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className={letter === " " ? "inline-block w-12 max-sm:w-7" : `${letterColors[index % letterColors.length]} mx-[0.018em] inline-block cursor-pointer`}
                initial={{ opacity: 0, y: 18, rotateX: -80 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ rotateY: 180, scale: 1.08 }}
                transition={{
                  opacity: { delay: index * 0.035, duration: 0.45, ease: "easeOut" },
                  y: { delay: index * 0.035, duration: 0.45, ease: "easeOut" },
                  rotateX: { delay: index * 0.035, duration: 0.45, ease: "easeOut" },
                  rotateY: { duration: 0.16, ease: "easeOut" },
                  scale: { duration: 0.12, ease: "easeOut" },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`mt-4 text-center text-sm font-medium ${theme.muted}`}
          >
            {data.meta.tagline}
          </motion.p>

          <div className="mt-4 hidden items-center justify-center gap-2 max-sm:flex">
            <a
              href={data.meta.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={`grid h-10 w-10 place-items-center rounded-full border shadow-sm ${theme.panel}`}
            >
              <GitHub sx={{ fontSize: 19 }} />
            </a>
            <a
              href={data.meta.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={`grid h-10 w-10 place-items-center rounded-full border shadow-sm ${theme.panel}`}
            >
              <LinkedIn sx={{ fontSize: 19 }} />
            </a>
          </div>

          <motion.div
            style={{ x: panelX, y: panelY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="relative mt-8 w-full max-w-[760px]"
          >
            <label className={`flex h-[58px] items-center rounded-full border px-5 shadow-[0_10px_35px_rgba(60,64,67,0.18)] transition hover:shadow-[0_14px_40px_rgba(60,64,67,0.24)] ${theme.search}`}>
              <Search className={`mr-4 ${theme.muted}`} sx={{ fontSize: 24 }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search portfolio apps, projects, skills"
                className={`min-w-0 flex-1 bg-transparent text-base outline-none ${theme.placeholder}`}
              />
              <button type="button" aria-label="Voice search" className="mx-2 grid h-9 w-9 cursor-pointer place-items-center rounded-full hover:bg-[#f1f3f4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" d="M0 0h24v24H0z" /><path fill="#4285F4" d="M12 15c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v7c0 1.66 1.34 3 3 3z" /><path fill="#34A853" d="M11 18.92h2V22h-2z" /><path fill="#F4B400" d="M7 12H5c0 1.93.78 3.68 2.05 4.95l1.41-1.41C7.56 14.63 7 13.38 7 12z" /><path fill="#EA4335" d="M12 17c-1.38 0-2.63-.56-3.54-1.47l-1.41 1.41A6.99 6.99 0 0 0 12.01 19c3.87 0 6.98-3.14 6.98-7h-2c0 2.76-2.23 5-4.99 5z" /></svg>
              </button>
              <button type="button" aria-label="Search by image" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full p-0 hover:bg-[#f1f3f4]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="20 20 152 152"
                  preserveAspectRatio="xMidYMid meet"
                  className="block h-[22px] w-[22px]"
                >
                  <circle cx="144.07" cy="144" r="16" fill="#34A853" />
                  <circle cx="96.07" cy="104" r="24" fill="#4285F4" />

                  <path
                    fill="#EA4335"
                    d="M24 135.2c0 18.11 14.69 32.8 32.8 32.8H96v-16l-40.1-.1c-8.8 0-15.9-8.19-15.9-17.9v-18H24v19.2z"
                  />

                  <path
                    fill="#FBBC04"
                    d="M168 72.8c0-18.11-14.69-32.8-32.8-32.8H116l20 16c8.8 0 16 8.29 16 18v30h16V72.8z"
                  />

                  <path
                    fill="#4285F4"
                    d="M112 24H80L68 40H56.8C38.69 40 24 54.69 24 72.8V92h16V74c0-9.71 7.2-18 16-18h80l-24-32z"
                  />
                </svg>
              </button>
            </label>
          </motion.div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 + index * 0.08 }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur ${theme.stat}`}
              >
                {item.icon}
                <span>{item.value}</span>
                <span className={theme.muted}>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid max-w-[760px] grid-cols-3 gap-x-5 gap-y-4 sm:grid-cols-5">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 26, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.46 + index * 0.08, duration: 0.42, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href={app.href}
                  className={`group flex h-[112px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-2xl hover:shadow-lg ${theme.shortcut}`}
                >
                  <span className={`grid h-[58px] w-[58px] place-items-center rounded-2xl shadow-[0_8px_22px_rgba(60,64,67,0.16)] ring-1 transition group-hover:shadow-[0_12px_28px_rgba(60,64,67,0.22)] ${theme.shortcutIcon}`}>
                    <img src={appLogos[app.name]} alt={app.name} className="h-9 w-9 object-contain" />
                  </span>
                  <span className={`mt-3 max-w-[100px] truncate text-center text-sm font-medium ${theme.shortcutText}`}>{app.name}</span>
                </Link>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 26, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.46 + filteredApps.length * 0.08, duration: 0.42 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className={`flex h-[112px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-2xl hover:shadow-lg ${theme.shortcut}`}
            >
              <Link
                href={"/launch"}
                className={`group flex h-[112px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-2xl hover:shadow-lg ${theme.shortcut}`}
              >
                <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#e8f0fe] text-[#174ea6] shadow-sm">
                  <RocketLaunch sx={{ fontSize: 27 }} />
                </span>
                <span className={`mt-3 text-center text-sm font-medium ${theme.shortcutText}`}>Launch lab</span>
              </Link>
            </motion.button>
          </div>
        </motion.div>

        <motion.a
          href={data.meta.resume_url}
          target="_blank"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-6 right-6 cursor-pointer rounded-full bg-[#d3e3fd] px-5 py-3 text-sm font-semibold text-[#0b316f] shadow-md hover:bg-[#c2d7fb] max-sm:hidden"
        >
          View Resume
        </motion.a>
      </section>
    </main>
  );
}
