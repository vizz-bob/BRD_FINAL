"""Runtime compatibility helpers for third-party packages."""

from __future__ import annotations

import sys


def apply_django_py314_context_copy_patch() -> None:
    """
    Patch Django 4.2 BaseContext.__copy__ for Python 3.14+.

    Django 4.2 uses ``copy(super())`` in BaseContext.__copy__, which breaks on
    Python 3.14 because copying a ``super`` object no longer preserves writable
    attributes required by Django's template context internals.
    """
    if sys.version_info < (3, 14):
        return

    from django.template.context import BaseContext

    # Only patch the known incompatible implementation.
    copy_impl = BaseContext.__copy__
    if "super" not in copy_impl.__code__.co_names:
        return

    def _safe_base_context_copy(self):
        duplicate = self.__class__.__new__(self.__class__)
        if hasattr(self, "__dict__"):
            duplicate.__dict__ = self.__dict__.copy()
        duplicate.dicts = self.dicts[:]
        return duplicate

    BaseContext.__copy__ = _safe_base_context_copy
