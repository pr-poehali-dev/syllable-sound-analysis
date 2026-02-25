import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const VOWELS = ["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"];
function isVowel(ch: string) {
  return VOWELS.includes(ch.toLowerCase());
}

const SOFT_CONSONANTS: Record<string, boolean> = {
  "ч": true, "щ": true, "й": true, "ь": true,
};
function isSoft(ch: string) {
  return SOFT_CONSONANTS[ch.toLowerCase()] ?? false;
}

function ColorLetter({ ch }: { ch: string }) {
  const c = ch.toLowerCase();
  if (isVowel(c)) return <span className="text-red-500 font-black">{ch}</span>;
  if (isSoft(c)) return <span className="text-green-600 font-black">{ch}</span>;
  return <span className="text-blue-600 font-black">{ch}</span>;
}

function ColorWord({ word }: { word: string }) {
  return (
    <span>
      {word.split("").map((ch, i) =>
        ch === "-" ? <span key={i} className="text-slate-300 mx-0.5 font-bold">-</span>
          : ch === " " ? <span key={i}>&nbsp;</span>
          : <ColorLetter key={i} ch={ch} />
      )}
    </span>
  );
}

type Slide = {
  id: number;
  icon: string;
  bg: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
};

function WordCard({ word, label, big }: { word: string; label?: string; big?: boolean }) {
  const parts = word.split("-");
  const hasHyphen = parts.length > 1;
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className={`bg-white/90 rounded-2xl px-5 py-3 shadow-md border-2 border-white/80 ${big ? "text-4xl" : "text-2xl"} font-caveat font-bold`}>
        {hasHyphen ? (
          <span>
            {parts.map((p, i) => (
              <span key={i}>
                {p.split("").map((ch, j) => <ColorLetter key={j} ch={ch} />)}
                {i < parts.length - 1 && <span className="text-slate-300 mx-1">-</span>}
              </span>
            ))}
          </span>
        ) : (
          word.split("").map((ch, i) => <ColorLetter key={i} ch={ch} />)
        )}
      </div>
      {label && <span className="font-nunito text-xs font-bold text-white/80 uppercase tracking-wider">{label}</span>}
    </div>
  );
}

function SlideWrapper({ children, bg, animate }: { children: React.ReactNode; bg: string; animate: boolean }) {
  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl ${bg} transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transition: "opacity 0.4s ease, transform 0.4s ease" }}>
      {children}
    </div>
  );
}

const DEMO_WORDS_CLAP = [
  { word: "РЕП-КА", syllables: 2 },
  { word: "МАН-ДА-РИН", syllables: 3 },
  { word: "ЛЁД", syllables: 1 },
];

function ClapDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [clapped, setClapped] = useState<number[]>([]);

  function handleClap(i: number) {
    setActive(i);
    setClapped(prev => prev.includes(i) ? prev : [...prev, i]);
    setTimeout(() => setActive(null), 400);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
      {DEMO_WORDS_CLAP.map((w, i) => (
        <button key={i} onClick={() => handleClap(i)}
          className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all active:scale-90 hover:scale-105 shadow-md
            ${active === i ? "bg-yellow-300 border-yellow-400 scale-110" : clapped.includes(i) ? "bg-green-100 border-green-400" : "bg-white border-white/60"}
          `}>
          <span className="text-3xl">{active === i ? "👏" : clapped.includes(i) ? "✅" : "👋"}</span>
          <span className="font-caveat text-2xl font-bold">
            {w.word.split("").map((ch, j) =>
              ch === "-" ? <span key={j} className="text-slate-300 mx-0.5">-</span> : <ColorLetter key={j} ch={ch} />
            )}
          </span>
          <span className="font-nunito text-sm font-bold text-slate-500">{w.syllables} {w.syllables === 1 ? "хлопок" : "хлопка"}</span>
        </button>
      ))}
    </div>
  );
}

function VowelDemo() {
  const [found, setFound] = useState<Record<string, number[]>>({ "РЕПКА": [], "МАНДАРИН": [], "ЛЁД": [] });
  const words = ["РЕПКА", "МАНДАРИН", "ЛЁД"];

  function toggleLetter(word: string, idx: number) {
    const ch = word[idx].toLowerCase();
    if (!isVowel(ch)) return;
    setFound(prev => {
      const arr = prev[word];
      const next = arr.includes(idx) ? arr.filter(i => i !== idx) : [...arr, idx];
      return { ...prev, [word]: next };
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
      {words.map(word => {
        const vowelCount = word.split("").filter(ch => isVowel(ch)).length;
        const foundCount = found[word].length;
        const complete = foundCount === vowelCount;
        return (
          <div key={word} className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 transition-all shadow-md
            ${complete ? "bg-green-100 border-green-400" : "bg-white border-white/60"}`}>
            <div className="flex gap-1 font-caveat text-2xl font-bold">
              {word.split("").map((ch, i) => (
                <button key={i} onClick={() => toggleLetter(word, i)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                    ${isVowel(ch.toLowerCase())
                      ? found[word].includes(i) ? "bg-red-400 text-white scale-110 shadow" : "bg-red-100 text-red-500 hover:bg-red-200"
                      : "text-slate-600 cursor-default"
                    }`}>
                  {ch}
                </button>
              ))}
            </div>
            {complete
              ? <span className="font-nunito text-sm font-black text-green-700">✅ {vowelCount} гласных = {vowelCount} слога</span>
              : <span className="font-nunito text-xs text-slate-500">Нажми на гласные</span>
            }
          </div>
        );
      })}
    </div>
  );
}

function PresentationPage() {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(true);

  function goTo(n: number) {
    setAnim(false);
    setTimeout(() => {
      setSlide(n);
      setAnim(true);
    }, 150);
  }

  const SLIDES: Slide[] = [
    {
      id: 0,
      icon: "📚",
      bg: "bg-gradient-to-br from-violet-500 to-indigo-600",
      title: "Слоги",
      subtitle: "Русский язык • 1 класс",
      content: (
        <div className="text-center py-6">
          <div className="text-8xl mb-6 drop-shadow-lg">📚</div>
          <h1 className="font-caveat text-5xl sm:text-6xl font-bold text-white mb-3 drop-shadow">Слоги</h1>
          <p className="font-nunito text-white/80 text-xl font-semibold mb-8">Русский язык • 1 класс</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["Что такое слог?", "Гласные = слоги", "Открытые и закрытые", "3 способа"].map((t, i) => (
              <span key={i} className="bg-white/20 text-white font-nunito font-bold text-sm px-4 py-2 rounded-full border border-white/30">
                {t}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 1,
      icon: "💨",
      bg: "bg-gradient-to-br from-orange-400 to-amber-500",
      title: "Что такое слог?",
      content: (
        <div>
          <div className="bg-white/25 rounded-2xl p-5 mb-5 border border-white/30">
            <p className="font-nunito text-white text-lg leading-relaxed font-semibold">
              Слог — это те звуки в слове, которые можно произнести{" "}
              <span className="bg-white text-orange-500 px-2 py-0.5 rounded-lg font-black">одним толчком воздуха</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="bg-white/20 rounded-2xl p-4 flex-1 border border-white/30">
              <p className="font-nunito text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Пример</p>
              <div className="font-caveat text-4xl font-bold text-center">
                <WordCard word="РЕП-КА" />
              </div>
              <p className="font-nunito text-white/80 text-sm text-center mt-2">2 слога</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 flex-1 border border-white/30">
              <p className="font-nunito text-white/80 text-xs font-bold uppercase tracking-wider mb-2">Слог может быть</p>
              <ul className="font-nunito text-white text-sm space-y-1.5 font-semibold">
                <li>✦ Из одной буквы: <span className="font-caveat text-lg"><ColorLetter ch="У" /></span>-рок</li>
                <li>✦ Из пары звуков: ма, ко, ре</li>
                <li>✦ Со многими согл.: <span className="font-caveat text-lg"><ColorWord word="ВО-СТОРГ" /></span></li>
              </ul>
            </div>
          </div>
          <div className="bg-white/30 rounded-2xl p-3 text-center border border-white/40">
            <p className="font-caveat text-2xl font-bold text-white">
              <ColorWord word="У-ЧИТ" /> &nbsp;·&nbsp; <ColorWord word="А-ПЕЛЬ-СИН" />
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      icon: "🔴",
      bg: "bg-gradient-to-br from-red-500 to-rose-600",
      title: "Гласные звуки",
      content: (
        <div>
          <div className="bg-white/25 rounded-2xl p-4 mb-5 border border-white/30">
            <p className="font-nunito text-white text-lg font-semibold leading-relaxed">
              Чтобы образовать слог — нужен{" "}
              <span className="bg-white text-red-500 px-2 py-0.5 rounded-lg font-black">гласный звук</span>.
              Гласные на письме отмечаем <span className="underline decoration-white">красным цветом</span>.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-5">
            {["А", "Е", "Ё", "И", "О", "У", "Ы", "Э", "Ю", "Я"].map(v => (
              <div key={v} className="bg-red-400 border-2 border-red-300 text-white font-caveat font-bold text-3xl rounded-2xl flex items-center justify-center h-14 shadow-md">
                {v}
              </div>
            ))}
          </div>
          <div className="bg-white/25 rounded-2xl p-4 border border-white/30">
            <p className="font-nunito text-white font-black text-center text-xl">
              Сколько гласных — столько и слогов!
            </p>
            <div className="flex justify-center gap-6 mt-3 flex-wrap">
              <div className="text-center">
                <WordCard word="У-ЧИТ" />
                <p className="font-nunito text-white/80 text-xs mt-1">2 гласных = 2 слога</p>
              </div>
              <div className="text-center">
                <WordCard word="А-ПЕЛЬ-СИН" />
                <p className="font-nunito text-white/80 text-xs mt-1">3 гласных = 3 слога</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      icon: "🟢",
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      title: "Открытые слоги",
      content: (
        <div>
          <div className="bg-white/25 rounded-2xl p-5 mb-5 border border-white/30">
            <p className="font-nunito text-white text-lg font-semibold leading-relaxed">
              Открытый слог — заканчивается на{" "}
              <span className="bg-white text-red-500 px-2 py-0.5 rounded-lg font-black">гласный звук</span>
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-5 mb-4 border border-white/30">
            <p className="font-nunito text-white/80 text-xs font-bold uppercase tracking-wider mb-3">Пример — все слоги открытые:</p>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="font-caveat text-5xl font-bold text-white mb-2">
                  <ColorWord word="КО-РО-ВА" />
                </div>
                <div className="flex gap-3 justify-center mt-2">
                  {["КО", "РО", "ВА"].map((s, i) => (
                    <div key={i} className="bg-white/30 rounded-xl px-3 py-2 border border-white/40">
                      <div className="font-caveat text-xl font-bold">
                        {s.split("").map((ch, j) => <ColorLetter key={j} ch={ch} />)}
                      </div>
                      <div className="font-nunito text-white/70 text-xs text-center">→ гласная</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 border border-white/30">
            <p className="font-nunito text-white text-sm font-semibold text-center">
              🔴 Красный = гласный звук в конце слога
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      icon: "🔵",
      bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      title: "Закрытые слоги",
      content: (
        <div>
          <div className="bg-white/25 rounded-2xl p-5 mb-5 border border-white/30">
            <p className="font-nunito text-white text-lg font-semibold leading-relaxed">
              Закрытый слог — заканчивается на{" "}
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-lg font-black">согласный звук</span>
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-5 mb-4 border border-white/30">
            <p className="font-nunito text-white/80 text-xs font-bold uppercase tracking-wider mb-3">Пример — оба слога закрытые:</p>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="font-caveat text-5xl font-bold text-white mb-3">
                  <ColorWord word="НОЧЬ-НИК" />
                </div>
                <div className="flex gap-3 justify-center">
                  {[{ s: "НОЧЬ", end: "Ч", soft: true }, { s: "НИК", end: "К", soft: false }].map((item, i) => (
                    <div key={i} className="bg-white/30 rounded-xl px-4 py-3 border border-white/40">
                      <div className="font-caveat text-2xl font-bold mb-1">
                        {item.s.split("").map((ch, j) => <ColorLetter key={j} ch={ch} />)}
                      </div>
                      <div className={`font-nunito text-xs font-bold ${item.soft ? "text-green-300" : "text-blue-200"}`}>
                        {item.soft ? "🟢 мягкий" : "🔵 твёрдый"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <div className="bg-white/20 rounded-xl px-4 py-2 border border-white/30 font-nunito text-white text-sm font-semibold">
              🔵 <span className="text-blue-200">Синий</span> = твёрдый согласный
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 border border-white/30 font-nunito text-white text-sm font-semibold">
              🟢 <span className="text-green-300">Зелёный</span> = мягкий согласный
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      icon: "👏",
      bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
      title: "Способ 1 — Хлопки",
      content: (
        <div>
          <div className="bg-white/30 rounded-2xl p-5 mb-5 border border-white/40">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">👏</span>
              <p className="font-nunito text-white text-lg font-black">Хлопай в ладоши на каждый слог!</p>
            </div>
            <p className="font-nunito text-white/80 text-sm font-semibold">
              Произноси слово вслух и хлопай — сколько хлопков, столько слогов.
            </p>
          </div>
          <p className="font-nunito text-white/90 font-bold text-sm uppercase tracking-wider mb-3 text-center">Нажми на слово и попробуй!</p>
          <ClapDemo />
        </div>
      ),
    },
    {
      id: 6,
      icon: "🤲",
      bg: "bg-gradient-to-br from-pink-500 to-rose-500",
      title: "Способ 2 — Подбородок",
      content: (
        <div>
          <div className="bg-white/30 rounded-2xl p-5 mb-5 border border-white/40">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🤲</span>
              <p className="font-nunito text-white text-lg font-black">Приложи ладонь к подбородку!</p>
            </div>
            <p className="font-nunito text-white/80 text-sm font-semibold">
              Когда подбородок опустится или дёрнется — это один слог. Произноси слово медленно!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {DEMO_WORDS_CLAP.map((w, i) => (
              <div key={i} className="bg-white/25 rounded-2xl px-5 py-4 border border-white/30 text-center flex-1">
                <div className="font-caveat text-3xl font-bold mb-2">
                  {w.word.split("").map((ch, j) =>
                    ch === "-" ? <span key={j} className="text-white/40 mx-0.5">-</span> : <ColorLetter key={j} ch={ch} />
                  )}
                </div>
                <div className="flex justify-center gap-1 mb-1">
                  {Array.from({ length: w.syllables }).map((_, k) => (
                    <span key={k} className="text-xl">👇</span>
                  ))}
                </div>
                <p className="font-nunito text-white/80 text-xs font-semibold">{w.syllables} движения подбородком</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 7,
      icon: "🔍",
      bg: "bg-gradient-to-br from-purple-500 to-violet-600",
      title: "Способ 3 — Найди гласные",
      content: (
        <div>
          <div className="bg-white/30 rounded-2xl p-5 mb-5 border border-white/40">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🔍</span>
              <p className="font-nunito text-white text-lg font-black">Найди гласные в слове!</p>
            </div>
            <p className="font-nunito text-white/80 text-sm font-semibold">
              Сколько гласных звуков — столько и слогов. Нажми на гласные буквы!
            </p>
          </div>
          <VowelDemo />
        </div>
      ),
    },
    {
      id: 8,
      icon: "🏆",
      bg: "bg-gradient-to-br from-emerald-400 to-cyan-500",
      title: "Запомни главное!",
      content: (
        <div>
          <div className="grid gap-3 mb-5">
            {[
              { num: "1", color: "bg-orange-400", text: "Слог — звуки, произносимые одним толчком воздуха", icon: "💨" },
              { num: "2", color: "bg-red-400", text: "Сколько гласных — столько слогов", icon: "🔴" },
              { num: "3", color: "bg-green-500", text: "Открытый слог заканчивается на гласный", icon: "🟢" },
              { num: "4", color: "bg-blue-500", text: "Закрытый слог заканчивается на согласный", icon: "🔵" },
            ].map(item => (
              <div key={item.num} className="bg-white/25 rounded-2xl p-3 border border-white/30 flex items-center gap-3">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-nunito font-black text-lg shrink-0 shadow`}>
                  {item.num}
                </div>
                <p className="font-nunito text-white font-semibold text-sm">{item.icon} {item.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/30 rounded-2xl p-4 text-center border border-white/40">
            <p className="font-caveat text-2xl font-bold text-white mb-2">Цвета звуков</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="font-nunito text-sm font-bold"><span className="text-red-200 text-lg">●</span> Красный = гласный</span>
              <span className="font-nunito text-sm font-bold"><span className="text-blue-200 text-lg">●</span> Синий = твёрдый</span>
              <span className="font-nunito text-sm font-bold"><span className="text-green-200 text-lg">●</span> Зелёный = мягкий</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = SLIDES[slide];
  const total = SLIDES.length;

  return (
    <div className="min-h-screen font-nunito flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)" }}>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-4 flex items-center gap-3">
        <span className="font-nunito text-white/60 text-sm font-bold shrink-0">{slide + 1} / {total}</span>
        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((slide + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Slide title */}
      <div className="w-full max-w-2xl mb-3">
        <h2 className="font-caveat text-3xl font-bold text-white drop-shadow">{current.title}</h2>
      </div>

      {/* Slide */}
      <SlideWrapper bg={current.bg} animate={anim}>
        <div className="p-6 sm:p-8 min-h-72">
          {current.content}
        </div>
      </SlideWrapper>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 items-center">
        <button onClick={() => goTo(Math.max(0, slide - 1))}
          disabled={slide === 0}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white font-nunito font-bold px-5 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/20">
          <Icon name="ChevronLeft" size={18} /> Назад
        </button>

        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === slide ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`} />
          ))}
        </div>

        <button onClick={() => goTo(Math.min(total - 1, slide + 1))}
          disabled={slide === total - 1}
          className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed font-nunito font-bold px-5 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg">
          Далее <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      {/* Slide dots nav hint */}
      <p className="font-nunito text-white/40 text-xs mt-4">Нажимай на точки для перехода к слайду</p>
    </div>
  );
}

export default PresentationPage;
