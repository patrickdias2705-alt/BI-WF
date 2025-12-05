'use client'

import { useEffect, useState } from 'react'

interface SaleNotificationProps {
  sellerName: string
  amount: number
  onClose: () => void
}

export default function SaleNotification({ sellerName, amount, onClose }: SaleNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Criar elemento de áudio
    const audioElement = new Audio('/videoplayback.mp3')
    audioElement.volume = 0.7
    setAudio(audioElement)

    // Mostrar notificação e tocar som
    setIsVisible(true)
    audioElement.play().catch(err => {
      console.error('Erro ao tocar áudio:', err)
    })

    // Auto-fechar após 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // Aguardar animação de saída
    }, 5000)

    return () => {
      clearTimeout(timer)
      audioElement.pause()
      audioElement.currentTime = 0
    }
  }, [onClose])

  // Gerar notas de dinheiro caindo
  const moneyNotes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    rotation: (Math.random() - 0.5) * 360,
  }))

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay com blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Notificação central */}
      <div className="relative z-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-500 animate-scale-in">
        <div className="text-white">
          <h2 className="text-5xl font-bold mb-4 animate-bounce">
            🎉 {sellerName} 🎉
          </h2>
          <div className="text-4xl font-extrabold mb-2 animate-pulse">
            VENDEU!
          </div>
          <div className="text-6xl font-black text-yellow-300 drop-shadow-lg">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount)}
          </div>
        </div>
      </div>

      {/* Notas de dinheiro caindo */}
      {moneyNotes.map((note) => (
        <div
          key={note.id}
          className="absolute pointer-events-none"
          style={{
            left: `${note.left}%`,
            top: '-10%',
            animation: `fall-${note.id} ${note.duration}s ${note.delay}s ease-in forwards`,
          }}
        >
          <div className="text-6xl" style={{ transform: `rotate(${note.rotation}deg)` }}>💵</div>
        </div>
      ))}

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        ${moneyNotes.map((note) => `
          @keyframes fall-${note.id} {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) translateX(${(Math.random() - 0.5) * 200}px);
              opacity: 0;
            }
          }
        `).join('')}

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

