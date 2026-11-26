import Script from 'next/script';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="https://web-lens-app.vercel.app/tracker.js" strategy="beforeInteractive" id="tracker" />
      <Component {...pageProps} />
    </>
  );
}