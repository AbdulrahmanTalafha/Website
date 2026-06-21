export default function DigitalObservatoryTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-primary-900">
      <div className="pointer-events-none absolute inset-0 bg-primary-900" aria-hidden="true" />
      <div className="relative z-0 w-full">
        {children}
      </div>
    </div>
  )
}
