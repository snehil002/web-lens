import Script from 'next/script';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="https://web-lens-app.vercel.app/tracking-code.js" strategy="beforeInteractive" />
      {/* <Script src="http://localhost:3000/tracking-code.js" strategy="beforeInteractive" /> */}
      <Component {...pageProps} />
    </>
  );
}