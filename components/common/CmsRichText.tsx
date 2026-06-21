import clsx from 'clsx'

interface CmsRichTextProps {
  html: string
  className?: string
}

/** Renders CMS rich-editor HTML with paragraph spacing, lists, and links. */
export default function CmsRichText({ html, className }: CmsRichTextProps) {
  const trimmed = html?.trim()
  if (!trimmed) return null

  return (
    <div
      className={clsx('cms-rich-text', className)}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  )
}
