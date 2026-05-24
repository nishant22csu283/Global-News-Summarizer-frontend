import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  Newspaper,
  Globe,
  Languages,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Trophy,
  TrendingUp,
  Briefcase,
  Landmark,
  ShieldAlert,
  Clapperboard,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

const CATEGORIES = [
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "technology", label: "Technology", icon: TrendingUp },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "politics", label: "Politics", icon: Landmark },
  { id: "crime", label: "Crime", icon: ShieldAlert },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard },
];

function SkeletonBar({ className = "", darkMode }) {

  return (
    <div
      className={`rounded-xl ${
        darkMode ? "skeleton-shimmer-dark" : "skeleton-shimmer-light"
      } ${className}`}
    />
  );

}

function ArticleCardSkeleton({ darkMode }) {

  const border = darkMode ? "border-white/10" : "border-gray-200";

  return (
    <div
      className={`overflow-hidden rounded-[28px] border backdrop-blur-xl ${
        darkMode ? "bg-[#111827]/40" : "bg-white"
      } ${border}`}
    >

      <SkeletonBar darkMode className="h-56 w-full rounded-none" />

      <div className="space-y-4 p-6">

        <div className="flex items-center justify-between gap-3">

          <SkeletonBar darkMode className="h-6 w-20 rounded-full" />

          <SkeletonBar darkMode className="h-5 w-24" />

        </div>

        <SkeletonBar darkMode className="h-7 w-full" />

        <SkeletonBar darkMode className="h-7 w-4/5" />

        <SkeletonBar darkMode className="h-4 w-full" />

        <SkeletonBar darkMode className="h-4 w-full" />

        <SkeletonBar darkMode className="h-4 w-3/4" />

        <SkeletonBar darkMode className="h-5 w-28" />

      </div>

    </div>
  );

}

function NewsLoadingSkeletons({ darkMode }) {

  const border = darkMode ? "border-white/10" : "border-gray-200";

  return (
    <>

      <div className="px-8 pb-2 pt-0">

        <div
          className={`relative h-[430px] overflow-hidden rounded-[32px] border shadow-2xl ${border}`}
        >

          <SkeletonBar darkMode className="absolute inset-0 rounded-none" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 w-full space-y-4 p-10">

            <SkeletonBar darkMode className="h-8 w-40 rounded-full" />

            <SkeletonBar darkMode className="h-12 w-[85%] max-w-4xl" />

            <SkeletonBar darkMode className="h-12 w-[65%] max-w-3xl" />

            <SkeletonBar darkMode className="h-5 w-full max-w-4xl" />

            <SkeletonBar darkMode className="h-5 w-11/12 max-w-3xl" />

            <SkeletonBar darkMode className="h-12 w-48 rounded-2xl" />

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 xl:grid-cols-3">

        {Array.from({ length: 6 }).map((_, i) => (

          <ArticleCardSkeleton key={i} darkMode={darkMode} />

        ))}

      </div>

    </>
  );

}

function App() {

  // -----------------------------------
  // Theme
  // -----------------------------------

  const [darkMode, setDarkMode] = useState(true);

  // -----------------------------------
  // States
  // -----------------------------------

  const [country, setCountry] = useState("India");

  const [topic, setTopic] = useState("sports");

  const [language, setLanguage] = useState("en");

  const [articles, setArticles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  // Sidebar dropdowns

  const [showCategories, setShowCategories] = useState(true);

  const [showCountries, setShowCountries] = useState(false);

  const [showLanguages, setShowLanguages] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // Saved articles state with localStorage persistence
  const [savedArticles, setSavedArticles] = useState(() => {
    const saved = localStorage.getItem('savedArticles');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSavedArticles, setShowSavedArticles] = useState(false);

  // Save to localStorage whenever savedArticles changes
  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const toggleSaveArticle = (article) => {
    const isSaved = savedArticles.some(saved => saved.url === article.url);
    if (isSaved) {
      setSavedArticles(savedArticles.filter(saved => saved.url !== article.url));
    } else {
      setSavedArticles([...savedArticles, article]);
    }
  };

  const isArticleSaved = (articleUrl) => {
    return savedArticles.some(saved => saved.url === articleUrl);
  };

  // -----------------------------------
  // Fetch News
  // -----------------------------------

  const fetchNews = async () => {

    setLoading(true);

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/summaries`,
        {
          params: {
            country,
            topic,
            language,
          },
        }
      );

      setArticles(response.data.summaries);
      setSearchQuery("");

    } catch (error) {

      console.log(error);

    }

    setLoading(false);
    closeMobileSidebar();
  };

  // -----------------------------------
  // Theme Classes
  // -----------------------------------

  const bgMain = darkMode
    ? "bg-[#070b14] text-white"
    : "bg-[#f4f7fb] text-black";

  const sidebarBg = darkMode
    ? "bg-[#0d111c] border-white/10"
    : "bg-white border-gray-200";

  const cardBg = darkMode
    ? "bg-[#111827]/60 border-white/10"
    : "bg-white border-gray-200";

  const textSecondary = darkMode
    ? "text-gray-400"
    : "text-gray-600";

  const navBg = darkMode
    ? "bg-[#070b14]/80 border-white/10"
    : "bg-white/80 border-gray-200";

  const scrollClass = darkMode ? "sidebar-scroll" : "sidebar-scroll-light";

  const filteredArticles = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();

    if (!query) return articles;

    return articles.filter((article) => {

      const title = (article.title ?? "").toLowerCase();
      const summary = (article.summary ?? "").toLowerCase();

      return title.includes(query) || summary.includes(query);

    });

  }, [articles, searchQuery]);

  useEffect(() => {

    if (!mobileSidebarOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };

  }, [mobileSidebarOpen]);

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div className={`min-h-screen overflow-hidden transition-all duration-500 ${bgMain}`}>

      <div className="flex">

        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* ----------------------------------- */}
        {/* Sidebar */}
        {/* ----------------------------------- */}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[min(18rem,85vw)] min-h-screen border-r p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 ${sidebarBg} ${scrollClass} ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >

          {/* Logo */}

          <div className="mb-12 flex items-start justify-between gap-3">

            <div className="flex items-center gap-4 min-w-0">

              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20 shrink-0">

                <Sparkles />

              </div>

              <div className="min-w-0">

                <h1 className="text-2xl font-bold whitespace-nowrap leading-tight">
                  Global News
                </h1>

                <p className={`text-sm ${textSecondary}`}>
                  Smart AI Summarizer
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label="Close sidebar"
              className={`shrink-0 p-2 rounded-xl transition-colors lg:hidden ${
                darkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <X size={22} />
            </button>

          </div>

          {/* Categories */}

          <div className="mb-10">

            <button
              onClick={() =>
                setShowCategories(!showCategories)
              }
              className="w-full flex justify-between items-center mb-5"
            >

              <h2 className={`text-sm uppercase tracking-widest ${textSecondary}`}>

                Categories

              </h2>

              {showCategories ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

            </button>

            {showCategories && (

              <div className="space-y-2">

                {CATEGORIES.map(({ id, label, icon: Icon }) => {

                  const isActive = topic === id;

                  return (

                    <button
                      key={id}
                      onClick={() => {
                        setTopic(id);
                        closeMobileSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20"
                          : darkMode
                          ? "hover:bg-white/5"
                          : "hover:bg-gray-100"
                      }`}
                    >

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : darkMode
                            ? "bg-white/5 text-gray-400"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >

                        <Icon size={18} strokeWidth={1.75} />

                      </span>

                      <span className="font-medium">
                        {label}
                      </span>

                    </button>

                  );

                })}

              </div>

            )}

          </div>

          {/* Countries */}

          <div className="mb-10">

            <button
              onClick={() =>
                setShowCountries(!showCountries)
              }
              className="w-full flex justify-between items-center mb-5"
            >

              <h2 className={`text-sm uppercase tracking-widest ${textSecondary}`}>

                Countries

              </h2>

              {showCountries ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

            </button>

            {showCountries && (

              <div className={`space-y-2 max-h-64 overflow-y-auto pr-1 ${scrollClass}`}>

                {[
                  "India",
                  "USA",
                  "United Kingdom",
                  "France",
                  "Germany",
                  "Japan",
                  "China",
                  "Russia",
                  "Brazil",
                  "Canada",
                  "Australia",
                  "Italy",
                  "Spain",
                  "South Korea",  
                  "South Africa",
                  "Mexico",
                  "UAE",
                  "Singapore",
                  "Turkey",
                  "Netherlands",
                ].map((item) => (

                  <button
                    key={item}
                    onClick={() => {
                      setCountry(item);
                      closeMobileSidebar();
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                      country === item
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20"
                        : darkMode
                        ? "hover:bg-white/5"
                        : "hover:bg-gray-100"
                    }`}
                  >

                    <Globe size={18} />

                    <span>
                      {item}
                    </span>

                  </button>

                ))}

              </div>

            )}

          </div>

          {/* Languages */}

          <div className="mb-10">

            <button
              onClick={() =>
                setShowLanguages(!showLanguages)
              }
              className="w-full flex justify-between items-center mb-5"
            >

              <h2 className={`text-sm uppercase tracking-widest ${textSecondary}`}>

                Languages

              </h2>

              {showLanguages ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

            </button>

            {showLanguages && (

              <div className={`space-y-2 max-h-64 overflow-y-auto pr-1 ${scrollClass}`}>

                {[
                 ["English", "en"],
                 ["Hindi", "hi"],
                 ["Tamil", "ta"],
                 ["Telugu", "te"],
                 ["Malayalam", "ml"],
                 ["Marathi", "mr"],
                 ["Bengali", "bn"],
                 ["Punjabi", "pa"],
                 ["French", "fr"],
                 ["Spanish", "es"],
                 ["German", "de"],
                 ["Chinese", "zh-cn"],
                 ["Japanese", "ja"],
                 ["Korean", "ko"],
                 ["Arabic", "ar"],
                ].map(([name, code]) => (

                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      closeMobileSidebar();
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                      language === code
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20"
                        : darkMode
                        ? "hover:bg-white/5"
                        : "hover:bg-gray-100"
                    }`}
                  >

                    <Languages size={18} />

                    <span>
                      {name}
                    </span>

                  </button>

                ))}

              </div>

            )}

          </div>

          {/* Fetch Button */}

          <button
            onClick={fetchNews}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 py-4 rounded-2xl font-semibold shadow-xl shadow-emerald-500/20 transition-all duration-300"
          >
            Fetch News
          </button>

        </aside>

        {/* ----------------------------------- */}
        {/* Main */}
        {/* ----------------------------------- */}

        <main className="flex-1 overflow-y-auto">

          {/* Navbar */}

          <div className={`sticky top-0 z-30 backdrop-blur-xl border-b px-4 py-3 sm:px-6 lg:px-8 lg:py-4 flex items-center gap-3 sm:gap-4 transition-all duration-500 ${navBg}`}>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className={`shrink-0 p-2.5 rounded-xl transition-colors lg:hidden ${
                darkMode
                  ? "hover:bg-white/10 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Menu size={22} />
            </button>

            {/* Search */}

            <div className="flex-1 min-w-0 max-w-2xl relative">

              <Search
                size={20}
                className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or summary..."
                className={`w-full rounded-2xl py-3 sm:py-4 pl-11 sm:pl-14 pr-4 sm:pr-5 text-sm sm:text-base outline-none transition-all border ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/40"
                    : "bg-gray-100 border-gray-200 text-black placeholder-gray-400 focus:border-emerald-400"
                }`}
              />

            </div>

            {/* Right Side */}

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">

              {/* Notification */}

              <button className={`relative transition-all hidden sm:block ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >

                  <path d="M10.268 21a2 2 0 0 0 3.464 0" />

                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />

                </svg>

                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

              </button>

              {/* Settings */}

              <button className={`transition-all hidden sm:block ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >

                  <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />

                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />

                </svg>

              </button>

              {/* Divider */}

              <div className={`hidden sm:block h-8 w-px ${
                darkMode
                  ? "bg-white/10"
                  : "bg-gray-300"
              }`} />

              {/* Saved Articles Button */}

              <button
                onClick={() => setShowSavedArticles(!showSavedArticles)}
                className={`relative transition-all ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
                aria-label="Saved articles"
              >
                {showSavedArticles ? (
                  <BookmarkCheck size={22} className="text-emerald-400" />
                ) : (
                  <Bookmark size={22} />
                )}
                {savedArticles.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs flex items-center justify-center text-white font-semibold">
                    {savedArticles.length}
                  </span>
                )}
              </button>

              {/* Divider */}

              <div className={`hidden sm:block h-8 w-px ${
                darkMode
                  ? "bg-white/10"
                  : "bg-gray-300"
              }`} />

              {/* Theme Toggle */}

              <div className="flex items-center gap-3">

                <Sun
                  size={18}
                  className={
                    darkMode
                      ? "text-gray-500"
                      : "text-yellow-500"
                  }
                />

                <button
                  onClick={() =>
                    setDarkMode(!darkMode)
                  }
                  className={`w-14 h-8 rounded-full flex items-center px-1 transition-all duration-500 ${
                    darkMode
                      ? "bg-white/10"
                      : "bg-gray-300"
                  }`}
                >

                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-all duration-500 ${
                      darkMode
                        ? "translate-x-0"
                        : "translate-x-6"
                    }`}
                  />

                </button>

                <Moon
                  size={18}
                  className={
                    darkMode
                      ? "text-gray-500"
                      : "text-black"
                  }
                />

              </div>

            </div>

          </div>

          {/* Latest News heading (count from backend via summaries list) */}

          <div className="px-4 pt-6 pb-2 sm:px-6 lg:px-8">

            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">

              {showSavedArticles ? "Saved Articles" : "Latest News"}

            </h2>

            <p className={`mt-2 text-sm ${textSecondary}`}>

              {showSavedArticles
                ? savedArticles.length === 0
                  ? "No saved articles yet. Click the bookmark icon on any article to save it."
                  : `${savedArticles.length} saved article${savedArticles.length === 1 ? "" : "s"}`
                : loading && articles.length === 0
                ? "Loading articles…"
                : searchQuery.trim()
                ? `${filteredArticles.length} of ${articles.length} article${articles.length === 1 ? "" : "s"} matching your search`
                : `${articles.length} article${articles.length === 1 ? "" : "s"} found • Updates when you fetch news`}

            </p>

          </div>

          {loading && <NewsLoadingSkeletons darkMode={darkMode} />}

          {/* Saved Articles View */}

          {!loading && showSavedArticles && (
            <div className="px-4 pb-2 pt-0 sm:px-6 lg:px-8">
              {savedArticles.length === 0 ? (
                <div className={`px-8 py-16 text-center ${textSecondary}`}>
                  <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No saved articles yet</p>
                  <p className="mt-2 text-sm">Click the bookmark icon on any article to save it for later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {savedArticles.map((article, index) => (
                    <div
                      key={article.url ?? `saved-${index}`}
                      className={`group relative overflow-hidden rounded-[28px] border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                        darkMode
                          ? "bg-[#111827]/60 border-white/10 hover:border-emerald-500/40"
                          : "bg-white border-gray-200 hover:border-emerald-400"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={
                            article.image ||
                            "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
                          }
                          alt="news"
                          className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-5">
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full capitalize">
                            {topic}
                          </span>

                          <div className="flex items-center gap-3">
                            <span className={textSecondary}>
                              {article.source}
                            </span>

                            <button
                              onClick={() => toggleSaveArticle(article)}
                              className={`p-2 rounded-full transition-all ${
                                darkMode
                                  ? "hover:bg-white/10 text-gray-400 hover:text-white"
                                  : "hover:bg-gray-100 text-gray-500 hover:text-black"
                              }`}
                              aria-label="Remove from saved"
                            >
                              <BookmarkCheck size={18} className="text-emerald-400" />
                            </button>

                          </div>

                        </div>

                        <h2 className="text-2xl font-bold leading-snug mb-4 line-clamp-2">
                          {article.title}
                        </h2>

                        <p className={`${textSecondary} text-sm leading-relaxed mb-6 line-clamp-4`}>
                          {article.summary}
                        </p>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                          Read More →
                        </a>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Featured */}

          {!loading && !showSavedArticles && articles.length > 0 && filteredArticles.length === 0 && (

            <div className={`px-8 py-16 text-center ${textSecondary}`}>

              <p className="text-lg">
                No articles match &ldquo;{searchQuery.trim()}&rdquo;
              </p>

              <p className="mt-2 text-sm">
                Try a different keyword in the title or summary
              </p>

            </div>

          )}

          {!loading && !showSavedArticles && filteredArticles.length > 0 && (

            <div className="px-4 pb-2 pt-0 sm:px-6 lg:px-8">

              <div
                className={`overflow-hidden rounded-2xl border shadow-2xl sm:rounded-[32px] ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >

                <div className="lg:relative lg:h-[430px]">

                  <img
                    src={
                      filteredArticles[0].image ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
                    }
                    alt="featured"
                    className="h-48 w-full object-cover opacity-80 sm:h-56 lg:absolute lg:inset-0 lg:h-full"
                  />

                  <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black via-black/70 to-black/20 lg:block" />

                  <span
                    className={`absolute left-6 top-3 z-10 hidden px-4 py-2 rounded-full text-sm font-semibold lg:inline-block lg:left-10 ${
                      darkMode
                        ? "bg-black/75 text-emerald-300 backdrop-blur-md ring-1 ring-white/15"
                        : "bg-black/80 text-emerald-300 backdrop-blur-md ring-1 ring-white/10"
                    }`}
                  >

                    FEATURED NEWS

                  </span>

                  <button
                    onClick={() => toggleSaveArticle(filteredArticles[0])}
                    className={`absolute right-4 top-3 z-10 p-2.5 rounded-full sm:right-6 sm:p-3 lg:right-10 transition-all ${
                      darkMode
                        ? "bg-black/75 hover:bg-black/90 text-white backdrop-blur-md ring-1 ring-white/15"
                        : "bg-black/80 hover:bg-black/90 text-white backdrop-blur-md ring-1 ring-white/10"
                    }`}
                    aria-label={isArticleSaved(filteredArticles[0].url) ? "Remove from saved" : "Save article"}
                  >
                    {isArticleSaved(filteredArticles[0].url) ? (
                      <BookmarkCheck size={18} className="text-emerald-400 sm:size-20" />
                    ) : (
                      <Bookmark size={18} sm:size-20 />
                    )}
                  </button>

                  <div
                    className={`p-4 sm:p-6 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:p-10 ${
                      darkMode ? "bg-[#0a0f18] lg:bg-transparent" : "bg-white lg:bg-transparent"
                    }`}
                  >

                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm lg:hidden ${
                      darkMode
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-500/15 text-emerald-700"
                    }`}
                  >

                    FEATURED NEWS

                  </span>

                  <h1
                    className={`mt-3 mb-3 max-w-5xl text-xl font-bold leading-snug sm:mt-4 sm:mb-4 sm:text-2xl md:text-3xl lg:mt-0 lg:mb-6 lg:text-5xl lg:leading-tight ${
                      darkMode ? "text-white" : "text-gray-900 lg:text-white"
                    }`}
                  >

                    {filteredArticles[0].title}

                  </h1>

                  <p
                    className={`mb-4 max-w-4xl text-sm leading-relaxed line-clamp-4 sm:mb-6 sm:text-base lg:mb-8 lg:text-lg lg:line-clamp-3 ${
                      darkMode ? "text-gray-300" : "text-gray-600 lg:text-gray-300"
                    }`}
                  >

                    {filteredArticles[0].summary}

                  </p>

                  <a
                    href={filteredArticles[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:opacity-90 sm:px-6 sm:py-3 sm:text-base"
                  >

                    Read Full Article

                  </a>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* News Grid */}

          {!loading && !showSavedArticles && (

          <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-6 md:grid-cols-2 lg:p-8 xl:grid-cols-3">

            {filteredArticles.slice(1).map((article, index) => (

              <div
                key={article.url ?? `${article.title}-${index}`}
                className={`group relative overflow-hidden rounded-[28px] border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  darkMode
                    ? "bg-[#111827]/60 border-white/10 hover:border-emerald-500/40"
                    : "bg-white border-gray-200 hover:border-emerald-400"
                }`}
              >

                <div className="overflow-hidden">

                  <img
                    src={
                      article.image ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
                    }
                    alt="news"
                    className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                </div>

                <div className="relative p-6">

                  <div className="flex items-center justify-between mb-5">

                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full capitalize">

                      {topic}

                    </span>

                    <div className="flex items-center gap-3">

                      <span className={textSecondary}>

                        {article.source}

                      </span>

                      <button
                        onClick={() => toggleSaveArticle(article)}
                        className={`p-2 rounded-full transition-all ${
                          darkMode
                            ? "hover:bg-white/10 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-500 hover:text-black"
                        }`}
                        aria-label={isArticleSaved(article.url) ? "Remove from saved" : "Save article"}
                      >
                        {isArticleSaved(article.url) ? (
                          <BookmarkCheck size={18} className="text-emerald-400" />
                        ) : (
                          <Bookmark size={18} />
                        )}
                      </button>

                    </div>

                  </div>

                  <h2 className="text-2xl font-bold leading-snug mb-4 line-clamp-2">

                    {article.title}

                  </h2>

                  <p className={`${textSecondary} text-sm leading-relaxed mb-6 line-clamp-4`}>

                    {article.summary}

                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >

                    Read More →

                  </a>

                </div>

              </div>

            ))}

          </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default App;