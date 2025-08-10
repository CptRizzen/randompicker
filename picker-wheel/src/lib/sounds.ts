'use client'

// Web Audio API sound generation utilities
let audioContext: AudioContext | null = null

// Initialize audio context (must be done after user interaction)
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Generate a spinning sound effect (like a ratchet or ticking)
export const playSpinSound = () => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Create a series of short clicks/ticks for spinning sound
    const tickCount = 50 // Number of ticks during spin
    const duration = 3000 // 3 seconds to match wheel animation
    const tickInterval = duration / tickCount

    for (let i = 0; i < tickCount; i++) {
      setTimeout(() => {
        // Create a short click sound
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        // Sharp click sound
        oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime)
        oscillator.type = 'square'
        
        // Quick fade in/out for click effect
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01)
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.05)
        
        // Gradually slow down the ticks (like a real wheel)
        const slowdown = 1 + (i / tickCount) * 2
      }, i * tickInterval * (1 + (i / tickCount) * 0.5)) // Slow down over time
    }
  } catch (error) {
    console.warn('Could not play spin sound:', error)
  }
}

// Generate a winner celebration sound
export const playWinnerSound = () => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Create a celebratory chord progression
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 (C major chord)
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
        oscillator.type = 'sine'
        
        // Fade in and out
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1)
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.6)
      }, index * 100) // Stagger the notes slightly
    })
  } catch (error) {
    console.warn('Could not play winner sound:', error)
  }
}

// Simple button click sound
export const playClickSound = () => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  } catch (error) {
    console.warn('Could not play click sound:', error)
  }
}
