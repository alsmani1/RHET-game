/**
 * Minimal progress bar/dots showing current scene position.
 * @param {{ current: number, total: number }} props
 */
export default function SceneProgress({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`progress-dot ${
            i === current ? 'active' : i < current ? 'completed' : 'upcoming'
          }`}
          title={`Scene ${i + 1}`}
        />
      ))}
    </div>
  )
}
