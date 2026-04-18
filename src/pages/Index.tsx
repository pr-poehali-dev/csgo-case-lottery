import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const STEAM_LOGIN_URL = "https://functions.poehali.dev/b861bf86-5e62-4ea6-abc1-89691eeb13ec";
const ROBOKASSA_URL = "https://functions.poehali.dev/a5676e04-463e-4daa-a494-c659a2b04576";

type Section = "home" | "cases" | "upgrades" | "profile" | "stats" | "support";

interface User {
  username: string;
  avatar: string;
  balance: number;
  cases: number;
  ref_code: string;
  ref_earnings: number;
  token: string;
}

const NAV = [
  { id: "home", label: "Главная", icon: "LayoutDashboard" },
  { id: "cases", label: "Кейсы", icon: "Package" },
  { id: "upgrades", label: "Апгрейды", icon: "Zap" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "stats", label: "Статистика", icon: "BarChart2" },
  { id: "support", label: "Поддержка", icon: "LifeBuoy" },
] as const;

const UPGRADES_DATA = [
  { name: "Щит удачи", desc: "Защита от потери при неудаче", cost: 200, active: false },
  { name: "Двойная комиссия", desc: "×2 бонус с рефералов на 24ч", cost: 500, active: false },
  { name: "VIP-статус", desc: "Приоритетный дроп в кейсах", cost: 1500, active: false },
  { name: "Авто-реинвест", desc: "Реинвестиция бонусов автоматически", cost: 800, active: false },
];

const CASES_DATA = [
  { name: "Нуар", price: "₽ 199", priceNum: 199, rarity: "Редкий", color: "#C8FF00", chance: "12%" },
  { name: "Криптон", price: "₽ 499", priceNum: 499, rarity: "Эпик", color: "#9B59B6", chance: "5%" },
  { name: "Абсолют", price: "₽ 999", priceNum: 999, rarity: "Легенда", color: "#E74C3C", chance: "1%" },
  { name: "Блэкаут", price: "₽ 299", priceNum: 299, rarity: "Необычный", color: "#3498DB", chance: "8%" },
];

const AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

function SteamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.187.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
    </svg>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#C8FF00]/15 to-transparent pointer-events-none" />
        <div className="relative rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-8 flex flex-col items-center gap-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors">
            <Icon name="X" size={16} />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C8FF00] flex items-center justify-center">
              <span className="text-black font-bold text-xl">D</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-white text-lg">Войди, чтобы продолжить</div>
              <div className="text-[#555] text-sm mt-1">Нужен аккаунт Steam для этого действия</div>
            </div>
          </div>
          <a
            href={STEAM_LOGIN_URL}
            className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#1b2838", border: "1px solid #2a475e", color: "#c7d5e0" }}
          >
            <SteamIcon />
            Войти через Steam
          </a>
          <p className="text-xs text-[#333] text-center">Мы не храним пароли от Steam</p>
        </div>
      </div>
    </div>
  );
}

function TopUpModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = custom ? parseFloat(custom) || 0 : amount;

  const handlePay = async () => {
    if (finalAmount < 50) { setError("Минимальная сумма — 50 ₽"); return; }
    setLoading(true);
    setError("");
    const origin = window.location.origin;
    const res = await fetch(ROBOKASSA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: finalAmount,
        user_id: null,
        user_name: user.username,
        user_email: "noreply@drop.ru",
        success_url: `${origin}?pay=ok&amount=${finalAmount}`,
        fail_url: `${origin}?pay=fail`,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      setError(data.error || "Ошибка создания платежа");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#C8FF00]/10 to-transparent pointer-events-none" />
        <div className="relative rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-7 flex flex-col gap-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors">
            <Icon name="X" size={16} />
          </button>

          <div>
            <div className="font-bold text-white text-lg">Пополнить баланс</div>
            <div className="text-[#555] text-sm mt-0.5">Оплата через СБП, карту или QR-код</div>
          </div>

          <div>
            <div className="text-xs text-[#555] mb-2 uppercase tracking-wider">Выбери сумму</div>
            <div className="grid grid-cols-3 gap-2">
              {AMOUNTS.map(a => (
                <button key={a}
                  onClick={() => { setAmount(a); setCustom(""); setError(""); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${!custom && amount === a ? "border-[#C8FF00]/50 bg-[rgba(200,255,0,0.08)] text-[#C8FF00]" : "border-[#1e1e1e] bg-[#111] text-[#888] hover:border-[#2a2a2a]"}`}>
                  ₽ {a.toLocaleString("ru")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-[#555] mb-2 uppercase tracking-wider">Или введи свою сумму</div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-sm">₽</span>
              <input
                type="number"
                min="50"
                placeholder="0"
                value={custom}
                onChange={e => { setCustom(e.target.value); setError(""); }}
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl pl-7 pr-4 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-[#C8FF00]/40"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-3 flex items-center justify-between">
            <span className="text-sm text-[#666]">К оплате</span>
            <span className="font-bold font-mono text-white text-lg neon-text">₽ {finalAmount > 0 ? finalAmount.toLocaleString("ru") : "—"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: "Smartphone", label: "СБП" },
              { icon: "CreditCard", label: "Карта" },
              { icon: "QrCode", label: "QR-код" },
            ].map(m => (
              <div key={m.label} className="flex flex-col items-center gap-1.5 py-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
                <Icon name={m.icon} size={16} className="text-[#555]" />
                <span className="text-xs text-[#555]">{m.label}</span>
              </div>
            ))}
          </div>

          {error && <div className="text-xs text-red-400 text-center">{error}</div>}

          <button
            onClick={handlePay}
            disabled={loading || finalAmount < 50}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#C8FF00", color: "#0a0a0a" }}
          >
            {loading ? "Создаём платёж..." : `Оплатить ₽ ${finalAmount > 0 ? finalAmount.toLocaleString("ru") : "—"}`}
          </button>

          <p className="text-xs text-[#333] text-center">Оплата через Robokassa · Защищено SSL</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-2 card-hover cursor-default ${accent ? "border-[#C8FF00]/20 bg-[rgba(200,255,0,0.04)]" : "border-[#1e1e1e] bg-[#111]"}`}>
      <span className="text-xs text-[#555] font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold stat-number ${accent ? "neon-text neon-glow-text" : "text-white"}`}>{value}</span>
      {sub && <span className="text-xs text-[#444]">{sub}</span>}
    </div>
  );
}

function SectionHome({ user, setSection, onTopUp, onLogin }: { user: User | null; setSection: (s: Section) => void; onTopUp: () => void; onLogin: () => void }) {
  const displayName = user ? user.username : "Гость";
  const balance = user ? user.balance : 0;
  const cases = user ? user.cases : 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Привет, {displayName} 👾</h1>
          <p className="text-[#555] mt-1">Твой баланс и активность</p>
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
        <div
          onClick={user ? onTopUp : onLogin}
          className="rounded-xl border border-[#C8FF00]/20 bg-[rgba(200,255,0,0.04)] p-5 flex flex-col gap-2 cursor-pointer card-hover"
        >
          <span className="text-xs text-[#555] font-medium uppercase tracking-wider">Баланс</span>
          <span className="text-2xl font-bold stat-number neon-text neon-glow-text">₽ {balance.toLocaleString("ru")}</span>
          <span className="text-xs text-[#C8FF00]/60">+ Пополнить →</span>
        </div>
        <StatCard label="Рефералы" value="0" sub="пригласи друзей" />
        <StatCard label="Комиссия всего" value="₽ 0" sub="от рефералов" />
        <StatCard label="Открыто кейсов" value={String(cases)} sub="за всё время" />
      </div>

      {!user && (
        <div className="rounded-xl border border-[#1b2838] bg-[#0f141a] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1b2838] flex items-center justify-center shrink-0">
            <SteamIcon />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Войди через Steam, чтобы играть</div>
            <div className="text-xs text-[#555] mt-0.5">Открытие кейсов, рефералы и пополнение — после входа</div>
          </div>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all hover:opacity-90"
            style={{ background: "#1b2838", border: "1px solid #2a475e", color: "#c7d5e0" }}
          >Войти</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Рефералы</span>
            <button onClick={user ? () => setSection("profile") : onLogin} className="text-xs text-[#C8FF00] hover:underline">Пригласить →</button>
          </div>
          <div className="py-8 text-center">
            <div className="text-3xl mb-3">👥</div>
            <div className="text-sm text-[#555]">Пока никого нет</div>
            <div className="text-xs text-[#444] mt-1">Поделись ссылкой — и получай 5% от активности друзей</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Последние дропы</span>
            <button onClick={() => setSection("cases")} className="text-xs text-[#C8FF00] hover:underline">Открыть →</button>
          </div>
          <div className="py-8 text-center">
            <div className="text-3xl mb-3">📦</div>
            <div className="text-sm text-[#555]">Ещё нет открытых кейсов</div>
            <div className="text-xs text-[#444] mt-1">Открой первый кейс и посмотри что выпадет</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCases({ user, onTopUp, onLogin }: { user: User | null; onTopUp: () => void; onLogin: () => void }) {
  const [opening, setOpening] = useState<string | null>(null);

  const handleOpen = (c: typeof CASES_DATA[0]) => {
    if (!user) { onLogin(); return; }
    setOpening(c.name);
    setTimeout(() => setOpening(null), 1800);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Кейсы</h2>
          <p className="text-[#555] mt-1">Открывай и получай предметы</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#555]">Баланс</div>
          <button onClick={user ? onTopUp : onLogin} className="font-mono font-bold text-white hover:text-[#C8FF00] transition-colors">
            {user ? `₽ ${user.balance.toLocaleString("ru")}` : "— войди →"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CASES_DATA.map((c) => (
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
                onClick={() => handleOpen(c)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
                style={{ background: c.color, color: "#0a0a0a" }}
              >
                {user ? "Открыть" : "Войти"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionUpgrades({ user, onLogin }: { user: User | null; onLogin: () => void }) {
  const [items, setItems] = useState(UPGRADES_DATA);

  const toggle = (i: number) => {
    if (!user) { onLogin(); return; }
    setItems(prev => prev.map((u, idx) => idx === i ? { ...u, active: !u.active } : u));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Апгрейды</h2>
        <p className="text-[#555] mt-1">Усиль свой аккаунт</p>
      </div>
      {!user && (
        <div className="rounded-xl border border-[#1b2838] bg-[#0f141a] p-4 flex items-center gap-3 text-sm">
          <SteamIcon />
          <span className="text-[#888]">Войди через Steam для активации апгрейдов</span>
          <button onClick={onLogin} className="ml-auto text-xs text-[#C8FF00] hover:underline shrink-0">Войти →</button>
        </div>
      )}
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

function SectionProfile({ user, onLogin, onTopUp }: { user: User | null; onLogin: () => void; onTopUp: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-4xl">👤</div>
        <div className="text-center">
          <div className="text-xl font-bold text-white mb-1">Войди, чтобы видеть профиль</div>
          <div className="text-[#555] text-sm">Нужен аккаунт Steam</div>
        </div>
        <a href={STEAM_LOGIN_URL}
          className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "#1b2838", border: "1px solid #2a475e", color: "#c7d5e0" }}>
          <SteamIcon /> Войти через Steam
        </a>
      </div>
    );
  }

  const link = `${window.location.origin}?ref=${user.ref_code}`;
  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Профиль</h2>
        <p className="text-[#555] mt-1">Данные аккаунта и реферальная программа</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-xl border border-[#1e1e1e] bg-[#111] p-6 flex flex-col items-center gap-4">
          {user.avatar
            ? <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-2xl border border-[#2a2a2a]" />
            : <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-4xl">👤</div>
          }
          <div className="text-center">
            <div className="font-bold text-white text-lg">{user.username}</div>
            <div className="text-xs text-[#555] mt-0.5">Steam аккаунт</div>
          </div>
          <div className="w-full pt-3 border-t border-[#1e1e1e] space-y-2">
            {[
              { l: "Баланс", v: `₽ ${user.balance.toLocaleString("ru")}` },
              { l: "Уровень", v: "1" },
              { l: "Кейсов открыто", v: String(user.cases) },
            ].map(r => (
              <div key={r.l} className="flex justify-between text-sm">
                <span className="text-[#555]">{r.l}</span>
                <span className="text-white font-medium">{r.v}</span>
              </div>
            ))}
          </div>
          <button onClick={onTopUp} className="w-full py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ background: "#C8FF00", color: "#0a0a0a" }}>
            Пополнить баланс
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#C8FF00]/20 bg-[rgba(200,255,0,0.03)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Users" size={16} className="text-[#C8FF00]" />
              <span className="font-semibold text-white">Реферальная программа</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { l: "Рефералов", v: "0" },
                { l: "Комиссия", v: "5%" },
                { l: "Заработано", v: `₽ ${user.ref_earnings.toLocaleString("ru")}` },
              ].map(s => (
                <div key={s.l} className="text-center p-3 rounded-lg bg-[#0d0d0d] border border-[#1e1e1e]">
                  <div className="text-xl font-bold font-mono neon-text">{s.v}</div>
                  <div className="text-xs text-[#555] mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-[#555] mb-2">Твоя реферальная ссылка</div>
            <div className="flex gap-2">
              <div className="flex-1 font-mono text-xs bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-[#888] truncate">{link}</div>
              <button onClick={copy} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shrink-0"
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
            <div className="py-6 text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm text-[#555]">Ещё никого нет</div>
              <div className="text-xs text-[#444] mt-1">Поделись ссылкой выше с друзьями</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionStats({ user }: { user: User | null }) {
  const cases = user ? user.cases : 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Статистика</h2>
        <p className="text-[#555] mt-1">Динамика доходов и активности</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Доход за месяц" value="₽ 0" sub="начни открывать кейсы" accent />
        <StatCard label="Всего дропов" value={String(cases)} sub="за всё время" />
        <StatCard label="Ср. чек кейса" value="—" />
        <StatCard label="ROI рефералов" value="—" sub="нет данных" />
      </div>
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
        <div className="text-sm font-semibold text-white mb-5">Доход по месяцам</div>
        <div className="py-12 text-center">
          <div className="text-3xl mb-3">📊</div>
          <div className="text-sm text-[#555]">Нет данных для отображения</div>
          <div className="text-xs text-[#444] mt-1">График появится после первых открытий</div>
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
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Опиши проблему подробно..."
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#C8FF00]/40 resize-none" />
              <button onClick={send} className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 hover:opacity-90"
                style={{ background: "#C8FF00", color: "#0a0a0a" }}>
                {sent ? "Отправлено ✓" : "Отправить"}
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-3">Мои обращения</div>
            <div className="py-6 text-center"><div className="text-sm text-[#555]">Обращений пока нет</div></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-5">
            <div className="text-sm font-semibold text-white mb-3">FAQ</div>
            <div className="space-y-2">
              {["Как работают рефералы?", "Когда зачисляется комиссия?", "Можно ли продать предмет?", "Как активировать апгрейд?"].map((q, i) => (
                <button key={i} className="w-full text-left text-xs text-[#666] hover:text-[#C8FF00] py-1.5 border-b border-[#181818] last:border-0 transition-colors">{q}</button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4 text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium text-white">Telegram чат</div>
            <div className="text-xs text-[#555] mt-0.5 mb-3">Быстрые ответы 24/7</div>
            <button className="w-full py-2 rounded-lg text-xs font-medium border border-[#2a2a2a] text-[#888] hover:border-[#C8FF00]/30 hover:text-[#C8FF00] transition-all">Открыть чат</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseUserFromUrl(): User | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) return null;
  const user: User = {
    token,
    username: params.get("username") || "Игрок",
    avatar: params.get("avatar") || "",
    balance: parseFloat(params.get("balance") || "0"),
    cases: parseInt(params.get("cases") || "0", 10),
    ref_code: params.get("ref_code") || "",
    ref_earnings: parseFloat(params.get("ref_earnings") || "0"),
  };
  localStorage.setItem("drop_user", JSON.stringify(user));
  window.history.replaceState({}, "", window.location.pathname);
  return user;
}

function loadUserFromStorage(): User | null {
  const raw = localStorage.getItem("drop_user");
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pay") === "ok") {
      const amount = parseFloat(params.get("amount") || "0");
      const stored = loadUserFromStorage();
      if (stored && amount > 0) {
        const updated = { ...stored, balance: stored.balance + amount };
        localStorage.setItem("drop_user", JSON.stringify(updated));
        setUser(updated);
      }
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    const fromUrl = parseUserFromUrl();
    if (fromUrl) { setUser(fromUrl); return; }
    setUser(loadUserFromStorage());
  }, []);

  const logout = () => { localStorage.removeItem("drop_user"); setUser(null); };
  const navigate = (id: Section) => { setSection(id); setMobileOpen(false); };
  const openLogin = () => setShowLogin(true);
  const openTopUp = () => { if (!user) { openLogin(); return; } setShowTopUp(true); };

  const renderSection = () => {
    switch (section) {
      case "home": return <SectionHome user={user} setSection={setSection} onTopUp={openTopUp} onLogin={openLogin} />;
      case "cases": return <SectionCases user={user} onTopUp={openTopUp} onLogin={openLogin} />;
      case "upgrades": return <SectionUpgrades user={user} onLogin={openLogin} />;
      case "profile": return <SectionProfile user={user} onLogin={openLogin} onTopUp={openTopUp} />;
      case "stats": return <SectionStats user={user} />;
      case "support": return <SectionSupport />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-golos">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showTopUp && user && <TopUpModal user={user} onClose={() => setShowTopUp(false)} />}

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
            <button key={n.id} onClick={() => navigate(n.id as Section)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${section === n.id ? "active" : "text-[#666]"}`}>
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#181818]">
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full border border-[#2a2a2a]" />
                : <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-sm">👤</div>
              }
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-white truncate">{user.username}</div>
                <div className="text-[10px] text-[#444]">₽ {user.balance.toLocaleString("ru")}</div>
              </div>
              <button onClick={logout} className="text-[#444] hover:text-[#C8FF00] transition-colors shrink-0" title="Выйти">
                <Icon name="LogOut" size={14} />
              </button>
            </div>
          ) : (
            <button onClick={openLogin}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{ background: "#1b2838", border: "1px solid #2a475e", color: "#c7d5e0" }}>
              <SteamIcon /> Войти
            </button>
          )}
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <main className="flex-1 lg:ml-56 min-h-screen">
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#141414] px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-[#555] hover:text-white" onClick={() => setMobileOpen(true)}>
            <Icon name="Menu" size={20} />
          </button>
          <div className="hidden lg:block">
            <span className="text-sm text-[#555]">{NAV.find(n => n.id === section)?.label}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={openTopUp}
              className="flex items-center gap-1.5 text-xs border border-[#1e1e1e] rounded-lg px-3 py-1.5 transition-all hover:border-[#C8FF00]/30 hover:text-[#C8FF00]"
              style={{ color: user ? undefined : "#555" }}
            >
              <Icon name="Plus" size={12} />
              <span className="font-mono">{user ? `₽ ${user.balance.toLocaleString("ru")}` : "Пополнить"}</span>
            </button>
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
