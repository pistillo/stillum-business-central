import { Menu } from '@ark-ui/react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../theme/ThemeContext';

const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Chiaro', icon: Sun },
  { value: 'dark', label: 'Scuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
];

export function ThemeToggle() {
  const { mode, resolved, setMode } = useTheme();

  const CurrentIcon = resolved === 'dark' ? Moon : Sun;

  return (
    <Menu.Root>
      <Menu.Trigger
        className="btn-icon rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                   dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
      >
        <CurrentIcon size={18} />
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          className="z-50 min-w-[140px] rounded-lg border border-gray-200 dark:border-slate-700
                     bg-white dark:bg-slate-800 p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {options.map((opt) => (
            <Menu.Item
              key={opt.value}
              value={opt.value}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer
                transition-colors
                ${
                  mode === opt.value
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              onClick={() => setMode(opt.value)}
            >
              <opt.icon size={16} />
              {opt.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
