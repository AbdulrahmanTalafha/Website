# WeRise CMS Admin Review And Editorial UX Plan

## Project Context

There are two related codebases:

- `werise-new`: the existing static Next.js website.
- `WeRise-CMS`: the Laravel CMS admin/API backend.

The Next.js website is currently built with fixed App Router routes, React components, and static content files under `data/`. The Laravel CMS has already been generated with a normalized database schema, Filament resources, translation tables, relation managers, seeders, and public APIs.

The current problem is not that the backend foundation is unusable. The problem is that the Filament admin experience still feels like database CRUD instead of a website editor.

## 1. What Has Already Been Implemented

### Laravel CMS Foundation

The CMS repo already includes:

- Laravel 12.
- Filament 4 admin panel.
- Admin login at `/admin`.
- Laravel Sanctum.
- Spatie Permission.
- Spatie Media Library.
- Spatie Activity Log.
- MySQL-ready migrations.
- Seeders for admin user, roles, settings, pages, menus, and sample content.
- Public API endpoints under `/api/v1/{locale}`.

### Core CMS Tables

The CMS has migrations for:

- `site_settings`
- `site_setting_translations`
- `header_settings`
- `header_setting_translations`
- `footer_settings`
- `footer_setting_translations`
- `pages`
- `page_translations`
- `page_sections`
- `page_section_translations`
- `menus`
- `menu_items`
- `menu_item_translations`
- `redirects`
- `preview_tokens`
- `content_revisions`

### Dynamic Content Modules

The CMS has module tables for:

- `projects`
- `project_translations`
- `initiatives`
- `initiative_translations`
- `publications`
- `publication_translations`
- `media_posts`
- `media_post_translations`
- `team_members`
- `team_member_translations`
- `governance_bodies`
- `governance_body_translations`
- `partners`
- `partner_translations`
- `elections`
- `election_translations`
- `observatory_statistics`
- `observatory_reports`
- `observatory_report_translations`

### Filament Resources

Filament resources exist for the main CMS entities:

- Pages
- Page Sections
- Page Translations
- Page Section Translations
- Projects
- Project Translations
- Initiatives
- Initiative Translations
- Publications
- Publication Translations
- Media Posts
- Media Post Translations
- Team Members
- Team Member Translations
- Governance Bodies
- Governance Body Translations
- Partners
- Partner Translations
- Elections
- Election Translations
- Observatory Reports
- Observatory Report Translations
- Observatory Statistics
- Menus
- Menu Items
- Menu Item Translations
- Redirects
- Site Settings
- Header Settings
- Footer Settings
- Users

### Relation Managers

Some parent resources already have inline relation managers:

- `PageResource`
  - page translations
  - page sections
- `PageSectionResource`
  - section translations
- `ProjectResource`
  - project translations
- `InitiativeResource`
  - initiative translations
- `PublicationResource`
  - publication translations
- `MediaPostResource`
  - media post translations
- `TeamMemberResource`
  - team member translations
- `PartnerResource`
  - partner translations
- `MenuResource`
  - menu items
- `MenuItemResource`
  - menu item translations

### Public APIs

The CMS has API routes for:

- settings
- navigation
- pages
- home
- projects
- initiatives
- publications
- media
- team
- partners
- elections
- observatory
- search
- sitemap records
- redirect manifest

Example routes:

```text
GET /api/v1/ar/settings
GET /api/v1/ar/navigation
GET /api/v1/ar/pages/{key}
GET /api/v1/ar/home
GET /api/v1/ar/projects
GET /api/v1/ar/projects/{slug}
GET /api/v1/ar/initiatives
GET /api/v1/ar/publications
GET /api/v1/ar/media
GET /api/v1/ar/team
GET /api/v1/ar/partners
GET /api/v1/ar/elections
GET /api/v1/ar/observatory
GET /api/v1/ar/sitemap-records
```

### Fixes Already Applied

The CMS has already had several technical fixes:

- Fixed long MySQL unique index names for translation tables.
- Fixed generated Filament table columns that referenced non-existing fields.
- Added media selectors for media foreign keys.
- Added relationship selectors instead of raw ID fields in some forms.
- Changed local sessions to file sessions to avoid `419 Page Expired` after database resets.
- Disabled lazy loading on Filament relation managers to avoid Livewire lazy-load `419` errors.
- Improved page section forms with clearer labels and JSON formatting.

## 2. How The Current CMS Architecture Works

The CMS uses a normalized multilingual model:

- Parent records store shared, non-language-specific fields.
- Translation records store Arabic and English content.

Example:

- `pages`
  - route, status, sitemap settings, canonical URL, SEO image
- `page_translations`
  - locale, title, meta title, meta description
- `page_sections`
  - page, section key, section type, sort order, visibility, media, settings JSON
- `page_section_translations`
  - locale, title, subtitle, description, badge, button labels, extra content JSON

Dynamic modules follow the same pattern:

- `projects`
  - slug, status, dates, filters, media, publishing fields
- `project_translations`
  - title, short description, full description, donor, sector, key results, SEO fields

This architecture is valid for APIs and multilingual content, but it is not yet presented to editors in a friendly way.

## 3. Why The Current Admin Appears As Normal ORM Forms

The current admin looks like standard ORM CRUD because the Filament resources were generated directly from models and database tables.

That means the admin exposes:

- database field names
- IDs and relationships
- separate translation resources
- separate page section resources
- JSON fields
- technical settings
- raw model structure

This is expected from generated Filament resources, but it is not the intended final editorial experience.

Editors should not need to understand:

- `page_section_id`
- `locale`
- translation tables
- relation managers
- section keys
- internal JSON
- model relationships

They should feel like they are editing the real website.

## 4. Which Existing Parts Can Be Reused

The following should be reused:

- Migrations and core database schema.
- Models and relationships.
- Translation model structure.
- Publishing fields.
- SEO fields.
- Menu tables.
- Page and page section tables.
- Dynamic content module tables.
- API controllers and resources.
- Roles and permissions foundation.
- Activity log foundation.
- Content revisions table.
- Existing Filament resources as a starting point.
- Existing relation managers as a starting point.

There is no need to delete the CMS and rebuild from scratch.

The correct direction is to keep the backend architecture and replace the generated admin UX with editorial screens.

## 5. Which Parts Must Be Changed

The following parts need to change:

- Sidebar navigation should hide technical translation resources.
- Fixed page editing should move from database CRUD to custom editorial screens.
- Page sections should be shown as website section cards.
- Arabic and English content should be edited side by side or in tabs on the same screen.
- JSON fields should be converted into repeaters/builders where possible.
- Technical fields should be hidden or moved to advanced panels.
- Media upload and preview need a proper editor-friendly flow.
- Dynamic module forms need editorial tabs.
- Revisions and publish workflow need clearer UI.
- Preview links need to be added.

## 6. Which Resources Should Remain Normal CRUD Modules

These can remain mostly normal Filament resources, but they need better labels, tabs, validation, and hidden technical fields:

- Projects
- Initiatives
- Publications
- Media Posts
- Team Members
- Governance Bodies
- Partners
- Elections
- Observatory Reports
- Observatory Statistics
- Redirects
- Users

They should not expose translation resources separately. Instead, each module should include tabs like:

```text
General
English
العربية
Media
SEO
Relationships
Publishing
```

## 7. Which Resources Need Custom Editorial Screens

Fixed website pages need custom editorial screens:

- Home
- About
- Programs / Projects listing
- Initiatives listing
- Publications listing
- Media Center
- Team / Governance
- Partners / Supporters
- Digital Observatory
- E-Election Platform
- Contact
- Search
- Not Found

These are not arbitrary CMS pages. They correspond to existing Next.js routes and layouts.

The client should not create arbitrary new frontend page routes or arbitrary section types.

The editor should only manage approved sections that already exist or are supported by the frontend.

## 8. How To Transform The Current CMS Into The Desired Experience

### Step 1: Clean Admin Navigation

Hide standalone translation resources from the sidebar:

- Page Translations
- Page Section Translations
- Project Translations
- Initiative Translations
- Publication Translations
- Media Post Translations
- Team Member Translations
- Partner Translations
- Menu Item Translations
- Election Translations
- Observatory Report Translations
- Governance Body Translations

Keep them available internally through relation managers, but not visible as top-level editor modules.

Rename visible resources:

- Pages -> Website Pages
- Menus -> Navigation Menus
- Media Posts -> Media Center
- Site Settings -> Website Settings
- Header Settings -> Header
- Footer Settings -> Footer

### Step 2: Build A Website Pages Editor

Replace the normal `Pages > Edit` experience with a custom page editor.

The editor should show:

```text
Page information
SEO settings
Publishing settings
Sections in frontend order
```

Each page section should appear as a clear card:

```text
Hero Section
English | Arabic
Title
Subtitle
Description
Buttons
Image
Enabled / Disabled
```

### Step 3: Map Fixed Pages To Approved Sections

The Next.js frontend already has fixed routes:

- `/[locale]`
- `/[locale]/about`
- `/[locale]/programs-projects`
- `/[locale]/initiatives-campaigns`
- `/[locale]/publications-reports`
- `/[locale]/media-center`
- `/[locale]/team-governance`
- `/[locale]/partners-supporters`
- `/[locale]/digital-observatory`
- `/[locale]/e-election-platform`
- `/[locale]/contact`
- `/[locale]/search`

The CMS should define allowed sections for each fixed page.

Examples:

Home page sections:

- hero
- news ticker
- about intro
- focus areas
- featured projects
- stats
- featured initiatives
- observatory preview
- latest publications
- e-election CTA
- latest news
- partners
- final CTA

About page sections:

- hero
- introduction
- mission / vision
- values
- work areas
- timeline
- achievements
- partners

Projects listing page:

- hero
- stats
- filters
- project listing

Publications listing page:

- hero
- publication listing

Media Center page:

- hero
- category tabs
- featured item
- press releases
- videos
- media coverage
- listing

Digital Observatory page:

- hero
- overview
- methodology
- statistics
- reports
- report case form
- call to action

Contact page:

- hero
- contact form
- contact information
- social links
- map

### Step 4: Build Page Section Form Components

Create section-specific form components instead of one generic JSON field.

Examples:

- `HeroSectionForm`
- `StatsSectionForm`
- `FeaturedProjectsSectionForm`
- `LatestNewsSectionForm`
- `PartnersSectionForm`
- `ContactInformationSectionForm`
- `ObservatoryStatsSectionForm`

These components should read/write to:

- `page_sections.settings_json`
- `page_section_translations.title`
- `page_section_translations.subtitle`
- `page_section_translations.description`
- `page_section_translations.content_json`
- media fields

### Step 5: Improve Dynamic Module Forms

For modules like Projects and Publications, keep the existing model/resources but reorganize forms.

Project editor should become:

```text
General
- slug
- project status
- sector
- dates
- filters

English
- title
- short description
- full description
- donor
- target group
- key results

العربية
- title
- short description
- full description
- donor
- target group
- key results

Media
- featured image
- gallery

SEO
- canonical URL
- noindex
- meta title EN/AR
- meta description EN/AR
- SEO image

Publishing
- draft/published
- publish date
- sitemap
```

### Step 6: Add Media Manager

The CMS currently has media references but does not yet have a polished media library manager.

Need to add:

- upload images
- upload PDFs
- preview images
- manage alt text
- manage captions
- select media from existing assets
- validate file type by usage

### Step 7: Add Preview And Publish Workflow

The schema already has:

- `status`
- `published_at`
- `preview_tokens`
- `content_revisions`

Need to expose this in the admin:

- Save draft
- Publish
- Unpublish
- Preview page
- View revisions
- Restore revision

## 9. Whether Schema Changes Are Required

Major schema deletion is not required.

The existing schema is mostly reusable.

Possible small additions may be useful:

- Add a section registry/config file instead of new database tables.
- Add fields for manual dynamic selections if not already handled through `settings_json`.
- Add media collections or a dedicated media asset wrapper if needed for editor-friendly uploads.
- Add revision snapshot helpers if current `content_revisions` is not yet wired into save events.

The first phase should avoid schema churn. Use the existing:

- pages
- page sections
- translations
- settings JSON
- content JSON
- media IDs
- publishing fields

## 10. Files Expected To Modify

### Laravel CMS Files

Expected files:

```text
app/Filament/Resources/Pages/PageResource.php
app/Filament/Resources/Pages/Pages/EditPage.php
app/Filament/Resources/Pages/Schemas/PageForm.php
app/Filament/Resources/Pages/RelationManagers/SectionsRelationManager.php
app/Filament/Resources/PageSections/PageSectionResource.php
app/Filament/Resources/PageSections/Schemas/PageSectionForm.php
app/Filament/Resources/PageSections/RelationManagers/TranslationsRelationManager.php
app/Filament/Resources/*Translation*/**/*
app/Filament/Resources/Projects/Schemas/ProjectForm.php
app/Filament/Resources/Initiatives/Schemas/InitiativeForm.php
app/Filament/Resources/Publications/Schemas/PublicationForm.php
app/Filament/Resources/MediaPosts/Schemas/MediaPostForm.php
app/Filament/Resources/TeamMembers/Schemas/TeamMemberForm.php
app/Filament/Resources/Partners/Schemas/PartnerForm.php
app/Filament/Resources/Menus/Schemas/MenuForm.php
app/Filament/Resources/Menus/RelationManagers/AllItemsRelationManager.php
app/Filament/Resources/MenuItems/Schemas/MenuItemForm.php
app/Providers/Filament/AdminPanelProvider.php
database/seeders/CmsStructureSeeder.php
database/seeders/ContentSeeder.php
```

Likely new files:

```text
app/Filament/Pages/WebsitePages.php
app/Filament/Pages/EditWebsitePage.php
app/Filament/Support/PageSectionRegistry.php
app/Filament/Support/SectionForms/HeroSectionForm.php
app/Filament/Support/SectionForms/StatsSectionForm.php
app/Filament/Support/SectionForms/FeaturedProjectsSectionForm.php
app/Filament/Support/SectionForms/LatestNewsSectionForm.php
app/Filament/Support/SectionForms/PartnersSectionForm.php
app/Filament/Support/SectionForms/ContactSectionForm.php
app/Filament/Support/Forms/TranslatableFields.php
```

### Next.js Files To Review For Mapping

Frontend files that define the actual page structure:

```text
app/[locale]/page.tsx
app/[locale]/about/page.tsx
app/[locale]/programs-projects/page.tsx
app/[locale]/initiatives-campaigns/page.tsx
app/[locale]/publications-reports/page.tsx
app/[locale]/media-center/page.tsx
app/[locale]/team-governance/page.tsx
app/[locale]/partners-supporters/page.tsx
app/[locale]/digital-observatory/page.tsx
app/[locale]/e-election-platform/page.tsx
app/[locale]/contact/page.tsx
```

Static data files to import into CMS:

```text
data/home.ts
data/about.ts
data/projects.ts
data/initiatives.ts
data/publications.ts
data/media.ts
data/team.ts
data/partners.ts
data/elections.ts
data/observatory.ts
data/navigation.ts
data/site.ts
```

## Current Content Location

At the moment, content is split like this:

### Fixed Pages

- Page setup: `pages`
- Page title and SEO: `page_translations`
- Page section setup: `page_sections`
- Actual section text: `page_section_translations`

### Dynamic Modules

- Project setup: `projects`
- Project text: `project_translations`
- Publication setup: `publications`
- Publication text: `publication_translations`
- Media setup: `media_posts`
- Media text: `media_post_translations`
- Team setup: `team_members`
- Team text: `team_member_translations`

### Menus

- Menu setup: `menus`
- Menu item setup: `menu_items`
- Menu labels: `menu_item_translations`

## Why The Client Cannot Easily Find Content Now

The current admin exposes the normalized database directly.

For example, to edit homepage hero text today:

1. Go to `Page Sections`.
2. Find `home / hero`.
3. Open it.
4. Scroll to `Translations`.
5. Edit Arabic or English translation rows.

This is technically correct but editorially poor.

The desired workflow should be:

1. Go to `Website Pages`.
2. Click `Home`.
3. Open `Hero Section`.
4. Edit English and Arabic content in one place.
5. Save or publish.

## Recommended Implementation Order

### Phase 1: Admin Navigation Cleanup

- Hide standalone translation resources.
- Rename sidebar labels.
- Group resources into:
  - Website
  - Content
  - Observatory
  - Settings
  - System

### Phase 2: Website Page Editor

- Build a custom `Website Pages` editor.
- Show fixed pages as human-readable records.
- Show sections as ordered cards.
- Edit Arabic and English content inside each section.
- Keep using existing tables.

### Phase 3: Dynamic Module Form Polish

- Rebuild module forms with tabs:
  - General
  - English
  - العربية
  - Media
  - SEO
  - Publishing

### Phase 4: Import Real Frontend Content

- Import content from `data/*.ts` into CMS seeders or import commands.
- Match static frontend content to CMS modules.
- Preserve Arabic and English copy.

### Phase 5: Media Manager

- Add upload/preview/select UI.
- Add alt text and caption editing.
- Support PDFs for publications and reports.

### Phase 6: Preview, Revisions, Publishing

- Add preview links.
- Wire revision snapshots.
- Add restore revision.
- Add publish/draft actions.

## Final Recommendation

Do not delete the existing CMS.

The current backend architecture is a reasonable foundation for an API-driven multilingual CMS. The issue is the generated Filament UX. The next work should focus on transforming the admin from ORM CRUD into an editorial website-management experience while reusing the existing schema, models, APIs, permissions, and relationships.

