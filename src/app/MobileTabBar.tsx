import { useEffect, useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { BottomSheet, cn } from '@/components/ui';
import { t } from '@/i18n';
import { isActive, NAV, NAV_ITEMS, TAB_BAR_IDS } from './nav';

const TAB =
  'flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-150';

/** Phone navigation: four pinned destinations plus a More sheet with everything. */
export function MobileTabBar() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const tabs = TAB_BAR_IDS.map((id) => NAV_ITEMS.find((i) => i.id === id)!);
  const inMore = !tabs.some((t) => isActive(t, pathname));

  useEffect(() => setMoreOpen(false), [pathname]);

  return (
    <>
      <nav
        aria-label={t('Main')}
        className="flex h-14 shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {tabs.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={cn(TAB, active ? 'text-accent-text' : 'text-muted')}
            >
              <Icon aria-hidden className="size-5" />
              {t(item.label)}
            </Link>
          );
        })}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setMoreOpen(true)}
          className={cn(TAB, inMore ? 'text-accent-text' : 'text-muted')}
        >
          <Ellipsis aria-hidden className="size-5" />
          {t('More')}
        </button>
      </nav>

      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t('All sections')}>
        <div className="px-2 pb-4">
          {NAV.map((group) => (
            <div key={group.id} className="mb-2">
              {group.label && (
                <h3 className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">{t(group.label)}</h3>
              )}
              <ul>
                {group.items.map((item) => {
                  const active = isActive(item, pathname);
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          'flex h-11 items-center gap-3 rounded-control px-3 text-sm',
                          active ? 'bg-accent/15 text-accent-text' : 'text-fg',
                        )}
                      >
                        <Icon aria-hidden className="size-4.5" />
                        {t(item.label)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
