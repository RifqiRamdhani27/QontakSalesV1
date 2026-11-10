from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

PAYMENT_TERM_CHOICES = [("net_15", "Net 15"), ("net_30", "Net 30"), ("net_60", "Net 60"), ("cod", "Cash On Delivery"), ("custom", "Custom")]

class CustomField(models.Model):
    QUOTA = 3

    PAGE_CHOICES = [
        ("sales", "Sales"),
        ("purchases", "Purchases"),
        ("products", "Products"),
        ("expenses", "Expenses"),
    ]
    FIELD_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("date", "Date"),
        ("dropdown", "Dropdown"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("deleted", "Deleted"),
    ]
    AFFIX_CHOICES = [
        ("none", "None"),
        ("prefix", "Prefix"),
        ("suffix", "Suffix"),
    ]
    DATE_DEFAULT_CHOICES = [
        ("none", "Empty"),
        ("today", "Today"),
    ]

    company = models.ForeignKey(
        "accounts.Company", on_delete=models.CASCADE, related_name="custom_fields"
    )
    name = models.CharField(max_length=25)
    page = models.CharField(max_length=20, choices=PAGE_CHOICES)
    sub_pages = models.JSONField(blank=True, default=list)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    is_required = models.BooleanField(default=False)
    show_in_print = models.BooleanField(default=False)
    max_chars = models.PositiveIntegerField(blank=True, null=True)
    use_decimal = models.BooleanField(default=False)
    affix_type = models.CharField(max_length=10, choices=AFFIX_CHOICES, default="none")
    affix_text = models.CharField(max_length=30, blank=True, default="")
    date_default = models.CharField(
        max_length=10, choices=DATE_DEFAULT_CHOICES, default="none"
    )
    allow_multiple = models.BooleanField(default=False)
    options = models.JSONField(blank=True, default=list)
    default_value = models.CharField(max_length=100, blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        indexes = [
            models.Index(fields=["company", "page", "status"]),
        ]

    def __str__(self):
        return self.name

class AccountMapping(models.Model):
    ACCOUNT_TYPES = [
        ("sales", "Sales"),
        ("purchase", "Purchase"),
        ("ar_ap", "AR/AP"),
        ("inventory", "Inventory"),
        ("others", "Others"),
        ("bank", "Bank"),
        ("cash", "Cash"),
        ("credit_card", "Credit Card"),
        ("account_receivable", "Account Receivable"),
        ("account_payable", "Account Payable"),
    ]

    company = models.ForeignKey(
        "accounts.Company", on_delete=models.CASCADE, related_name="account_mappings"
    )
    account_type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    target_type = models.CharField(max_length=100, default="company")
    target_id = models.CharField(max_length=100)
    account_code = models.CharField(max_length=50)
    account_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    mapping_options = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ["account_type", "target_id"]
        unique_together = [
            ("company", "account_type", "target_type", "target_id"),
        ]

    def __str__(self):
        return f"{self.account_code} - {self.account_name}"

class Billing(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
        ("canceled", "Canceled"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash"),
        ("bank_transfer", "Bank Transfer"),
        ("credit_card", "Credit Card"),
        ("check", "Check"),
        ("online", "Online Payment"),
    ]

    invoice_number = models.CharField(max_length=100, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField()
    customer = models.ForeignKey("accounts.Company", on_delete=models.PROTECT, related_name="billings")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, blank=True, default="")
    billing_period = models.CharField(max_length=100)
    notes = models.TextField(blank=True, default="")
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-invoice_date"]

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"

class ApprovalRule(models.Model):
    RULE_TYPES = [
        ("amount_based", "Amount Based"),
        ("role_based", "Role Based"),
        ("user_based", "User Based"),
        ("workflow", "Workflow"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    rule_type = models.CharField(max_length=50, choices=RULE_TYPES)
    amount_threshold = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    approver_role = models.ForeignKey("accounts.Role", on_delete=models.PROTECT, related_name="approval_rules", blank=True, null=True)
    approver_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="approval_rules", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    condition = models.JSONField(blank=True, null=True)
    notification_template = models.TextField(blank=True, default="")
    company = models.ForeignKey("accounts.Company", on_delete=models.PROTECT, related_name="approval_rules")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class TaggingRule(models.Model):
    TAG_TYPES = [
        ("transaction", "Transaction"),
        ("customer", "Customer"),
        ("product", "Product"),
        ("employee", "Employee"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    tag_type = models.CharField(max_length=50, choices=TAG_TYPES)
    transaction_type = models.CharField(max_length=100)
    tag_mapping = models.JSONField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    default_tag = models.CharField(max_length=100, blank=True, default="")
    tag_set = models.JSONField(blank=True, null=True)
    company = models.ForeignKey("accounts.Company", on_delete=models.PROTECT, related_name="tagging_rules")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class TemplateSetting(models.Model):
    company = models.ForeignKey(
        "accounts.Company", on_delete=models.CASCADE, related_name="template_settings"
    )
    key = models.CharField(max_length=50)
    data = models.JSONField(blank=True, default=dict)
    signature_image = models.ImageField(
        upload_to="template_signatures/", blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("company", "key")]
        ordering = ["key"]

    def __str__(self):
        return f"{self.company.name} - {self.key}"

class Invitation(models.Model):


    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invitation"
    )
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_invitations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Undangan {self.user.email}"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_usable(self):
        return self.accepted_at is None and not self.is_expired


class SalesFormSetting(models.Model):
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, related_name="sales_form_settings")
    preferred_sales_term = models.CharField(
        max_length=20, choices=PAYMENT_TERM_CHOICES, default="net_30"
    )
    use_sales_shipping = models.BooleanField(default=False)
    use_sales_discount = models.BooleanField(default=False)
    use_sales_discount_per_line = models.BooleanField(default=False)
    use_discount_account_per_product = models.BooleanField(default=False)
    use_sales_deposit = models.BooleanField(default=False)
    show_profit_margin_on_invoice = models.BooleanField(default=False)
    block_sale_if_stock_insufficient = models.BooleanField(default=False)
    lock_price_by_price_rule = models.BooleanField(default=False)
    default_invoice_message = models.TextField(blank=True, default="")
    default_delivery_slip_message = models.TextField(blank=True, default="")

    def __str__(self):
        return "Sales form setting"

class InvoiceReminder(models.Model):
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, related_name="invoice_reminders")
    TYPE_CHOICES = [
        ("sales_invoice", "Invoice penjualan"),
        ("sales_order", "Pesanan penjualan"),
        ("both", "Keduanya"),
    ]

    is_enabled = models.BooleanField(default=False)
    invoice_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="sales_invoice")
    exempt_by_amount = models.BooleanField(default=False)
    exempt_amount_under = models.DecimalField(
        max_digits=18, decimal_places=2, null=True, blank=True
    )
    exempt_by_customer = models.BooleanField(default=False)
    exempt_by_invoice = models.BooleanField(default=False)
    exempt_by_order = models.BooleanField(default=False)
    exempt_customers = models.ManyToManyField(
        "customers.Customer", blank=True, related_name="exempt_from_reminders"
    )

    def __str__(self):
        return "Invoice reminder"

class InvoiceReminderInterval(models.Model):
    TIMING_CHOICES = [
        ("before_due", "Sebelum jatuh tempo"),
        ("after_due", "Sesudah jatuh tempo"),
    ]

    reminder = models.ForeignKey(
        InvoiceReminder, on_delete=models.CASCADE, related_name="intervals"
    )
    days = models.PositiveIntegerField()
    timing = models.CharField(max_length=10, choices=TIMING_CHOICES, default="before_due")
    email_subject = models.CharField(max_length=255)
    email_body = models.TextField()
    include_pdf = models.BooleanField(default=True)

    class Meta:
        ordering = ["timing", "days"]
        constraints = [models.UniqueConstraint(fields=["reminder", "days", "timing"], name="settings_invoice_interval_unique")]

    def __str__(self):
        return f"{self.days} hari {self.timing}"


class PurchaseSetting(models.Model):
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, related_name="purchase_settings")
    preferred_purchase_term = models.CharField(
        max_length=20, choices=PAYMENT_TERM_CHOICES, default="net_30"
    )
    enable_supplier_in_purchase_request = models.BooleanField(default=False)
    use_purchase_shipping = models.BooleanField(default=False)
    use_purchase_discount = models.BooleanField(default=False)
    use_purchase_discount_per_line = models.BooleanField(default=False)
    use_purchase_deposit = models.BooleanField(default=False)
    default_purchase_order_message = models.TextField(blank=True, default="")

    def __str__(self):
        return "Purchase setting"


class ProductSetting(models.Model):
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, related_name="product_settings")
    COSTING_METHOD_CHOICES = [("average", "Average cost")]

    inventory_costing_method = models.CharField(
        max_length=20, choices=COSTING_METHOD_CHOICES, default="average"
    )
    show_stock_info = models.BooleanField(default=False)
    enable_barcode = models.BooleanField(default=False)
    use_product_variant = models.BooleanField(default=False)
    enable_serial_number_tracking = models.BooleanField(default=True)
    enable_batch_tracking = models.BooleanField(default=True)
    enable_storage_location = models.BooleanField(default=False)

    def __str__(self):
        return "Product setting"

class ProductBatchReminder(models.Model):
    company = models.ForeignKey("accounts.Company", on_delete=models.CASCADE, related_name="product_batch_reminders")
    UNIT_CHOICES = [("day", "Hari"), ("week", "Minggu"), ("month", "Bulan")]
    TIMING_CHOICES = [
        ("before_expiration", "Sebelum kedaluwarsa"),
        ("after_expiration", "Sesudah kedaluwarsa"),
    ]

    title = models.CharField(max_length=40)
    interval_value = models.PositiveIntegerField(
        validators=[MinValueValidator(1)], default=1
    )
    interval_unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default="day")
    timing = models.CharField(
        max_length=20, choices=TIMING_CHOICES, default="before_expiration"
    )
    email_subject = models.CharField(max_length=255, blank=True, default="")
    email_body = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class CompanyProductionSetting(models.Model):
    company = models.OneToOneField("accounts.Company", on_delete=models.CASCADE, related_name="production_settings")
    production_plan_date_mode = models.CharField(max_length=10, choices=[("required", "required"), ("optional", "optional"), ("hidden", "hidden")], default="required")
    allow_backdated_plan_date = models.BooleanField(default=False)
    allow_partial_production = models.BooleanField(default=False)
