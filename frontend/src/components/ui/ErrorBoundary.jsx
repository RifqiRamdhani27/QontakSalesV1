import { Component } from "react";
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
import { btnSecondary } from "@/components/ui/styles";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Halaman pengaturan gagal dirender:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="p-7 max-md:p-[18px]" role="alert">
        <div className="mx-auto max-w-[720px] rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <WarningCircle size={22} weight="fill" />
            </span>
            <div className="min-w-0">
              <h3 className="m-0 text-base font-bold text-gray-900">
                Halaman pengaturan gagal dimuat
              </h3>
              <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500">
                Terjadi kesalahan tak terduga saat menampilkan halaman ini. Coba muat
                ulang halaman. Jika masih gagal, laporkan pesan kesalahan di bawah.
              </p>
              <pre className="mt-3 max-h-[180px] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {this.state.error?.message || "Kesalahan tidak diketahui"}
              </pre>
              <button
                type="button"
                className={`${btnSecondary} mt-4`}
                onClick={() => window.location.reload()}
              >
                <ArrowClockwise size={15} /> Muat ulang halaman
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
