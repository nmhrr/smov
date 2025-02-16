import { Dispatch, SetStateAction, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { MwLink } from "@/components/text/Link";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { Divider } from "@/components/utils/Divider";
import { Heading1 } from "@/components/utils/Text";
import { SetupPart } from "@/pages/parts/settings/SetupPart";
import { useAuthStore } from "@/stores/auth";

interface ProxyEditProps {
  proxyUrls: string[] | null;
  setProxyUrls: Dispatch<SetStateAction<string[] | null>>;
}

interface BackendEditProps {
  backendUrl: string | null;
  setBackendUrl: Dispatch<SetStateAction<string | null>>;
}

interface FebboxTokenProps {
  febboxToken: string | null;
  setFebboxToken: Dispatch<SetStateAction<string | null>>;
}

function ProxyEdit({ proxyUrls, setProxyUrls }: ProxyEditProps) {
  const { t } = useTranslation();
  const add = useCallback(() => {
    setProxyUrls((s) => [...(s ?? []), ""]);
  }, [setProxyUrls]);

  const changeItem = useCallback(
    (index: number, val: string) => {
      setProxyUrls((s) => [
        ...(s ?? []).map((v, i) => {
          if (i !== index) return v;
          return val;
        }),
      ]);
    },
    [setProxyUrls],
  );

  const removeItem = useCallback(
    (index: number) => {
      setProxyUrls((s) => [...(s ?? []).filter((v, i) => i !== index)]);
    },
    [setProxyUrls],
  );

  return (
    <SettingsCard>
      <div className="flex justify-between items-center gap-4">
        <div className="my-3">
          <p className="text-white font-bold mb-3">
            {t("settings.connections.workers.label")}
          </p>
          <p className="max-w-[30rem] font-medium">
            <Trans i18nKey="settings.connections.workers.description">
              <MwLink to="https://docs.undi.rest/proxy/deploy">
                Proxy documentation
              </MwLink>
            </Trans>
          </p>
        </div>
        <div>
          <Toggle
            onClick={() => setProxyUrls((s) => (s === null ? [] : null))}
            enabled={proxyUrls !== null}
          />
        </div>
      </div>
      {proxyUrls !== null ? (
        <>
          <Divider marginClass="my-6 px-8 box-content -mx-8" />
          <p className="text-white font-bold mb-3">
            {t("settings.connections.workers.urlLabel")}
          </p>

          <div className="my-6 space-y-2 max-w-md">
            {(proxyUrls?.length ?? 0) === 0 ? (
              <p>{t("settings.connections.workers.emptyState")}</p>
            ) : null}
            {(proxyUrls ?? []).map((v, i) => (
              <div
                // not the best but we can live with it
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="grid grid-cols-[1fr,auto] items-center gap-2"
              >
                <AuthInputBox
                  value={v}
                  onChange={(val) => changeItem(i, val)}
                  placeholder={
                    t("settings.connections.workers.urlPlaceholder") ??
                    undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="h-full scale-90 hover:scale-100 rounded-full aspect-square bg-authentication-inputBg hover:bg-authentication-inputBgHover flex justify-center items-center transition-transform duration-200 hover:text-white cursor-pointer"
                >
                  <Icon className="text-xl" icon={Icons.X} />
                </button>
              </div>
            ))}
          </div>

          <Button theme="purple" onClick={add}>
            {t("settings.connections.workers.addButton")}
          </Button>
        </>
      ) : null}
    </SettingsCard>
  );
}

function BackendEdit({ backendUrl, setBackendUrl }: BackendEditProps) {
  const { t } = useTranslation();
  const user = useAuthStore();
  return (
    <SettingsCard>
      <div className="flex justify-between items-center gap-4">
        <div className="my-3">
          <p className="text-white font-bold mb-3">
            {t("settings.connections.server.label")}
          </p>
          <p className="max-w-[30rem] font-medium">
            <Trans i18nKey="settings.connections.server.description">
              <MwLink to="https://docs.undi.rest/backend/deploy">
                Backend documentation
              </MwLink>
            </Trans>
          </p>
          {user.account && (
            <div>
              <br />
              <p className="max-w-[30rem] font-medium">
                <Trans i18nKey="settings.connections.server.migration.description">
                  <MwLink to="/migration">
                    {t("settings.connections.server.migration.link")}
                  </MwLink>
                </Trans>
              </p>
            </div>
          )}
        </div>
        <div>
          <Toggle
            onClick={() => setBackendUrl((s) => (s === null ? "" : null))}
            enabled={backendUrl !== null}
          />
        </div>
      </div>
      {backendUrl !== null ? (
        <>
          <Divider marginClass="my-6 px-8 box-content -mx-8" />
          <p className="text-white font-bold mb-3">
            {t("settings.connections.server.urlLabel")}
          </p>
          <AuthInputBox
            onChange={setBackendUrl}
            value={backendUrl ?? ""}
            placeholder="https://"
          />
        </>
      ) : null}
    </SettingsCard>
  );
}

function FebboxTokenEdit({ febboxToken, setFebboxToken }: FebboxTokenProps) {
  const { t } = useTranslation();

  return (
    <SettingsCard>
      <div className="flex justify-between items-center gap-4">
        <div className="my-3">
          <p className="text-white font-bold mb-3">FED API (Febbox) UI token</p>
          <p className="max-w-[30rem] font-medium">
            <Trans i18nKey="settings.connections.febbox.description">
              Bringing your own UI token allows you to get faster 4K streams. We
              only have a limited number of tokens, so bringing your own helps
              speed up your streams when traffic is high.
            </Trans>
          </p>
        </div>
        <div>
          <Toggle
            onClick={() => setFebboxToken((s) => (s === null ? "" : null))}
            enabled={febboxToken !== null}
          />
        </div>
      </div>
      {febboxToken !== null ? (
        <>
          <Divider marginClass="my-6 px-8 box-content -mx-8" />

          <div className="my-3">
            <p className="max-w-[30rem] font-medium">
              <Trans i18nKey="settings.connections.febbox.description">
                To get your UI token:
                <br />
                1. Go to <MwLink to="https://febbox.com">febbox.com</MwLink> and
                log in with Google
                <br />
                2. Open DevTools or inspect the page
                <br />
                3. Go to Application tab → Cookies
                <br />
                4. Copy the &quot;ui&quot; cookie.
                <br />
                5. Close the tab, but do NOT logout!
              </Trans>
            </p>
            <p className="text-xs mt-2">
              (This is not a sensitive login cookie or account token)
            </p>
          </div>

          <Divider marginClass="my-6 px-8 box-content -mx-8" />
          <p className="text-white font-bold mb-3">
            {t("settings.connections.febbox.tokenLabel", "Token")}
          </p>
          <AuthInputBox
            onChange={(newToken) => {
              setFebboxToken(newToken);
            }}
            value={febboxToken ?? ""}
            placeholder="eyABCdE..."
          />
        </>
      ) : null}
    </SettingsCard>
  );
}

export function ConnectionsPart(
  props: BackendEditProps & ProxyEditProps & FebboxTokenProps,
) {
  const { t } = useTranslation();
  return (
    <div>
      <Heading1 border>{t("settings.connections.title")}</Heading1>
      <div className="space-y-6">
        <SetupPart /> {/* I was wondering what happened to this badddev >:( */}
        <ProxyEdit
          proxyUrls={props.proxyUrls}
          setProxyUrls={props.setProxyUrls}
        />
        <BackendEdit
          backendUrl={props.backendUrl}
          setBackendUrl={props.setBackendUrl}
        />
        <FebboxTokenEdit
          febboxToken={props.febboxToken}
          setFebboxToken={props.setFebboxToken}
        />
      </div>
    </div>
  );
}
