import { Menu } from '@ark-ui/react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { languageLabels, supportedLanguages, type SupportedLanguage } from '../i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <Menu.Root>
      <Menu.Trigger
        className="btn-icon rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
                   dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700"
      >
        <Globe size={18} />
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          className="z-50 min-w-[140px] rounded-lg border border-gray-200 dark:border-slate-700
                     bg-white dark:bg-slate-800 p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {supportedLanguages.map((lang) => (
            <Menu.Item
              key={lang}
              value={lang}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer
                transition-colors
                ${
                  current === lang
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              onClick={() => i18n.changeLanguage(lang)}
            >
              {languageLabels[lang]}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
