CREATE TABLE "footer_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "footer_links_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "footer_links" ("id", "tenantId", "label", "href", "order", "isActive")
SELECT "id" || '-footer-home', "id", 'Home', '#top', 0, true FROM "tenants"
UNION ALL
SELECT "id" || '-footer-about', "id", 'About Us', '#about-mosque', 1, true FROM "tenants"
UNION ALL
SELECT "id" || '-footer-services', "id", 'Services', '#events', 2, true FROM "tenants"
UNION ALL
SELECT "id" || '-footer-programs', "id", 'Programs', '#announcements', 3, true FROM "tenants"
UNION ALL
SELECT "id" || '-footer-donate', "id", 'Get Involved', '#donate', 4, true FROM "tenants";
