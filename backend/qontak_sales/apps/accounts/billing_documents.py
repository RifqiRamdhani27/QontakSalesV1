from django.template import Context, Template


INVOICE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice {{ invoice.invoice_number }}</title>
<style>
body { font-family: Arial, sans-serif; color: #1f2937; max-width: 800px; margin: 40px auto; padding: 24px; }
h1 { margin-bottom: 6px; color: #2563eb; }
header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
.details { display: flex; justify-content: space-between; gap: 24px; margin: 24px 0; }
p { margin: 6px 0; }
table { width: 100%; border-collapse: collapse; margin-top: 24px; }
th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
.amount { text-align: right; }
.total { font-weight: bold; font-size: 18px; }
.notes { margin-top: 24px; white-space: pre-wrap; }
@media print { body { margin: 0; } }
</style>
</head>
<body>
<header><h1>Billing Invoice</h1><p>{{ invoice.invoice_number }}</p></header>
<div class="details">
<section><strong>Billed to</strong><p>{{ company.name }}</p><p>{{ company.company_email }}</p><p>{{ company.billing_address|default:company.address }}</p></section>
<section><p>Invoice date: {{ invoice.invoice_date|date:"d M Y" }}</p><p>Due date: {{ invoice.due_date|date:"d M Y" }}</p><p>Status: {{ invoice.get_status_display }}</p>{% if invoice.paid_at %}<p>Paid at: {{ invoice.paid_at|date:"d M Y H:i" }}</p>{% endif %}</section>
</div>
<table>
<thead><tr><th>Billing period</th><th class="amount">Amount ({{ company.base_currency }})</th></tr></thead>
<tbody><tr><td>{{ invoice.billing_period }}</td><td class="amount">{{ invoice.amount|floatformat:"2" }}</td></tr><tr><td>Tax</td><td class="amount">{{ invoice.tax_amount|floatformat:"2" }}</td></tr><tr class="total"><td>Total</td><td class="amount">{{ invoice.total_amount|floatformat:"2" }}</td></tr></tbody>
</table>
{% if invoice.payment_method %}<p>Payment method: {{ invoice.get_payment_method_display }}</p>{% endif %}
{% if invoice.notes %}<div class="notes">{{ invoice.notes }}</div>{% endif %}
</body>
</html>"""


def render_billing_invoice(invoice):
    return Template(INVOICE_TEMPLATE).render(Context({"invoice": invoice, "company": invoice.customer}))
