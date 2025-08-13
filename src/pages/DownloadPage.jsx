// src/pages/DownloadPage.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DownloadPage = () => {
  const { t } = useTranslation("download");
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [versionInfo, setVersionInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVersion = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/api/v1/version/`);
        if (!res.ok) throw new Error(`Failed to fetch version: ${res.status}`);
        const data = await res.json();
        if (isMounted) setVersionInfo(data);
      } catch (e) {
        if (isMounted) setError(e?.message || t("loading_error", { defaultValue: "Failed to load version info" }));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVersion();
    return () => { isMounted = false; };
  }, [API_URL]);

  const version = versionInfo?.version || "";
  const relativeApkPath = versionInfo?.apk_url || (version ? `downloads/android/${version}/app-v${version}-universal.apk` : "");
  const downloadUrl = relativeApkPath ? `${API_URL}/api/v1/${relativeApkPath}` : "";

  return (
    <div className="max-w-xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6 text-gray-100">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-sm text-gray-300 mb-6">{t("subtitle")}</p>

      {loading && (
        <div className="text-gray-300">{t("loading")}</div>
      )}

      {!loading && error && (
        <div className="text-red-400 mb-4">{t("error_prefix")} {error}</div>
      )}

      {!loading && !error && (
        <div>
          <div className="mb-4">
            <div className="text-lg">{t("latest_version")}: <span className="font-semibold">{version || t("unknown")}</span></div>
            {versionInfo?.releaseNotes && (
              <div className="mt-2">
                <div className="font-medium">{t("release_notes")}</div>
                <p className="text-sm text-gray-300 whitespace-pre-line">{versionInfo.releaseNotes}</p>
              </div>
            )}
            {versionInfo?.timestamp && (
              <div className="mt-2 text-sm text-gray-400">{t("published")}: {new Date(versionInfo.timestamp).toLocaleString()}</div>
            )}
          </div>

          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
            >
              {t("download_cta")}
            </a>
          ) : (
            <div className="text-yellow-300">{t("download_unavailable")}</div>
          )}

          {downloadUrl && (
            <div className="mt-3 text-xs text-gray-400 break-all">
              {t("direct_link")}: {downloadUrl}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadPage;


