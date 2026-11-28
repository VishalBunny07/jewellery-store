# SQL migrations

Apply migration folders in chronological order using the PostgreSQL connection configured by `DATABASE_URL`.

Before applying a migration to a non-disposable database:
1. Take a database backup.
2. Confirm the target database name and environment.
3. Review the SQL file.
4. Apply the SQL and verify the resulting table/indexes.

`20261128_add_sessions/migration.sql` adds only the `Session` table and its indexes/foreign key. It does not alter or delete existing customer, address, OTP, cart, wishlist, product, or order data.
