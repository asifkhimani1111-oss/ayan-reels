
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const messages = document.getElementById("messages");
const language = document.getElementById("language");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language.value;
  speech.rate = 0.95;

  window.speechSynthesis.speak(speech);
}

function getReply(question) {
  const q = question.toLowerCase();
  const lang = language.value;

  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("નમસ્તે") ||
    q.includes("હેલો")
  ) {
    if (lang === "gu-IN") return "નમસ્તે! હું AA AI છું. કેમ છો?";
    if (lang === "hi-IN") return "नमस्ते! मैं AA AI हूँ। कैसे हैं?";
    return "Hello! I am AA AI. How are you?";
  }

  if (
    q.includes("તમારું નામ") ||
    q.includes("नाम") ||
    q.includes("your name")
  ) {
    if (lang === "gu-IN") return "મારું નામ AA AI છે.";
    if (lang === "hi-IN") return "मेरा नाम AA AI है।";
    return "My name is AA AI.";
  }

  if (
    q.includes("કેમ છો") ||
    q.includes("कैसे हो") ||
    q.includes("how are you")
  ) {
    if (lang === "gu-IN") return "હું મજામાં છું! તમે કેમ છો?";
    if (lang === "hi-IN") return "मैं अच्छा हूँ! आप कैसे हैं?";
    return "I am doing well! How are you?";
  }

  if (
    q.includes("સમય") ||
    q.includes("time")
  ) {
    const time = new Date().toLocaleTimeString();
    return lang === "gu-IN"
      ? "હાલનો સમય છે " + time
      : lang === "hi-IN"
      ? "अभी समय है " + time
      : "The current time is " + time;
  }

  if (
    q.includes("તારીખ") ||
    q.includes("date")
  ) {
    const date = new Date().toLocaleDateString();
    return lang === "gu-IN"
      ? "આજની તારીખ છે " + date
      : lang === "hi-IN"
      ? "आज की तारीख है " + date
      : "Today's date is " + date;
  }

  if (
    q.includes("બાય") ||
    q.includes("अलविदा") ||
    q.includes("bye")
  ) {
    if (lang === "gu-IN") return "આવજો! ફરી મળીએ.";
    if (lang === "hi-IN") return "अलविदा! फिर मिलेंगे।";
    return "Goodbye! See you again.";
  }

  if (lang === "gu-IN") {
    return "માફ કરજો! આ સવાલનો જવાબ મારી પાસે અત્યારે નથી. હું હજુ શીખી રહ્યો છું.";
  }

  if (lang === "hi-IN") {
    return "माफ कीजिए! मुझे अभी इस सवाल का जवाब नहीं पता।";
  }

  return "Sorry! I don't know the answer yet. I am still learning.";
}

function sendMessage() {
  const question = input.value.trim();

  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  const reply = getReply(question);

  addMessage(reply, "bot");
  speak(reply);
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", function() {
    recognition.lang = language.value;
    recognition.start();
    micBtn.textContent = "🎙️ સાંભળી રહ્યો છું...";
  });

  recognition.onresult = function(event) {
    input.value = event.results[0][0].transcript;
    micBtn.textContent = "🎙️ અવાજથી વાત કરો";
    sendMessage();
  };

  recognition.onerror = function() {
    micBtn.textContent = "🎙️ ફરી પ્રયાસ કરો";
  };

  recognition.onend = function() {
    micBtn.textContent = "🎙️ અવાજથી વાત કરો";
  };
} else {
  micBtn.addEventListener("click", function() {
    alert("આ બ્રાઉઝરમાં Voice Recognition ઉપલબ્ધ નથી.");
  });
}
