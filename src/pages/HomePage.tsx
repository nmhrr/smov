import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { To, useNavigate } from "react-router-dom";

import { WideContainer } from "@/components/layout/WideContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useRandomTranslation } from "@/hooks/useRandomTranslation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import DiscoverContent from "@/pages/discover/discoverContent";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { BookmarksPart } from "@/pages/parts/home/BookmarksPart";
import { HeroPart } from "@/pages/parts/home/HeroPart";
import { WatchingPart } from "@/pages/parts/home/WatchingPart";
import { SearchListPart } from "@/pages/parts/search/SearchListPart";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";
import { usePreferencesStore } from "@/stores/preferences";

import { Button } from "./About";

function useSearch(search: string) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<string>(search, 500);
  useEffect(() => {
    setSearching(search !== "");
    setLoading(search !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return {
    loading,
    searching,
  };
}

// What the sigma?

export function HomePage() {
  const { t } = useTranslation();
  const { t: randomT } = useRandomTranslation();
  const emptyText = randomT(`home.search.empty`);
  const navigate = useNavigate();
  const [showBg, setShowBg] = useState<boolean>(false);
  const searchParams = useSearchQuery();
  const [search] = searchParams;
  const s = useSearch(search);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showWatching, setShowWatching] = useState(false);

  const handleClick = (path: To) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const enableDiscover = usePreferencesStore((state) => state.enableDiscover);

  /* 
  // Safari Notice
  const [showModal, setShowModal] = useState(() => {
    const isSafari =
      typeof navigator !== "undefined" &&
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent);

    const isMac =
      typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

    const isIOS =
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/.test(navigator.userAgent);

    return isSafari && (isMac || isIOS);
  });
  */

  /* One time notice
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("popupDismissed");
    if (!isDismissed) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("popupDismissed", "true");
  };
  */

  // const { loggedIn } = useAuth(); // Adjust padding for popup show button based on logged in state

  return (
    <HomeLayout showBg={showBg}>
      {/* Popup show button
      <a
        onClick={() => setShowModal(true)}
        className={` text-white tabbable rounded-full z-50 fixed top-5 ${
          loggedIn
            ? "right-[7.5rem] lg:right-[12.5rem] lg:text-2xl"
            : "right-[7.5rem] text-xl lg:text-lg"
        }`}
        style={{ animation: "pulse 1s infinite" }}
      >
        <IconPill icon={Icons.WARNING}>
          <span className="font-bold select-none">READ</span>
        </IconPill>
      </a>
      */}
      <div className="mb-16 sm:mb-24">
        <Helmet>
          <style type="text/css">{`
            html, body {
              scrollbar-gutter: stable;
            }
          `}</style>
          <title>{t("global.name")}</title>
        </Helmet>

        {/* Popup
        {showModal && (
          <PopupModal
            styles="max-w-2xl" // max-w-md for short
            title="We’re changing our backend server!"
            message={
              <div>
                <p>
                  On <strong>January 8th</strong>, the backend server will
                  change from:
                </p>
                <p>
                  <strong>server.vidbinge.com</strong> →{" "}
                  <strong>server.fifthwit.tech</strong>
                </p>
                <br />
                <p>
                  You will need to <strong>migrate your account </strong> to the
                  new server or choose to continue using the old server by
                  updating your settings.
                </p>
                <br />
                <p>
                  <strong>What You Need to Know:</strong>
                </p>
                <ul>
                  <li>
                    1. <strong>Migrating Your Account:</strong> Your data (e.g.,
                    bookmarks) will not be automatically transferred. You’ll
                    need to migrate your account from the settings page. Or from
                    below.
                  </li>
                  <li>
                    2. <strong>Staying on the Old Server:</strong> If you don’t
                    want to change to the new server, your data will remain safe
                    on <strong>server.vidbinge.com</strong>. You can change the
                    Backend URL in your settings to
                    &quot;https://server.vidbinge.com&quot;.
                  </li>
                </ul>
                <br />
                <p>
                  <strong>Steps to Move Your Data:</strong>
                </p>
                <ol>
                  <li>
                    1. Log into your account on{" "}
                    <strong>server.vidbinge.com</strong>.
                  </li>
                  <li>
                    (If you already are logged in, press here:{" "}
                    <a href="/migration" className="text-type-link">
                      Migrate my data.
                    </a>
                    )
                  </li>
                  <li>
                    2. Go to the <strong>Settings</strong> page.
                  </li>
                  <li>
                    3. Scroll down to{" "}
                    <strong>Connections &gt; Custom Server</strong>.
                  </li>
                  <li>
                    3. Press the &quot;Migrate my data to a new server.&quot;
                    button.
                  </li>
                  <li>
                    4. Enter the new server url:{" "}
                    <strong>https://server.fifthwit.tech</strong> and press
                    &quot;Migrate&quot;.
                  </li>
                  <li>5. Login to your account with the same passphrase!</li>
                </ol>
                <br />
                <p>
                  Thank you for your understanding and support during this
                  transition! If you have questions or need help, feel free to
                  reach out on the{" "}
                  <a
                    href="https://discord.com/invite/7z6znYgrTG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-type-link"
                  >
                    CrackerMovies Discord
                  </a>
                  !
                </p>
              </div>
            }
            onClose={handleCloseModal}
          />
        )}
        */}

        <HeroPart searchParams={searchParams} setIsSticky={setShowBg} />
      </div>
      <WideContainer>
        {s.loading ? (
          <SearchLoadingPart />
        ) : s.searching ? (
          <SearchListPart searchQuery={search} />
        ) : (
          <div className="flex flex-col gap-8">
            <WatchingPart onItemsChange={setShowWatching} />
            <BookmarksPart onItemsChange={setShowBookmarks} />
          </div>
        )}
        {!(showBookmarks || showWatching) && !enableDiscover ? (
          <div className="flex flex-col translate-y-[-30px] items-center justify-center">
            <p className="text-[18.5px] pb-3">{emptyText}</p>
          </div>
        ) : null}
      </WideContainer>
      {enableDiscover ? (
        <div className="pt-12 w-full max-w-[100dvw] justify-center items-center">
          <DiscoverContent />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-40 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="px-py p-[0.35em] mt-3 rounded-xl text-type-dimmed box-content text-[18px] bg-largeCard-background justify-center items-center"
              onClick={() => handleClick("/discover")}
            >
              {t("home.search.discover")}
            </Button>
          </div>
        </div>
      )}
    </HomeLayout>
  );
}
