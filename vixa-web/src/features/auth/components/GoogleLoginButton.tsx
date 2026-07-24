import { useEffect, useRef } from 'react'
import { useLoginWithGoogle } from '../hooks/useLoginWithGoogle'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: unknown) => void
          renderButton: (parent: HTMLElement, options: unknown) => void
        }
      }
    }
  }
}

export function GoogleLoginButton({ onSuccess }: { onSuccess?: () => void }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const loginWithGoogle = useLoginWithGoogle()

  useEffect(() => {
    const scriptId = 'google-identity-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = renderButton
      document.body.appendChild(script)
    } else {
      renderButton()
    }

    function renderButton() {
      if (!window.google || !buttonRef.current) return

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          loginWithGoogle.mutate(response.credential, { onSuccess })
        },
      })

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={buttonRef} />
}