import { Cpu, Database, Globe, Sparkles, Users } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import {
  CAPTURE_HASH,
  DOCUMENT_MANAGEMENT_HASH,
  FOCAL_AI_PAGE_HASH,
  WEB_CONTENT_MANAGEMENT_HASH,
  WORKFLOW_MANAGEMENT_HASH
} from '../content/pageHashes';
import type { RibbonStripMode } from './ribbonStripMode';

const products = [
  { titleKey: 'home.bentoCard0Title', href: CAPTURE_HASH, icon: Cpu },
  { titleKey: 'home.bentoCard1Title', href: FOCAL_AI_PAGE_HASH, icon: Sparkles },
  { titleKey: 'home.bentoCard2Title', href: WORKFLOW_MANAGEMENT_HASH, icon: Users },
  { titleKey: 'home.bentoCard3Title', href: DOCUMENT_MANAGEMENT_HASH, icon: Database },
  { titleKey: 'home.bentoCard4Title', href: WEB_CONTENT_MANAGEMENT_HASH, icon: Globe }
] as const;

const partners = [
  { nameKey: 'home.ribbonPartner0Name', logo: 'ibm.svg', width: 76, height: 32, showName: false },
  { nameKey: 'home.ribbonPartner1Name', logo: 'qmatic.svg', width: 140, height: 26, showName: false },
  { nameKey: 'home.ribbonPartner2Name', logo: 'bricsys.jpg', width: 34, height: 34, showName: true },
  { nameKey: 'home.ribbonPartner3Name', logo: 'chapoo.jpg', width: 116, height: 56, showName: false }
] as const;

const credentials = [
  'home.ribbonCredential0',
  'home.ribbonCredential1',
  'home.ribbonCredential2',
  'home.ribbonCredential3'
] as const;

export function RibbonStrip({ mode }: { mode: RibbonStripMode }) {
  const { t } = useI18n();

  if (mode === 'none') return null;

  if (mode === 'products') {
    return (
      <nav className="ribbon-strip" aria-label={t('home.ribbonStripProductsAria')}>
        <div className="ribbon-strip-track">
          {products.map((product) => (
            <a key={product.href} className="ribbon-product" href={product.href}>
              <product.icon className="ribbon-product-mark" size={28} strokeWidth={2.2} aria-hidden="true" />
              <span>{t(product.titleKey)}</span>
            </a>
          ))}
        </div>
      </nav>
    );
  }

  if (mode === 'partners') {
    return (
      <div className="ribbon-strip">
        <ul className="ribbon-strip-track" aria-label={t('home.ribbonStripPartnersAria')}>
          {partners.map((partner) => (
            <li key={partner.nameKey} className="ribbon-partner">
              <img
                className="ribbon-partner-logo"
                src={`/assets/partners/${partner.logo}`}
                alt={t(partner.nameKey)}
                width={partner.width}
                height={partner.height}
              />
              {partner.showName && <span className="ribbon-partner-name" aria-hidden="true">{t(partner.nameKey)}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="ribbon-strip">
      <ul className="ribbon-strip-track" aria-label={t('home.ribbonStripCredentialsAria')}>
        {credentials.map((key) => (
          <li key={key} className="ribbon-credential">
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
