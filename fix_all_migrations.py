#!/usr/bin/env python3
"""
BRD LoanCRM - Fix ALL PostgreSQL type-coercion migration errors.

Fixes:
  0002  productfacility.id          bigint → uuid
  0029  agentcategory.id            uuid → bigint  (x7 models)
  0031  agentprofile.id             uuid → bigint  (x3 models)
  0038  adminuser.role_id           integer → uuid (FK type change)

Run on EC2: python3 /home/ubuntu/brdapp/fix_all_migrations.py
"""

import re, os

D = "/home/ubuntu/brdapp/BRD_MasterAdmin_Backend_1.1/adminpanel/migrations/"

def patch_file(fname, old, new):
    fpath = D + fname
    with open(fpath) as f:
        content = f.read()
    if old in content:
        with open(fpath, 'w') as f:
            f.write(content.replace(old, new))
        return True
    return False


# ── 0002: productfacility  bigint → uuid ──────────────────────────────────
def fix_0002():
    fname = "0002_rename_interest_waiver_moratoriumconfig_allowed_and_more.py"
    old = """        migrations.AlterField(
            model_name='productfacility',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),"""
    new = """        migrations.RunSQL(
            sql=\"\"\"
                ALTER TABLE "adminpanel_productfacility" DROP COLUMN "id" CASCADE;
                ALTER TABLE "adminpanel_productfacility"
                    ADD COLUMN "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid();
            \"\"\",
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AlterField(
                    model_name='productfacility',
                    name='id',
                    field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
                ),
            ]
        ),"""
    r = patch_file(fname, old, new)
    print(f"{'✅ fixed' if r else '⏭  already fixed'} — 0002 productfacility.id (bigint→uuid)")


# ── 0029: 7 models  uuid → bigint ─────────────────────────────────────────
def fix_0029():
    fname = "0029_agentprofile_clientprofile_vendorprofile_and_more.py"
    models = ["agentcategory","agentconstitution","agentlevel",
              "agentlocation","agentresponsibility","agentservicetype","agenttype"]
    count = 0
    for m in models:
        old = f"""        migrations.AlterField(
            model_name='{m}',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),"""
        new = f"""        migrations.RunSQL(
            sql=\"\"\"
                ALTER TABLE "adminpanel_{m}" DROP COLUMN "id" CASCADE;
                ALTER TABLE "adminpanel_{m}" ADD COLUMN "id" bigserial PRIMARY KEY;
            \"\"\",
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AlterField(
                    model_name='{m}',
                    name='id',
                    field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
                ),
            ]
        ),"""
        if patch_file(fname, old, new):
            count += 1
    print(f"{'✅ fixed' if count else '⏭  already fixed'} — 0029 ({count}/7 models uuid→bigint)")


# ── 0031: 3 models  uuid → bigint ─────────────────────────────────────────
def fix_0031():
    fname = "0031_addresstype_applicanttype_clientcategory_and_more.py"
    models = ["agentprofile", "clientprofile", "vendorprofile"]
    count = 0
    for m in models:
        old = f"""        migrations.AlterField(
            model_name='{m}',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),"""
        new = f"""        migrations.RunSQL(
            sql=\"\"\"
                ALTER TABLE "adminpanel_{m}" DROP COLUMN "id" CASCADE;
                ALTER TABLE "adminpanel_{m}" ADD COLUMN "id" bigserial PRIMARY KEY;
            \"\"\",
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AlterField(
                    model_name='{m}',
                    name='id',
                    field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
                ),
            ]
        ),"""
        if patch_file(fname, old, new):
            count += 1
    print(f"{'✅ fixed' if count else '⏭  already fixed'} — 0031 ({count}/3 models uuid→bigint)")


# ── 0038: adminuser.role_id  integer → uuid (FK change) ───────────────────
def fix_0038():
    fname = "0038_alter_adminuser_role.py"
    old = """        migrations.AlterField(
            model_name='adminuser',
            name='role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='admin_users', to='adminpanel.role'),
        ),"""
    new = """        migrations.RunSQL(
            sql=\"\"\"
                ALTER TABLE "adminpanel_adminuser" DROP COLUMN IF EXISTS "role_id" CASCADE;
                ALTER TABLE "adminpanel_adminuser"
                    ADD COLUMN "role_id" uuid NULL
                    REFERENCES "adminpanel_role"("id")
                    DEFERRABLE INITIALLY DEFERRED;
            \"\"\",
            reverse_sql=migrations.RunSQL.noop,
            state_operations=[
                migrations.AlterField(
                    model_name='adminuser',
                    name='role',
                    field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='admin_users', to='adminpanel.role'),
                ),
            ]
        ),"""
    r = patch_file(fname, old, new)
    print(f"{'✅ fixed' if r else '⏭  already fixed'} — 0038 adminuser.role_id (int→uuid FK)")


if __name__ == "__main__":
    print("=" * 55)
    print("  BRD Migration Fixer — applying all patches")
    print("=" * 55)
    fix_0002()
    fix_0029()
    fix_0031()
    fix_0038()
    print("=" * 55)
    print("\nNext — run these commands:")
    print("  cd /home/ubuntu/brdapp")
    print("  docker compose run --rm masteradmin-backend \\")
    print("    python manage.py migrate adminpanel 0001 --no-input")
    print("  docker compose up -d --build masteradmin-backend")
    print("  docker logs -f loancrm_masteradmin_backend")
