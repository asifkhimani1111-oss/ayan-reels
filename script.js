
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
  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language.value;
  speech.rate = 0.95;

  speechSynthesis.speak(speech);
}

// Safe basic maths calculator
function calculate(expression) {
  let s = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/,/g, ".")
    .replace(/[?=]/g, "")
    .trim();

  if (!/^[0-9+\-*/().\s]+$/.test(s)) return null;

  const tokens = s.match(/\d*\.?\d+|[()+\-*/]/g);
  if (!tokens || tokens.join("") !== s.replace(/\s/g, "")) {
    return null;
  }

  let pos = 0;

  function factor() {
    if (tokens[pos] === "+") {
      pos++;
      return factor();
    }

    if (tokens[pos] === "-") {
      pos++;
      return -factor();
    }

    if (tokens[pos] === "(") {
      pos++;
      const value = add();
      if (tokens[pos] !== ")") throw Error("Invalid");
      pos++;
      return value;
    }

    const value = Number(tokens[pos++]);
    if (!Number.isFinite(value)) throw Error("Invalid");
    return value;
  }

  function multiply() {
    let value = factor();

    while (tokens[pos] === "*" || tokens[pos] === "/") {
      const operator = tokens[pos++];
      const next = factor();

      if (operator === "/" && next === 0) {
        throw Error("Divide by zero");
      }

      value = operator === "*" ? value * next : value / next;
    }

    return value;
  }

  function add() {
    let value = multiply();

    while (tokens[pos] === "+" || tokens[pos] === "-") {
      const operator = tokens[pos++];
      const next = multiply();
      value = operator === "+" ? value + next : value - next;
    }

    return value;
  }

  try {
    const result = add();
    if (pos !== tokens.length || !Number.isFinite(result)) return null;
    return Number(result.toFixed(8)).toString();
  } catch {
    return null;
  }
}

function getReply(question) {
  const q = question.toLowerCase().trim();
  const lang = language.value;

  const replies = {
    greeting: [
      "નમસ્તે! હું AA છું. આજે તમને શું જાણવું છે?",
      "નમસ્તે! ચાલો વાત કરીએ. 😊"
    ],
    name: "મારું નામ AA AI છે. હું તમારો ડિજિટલ સહાયક છું.",
    creator: "મને AA AI તરીકે બનાવવામાં આવ્યો છે.",
    thanks: "તમારું સ્વાગત છે! 😊",
    how: "હું મજામાં છું! તમે કેમ છો?",
    india: "ભારતની રાજધાની નવી દિલ્હી છે.",
    gujarat: "ગુજરાતની રાજધાની ગાંધીનગર છે.",
    ahmedabad: "અમદાવાદ ગુજરાતનું એક મોટું શહેર છે.",
    earth: "પૃથ્વી સૂર્યમંડળનો એક ગ્રહ છે.",
    sun: "સૂર્ય આપણને પ્રકાશ અને ગરમી આપે છે.",
    water: "પાણીનું રાસાયણિક સૂત્ર H2O છે.",
    computer: "કમ્પ્યુટર માહિતી પ્રોસેસ કરતું ઇલેક્ટ્રોનિક ઉપકરણ છે.",
    internet: "ઇન્ટરનેટ દુનિયાભરના કમ્પ્યુટરોને જોડતું નેટવર્ક છે.",
    bye: "આવજો! ફરી મળીએ. 😊"
  };

  const hindi = {
    greeting: "नमस्ते! मैं AA हूँ। आज आप क्या जानना चाहते हैं?",
    name: "मेरा नाम AA AI है। मैं आपका डिजिटल सहायक हूँ।",
    creator: "मुझे AA AI के रूप में बनाया गया है।",
    thanks: "आपका स्वागत है! 😊",
    how: "मैं अच्छा हूँ! आप कैसे हैं?",
    india: "भारत की राजधानी नई दिल्ली है।",
    gujarat: "गुजरात की राजधानी गांधीनगर है।",
    ahmedabad: "अहमदाबाद गुजरात का एक बड़ा शहर है।",
    earth: "पृथ्वी सौरमंडल का एक ग्रह है।",
    sun: "सूरज हमें रोशनी और गर्मी देता है।",
    water: "पानी का रासायनिक सूत्र H2O है।",
    computer: "कंप्यूटर एक इलेक्ट्रॉनिक उपकरण है।",
    internet: "इंटरनेट दुनिया भर के कंप्यूटरों का नेटवर्क है।",
    bye: "अलविदा! फिर मिलेंगे। 😊"
  };

  const english = {
    greeting: "Hello! I am AA. What would you like to know today?",
    name: "My name is AA AI. I am your digital assistant.",
    creator: "I was created as AA AI.",
    thanks: "You're welcome! 😊",
    how: "I am doing well! How are you?",
    india: "The capital of India is New Delhi.",
    gujarat: "The capital of Gujarat is Gandhinagar.",
    ahmedabad: "Ahmedabad is a major city in Gujarat, India.",
    earth: "Earth is a planet in our solar system.",
    sun: "The Sun gives us light and heat.",
    water: "The chemical formula of water is H2O.",
    computer: "A computer is an electronic device that processes information.",
    internet: "The internet is a worldwide network of connected computers.",
    bye: "Goodbye! See you again. 😊"
  };

  const data = lang === "gu-IN" ? replies :
               lang === "hi-IN" ? hindi : english;

  const has = (...words) => words.some(w => q.includes(w));

  if (has("hello", "hi", "હેલો", "નમસ્તે", "હાય", "નમસ્કાર", "नमस्ते", "हेलो", "नमस्कार")) {
    return data.greeting;
  }

  if (has("તમારું નામ", "તારું નામ", "તમારુ નામ", "नाम क्या", "आपका नाम", "your name", "who are you")) {
    return data.name;
  }

  if (has("કોણે બનાવ્યો", "કોણે બનાવ્યું", "કિસने बनाया", "who made you")) {
    return data.creator;
  }

  if (has("આભાર", "ધન્યવાદ", "शुक्रिया", "धन्यवाद", "thank you", "thanks")) {
    return data.thanks;
  }

  if (has("કેમ છો", "કેમ છે", "कैसे हो", "कैसे हैं", "how are you")) {
    return data.how;
  }

  if (has("ભારતની રાજધાની", "भारत की राजधानी", "capital of india")) {
    return data.india;
  }

  if (has("ગુજરાતની રાજધાની", "गुजरात की राजधानी", "capital of gujarat")) {
    return data.gujarat;
  }

  if (has("અમદાવાદ", "अहमदाबाद", "ahmedabad")) {
    return data.ahmedabad;
  }

  if (has("પૃથ્વી", "धरती", "पृथ्वी", "earth")) {
    return data.earth;
  }

  if (has("સૂર્ય", "सूरज", "sun")) {
    return data.sun;
  }

  if (has("પાણીનું સૂત્ર", "पानी का सूत्र", "formula of water")) {
    return data.water;
  }

  if (has("કમ્પ્યુટર શું", "कंप्यूटर क्या", "what is computer")) {
    return data.computer;
  }

  if (has("ઇન્ટરનેટ શું", "इंटरनेट क्या", "what is internet")) {
    return data.internet;
  }

  if (has("સમય", "टाइम", "समय", "time")) {
    const t = new Date().toLocaleTimeString();
    if (lang === "gu-IN") return "હાલનો સમય " + t + " છે.";
    if (lang === "hi-IN") return "अभी समय " + t + " है।";
    return "The current time is " + t;
  }

  if (has("તારીખ", "आज की तारीख", "date", "today")) {
    const d = new Date().toLocaleDateString();
    if (lang === "gu-IN") return "આજની તારીખ " + d + " છે.";
    if (lang === "hi-IN") return "आज की तारीख " + d + " है।";
    return "Today's date is " + d;
  }

  if (has("બાય", "આવજો", "अलविदा", "bye", "goodbye")) {
    return data.bye;
  }

  // Arithmetic examples: 25 + 10, 100 / 4
  const mathText = q.replace(/(જવાબ|ગણો|કેટલા|કેટલું|calculate|solve|what is|કેટલું થાય|कितना होगा)/g, "");
  const result = calculate(mathText);

  if (result !== null) {
    if (lang === "gu-IN") return "જવાબ છે: " + result;
    if (lang === "hi-IN") return "जवाब है: " + result;
    return "The answer is: " + result;
  }

  if (lang === "gu-IN") {
    return "આ સવાલ માટે મારી પાસે હજી ચોક્કસ જવાબ નથી. તમે સવાલ બીજા શબ્દોમાં પૂછશો? હું મદદ કરવાનો પ્રયત્ન કરીશ.";
  }

  if (lang === "hi-IN") {
    return "इस सवाल का सही जवाब अभी मेरे पास नहीं है। आप इसे दूसरे शब्दों में पूछ सकते हैं।";
  }

  return "I don't have a reliable answer to that yet. Could you ask it another way?";
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

input.addEventListener("keydown", event => {
  if (event.key === "Enter") sendMessage();
});

// Free browser voice recognition where supported
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", () => {
    recognition.lang = language.value;
    micBtn.textContent = "🎙️ સાંભળી રહ્યો છું...";
    try {
      recognition.start();
    } catch (error) {
      micBtn.textContent = "🎙️ ફરી પ્રયાસ કરો";
    }
  });

  recognition.onresult = event => {
    input.value = event.results[0][0].transcript;
    sendMessage();
  };

  recognition.onerror = () => {
    micBtn.textContent = "🎙️ અવાજથી વાત કરો";
  };

  recognition.onend = () => {
    micBtn.textContent = "🎙️ અવાજથી વાત કરો";
  };
} else {
  micBtn.addEventListener("click", () => {
    alert("આ બ્રાઉઝરમાં અવાજ ઓળખવાની સુવિધા ઉપલબ્ધ નથી. લખીને વાત કરો.");
  });
}
