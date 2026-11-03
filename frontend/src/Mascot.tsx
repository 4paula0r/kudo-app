type MascotVariant = 'ai' | 'success' | 'planning' | 'sleep' | 'analysis' | 'savings'

const mascotAlt: Record<MascotVariant, string> = {
  ai: 'Búho KUDO trabajando como asistente financiero',
  success: 'Búho KUDO celebrando una meta alcanzada',
  planning: 'Búho KUDO planificando las finanzas',
  sleep: 'Búho KUDO descansando',
  analysis: 'Búho KUDO analizando datos financieros',
  savings: 'Búho KUDO ahorrando para sus metas',
}

export default function Mascot({ variant, className = '' }: { variant: MascotVariant; className?: string }) {
  return <img
    className={`kudo-mascot kudo-mascot-${variant} ${className}`.trim()}
    src={`/prototypes/images/kudo/owl-${variant}.png`}
    alt={mascotAlt[variant]}
    loading="lazy"
    decoding="async"
  />
}

