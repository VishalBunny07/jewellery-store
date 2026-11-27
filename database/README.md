# Database Documentation

## Database Overview

- Database: PostgreSQL
- Database name: jewellery_store
- Schema tooling: Prisma 8
- Application database access: PostgreSQL using the `pg` package
- Environment configuration: Root `.env` file

## Directory Structure

```text
database/
├── schema/
│   ├── contract.prisma
│   ├── contract.json
│   └── contract.d.ts
├── migrations/
├── seeds/
│   └── seed.ts
├── backups/
├── scripts/
├── PRISMA-GUIDE.md
└── README.md
```

## Prisma Contract

Main schema: `database/schema/contract.prisma`

Generate contract files:

```bash
npm run contract:emit
```

Generated files:
- `database/schema/contract.json`
- `database/schema/contract.d.ts`

## Database Seeding

Seed script: `database/seeds/seed.ts`

Run:

```bash
npm run db:seed
```

Only run when intentionally seeding the database.

## Database Connection

The application reads `DATABASE_URL` from the root `.env` file.

Never commit database credentials.

## Important Notes

- Keep Prisma contract files under version control.
- Keep database backups out of Git.
- The storefront currently uses the `pg` package for PostgreSQL access.
- A Prisma application database client is not currently configured.
- Review database changes before applying them.