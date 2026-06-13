import { useLocation, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4" style={{ background: '#F8F6F2' }}>
      <h1 className="absolute bottom-0 text-9xl md:text-[12rem] font-black text-[#1C2526]/5 select-none pointer-events-none z-0">
        404
      </h1>
      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-semibold mt-6 text-[#1C2526]">{t('notFound.title')}</h2>
        <p className="mt-2 text-base text-[#5A6A72] font-mono">{location.pathname}</p>
        <p className="mt-4 text-lg md:text-xl text-[#8A97A0]">{t('notFound.hint')}</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 gradient-bg text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap text-sm"
        >
          <i className="ri-home-line text-base" />
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}