import { Circle, Square, Wind, Star, Plus, Triangle } from "lucide-react";

export const BRUSHES = {
  round: { icon: Circle, label: "Round", wave: "sine", timbre: "smooth" },
  square: { icon: Square, label: "Square", wave: "square", timbre: "sharp" },
  spray: { icon: Wind, label: "Spray", wave: "triangle", timbre: "airy" },
  star: { icon: Star, label: "Star", wave: "sawtooth", timbre: "sparkling" },
  cross: { icon: Plus, label: "Cross", wave: "square", timbre: "percussive" },
  triangle: { icon: Triangle, label: "Triangle", wave: "triangle", timbre: "hollow" },
  sawtooth: { icon: Star, label: "Sawtooth", wave: "sawtooth", timbre: "bright" },
  calligraphy: { icon: Star, label: "Calligraphy", wave: "sine", timbre: "expressive" },
  marker: { icon: Square, label: "Marker", wave: "square", timbre: "bold" },
  pencil: { icon: Circle, label: "Pencil", wave: "sine", timbre: "subtle" }
};
