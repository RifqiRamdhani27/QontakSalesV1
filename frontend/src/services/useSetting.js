import { useCallback, useEffect, useRef, useState } from "react";
import api, { extractError } from "./api";
import { canAccessSettings, canAccessSettingsTemplate } from "./settingsAccess";


export const canEditSettings = (module = "sales") => canAccessSettings(module, "edit");

export function useSetting(url) {
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(url)
      .then((response) => {
        if (!cancelled) setSaved(response.data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(extractError(error, "Gagal memuat pengaturan."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const save = async (values) => {
    const response = await api.put(url, values);
    setSaved(response.data);
    return response.data;
  };

  return { saved, setSaved, loading, loadError, save };
}

export function useEditing(saved, save, failMessage) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const start = () => {
    setError("");
    setDraft(saved);
  };
  const cancel = () => setDraft(null);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const toggleField = (field) => setDraft((current) => ({ ...current, [field]: !current[field] }));

  const submit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await save(payload);
      setDraft(null);
    } catch (e) {
      setError(extractError(e, failMessage));
    } finally {
      setSaving(false);
    }
  };

  return { draft, editing: draft !== null, saving, error, start, cancel, setField, toggleField, submit };
}


export function useAccountMappings() {
  const [values, setValues] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/account-mappings/"),
      api.get("/account-mappings/options/"),
    ])
      .then(([mappingResponse, optionsResponse]) => {
        const next = {};
        mappingResponse.data.forEach((item) => {
          const value =
            item.account_code || item.mapping_options?.account_value;
          if (value) next[item.target_id] = value;
        });
        setValues(next);
        setAccounts(optionsResponse.data.accounts || []);
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat account mapping."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (entries) => {
    await api.put("/account-mappings/bulk/", { mappings: entries });
    load();
  };

  return { values, accounts, loading, error, save };
}


const toApprovalRule = (record) => {
  const condition = record.condition || {};
  return {
    id: record.id,
    ruleName: record.name,
    description: record.description || "",
    transactionGroup: condition.transactionGroup || "",
    transactionType: condition.transactionType || record.condition?.transactionType || "",
    createdBy: condition.createdBy || "all",
    createdByUsers: condition.createdByUsers || [],
    createdFor: condition.createdFor || "all",
    createdForCustomers: condition.createdForCustomers || [],
    productScope: condition.productScope || "all",
    applyToDraft: condition.applyToDraft ?? true,
    criteria: condition.criteria || [],
    overdueDays: condition.overdueDays || 0,
    amountValue: Number(record.amount_threshold ?? condition.amountValue ?? 0) || 0,
    levels: condition.levels || condition.steps || [],
    changelog: condition.changelog || [],
    lastEdited: condition.lastEdited || "",
    lastEditedBy: condition.lastEditedBy || "",
  };
};

const toApprovalPayload = (values) => ({
  name: values.ruleName,
  description: values.description || "",
  rule_type: "workflow",
  amount_threshold: (values.criteria || []).includes("specificValue")
    ? Number(values.amountValue) || 0
    : null,
  is_active: true,
  condition: values,
});

export function useApprovalRules() {
  const [rules, setRules] = useState([]);
  const [options, setOptions] = useState({ users: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/approval-rules/"),
      api.get("/approval-rules/options/"),
    ])
      .then(([rulesResponse, optionsResponse]) => {
        setRules(rulesResponse.data.map(toApprovalRule));
        setOptions({
          users: optionsResponse.data.users || [],
          customers: optionsResponse.data.customers || [],
        });
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat approval rules."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    await api.post("/approval-rules/", toApprovalPayload(values));
    load();
  };

  const update = async (id, values) => {
    await api.patch(`/approval-rules/${id}/`, toApprovalPayload(values));
    load();
  };

  const remove = async (id) => {
    await api.delete(`/approval-rules/${id}/`);
    load();
  };

  return { rules, options, loading, error, create, update, remove };
}


const toHistoryRow = (record, currency) => ({
  id: record.id,
  payDate: record.paid_at
    ? new Date(record.paid_at).toLocaleDateString("id-ID")
    : "-",
  period: record.billing_period || "-",
  amount: new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(record.total_amount) || 0),
  invoiceAvailable: !["draft", "canceled"].includes(record.status),
});

export function useBillings() {
  const [history, setHistory] = useState([]);
  const [company, setCompany] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/billings/"),
      api.get("/company/"),
      api.get("/billings/overview/"),
    ])
      .then(([billingResponse, companyResponse, overviewResponse]) => {
        const currency = companyResponse.data.base_currency || "IDR";
        setHistory(billingResponse.data.map((record) => toHistoryRow(record, currency)));
        setCompany(companyResponse.data);
        setOverview(overviewResponse.data);
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat billing."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const downloadInvoice = async (id) => {
    const response = await api.get(`/billings/${id}/invoice/`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${id}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return { history, company, overview, loading, error, downloadInvoice };
}


export const canManageCustomFields = () => ["create", "edit", "delete"].some((action) => canAccessSettings("custom-fields", action));

export async function fetchCustomFieldScope(page, subPage) {
  const params = { for_page: page.toLowerCase() };
  if (subPage) params.for_sub_page = subPage;
  const response = await api.get("/custom-fields/", { params });
  return response.data.filter((item) => item.status !== "deleted");
}

export function useCustomFields({ status, search }) {
  const [fields, setFields] = useState([]);
  const [quota, setQuota] = useState({ quota: 0, used: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    setLoading(true);
    Promise.all([
      api.get("/custom-fields/", { params }),
      api.get("/custom-fields/quota/"),
    ])
      .then(([listResponse, quotaResponse]) => {
        if (cancelled) return;
        setFields(listResponse.data);
        setQuota(quotaResponse.data);
        setError("");
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(extractError(requestError, "Gagal memuat custom fields."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, search, version]);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);

  const create = async (payload) => {
    await api.post("/custom-fields/", payload);
    refresh();
  };

  const update = async (id, payload) => {
    await api.patch(`/custom-fields/${id}/`, payload);
    refresh();
  };

  const remove = async (id) => {
    await api.delete(`/custom-fields/${id}/`);
    refresh();
  };

  const reorder = async (ids) => {
    await api.post("/custom-fields/reorder/", { ids });
    refresh();
  };

  return { fields, quota, loading, error, create, update, remove, reorder };
}


const toTaggingRule = (record) => ({
  id: record.id,
  ruleName: record.name,
  transactionType: record.transaction_type,
  taggingType: record.tag_mapping?.taggingType ?? 2,
  customTags: record.tag_set || [],
  transactionMakers: record.tag_mapping?.transactionMakers || [],
});

const toTaggingPayload = (values) => ({
  name: values.ruleName,
  description: "",
  tag_type: "transaction",
  transaction_type: values.transactionType,
  is_active: true,
  default_tag: values.customTags?.[0] || "",
  tag_set: values.customTags || [],
  tag_mapping: {
    taggingType: values.taggingType,
    transactionMakers: values.transactionMakers || [],
  },
});

export function useTaggingRules() {
  const [rules, setRules] = useState([]);
  const [options, setOptions] = useState({ users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/tagging-rules/"),
      api.get("/tagging-rules/options/"),
    ])
      .then(([rulesResponse, optionsResponse]) => {
        setRules(rulesResponse.data.map(toTaggingRule));
        setOptions({ users: optionsResponse.data.users || [] });
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat tagging rules."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    await api.post("/tagging-rules/", toTaggingPayload(values));
    load();
  };

  const update = async (id, values) => {
    await api.patch(`/tagging-rules/${id}/`, toTaggingPayload(values));
    load();
  };

  const remove = async (id) => {
    await api.delete(`/tagging-rules/${id}/`);
    load();
  };

  return { rules, options, loading, error, create, update, remove };
}


export const canEditTemplates = (key) => canAccessSettingsTemplate(key, "edit");

const collectMessages = (value) => {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (typeof value === "object") return Object.values(value).flatMap(collectMessages);
  return [String(value)];
};

export const templateErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (data && typeof data === "object") {
    const messages = collectMessages(data);
    if (messages.length > 0) return messages.join("\n");
  }
  return fallback;
};

export function useTemplateSetting(key, defaults) {
  const defaultsRef = useRef(defaults);
  const [values, setValues] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/template-settings/${key}/`)
      .then((response) => {
        if (cancelled) return;
        setValues({ ...defaultsRef.current, ...response.data });
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(templateErrorMessage(requestError, "Gagal memuat template."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError("");
  };

  const reset = () => {
    setValues({ ...defaultsRef.current });
    setSaved(false);
    setError("");
  };

  const isDirty = JSON.stringify(values) !== JSON.stringify(defaultsRef.current);

  const save = async (extras) => {
    if (saving) return null;
    setSaving(true);
    setError("");
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([name]) => !name.endsWith("_url"))
      );
      let body = payload;
      if (extras) {
        body = new FormData();
        body.append("data", JSON.stringify(payload));
        Object.entries(extras).forEach(([name, value]) => {
          if (value === null || value === undefined || value === false) return;
          body.append(name, value === true ? "true" : value);
        });
      }
      const response = await api.put(`/template-settings/${key}/`, body);
      const next = { ...defaultsRef.current, ...response.data };
      setValues(next);
      setSaved(true);
      return response.data;
    } catch (requestError) {
      setError(templateErrorMessage(requestError, "Gagal menyimpan template."));
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    values,
    setField,
    loading,
    saving,
    saved,
    setSaved,
    error,
    save,
    reset,
    isDirty,
  };
}
