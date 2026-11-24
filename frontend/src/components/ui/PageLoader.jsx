import "./PageLoader.css";

function readTheme() {
  if (typeof localStorage === "undefined") return "light";
  return localStorage.getItem("app_theme") || "light";
}

/**
 * Loader kotak 3x3 untuk fallback <Suspense> saat halaman sedang dimuat.
 * Animasi dan ukuran mengikuti desain "banter loader"; CSS-nya dipisah ke
 * PageLoader.css supaya tidak butuh styled-components.
 */
export default function PageLoader({ label = "Memuat halaman…", fullscreen = true }) {
  const classes = ["page-loader"];
  if (fullscreen) classes.push("page-loader--fullscreen");
  if (readTheme() === "dark") classes.push("page-loader--dark");

  return (
    <div role="status" aria-live="polite" className={classes.join(" ")}>
      <div className="banter-loader" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="banter-loader__box" />
        ))}
      </div>
      <span className="page-loader__label">{label}</span>
    </div>
  );
}
