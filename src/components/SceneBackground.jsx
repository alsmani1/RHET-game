import { motion, AnimatePresence } from 'framer-motion'

// Import all scene images
import scene1Img from '../assets/scene_1.png'
import scene2Img from '../assets/scene_2.png'
import scene3Img from '../assets/scene_3.png'
import scene4Img from '../assets/scene_4.png'
import scene5Img from '../assets/scene_5.png'
import scene6Img from '../assets/scene_6.png'
import scene7Img from '../assets/scene_7.png'
import scene8Img from '../assets/scene_8.png'
import scene9Img from '../assets/scene_9.png'
import scene10Img from '../assets/scene_10.png'

/** Scene image map — all scenes now have images */
const SCENE_IMAGES = {
  s1: scene1Img,
  s2: scene2Img,
  s3: scene3Img,
  s4: scene4Img,
  s5: scene5Img,
  s6: scene6Img,
  s7: scene7Img,
  s8: scene8Img,
  s9: scene9Img,
  s10: scene10Img,
}



/** Mood-based color overlays that tint the scene */
const MOOD_OVERLAYS = {
  tense: 'rgba(180, 40, 40, 0.08)',
  warm: 'rgba(200, 130, 40, 0.1)',
  cold: 'rgba(40, 80, 180, 0.08)',
  hopeful: 'rgba(80, 180, 60, 0.06)',
  urgent: 'rgba(200, 40, 80, 0.1)',
  solemn: 'rgba(60, 60, 120, 0.08)',
  reflective: 'rgba(180, 150, 50, 0.06)',
  neutral: 'transparent',
}

/**
 * Full-viewport scene background with images for all scenes.
 * @param {{ sceneId: string, mood: string, stress: number }} props
 */
export default function SceneBackground({ sceneId, mood = 'neutral', stress = 50 }) {
  const imgSrc = SCENE_IMAGES[sceneId]
  const moodColor = MOOD_OVERLAYS[mood] || MOOD_OVERLAYS.neutral

  // Stress affects the darkness of the overlay
  const stressOverlayOpacity = 0.15 + (stress / 100) * 0.25

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneId}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Image layer */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imgSrc})`,
            }}
          />



          {/* Dark gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(10, 12, 20, ${0.25 + stressOverlayOpacity * 0.2}) 0%,
                rgba(10, 12, 20, ${0.1 + stressOverlayOpacity * 0.1}) 25%,
                rgba(10, 12, 20, ${0.3 + stressOverlayOpacity * 0.3}) 60%,
                rgba(10, 12, 20, ${0.85 + stressOverlayOpacity * 0.1}) 100%
              )`,
            }}
          />

          {/* Mood color tint */}
          <div className="absolute inset-0" style={{ backgroundColor: moodColor }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
