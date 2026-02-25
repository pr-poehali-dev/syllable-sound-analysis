import { useState, useEffect } from "react";

const VOWELS = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];

function isVowel(ch: string) {
  return VOWELS.includes(ch.toLowerCase());
}

function splitWord(word: string): string[] {
  const letters = word.toLowerCase().split("");
  const syllables: string[] = [];
  let current = "";

  for (let i = 0; i < letters.length; i++) {
    current += letters[i];
    if (isVowel(letters[i])) {
      const next = letters[i + 1];
      const afterNext = letters[i + 2];
      if (next && !isVowel(next) && afterNext && isVowel(afterNext)) {
        syllables.push(current);
        current = "";
      } else if (!next || isVowel(next)) {
        syllables.push(current);
        current = "";
      }
    }
  }
  if (current) {
    if (syllables.length > 0) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }
  return syllables;
}

const THEORY_CARDS = [
  {
    emoji: "💨",
    title: "Что такое слог?",
    color: "from-orange-400 to-pink-400",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "Слог — это звуки, которые произносятся одним толчком воздуха. В основе каждого слога — гласный звук.",
    example: "РЕП-КА",
  },
  {
    emoji: "🔴",
    title: "Гласные = слоги",
    color: "from-red-400 to-orange-400",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "Сколько гласных в слове — столько и слогов! Гласные: А, Е, Ё, И, О, У, Ы, Э, Ю, Я",
    example: "А-ПЕЛ-ЬСИН",
  },
  {
    emoji: "🟢",
    title: "Открытый слог",
    color: "from-green-400 to-teal-400",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "Слог заканчивается на гласный — открытый слог. Например: КО-РО-ВА — все слоги открытые!",
    example: "КО-РО-ВА",
  },
  {
    emoji: "🔵",
    title: "Закрытый слог",
    color: "from-blue-400 to-indigo-400",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "Слог заканчивается на согласный — закрытый слог. Например: НОЧЬ-НИК — оба слога закрытые!",
    example: "НОЧЬ-НИК",
  },
];

const METHODS = [
  {
    num: "1",
    icon: "👏",
    title: "Хлопки",
    desc: "Хлопай в ладоши на каждый слог!",
    color: "bg-yellow-400",
    words: ["РЕП-КА", "МАН-ДА-РИН", "ЛЁД"],
  },
  {
    num: "2",
    icon: "🤲",
    title: "Подбородок",
    desc: "Приложи ладонь к подбородку — сколько раз опустится, столько слогов!",
    color: "bg-pink-400",
    words: ["РЕП-КА", "МАН-ДА-РИН", "ЛЁД"],
  },
  {
    num: "3",
    icon: "🔍",
    title: "Гласные",
    desc: "Найди все гласные в слове — это и есть количество слогов!",
    color: "bg-purple-400",
    words: ["РЕП-КА", "МАН-ДА-РИН", "ЛЁД"],
  },
];

const QUIZ_WORDS = [
  { word: "КОШКА", answer: 2 },
  { word: "МОЛОКО", answer: 3 },
  { word: "ДОМ", answer: 1 },
  { word: "РАДУГА", answer: 3 },
  { word: "СОН", answer: 1 },
  { word: "ЯБЛОКО", answer: 3 },
  { word: "РЫБА", answer: 2 },
  { word: "МАШИНА", answer: 3 },
];

const SPLIT_WORDS = ["ЗИМА", "РЕБЯТА", "ШКОЛА", "ОБЛАКО", "ПЧЕЛА", "КАПУСТА"];

const CLAP_WORDS = [
  { word: "РЕПКА", syllables: 2 },
  { word: "МАНДАРИН", syllables: 3 },
  { word: "ЛЁД", syllables: 1 },
  { word: "БАБОЧКА", syllables: 3 },
  { word: "КОТ", syllables: 1 },
];

function CloudBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-10 left-10 text-8xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>☁️</div>
      <div className="absolute top-32 right-16 text-6xl opacity-15 animate-float" style={{ animationDelay: "1s" }}>☁️</div>
      <div className="absolute top-64 left-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>⭐</div>
      <div className="absolute bottom-40 right-10 text-7xl opacity-15 animate-float" style={{ animationDelay: "0.5s" }}>☁️</div>
      <div className="absolute bottom-20 left-20 text-4xl opacity-20 animate-float" style={{ animationDelay: "1.5s" }}>🌟</div>
      <div className="absolute top-1/2 right-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: "2.5s" }}>✨</div>
    </div>
  );
}

function SyllableWord({ word }: { word: string }) {
  const parts = word.split("-");
  return (
    <span className="inline-flex gap-0.5 items-center flex-wrap">
      {parts.map((part, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-caveat text-xl font-bold">
            {part.split("").map((ch, j) => (
              <span key={j} className={isVowel(ch) ? "text-red-500" : "text-slate-700"}>
                {ch}
              </span>
            ))}
          </span>
          {i < parts.length - 1 && (
            <span className="text-slate-400 font-bold mx-0.5">-</span>
          )}
        </span>
      ))}
    </span>
  );
}

function QuizGame() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const [shuffled] = useState(() =>
    QUIZ_WORDS.map(q => {
      const base = [q.answer];
      const extras = [1, 2, 3, 4].filter(n => n !== q.answer);
      const all = [...base, ...extras].slice(0, 4);
      return all.sort(() => Math.random() - 0.5);
    })
  );

  const current = QUIZ_WORDS[idx];

  function handleAnswer(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === current.answer) {
      setScore(s => s + 1);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 600);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => {
      if (idx + 1 >= QUIZ_WORDS.length) {
        setDone(true);
      } else {
        setIdx(i => i + 1);
        setSelected(null);
      }
    }, 900);
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="text-center py-8 animate-bounce-in">
        <div className="text-6xl mb-4">{score >= 6 ? "🏆" : score >= 4 ? "⭐" : "💪"}</div>
        <div className="font-nunito text-3xl font-black text-slate-800 mb-2">{score} из {QUIZ_WORDS.length}</div>
        <div className="font-nunito text-lg text-slate-600 mb-6">
          {score >= 6 ? "Отлично! Ты настоящий знаток слогов!" : score >= 4 ? "Хорошо! Ещё немного практики!" : "Не сдавайся! Попробуй ещё раз!"}
        </div>
        <button onClick={restart} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-nunito font-bold text-lg px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95">
          Играть снова 🎮
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="font-nunito text-slate-500 font-semibold">Вопрос {idx + 1}/{QUIZ_WORDS.length}</span>
        <span className="font-nunito font-black text-purple-600 text-lg">⭐ {score}</span>
      </div>
      <div className={`text-center mb-8 transition-all ${celebrate ? "animate-pop" : ""} ${shake ? "animate-wiggle" : ""}`}>
        <div className="font-caveat text-5xl font-bold text-slate-800 mb-2">{current.word}</div>
        <div className="font-nunito text-slate-500">Сколько слогов в этом слове?</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shuffled[idx].map(n => {
          let cls = "border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50";
          if (selected === n) {
            cls = n === current.answer ? "border-2 border-green-400 bg-green-100" : "border-2 border-red-400 bg-red-100";
          } else if (selected !== null && n === current.answer) {
            cls = "border-2 border-green-400 bg-green-100";
          }
          return (
            <button key={n} onClick={() => handleAnswer(n)}
              className={`${cls} rounded-2xl py-4 font-nunito font-black text-3xl text-slate-700 transition-all hover:scale-105 active:scale-95 shadow-sm`}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SplitGame() {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  const word = SPLIT_WORDS[idx];
  const correct = splitWord(word).join("-").toUpperCase();

  function check() {
    const norm = input.trim().toUpperCase();
    if (norm === correct) {
      setResult("correct");
      setScore(s => s + 1);
    } else {
      setResult("wrong");
    }
  }

  function next() {
    setIdx(i => (i + 1) % SPLIT_WORDS.length);
    setInput("");
    setResult(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="font-nunito text-slate-500 font-semibold">Слово {idx + 1}/{SPLIT_WORDS.length}</span>
        <span className="font-nunito font-black text-orange-600 text-lg">⭐ {score}</span>
      </div>
      <div className="text-center mb-6">
        <div className="font-caveat text-5xl font-bold text-slate-800 mb-2">{word}</div>
        <div className="font-nunito text-slate-500 text-sm">Раздели на слоги через дефис, например: КОШ-КА</div>
      </div>
      <input
        value={input}
        onChange={e => { setInput(e.target.value.toUpperCase()); setResult(null); }}
        onKeyDown={e => e.key === "Enter" && !result && check()}
        placeholder="Напиши слоги..."
        className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 font-caveat text-2xl text-center focus:outline-none focus:border-orange-400 mb-4"
      />
      {!result ? (
        <button onClick={check} className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-nunito font-bold text-lg py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95">
          Проверить ✅
        </button>
      ) : (
        <div className={`rounded-2xl p-4 mb-4 text-center animate-bounce-in ${result === "correct" ? "bg-green-100 border-2 border-green-400" : "bg-red-100 border-2 border-red-400"}`}>
          {result === "correct" ? (
            <div className="font-nunito font-black text-green-700 text-xl">🎉 Правильно! Молодец!</div>
          ) : (
            <div>
              <div className="font-nunito font-black text-red-700 text-lg mb-1">Не совсем… попробуй ещё!</div>
              <div className="font-nunito text-slate-600">Правильно: <SyllableWord word={correct} /></div>
            </div>
          )}
          <button onClick={next} className="mt-3 bg-white border-2 border-slate-300 text-slate-700 font-nunito font-bold px-6 py-2 rounded-xl hover:scale-105 transition-transform">
            Следующее →
          </button>
        </div>
      )}
    </div>
  );
}

function ClapGame() {
  const [wordIdx, setWordIdx] = useState(0);
  const [claps, setClaps] = useState(0);
  const [phase, setPhase] = useState<"idle" | "clapping" | "done">("idle");

  const current = CLAP_WORDS[wordIdx];

  function startClap() {
    setClaps(0);
    setPhase("clapping");
  }

  function doClap() {
    setClaps(c => c + 1);
  }

  function finish() {
    setPhase("done");
  }

  function nextWord() {
    setWordIdx(i => (i + 1) % CLAP_WORDS.length);
    setClaps(0);
    setPhase("idle");
  }

  const correct = claps === current.syllables;

  return (
    <div className="text-center">
      <div className="font-caveat text-5xl font-bold text-slate-800 mb-2 mt-2">{current.word}</div>
      <div className="font-nunito text-slate-500 mb-6 text-sm">
        В слове {current.syllables} {current.syllables === 1 ? "слог" : current.syllables < 5 ? "слога" : "слогов"}
      </div>

      {phase === "idle" && (
        <button onClick={startClap} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-nunito font-black text-xl px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95 mb-4">
          Начать хлопать! 👏
        </button>
      )}

      {phase === "clapping" && (
        <div>
          <button
            onClick={doClap}
            className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-xl font-nunito font-black text-5xl hover:scale-110 transition-transform active:scale-90 mb-4 mx-auto flex items-center justify-center"
          >
            👏
          </button>
          <div className="font-nunito font-black text-4xl text-orange-500 mb-2">{claps}</div>
          <div className="font-nunito text-slate-500 text-sm mb-4">хлопков</div>
          <button onClick={finish} className="bg-green-500 text-white font-nunito font-bold px-6 py-2 rounded-xl hover:scale-105 transition-transform">
            Готово ✓
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className={`rounded-2xl p-5 mb-4 animate-bounce-in ${correct ? "bg-green-100 border-2 border-green-400" : "bg-orange-100 border-2 border-orange-400"}`}>
          <div className="font-nunito font-black text-2xl mb-1">
            {correct ? "🎉 Отлично!" : `Ты хлопнул ${claps} раз`}
          </div>
          <div className="font-nunito text-slate-600">
            Правильно: <strong>{current.syllables}</strong> {current.syllables === 1 ? "хлопок" : current.syllables < 5 ? "хлопка" : "хлопков"}
          </div>
          <button onClick={nextWord} className="mt-3 bg-white border-2 border-slate-300 text-slate-700 font-nunito font-bold px-6 py-2 rounded-xl hover:scale-105 transition-transform">
            Следующее →
          </button>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<"theory" | "methods" | "games">("theory");
  const [activeGame, setActiveGame] = useState<"quiz" | "split" | "clap">("quiz");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen font-nunito relative" style={{ background: "linear-gradient(135deg, #fef9c3 0%, #fce7f3 40%, #dbeafe 100%)" }}>
      <CloudBg />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pb-16">

        {/* Header */}
        <div className={`text-center pt-10 pb-8 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
          <div className="text-6xl mb-3 animate-float">📚</div>
          <h1 className="font-caveat text-5xl font-bold text-slate-800 mb-2 leading-tight">
            СловоЗнайка
          </h1>
          <p className="font-nunito text-lg text-slate-600 font-semibold">Учим слоги — весело и легко!</p>
        </div>

        {/* Nav */}
        <div className={`flex gap-2 justify-center mb-8 flex-wrap ${mounted ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
          {[
            { key: "theory", label: "📖 Теория", color: "from-orange-400 to-pink-400" },
            { key: "methods", label: "✋ Способы", color: "from-green-400 to-teal-400" },
            { key: "games", label: "🎮 Игры", color: "from-purple-400 to-blue-400" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as "theory" | "methods" | "games")}
              className={`font-nunito font-black text-sm px-5 py-2.5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md ${
                activeSection === tab.key
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                  : "bg-white text-slate-600 border-2 border-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Theory */}
        {activeSection === "theory" && (
          <div className="animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-6 mb-4 shadow-xl border-2 border-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl animate-float">💨</div>
                <div>
                  <h2 className="font-caveat text-3xl font-bold text-slate-800">Что такое слог?</h2>
                  <p className="font-nunito text-slate-600 text-sm mt-1">Звуки, произносимые одним толчком воздуха</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 mb-4 border border-orange-100">
                <p className="font-nunito text-slate-700 leading-relaxed">
                  В основе каждого слога — <span className="text-red-500 font-black">гласный звук</span>. Гласные мы обозначаем красным цветом.
                  Сколько гласных — столько и слогов!
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["А", "Е", "Ё", "И", "О", "У", "Ы", "Э", "Ю", "Я"].map(v => (
                  <span key={v} className="w-9 h-9 bg-red-500 text-white font-caveat font-bold text-xl rounded-xl flex items-center justify-center shadow-md">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {THEORY_CARDS.map((card, i) => (
              <div
                key={i}
                className={`${card.bg} rounded-3xl p-5 mb-4 border-2 ${card.border} shadow-lg animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{card.emoji}</div>
                  <h3 className="font-caveat text-2xl font-bold text-slate-800">{card.title}</h3>
                </div>
                <p className="font-nunito text-slate-700 text-sm leading-relaxed mb-3">{card.text}</p>
                <div className={`bg-gradient-to-r ${card.color} rounded-2xl px-4 py-3 inline-block shadow-md`}>
                  <SyllableWord word={card.example} />
                </div>
              </div>
            ))}

            <div className="bg-white/80 backdrop-blur rounded-3xl p-5 shadow-xl border-2 border-white mt-4">
              <h3 className="font-caveat text-2xl font-bold text-slate-800 mb-3">📝 Примеры слов</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { word: "У-РОК", n: 2 },
                  { word: "А-ПЕЛ-ЬСИН", n: 3 },
                  { word: "ВО-СТОРГ", n: 2 },
                  { word: "У-ЧИТ", n: 2 },
                  { word: "ЛЁД", n: 1 },
                  { word: "МАН-ДА-РИН", n: 3 },
                ].map(({ word, n }) => (
                  <div key={word} className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 flex items-center justify-between">
                    <SyllableWord word={word} />
                    <span className="font-nunito font-black text-slate-400 text-sm">{n} сл.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Methods */}
        {activeSection === "methods" && (
          <div className="animate-fade-in">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-5 mb-4 shadow-xl border-2 border-white">
              <h2 className="font-caveat text-3xl font-bold text-slate-800 mb-2">3 способа делить слоги</h2>
              <p className="font-nunito text-slate-600 text-sm">Выбери удобный для себя!</p>
            </div>

            {METHODS.map((m, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur rounded-3xl p-5 mb-4 shadow-xl border-2 border-white animate-fade-in"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`${m.color} text-white font-nunito font-black text-2xl w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0`}>
                    {m.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{m.icon}</span>
                      <h3 className="font-caveat text-2xl font-bold text-slate-800">{m.title}</h3>
                    </div>
                    <p className="font-nunito text-slate-600 text-sm leading-relaxed mb-3">{m.desc}</p>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <p className="font-nunito text-xs text-slate-400 mb-2 font-semibold">ПОПРОБУЕМ:</p>
                      <div className="flex flex-wrap gap-2">
                        {m.words.map(w => (
                          <span key={w} className={`${m.color} text-white font-caveat font-bold px-3 py-1.5 rounded-xl text-lg shadow-sm`}>
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-5 shadow-xl text-white">
              <h3 className="font-caveat text-2xl font-bold mb-2">💡 Главное правило</h3>
              <p className="font-nunito text-sm leading-relaxed opacity-90">
                Все три способа дадут одинаковый результат. Выбери тот, который нравится тебе больше всего!
              </p>
            </div>
          </div>
        )}

        {/* Games */}
        {activeSection === "games" && (
          <div className="animate-fade-in">
            <div className="flex gap-2 justify-center mb-6 flex-wrap">
              {[
                { key: "quiz", label: "🔢 Счёт", color: "from-purple-500 to-blue-500" },
                { key: "split", label: "✂️ Раздели", color: "from-orange-400 to-pink-400" },
                { key: "clap", label: "👏 Хлопки", color: "from-yellow-400 to-orange-400" },
              ].map(g => (
                <button
                  key={g.key}
                  onClick={() => setActiveGame(g.key as "quiz" | "split" | "clap")}
                  className={`font-nunito font-black text-sm px-4 py-2.5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md ${
                    activeGame === g.key
                      ? `bg-gradient-to-r ${g.color} text-white shadow-lg scale-105`
                      : "bg-white text-slate-600 border-2 border-slate-100"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-2 border-white">
              {activeGame === "quiz" && (
                <div>
                  <h2 className="font-caveat text-3xl font-bold text-slate-800 mb-1">Сколько слогов?</h2>
                  <p className="font-nunito text-slate-500 text-sm mb-5">Выбери правильный ответ</p>
                  <QuizGame />
                </div>
              )}
              {activeGame === "split" && (
                <div>
                  <h2 className="font-caveat text-3xl font-bold text-slate-800 mb-1">Раздели слово</h2>
                  <p className="font-nunito text-slate-500 text-sm mb-5">Напиши слово, разделив его на слоги через дефис</p>
                  <SplitGame />
                </div>
              )}
              {activeGame === "clap" && (
                <div>
                  <h2 className="font-caveat text-3xl font-bold text-slate-800 mb-1">Хлопалка!</h2>
                  <p className="font-nunito text-slate-500 text-sm mb-5">Нажимай на кнопку на каждый слог в слове</p>
                  <ClapGame />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 font-nunito text-slate-400 text-sm">
          <span className="text-2xl">🚀</span> СловоЗнайка — учимся и растём!
        </div>
      </div>
    </div>
  );
}
