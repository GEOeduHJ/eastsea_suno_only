import React from 'react';
import { ModuleStep } from '../types';

type Theme = NonNullable<ModuleStep['detailContainers']>[number];

const styles = [
  { icon: '🕰️', button: 'border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100', selected: 'ring-amber-400', accent: 'bg-amber-500', soft: 'border-amber-100 bg-amber-50' },
  { icon: '🗺️', button: 'border-sky-200 bg-sky-50 text-sky-950 hover:bg-sky-100', selected: 'ring-sky-400', accent: 'bg-sky-500', soft: 'border-sky-100 bg-sky-50' },
  { icon: '⚖️', button: 'border-violet-200 bg-violet-50 text-violet-950 hover:bg-violet-100', selected: 'ring-violet-400', accent: 'bg-violet-500', soft: 'border-violet-100 bg-violet-50' },
  { icon: '🌏', button: 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100', selected: 'ring-emerald-400', accent: 'bg-emerald-500', soft: 'border-emerald-100 bg-emerald-50' },
];

const renderBlock = (block: string, index: number) => {
  const [heading, ...lines] = block.split('\n').filter(Boolean);
  return <section key={`${heading}-${index}`} className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm"><h4 className="font-bold text-slate-900">{heading}</h4><div className="mt-3 space-y-2">{lines.map((line) => <p key={line} className="text-sm leading-7 text-slate-700">{line.startsWith('•') ? `• ${line.slice(1).trim()}` : line}</p>)}</div></section>;
};

interface Props { intro: string; themes: Theme[]; }

const EastSeaSongThemeLearning: React.FC<Props> = ({ intro, themes }) => {
  const [selectedId, setSelectedId] = React.useState(themes[0]?.id ?? '');
  const selectedIndex = Math.max(0, themes.findIndex((theme) => theme.id === selectedId));
  const selected = themes[selectedIndex] ?? themes[0];
  const style = styles[selectedIndex] ?? styles[0];

  React.useEffect(() => setSelectedId(themes[0]?.id ?? ''), [themes]);
  if (!selected) return null;

  return <div>
    <section className="overflow-hidden rounded-3xl bg-ocean-gradient px-6 py-8 text-white shadow-lg sm:px-8">
      <p className="text-xs font-bold tracking-[0.18em] text-territory-accent">EAST SEA STORY STUDIO</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight">이름에서 시작하는 동해의 이야기</h3>
      <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/75">{intro}</p>
    </section>

    <section className="mt-7" aria-labelledby="east-sea-song-theme-title">
      <div className="mb-4"><h3 id="east-sea-song-theme-title" className="text-xl font-bold text-slate-900">네 가지 테마 중 하나를 선택하세요</h3><p className="mt-1 text-sm text-slate-500">선택한 테마의 핵심 사실을 2단계에서 노래의 소재와 메시지로 바꿉니다.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{themes.map((theme, index) => { const itemStyle = styles[index] ?? styles[0]; const active = index === selectedIndex; return <button key={theme.id} type="button" onClick={() => setSelectedId(theme.id)} aria-pressed={active} className={`min-h-[152px] rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${itemStyle.button} ${active ? `ring-4 ${itemStyle.selected} shadow-md` : ''}`}><span className="text-2xl" aria-hidden="true">{itemStyle.icon}</span><span className="mt-4 block text-xs font-bold opacity-70">테마 {index + 1}</span><span className="mt-1 block font-bold">{theme.title.replace(/^.*?\.\s*/, '')}</span><span className="mt-2 block text-xs leading-5 opacity-80">{theme.description}</span></button>; })}</div>
    </section>

    <article className={`mt-7 overflow-hidden rounded-3xl border ${style.soft} shadow-sm`} aria-live="polite">
      <header className="flex items-start gap-4 border-b border-white/80 bg-white/70 p-6"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-white ${style.accent}`} aria-hidden="true">{style.icon}</div><div><p className="text-xs font-bold text-slate-500">선택한 테마 {selectedIndex + 1}/4</p><h3 className="mt-1 text-xl font-bold text-slate-950">{selected.title}</h3><p className="mt-1 text-sm text-slate-600">{selected.description}</p></div></header>
      <div className="grid gap-4 p-5 lg:grid-cols-2 lg:p-6">{selected.content.split('\n\n').filter(Boolean).map(renderBlock)}</div>
    </article>
  </div>;
};

export default EastSeaSongThemeLearning;
