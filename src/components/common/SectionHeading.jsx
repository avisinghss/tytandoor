export default function SectionHeading({
  badge,
  title,
  description,
  center = true,
}) {
  return (
    <div className={center ? "text-center mb-16" : "mb-16"}>

      {badge && (
        <span className="inline-block uppercase tracking-[4px] text-red-700 font-semibold text-sm mb-4">
          {badge}
        </span>
      )}

      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-gray-600 leading-8 mx-auto">
          {description}
        </p>
      )}

    </div>
  );
}