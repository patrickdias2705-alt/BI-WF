'use client'

import { useEffect, useState } from 'react'

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notificações não são suportadas neste navegador')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.warn('Permissão de notificação foi negada')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error)
      return false
    }
  }

  const showNotification = async (
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> => {
    if (!isSupported) {
      console.warn('Notificações não são suportadas')
      return null
    }

    // Solicitar permissão se necessário
    const hasPermission = await requestPermission()
    if (!hasPermission) {
      return null
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false, // false = toca som nativo do sistema
        vibrate: [200, 100, 200], // Vibrar em dispositivos móveis
        ...options,
      })

      // Fechar automaticamente após 5 segundos
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Quando a notificação for clicada, focar na janela
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return notification
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error)
      return null
    }
  }

  const playSound = async (src: string, volume: number = 0.7): Promise<void> => {
    try {
      const audio = new Audio(src)
      audio.volume = volume
      audio.preload = 'auto'
      
      // Carregar o áudio primeiro
      audio.load()
      
      // Tentar tocar quando estiver pronto
      const playAudio = () => {
        audio.play().catch((error) => {
          console.error('Erro ao tocar áudio:', error)
          // Tentar novamente após um pequeno delay
          setTimeout(() => {
            audio.play().catch(console.error)
          }, 200)
        })
      }

      // Se já estiver carregado, tocar imediatamente
      if (audio.readyState >= 2) {
        playAudio()
      } else {
        // Aguardar carregar
        audio.addEventListener('canplay', playAudio, { once: true })
        audio.addEventListener('loadeddata', playAudio, { once: true })
      }
    } catch (error) {
      console.error('Erro ao criar elemento de áudio:', error)
    }
  }

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    playSound,
  }
}

