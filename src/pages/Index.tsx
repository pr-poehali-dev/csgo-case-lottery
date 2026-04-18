import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "cases" | "upgrades" | "profile" | "stats" | "support";

const NAV = [
  { id: "home", label: "Главная", icon: "LayoutDashboard" },
  { id: "cases", label: "Кейсы", icon: "Package" },
  { id: "upgrades", label: "Апгрейды", icon: "Zap" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "stats", label: "Статистика", icon: "BarChart2" },
  { id: "support", label: "Поддержка", icon: "LifeBuoy" },
] as const;

const REFERRALS = [
  { name: "Aleksei_pro", joined: "2 дн. назад", activity: 94, earned: "+₽ 1 240" },
  { name: "dark_trader", joined: "5 дн. назад", activity: 71, earned: "+₽ 870" },
  { name: "moonshot99", joined: "12 дн. назад", activity: 43, earned: "+₽ 340" },
  { name: "viper_x", joined: "18 дн. назад", activity: 28, earned: "+₽ 190" },
];

const CASES = [
  { name: "Нуар", price: "₽ 199", rarity: "Редкий", color: "#C8FF00", chance: "12%" },
  { name: "Криптон", price: "₽ 499", rarity: "Эпик", color: "#9B59B6", chance: "5%" },
  { name: "Абсолют", price: "₽ 999", rarity: "Легенда", color: "#E74C3C", chance: "1%" },
  { name: "Блэкаут", price: "₽ 299", rarity: "Необычный", color: "#3498DB", chance: "8%" },
];

const UPGRADES = [
  { name: "Щит удачи", desc: "Защита от потери при неудаче", cost: 200, active: true },
  { name: "Двойная комиссия", desc: "×2 бонус с рефералов на 24ч", cost: 500, active: false },
  { name: "VIP-статус", desc: "Приоритетный дроп в кейсах", cost: 1500, active: false },
  { name: "Авто-реинвест", desc: "Реинвестиция бонусов автоматически", cost: 800, active: true },
];

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-2 card-hover cursor-default ${accent ? "border-[#C8FF00]/20 bg-[rgba(200,255,0,0.04)]" : "border-[#1e1e1e] bg-[#111]"}`}>
      <span className="text-xs text-[#555] font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold stat-number ${accent ? "neon-text neon-glow-text" : "text-white"}`}>{value}</span>
      {sub && <span className="text-xs text-[#444]">{sub}</span>}
    </div>
  );
}

function SectionHome({ setSection }: { setSection: (s: Section) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Добро пожаловать 👾</h1>
          <p className="text-[#555] mt-1">Твой баланс и активность за сегодня</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#555] uppercase tracking-wider mb-1">Онлайн</div>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-[#C8FF00] pulse-dot"></span>
            <span className="text-sm text-[#C8FF00]">1 247 игроков</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Баланс" value="₽ 14 820" sub="+₽ 340 сегодня" accent />
        <StatCard label="Рефералы" value="4" sub="активных" />
        <StatCard label="Комиссия всего" value="₽ 2 640" sub="от рефералов" />
        <StatCard label="Открыто кейсов" value="38" sub="за всё время" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Рефералы</span>
            <button onClick={() => setSection("profile")} className="text-xs text-[#C8FF00] hover:underline">Пригласить →</button>
          </div>
          <div className="space-y-3">
            {REFERRALS.slice(0, 3).map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xs font-mono text-[#555]">
                  {r.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{r.name}</div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-1">
                    <div className="h-1 bg-[#C8FF00] rounded-full transition-all" style={{ width: `${r.activity}%` }}></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#C8FF00] shrink-0">{r.earned}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Последние кейсы</span>
            <button onClick={() => setSection("cases")} className="text-xs text-[#C8FF00] hover:underline">Все →</button>
          </div>
          <div className="space-y-2">
            {[
              { item: "Нож «Тень»", case: "Нуар", time: "10 мин назад", val: "₽ 3 400" },
              { item: "Перчатки «Абис»", case: "Криптон", time: "1ч назад", val: "₽ 890" },
              { item: "Пистолет «Мрак»", case: "Абсолют", time: "3ч назад", val: "₽ 210" },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#181818] last:border-0">
                <div>
                  <div className="text-sm text-white">{d.item}</div>
                  <div className="text-xs text-[#555]">{d.case} · {d.time}</div>
                </div>
                <span className="text-sm font-mono text-[#C8FF00]">{d.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCases() {
  const [opening, setOpening] = useState<string | null>(null);

  const handleOpen = (name: string) => {
    setOpening(name);
    setTimeout(() => setOpening(null), 1800);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Кейсы</h2>
        <p className="text-[#555] mt-1">Открывай и получай предметы</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CASES.map((c) => (
          <div key={c.name} className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5 flex flex-col gap-4 card-hover">
            <div className="w-full aspect-square rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ background: `radial-gradient(circle at 60% 40%, ${c.color}18 0%, transparent 70%), #0d0d0d` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}>
                <span className="text-3xl">📦</span>
              </div>
              {opening === c.name && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 animate-fade-in">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎉</div>
                    <div className="text-xs font-mono" style={{ color: c.color }}>Открываем...</div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-white">{c.name}</div>
              <div className="text-xs mt-0.5" style={{ color: c.color }}>{c.rarity} · шанс {c.chance}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-white">{c.price}</span>
              <button
                onClick={() => handleOpen(c.name)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
                style={{ background: c.color, color: "#0a0a0a" }}
              >Открыть</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionUpgrades() {
  const [items, setItems] = useState(UPGRADES);

  const toggle = (i: number) => {
    setItems(prev => prev.map((u, idx) => idx === i ? { ...u, active: !u.active } : u));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Апгрейды</h2>
        <p className="text-[#555] mt-1">Усиль свой аккаунт</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((u, i) => (
          <div key={u.name}
            className={`rounded-xl border p-5 flex items-start gap-4 transition-all duration-200 cursor-pointer ${u.active ? "border-[#C8FF00]/30 bg-[rgba(200,255,0,0.04)]" : "border-[#1e1e1e] bg-[#111]"}`}
            onClick={() => toggle(i)}>
            <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${u.active ? "bg-[#C8FF00] text-black" : "bg-[#1a1a1a] text-[#555]"}`}>
              <Icon name="Zap" size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${u.active ? "text-white" : "text-[#888]"}`}>{u.name}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${u.active ? "bg-[#C8FF00]/20 text-[#C8FF00]" : "bg-[#1a1a1a] text-[#555]"}`}>
                  {u.active ? "Активен" : `${u.cost} pts`}
                </span>
              </div>
              <p className="text-xs text-[#555] mt-1">{u.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionProfile() {
  const [copied, setCopied] = useState(false);
  const link = "https://drop.ru/ref/dark_user_42";

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Профиль</h2>
        <p className="text-[#555] mt-1">Данные аккаунта и реферальная программа</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-[#1e1e1e] bg-[#111] p-6 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="text-center">
            <div className="font-bold text-white text-lg">dark_user_42</div>
            <div className="text-xs text-[#555] mt-0.5">с 15 января 2025</div>
          </div>
          <div className="w-full pt-3 border-t border-[#1e1e1e] space-y-2">
            {[
              { l: "Уровень", v: "27" },
              { l: "Статус", v: "Золотой" },
              { l: "Рейтинг", v: "#142" },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-sm">
                <span className="text-[#555]">{r.l}</span>
                <span className="text-white font-medium">{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#C8FF00]/20 bg-[rgba(200,255,0,0.03)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Users" size={16} className="text-[#C8FF00]" />
              <span className="font-semibold text-white">Реферальная программа</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { l: "Рефералов", v: "4" },
                { l: "Комиссия", v: "5%" },
                { l: "Заработано", v: "₽ 2 640" },
              ].map(s => (
                <div key={s.l} className="text-center p-3 rounded-lg bg-[#0d0d0d] border border-[#1e1e1e]">
                  <div className="text-xl font-bold font-mono neon-text">{s.v}</div>
                  <div className="text-xs text-[#555] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-[#555] mb-2">Твоя реферальная ссылка</div>
            <div className="flex gap-2">
              <div className="flex-1 font-mono text-xs bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[#888] truncate">
                {link}
              </div>
              <button onClick={copy}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shrink-0"
                style={{ background: copied ? "#1a1a1a" : "#C8FF00", color: copied ? "#C8FF00" : "#0a0a0a" }}>
                {copied ? "Скопировано!" : "Копировать"}
              </button>
            </div>
            <p className="text-xs text-[#444] mt-3">
              Ты получаешь <span className="text-[#C8FF00]">5% комиссии</span> от каждой активности приглашённого друга навсегда.
            </p>
          </div>

          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-3">Активные рефералы</div>
            <div className="space-y-3">
              {REFERRALS.map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xs font-mono text-[#555]">
                    {r.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{r.name}</span>
                      <span className="text-xs text-[#555]">{r.joined}</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a1a1a] rounded-full">
                      <div className="h-1 bg-[#C8FF00] rounded-full" style={{ width: `${r.activity}%` }}></div>
                    </div>
                  </div>
                  <span className="text-xs font-mono neon-text shrink-0">{r.earned}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionStats() {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const values = [4200, 6800, 5100, 9400, 7300, 12800];
  const max = Math.max(...values);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Статистика</h2>
        <p className="text-[#555] mt-1">Динамика доходов и активности</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Доход за месяц" value="₽ 12 800" sub="+36% к прошлому" accent />
        <StatCard label="Всего дропов" value="38" sub="за 6 месяцев" />
        <StatCard label="Ср. чек кейса" value="₽ 389" />
        <StatCard label="ROI рефералов" value="×4.2" sub="окупаемость" />
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
        <div className="text-sm font-semibold text-white mb-5">Доход по месяцам</div>
        <div className="flex items-end gap-3 h-36">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-[#555]">₽{Math.round(v / 1000)}к</span>
              <div className="w-full rounded-t-md transition-all duration-500 relative overflow-hidden"
                style={{ height: `${(v / max) * 100}%`, background: i === values.length - 1 ? "#C8FF00" : "#1e1e1e" }}>
                {i === values.length - 1 && (
                  <div className="absolute inset-0 shimmer"></div>
                )}
              </div>
              <span className="text-xs text-[#555]">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="text-sm font-semibold text-white mb-4">Топ предметов</div>
          <div className="space-y-3">
            {[
              { name: "Нож «Тень»", val: "₽ 3 400", pct: 26 },
              { name: "Перчатки «Абис»", val: "₽ 890", pct: 16 },
              { name: "AK-47 «Призрак»", val: "₽ 650", pct: 12 },
            ].map((t, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">{t.name}</span>
                  <span className="font-mono text-white">{t.val}</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a] rounded-full">
                  <div className="h-1 bg-[#C8FF00] rounded-full" style={{ width: `${t.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="text-sm font-semibold text-white mb-4">Активность рефералов</div>
          <div className="space-y-3">
            {REFERRALS.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className="text-xs text-[#555] w-20 truncate">{r.name}</span>
                <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${r.activity}%`, background: `rgba(200,255,0,${r.activity / 100})` }}></div>
                </div>
                <span className="text-xs font-mono text-[#555] w-6">{r.activity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSupport() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Поддержка</h2>
        <p className="text-[#555] mt-1">Мы отвечаем в течение 15 минут</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-4">Новое обращение</div>
            <div className="space-y-3">
              <select className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-[#888] focus:outline-none focus:border-[#C8FF00]/40">
                <option>Выбери тип вопроса</option>
                <option>Проблема с кейсом</option>
                <option>Вопрос по рефералам</option>
                <option>Технический сбой</option>
                <option>Другое</option>
              </select>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Опиши проблему подробно..."
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#C8FF00]/40 resize-none"
              />
              <button
                onClick={send}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 hover:opacity-90"
                style={{ background: "#C8FF00", color: "#0a0a0a" }}
              >
                {sent ? "Отправлено ✓" : "Отправить"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-3">Мои обращения</div>
            <div className="space-y-2">
              {[
                { id: "#1042", topic: "Не зачислился бонус реферала", status: "Решено", date: "12 апр" },
                { id: "#0998", topic: "Вопрос по апгрейду VIP", status: "В работе", date: "10 апр" },
              ].map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#181818] last:border-0">
                  <div>
                    <div className="text-sm text-white">{t.topic}</div>
                    <div className="text-xs text-[#555]">{t.id} · {t.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === "Решено" ? "bg-[#C8FF00]/10 text-[#C8FF00]" : "bg-[#1a3a2a] text-[#4caf7d]"}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-3">FAQ</div>
            <div className="space-y-2">
              {[
                "Как работают рефералы?",
                "Когда зачисляется комиссия?",
                "Можно ли продать предмет?",
                "Как активировать апгрейд?",
              ].map((q, i) => (
                <button key={i} className="w-full text-left text-xs text-[#666] hover:text-[#C8FF00] py-1.5 border-b border-[#181818] last:border-0 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium text-white">Telegram чат</div>
            <div className="text-xs text-[#555] mt-0.5 mb-3">Быстрые ответы 24/7</div>
            <button className="w-full py-2 rounded-lg text-xs font-medium border border-[#2a2a2a] text-[#888] hover:border-[#C8FF00]/30 hover:text-[#C8FF00] transition-all">
              Открыть чат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case "home": return <SectionHome setSection={setSection} />;
      case "cases": return <SectionCases />;
      case "upgrades": return <SectionUpgrades />;
      case "profile": return <SectionProfile />;
      case "stats": return <SectionStats />;
      case "support": return <SectionSupport />;
    }
  };

  const navigate = (id: Section) => {
    setSection(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-golos">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-[#0d0d0d] border-r border-[#181818] flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-5 py-6 border-b border-[#181818]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C8FF00] flex items-center justify-center">
              <span className="text-black font-bold text-sm">D</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm">DROP</div>
              <div className="text-[10px] text-[#444] uppercase tracking-widest">Platform</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => navigate(n.id as Section)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${section === n.id ? "active" : "text-[#666]"}`}
            >
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#181818]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-sm">
              👤
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">dark_user_42</div>
              <div className="text-[10px] text-[#444]">₽ 14 820</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#141414] px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-[#555] hover:text-white" onClick={() => setMobileOpen(true)}>
            <Icon name="Menu" size={20} />
          </button>
          <div className="hidden lg:block">
            <span className="text-sm text-[#555]">{NAV.find(n => n.id === section)?.label}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#555] border border-[#1e1e1e] rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] pulse-dot"></span>
              <span className="font-mono">₽ 14 820</span>
            </div>
            <button className="w-8 h-8 rounded-lg bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#555] hover:text-white transition-colors">
              <Icon name="Bell" size={15} />
            </button>
          </div>
        </header>

        <div className="p-6 max-w-5xl">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
