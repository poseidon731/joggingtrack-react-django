from rest_framework import permissions

from .models import User

__all__ = ['IsUser', 'IsManager', 'IsAdmin']


class IsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated() and request.user.is_user


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated() and request.user.is_manager


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated() and request.user.is_admin


class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated() and (
            request.user.is_admin or request.user.is_manager
        )
