import Script from 'next/script'

interface SiteAnalyticsProps {
  googleAnalyticsId?: string | null
  googleTagManagerId?: string | null
}

/**
 * Injects GA4 and/or GTM scripts from CMS General Settings → Analytics.
 * Prefer GTM when both are set (GTM can host GA4).
 */
export default function SiteAnalytics({
  googleAnalyticsId,
  googleTagManagerId,
}: SiteAnalyticsProps) {
  const gtmId = googleTagManagerId?.trim() || null
  const gaId = googleAnalyticsId?.trim() || null

  if (!gtmId && !gaId) {
    return null
  }

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}
      {!gtmId && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  )
}
