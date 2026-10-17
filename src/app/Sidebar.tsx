import { useEffect, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn, IconButton, Tooltip, useMediaQuery } from '@/components/ui';
import { t } from '@/i18n';
import { useSettings } from '@/stores';
import { isActive, NAV, type NavItem } from './nav';

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/" className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3.5" aria-label={t('TradeSchool home')}>
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-6 shrink-0" />
      {!collapsed && <span className="text-[15px] font-semibold tracking-tight text-fg">TradeSchool</span>}
    </Link>
  );
}

function SidebarLink({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const active = isActive(item, pathname);
  const Icon = item.icon;
  const link = (
    <Link
      to={item.to}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? t(item.label) : undefined}
      className={cn(
        'flex h-8 items-center gap-2.5 rounded-control text-sm transition-colors duration-150',
        collapsed ? 'justify-center px-0' : 'px-2.5',
        active ? 'bg-accent/15 font-medium text-accent-text' : 'text-muted hover:bg-raised hover:text-fg',
      )}
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      {!collapsed && t(item.label)}
    </Link>
  );
  return collapsed ? (
    <Tooltip content={t(item.label)} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

/**
 * Fixed left navigation on tablet and desktop; collapses to icons. Below
 * 1280px (tablets, small laptops) it is always an icon rail, and the expand
 * button opens the full list over the page instead of pushing it aside.
 */
export function Sidebar() {
  const saved = useSettings((s) => s.sidebarCollapsed);
  const update = useSettings((s) => s.update);
  const { pathname } = useLocation();
  const narrow = useMediaQuery('(max-width: 1279px)');
  const [overlayOpen, setOverlayOpen] = useState(false);
  const overlay = narrow && overlayOpen;
  const collapsed = narrow ? !overlayOpen : saved;

  useEffect(() => setOverlayOpen(false), [pathname, narrow]);
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOverlayOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay]);

  const toggle = () => (narrow ? setOverlayOpen(!overlayOpen) : update({ sidebarCollapsed: !saved }));

  return (
    // The rail keeps its width in the layout while the overlay is open, so the page does not jump.
    <div className={cn('relative hidden shrink-0 md:block', collapsed || overlay ? 'w-14' : 'w-52')}>
      {overlay && (
        <div aria-hidden className="fixed inset-0 z-40 bg-overlay animate-fade-in" onClick={() => setOverlayOpen(false)} />
      )}
      <aside
        className={cn(
          'flex h-full flex-col border-r border-border bg-surface',
          collapsed ? 'w-14' : 'w-52',
          overlay && 'absolute inset-y-0 left-0 z-50 shadow-raised',
        )}
      >
        <Logo collapsed={collapsed} />
        <nav aria-label={t('Main')} className="flex-1 overflow-y-auto px-2 py-2">
          {NAV.map((group) => (
            <div key={group.id} className="mb-3 last:mb-0">
              {group.label &&
                (collapsed ? (
                  <div aria-hidden className="mx-2 mb-2 border-t border-border" />
                ) : (
                  <h2 className="mb-1 px-2.5 text-[11px] font-semibold tracking-wider text-muted uppercase">
                    {t(group.label)}
                  </h2>
                ))}
              <ul className="flex flex-col gap-0.5" aria-label={t(group.label ?? 'Home')}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <SidebarLink item={item} collapsed={collapsed} pathname={pathname} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={cn('flex border-t border-border p-2', collapsed ? 'justify-center' : 'justify-end')}>
          <IconButton
            label={collapsed ? t('Expand sidebar') : t('Collapse sidebar')}
            tooltipSide="right"
            aria-expanded={!collapsed}
            icon={collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            onClick={toggle}
          />
        </div>
      </aside>
    </div>
  );
}
