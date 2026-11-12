import { useState } from "react";

import { useBillings } from "@/services/useSetting";
import { extractError } from "@/services/settingsApi";

function CardHeading({ title, muted }) {
  return (
    <h3
      className={`m-0 border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wide ${
        muted ? "text-slate-300" : "text-slate-500"
      }`}
    >
      {title}
    </h3>
  );
}

function InfoRow({ label, value, valueClassName = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

function ContactSupportModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-[10px] bg-white p-6 shadow-lg">
        <h3 className="m-0 text-base font-bold text-gray-900">Hubungi Dukungan</h3>
        <p className="mt-2 text-sm text-gray-500">
          Untuk informasi langganan atau pembayaran, hubungi tim dukungan kami di{" "}
          <span className="font-medium text-blue-600">support@qontak.com</span>.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingsPage() {
  const { history: billingHistory, company: companyData, overview, loading, error, downloadInvoice } = useBillings();
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const company = {
    name: companyData?.name || "-",
    status: "-",
  };

  const subscription = {
    name: "Data paket belum tersedia",
    usersUsed: overview?.user_count ?? "-",
    usersLimit: "-",
    partners: overview?.partner_count ?? "-",
    daysLeft: "-",
    expiryDate: "-",
  };

  const billing = {
    cycle: overview?.billing_period || "-",
    nextBillingDate: overview?.next_due_date
      ? new Date(overview.next_due_date).toLocaleDateString("id-ID")
      : "-",
  };

  const handleDownload = async (index) => {
    if (downloadingIndex !== null) return;
    setDownloadingIndex(index);
    setDownloadError("");
    try {
      await downloadInvoice(billingHistory[index].id);
    } catch (requestError) {
      setDownloadError(extractError(requestError, "Gagal mengunduh faktur."));
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Tagihan</h2>
        <div className="text-right">
          <p className="m-0 text-sm font-bold text-gray-900">{company.name}</p>
          <p className="m-0 text-sm font-bold text-red-600">{company.status}</p>
        </div>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat tagihan..." : error}
        </p>
      )}

      {downloadError && <p className="m-0 mb-4 text-sm text-red-600" role="alert">{downloadError}</p>}

      <div className="mb-6 grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Paket Langganan" />
          <div className="mt-3">
            <InfoRow label="Nama" value={subscription.name} />
            <InfoRow
              label="Pengguna"
              value={`${subscription.usersUsed} dari ${subscription.usersLimit}`}
            />
            <InfoRow label="Mitra" value={subscription.partners} />
          </div>

          <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
            <div className="flex gap-2">
              <span className="m-0 text-xs font-medium text-gray-900">
                Sisa hari: </span>
              <span className="m-0 text-xs font-medium font-semibold text-gray-900">{subscription.daysLeft}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-gray-900">Tanggal berakhir </span>
              <span className="font-semibold font-semibold text-gray-900">{subscription.expiryDate}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Informasi Tagihan" />
          <div className="mt-3">
            <InfoRow
              label="Siklus Tagihan"
              value={billing.cycle}
              valueClassName="text-blue-600"
            />
            <InfoRow
              label="Tanggal Tagihan Berikutnya"
              value={billing.nextBillingDate}
              valueClassName="text-blue-600"
            />
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Rincian Pembayaran" muted />
          <div className="flex h-full flex-col items-center justify-center gap-3 pt-6">
            <p className="m-0 text-center text-xs leading-relaxed text-slate-300">
              Hubungi tim dukungan kami untuk informasi lebih lanjut tentang
              langganan dan pembayaran.
            </p>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:underline"
              onClick={() => setShowSupportModal(true)}
            >
              Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-sm">
        <div className="p-6 pb-4">
          <h3 className="m-0 text-xs font-bold uppercase tracking-wide text-slate-500">
            Riwayat Tagihan
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Tanggal Pembayaran</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Periode Tagihan</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Jumlah Total</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Unduh Faktur</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    Belum ada riwayat tagihan.
                  </td>
                </tr>
              ) : (
                billingHistory.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.payDate}</td>
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.period}</td>
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.amount}</td>
                    <td className="px-6 py-3.5 text-sm">
                      {row.invoiceAvailable ? (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline disabled:opacity-60"
                          disabled={downloadingIndex === index}
                          onClick={() => handleDownload(index)}
                        >
                          {downloadingIndex === index ? "Mengunduh..." : "Unduh"}
                        </button>
                      ) : (
                        <span className="text-slate-400">Faktur belum tersedia</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-sky-50 px-6 py-3 text-center text-xs text-sky-700">
          Menampilkan 1 .. {billingHistory.length} dari {billingHistory.length} data
        </div>
      </div>

      {showSupportModal && (
        <ContactSupportModal onClose={() => setShowSupportModal(false)} />
      )}
    </div>
  );
}
