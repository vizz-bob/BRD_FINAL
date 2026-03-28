from django.template.context import BaseContext


def apply_python314_compatibility_patch():
    if getattr(BaseContext.__copy__, "__name__", "") == "_safe_base_context_copy":
        return

    def _safe_base_context_copy(self):
        duplicate = self.__class__.__new__(self.__class__)
        duplicate.__dict__ = self.__dict__.copy()
        duplicate.dicts = self.dicts[:]
        return duplicate

    BaseContext.__copy__ = _safe_base_context_copy