import confetti from "canvas-confetti";

export function fireDoneConfetti() {
  try {
    // Quick, joyful double burst of celebratory confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"],
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
    });

    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10B981", "#6EE7B7", "#34D399"],
      });
      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10B981", "#6EE7B7", "#34D399"],
      });
    }, 120);
  } catch (err) {
    console.warn("Confetti error:", err);
  }
}
