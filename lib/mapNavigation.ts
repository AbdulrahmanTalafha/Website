import type { NavItem } from '@/types'
import type { CmsNavigationData } from '@/lib/cms'
import { navigationItems, footerLinks } from '@/data/navigation'

export interface ResolvedNavItem {
  label: string
  href: string
  description?: string
  children?: ResolvedNavItem[]
}

export interface ResolvedFooterSection {
  label: string
  items: Array<{ label: string; href: string }>
}

export function mapCmsHeaderNav(cms: CmsNavigationData | null, locale: 'en' | 'ar'): ResolvedNavItem[] {
  if (!cms?.header?.length) {
    return navigationItems.map((item) => ({
      label: item.label[locale],
      href: item.href,
      description: item.description?.[locale],
      children: item.children?.map((child) => ({
        label: child.label[locale],
        href: child.href,
        description: child.description?.[locale],
      })),
    }))
  }

  return cms.header.map((item) => ({
    label: item.label,
    href: item.href,
    description: item.description ?? undefined,
    children: item.children?.map((child) => ({
      label: child.label,
      href: child.href,
      description: child.description ?? undefined,
    })),
  }))
}

export function mapCmsFooterNav(
  cms: CmsNavigationData | null,
  locale: 'en' | 'ar',
): Record<string, ResolvedFooterSection> {
  if (!cms?.footer || Object.keys(cms.footer).length === 0) {
    const sections: Record<string, ResolvedFooterSection> = {}
    for (const [key, section] of Object.entries(footerLinks)) {
      sections[key] = {
        label: section.label[locale],
        items: section.items.map((item) => ({
          label: item.label[locale],
          href: item.href,
        })),
      }
    }
    return sections
  }

  const sections: Record<string, ResolvedFooterSection> = {}
  for (const [key, section] of Object.entries(cms.footer)) {
    sections[key] = {
      label: section.label,
      items: section.items.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    }
  }

  return sections
}

/** Build locale href prefix path */
export function navItemUrl(locale: string, href: string): string {
  if (href === '/sitemap.xml') return href
  if (href.startsWith('http://') || href.startsWith('https://')) return href
  if (href === '/') return `/${locale}`
  return `/${locale}${href}`
}

/** Legacy NavItem[] for any code still expecting bilingual records */
export function toBilingualNavItems(items: ResolvedNavItem[], locale: 'en' | 'ar'): NavItem[] {
  return items.map((item) => ({
    label: { en: item.label, ar: item.label },
    href: item.href,
    description: item.description ? { en: item.description, ar: item.description } : undefined,
    children: item.children?.map((child) => ({
      label: { en: child.label, ar: child.label },
      href: child.href,
      description: child.description ? { en: child.description, ar: child.description } : undefined,
    })),
  }))
}
