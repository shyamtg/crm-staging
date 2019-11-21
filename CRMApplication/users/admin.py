from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Teams, TeamRoles


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('user_mobile_number','organization',)}),
    )

class TeamAdmin(admin.ModelAdmin):
    model = Teams

    class Meta:
        verbose_name_plural = "Teams"

class TeamRolesAdmin(admin.ModelAdmin):
    model = Teams

    class Meta:
        verbose_name_plural = "TeamRoles"

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Teams, TeamAdmin)
admin.site.register(TeamRoles, TeamRolesAdmin)