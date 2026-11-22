from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Company, CustomUser
from .settings_models import LandingAppearance

admin.site.register(Company)
admin.site.register(CustomUser, UserAdmin)


@admin.register(LandingAppearance)
class LandingAppearanceAdmin(admin.ModelAdmin):
    list_display = ("__str__", "published_at", "updated_at")
    readonly_fields = ("updated_at",)
