import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang, isRTL } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={() => setLang('en')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: `1px solid ${lang === 'en' ? '#fafafa' : '#27272a'}`,
          background: lang === 'en' ? '#27272a' : 'transparent',
          color: '#fafafa',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: lang === 'en' ? 600 : 400,
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLang('ar')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: `1px solid ${lang === 'ar' ? '#fafafa' : '#27272a'}`,
          background: lang === 'ar' ? '#27272a' : 'transparent',
          color: '#fafafa',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: lang === 'ar' ? 600 : 400,
        }}
      >
        AR
      </button>
    </div>
  );
}
