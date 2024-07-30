export const speak = (text: string) => {
  const audio = new SpeechSynthesisUtterance(text);
  audio.rate = 0.6;
  window.speechSynthesis.speak(audio);
};
