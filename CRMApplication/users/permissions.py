from django.contrib.auth.models import Group
from rest_framework import permissions
from . import models
from django.core.exceptions import ObjectDoesNotExist
from . import ADMIN_ROLE

class IsTeamAdmin(permissions.BasePermission):
    """
    Allows access only to "admin" users.
    """
    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False
        try:
            team_role_instance = models.UserTeamRoleMapping.objects.get(
                user_id=request.user.id)
            return request.user and models.TeamRoles.objects.get(id=team_role_instance.role_id).role_name == ADMIN_ROLE
        except ObjectDoesNotExist as ex:
            return False

def is_in_group(user, group_name):
    """
    Takes a user and a group name, and returns `True` if the user is in that group.
    """
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None

class HasGroupPermission(permissions.BasePermission):
    """
    Ensure user is in required groups.
    """

    def has_permission(self, request, view):
        # Get a mapping of methods -> required group.
        required_groups_mapping = getattr(view, "required_groups", {})

        # Determine the required groups for this particular request method.
        required_groups = required_groups_mapping.get(request.method, [])

        # Return True if the user has all the required groups or is staff.
        return all([is_in_group(request.user, group_name) if group_name != "__all__" else True for group_name in required_groups]) or (request.user and request.user.is_staff)