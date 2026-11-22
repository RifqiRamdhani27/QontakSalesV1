import { useState } from "react";
import { X } from "@phosphor-icons/react";

import { useBillings } from "@/services/useSetting";
import { extractError } from "@/services/settingsApi";
import {
  btnModalCancel,
  modalCloseButton,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalPanel,
  modalTitle,
  tableBase,
  tableWrapper,
  td,
  th,
  trHover,
} from "@/components/ui/styles";

const linkButton =
  "border-0 bg-transparent p-0 text-sm font-semibold text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-60";

function CardHeading({ title, muted }) {
  return (
    <h3
      className={`m-0 border-b border-slate-100 pb-3 text-[15px] font-bold ${
        muted ? "text-slate-400" : "text-gray-900"
      }`}
    >
      {title}
    </h3>
  );
}

function InfoRow({ label, value, valueClassName = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function ContactSupportModal({ onClose }) {
  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex max-w-[420px] flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>Hubungi Dukungan</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          <p className="m-0 text-sm leading-6 text-slate-500">
            Untuk informasi langganan atau pembayaran, hubungi tim dukungan kami di{" "}
            <span className="font-semibold text-brand">support@qontak.com</span>.
          </p>
        </div>

        <div className={`${modalFooter} shrink-0`}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
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
      <div className="mb-6 flex items-start justify-between gap-4">
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

      {downloadError && (
        <p className="m-0 mb-4 text-sm text-red-600" role="alert">
          {downloadError}
        </p>
      )}

      <div className="mb-6 mt-4 grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <div className="company-card rounded-[10px] bg-white p-6">
          <CardHeading title="Paket Langganan" />
          <div className="mt-3">
            <InfoRow label="Nama" value={subscription.name} />
            <InfoRow
              label="Pengguna"
              value={`${subscription.usersUsed} dari ${subscription.usersLimit}`}
            />
            <InfoRow label="Mitra" value={subscription.partners} />
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <InfoRow label="Sisa hari" value={subscription.daysLeft} />
            <InfoRow label="Tanggal berakhir" value={subscription.expiryDate} />
          </div>
        </div>

        <div className="company-card rounded-[10px] bg-white p-6">
          <CardHeading title="Informasi Tagihan" />
          <div className="mt-3">
            <InfoRow
              label="Siklus Tagihan"
              value={billing.cycle}
              valueClassName="text-brand"
            />
            <InfoRow
              label="Tanggal Tagihan Berikutnya"
              value={billing.nextBillingDate}
              valueClassName="text-brand"
            />
          </div>
        </div>

        <div className="company-card flex flex-col rounded-[10px] bg-white p-6">
          <CardHeading title="Rincian Pembayaran" />
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-5">
            <p className="m-0 text-center text-[13px] leading-relaxed text-slate-500">
              Hubungi tim dukungan kami untuk informasi lebih lanjut tentang
              langganan dan pembayaran.
            </p>
            <button
              type="button"
              className={linkButton}
              onClick={() => setShowSupportModal(true)}
            >
              Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>

      <div className="company-card mb-6 overflow-hidden rounded-[10px] bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="m-0 text-[19px] font-bold text-gray-900">Riwayat Tagihan</h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Daftar pembayaran dan faktur langganan Anda.
          </p>
        </div>

        <div className={tableWrapper}>
          <table className={tableBase}>
            <thead>
              <tr>
                <th className={th}>Tanggal Pembayaran</th>
                <th className={th}>Periode Tagihan</th>
                <th className={th}>Jumlah Total</th>
                <th className={th}>Unduh Faktur</th>
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
                  <tr key={index} className={trHover}>
                    <td className={td}>{row.payDate}</td>
                    <td className={td}>{row.period}</td>
                    <td className={td}>{row.amount}</td>
                    <td className={td}>
                      {row.invoiceAvailable ? (
                        <button
                          type="button"
                          className={linkButton}
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

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-center text-[13px] text-slate-500">
          Menampilkan 1 .. {billingHistory.length} dari {billingHistory.length} data
        </div>
      </div>

      {showSupportModal && (
        <ContactSupportModal onClose={() => setShowSupportModal(false)} />
      )}
    </div>
  );
}