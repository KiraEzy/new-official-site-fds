import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  animate,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useReducedMotion
} from 'motion/react';
import { Menu, X, Phone, Mail, Search, Languages } from 'lucide-react';
import {
  CAPTURE_HASH,
  CAREER_HASH,
  CONTACT_US_HASH,
  WORKFLOW_MANAGEMENT_HASH,
  DOCUMENT_MANAGEMENT_HASH,
  FOCAL_AI_PAGE_HASH,
  PROFILE_HASH,
  SERVICES_HASH,
  WEB_CONTENT_MANAGEMENT_HASH
} from '../content/pageHashes';
import type { Locale } from '../i18n/types';
import { useI18n } from '../i18n/I18nContext';

const SOLUTIONS_HIGHLIGHT_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.82
};

export type NavbarLayoutMode = 'pillFixed' | 'heroTransparent';

type NavbarProps = {
  forceTopState?: boolean;
  topStateEnabled?: boolean;
  /** Demo: hide utility bar while home hero is at top; default false = always show on lg. */
  hideUtilityBarWhenHomeAtTop?: boolean;
  hideEnquiryButton?: boolean;
  navHoverEffect?: 'swipe' | 'spin';
  dropdownGlassOpacity?: number;
  colorProfile?: 'default' | 'navy';
  navLayout?: NavbarLayoutMode;
  /** Anchor inside the home hero; used to render the transparent nav so it scrolls away with the hero. */
  heroNavPortalEl?: HTMLElement | null;
  /** Pixels to offset the fixed header from the top (e.g. when a festival bar is visible). */
  topOffset?: number;
};

type AnimatedNavLinkProps = {
  href: string;
  name: string;
  hoverEffect: 'swipe' | 'spin';
  /** Renders a button (no URL); use for items that only open a dropdown. */
  dropdownTrigger?: boolean;
  menuOpen?: boolean;
  /** Light text for transparent hero overlay (reference: aistudio / Netlify hero). */
  tone?: 'default' | 'light';
};

function AnimatedNavLink({ href, name, hoverEffect, dropdownTrigger, menuOpen, tone = 'default' }: AnimatedNavLinkProps) {
  const animationRunRef = useRef(0);
  const baseTextControls = useAnimationControls();
  const overlayTextControls = useAnimationControls();
  const hiddenFromRight = 'inset(0 100% 0 0)';
  const hiddenFromLeft = 'inset(0 0 0 100%)';
  const fullyVisible = 'inset(0 0 0 0)';

  const baseTone = tone === 'light' ? 'text-white' : 'text-text/80';
  const ringTone = tone === 'light' ? 'focus-visible:ring-[#00e5ff]/70' : 'focus-visible:ring-interactive/70';
  const spinOverlayTone = tone === 'light' ? 'text-[#00e5ff]' : 'text-interactive';
  const sharedLinkClass = `relative px-4 py-2 text-[14px] font-semibold tracking-tight uppercase outline-none transition-colors duration-300 focus-visible:ring-2 ${ringTone} ${baseTone}`;

  const revealText = () => {
    animationRunRef.current += 1;
    baseTextControls.stop();
    overlayTextControls.stop();

    baseTextControls.start({
      clipPath: hiddenFromLeft,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
    });
    overlayTextControls.start({
      clipPath: fullyVisible,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
    });
  };

  const exitText = async () => {
    animationRunRef.current += 1;
    const runId = animationRunRef.current;

    baseTextControls.stop();
    overlayTextControls.stop();
    baseTextControls.set({ clipPath: hiddenFromRight });

    await Promise.all([
      overlayTextControls.start({
        clipPath: hiddenFromLeft,
        transition: { duration: 0.28, ease: [0.64, 0, 0.78, 0] }
      }),
      baseTextControls.start({
        clipPath: fullyVisible,
        transition: { duration: 0.28, ease: [0.64, 0, 0.78, 0] }
      })
    ]);

    if (animationRunRef.current === runId) {
      overlayTextControls.set({ clipPath: hiddenFromRight });
    }
  };

  if (hoverEffect === 'spin') {
    const triggerProps = dropdownTrigger
      ? ({
          type: 'button' as const,
          'aria-haspopup': 'menu' as const,
          'aria-expanded': menuOpen ?? false
        } as const)
      : ({ href } as const);

    const Tag = dropdownTrigger ? motion.button : motion.a;

    return (
      <Tag {...triggerProps} className={`group ${sharedLinkClass}`}>
        <span className="relative inline-block overflow-hidden">
          <span className="block origin-left transition-transform duration-300 ease-out group-hover:origin-right group-hover:scale-x-0 group-focus-visible:origin-right group-focus-visible:scale-x-0">
            {name}
          </span>
          <span
            aria-hidden="true"
            className={`absolute inset-0 block origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 ${spinOverlayTone}`}
          >
            {name}
          </span>
        </span>
      </Tag>
    );
  }

  const triggerProps = dropdownTrigger
    ? ({
        type: 'button' as const,
        'aria-haspopup': 'menu' as const,
        'aria-expanded': menuOpen ?? false
      } as const)
    : ({ href } as const);

  const Tag = dropdownTrigger ? motion.button : motion.a;

  return (
    <Tag
      {...triggerProps}
      onHoverStart={revealText}
      onHoverEnd={exitText}
      onFocus={revealText}
      onBlur={exitText}
      className={sharedLinkClass}
    >
      <span className="relative inline-block overflow-hidden">
        <motion.span initial={{ clipPath: fullyVisible }} animate={baseTextControls} className="block">
          {name}
        </motion.span>
        <motion.span
          aria-hidden="true"
          initial={{ clipPath: hiddenFromRight }}
          animate={overlayTextControls}
          className={`absolute inset-0 block ${spinOverlayTone}`}
        >
          {name}
        </motion.span>
      </span>
    </Tag>
  );
}

export default function Navbar({
  forceTopState = false,
  topStateEnabled = true,
  hideUtilityBarWhenHomeAtTop = false,
  hideEnquiryButton = false,
  navHoverEffect = 'swipe',
  dropdownGlassOpacity = 1,
  colorProfile = 'default',
  navLayout = 'pillFixed',
  heroNavPortalEl = null,
  topOffset = 0
}: NavbarProps) {
  const { locale, setLocale, t } = useI18n();
  const prefersReducedMotion = useReducedMotion();

  const langButtonClass = (l: Locale) =>
    `transition-colors ${locale === l ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}`;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'solutions' | 'locale' | null>(null);
  const [solutionsDropdownHovered, setSolutionsDropdownHovered] = useState(false);
  const [hoveredSolutionIndex, setHoveredSolutionIndex] = useState<number | null>(null);
  const solutionsListRef = useRef<HTMLDivElement>(null);
  const solutionItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const localeMenuRef = useRef<HTMLDivElement>(null);

  const solutionsPillTop = useMotionValue(0);
  const solutionsPillHeight = useMotionValue(0);
  const solutionListHeightMv = useMotionValue(0);

  const solutionsClipBottom = useTransform(
    [solutionsPillTop, solutionsPillHeight, solutionListHeightMv],
    ([pillTop, pillH, listH]) => Math.max(0, Number(listH) - Number(pillTop) - Number(pillH))
  );
  const solutionsClipPath = useMotionTemplate`inset(${solutionsPillTop}px 0px ${solutionsClipBottom}px 0px round 16px)`;

  const [solutionUniformHeight, setSolutionUniformHeight] = useState(0);
  const [solutionHighlight, setSolutionHighlight] = useState({ top: 0, height: 0 });

  const measureSolutionsLayout = useCallback(() => {
    const list = solutionsListRef.current;
    if (!list || activeDropdown !== 'solutions') return;
    let maxH = 1;
    solutionItemRefs.current.forEach((el) => {
      if (el) maxH = Math.max(maxH, el.offsetHeight);
    });
    setSolutionUniformHeight(maxH);
    solutionListHeightMv.set(list.offsetHeight);
  }, [activeDropdown, solutionListHeightMv]);

  useLayoutEffect(() => {
    if (activeDropdown !== 'solutions') {
      setSolutionUniformHeight(0);
      solutionListHeightMv.set(0);
      return;
    }
    const id = requestAnimationFrame(() => {
      measureSolutionsLayout();
      requestAnimationFrame(measureSolutionsLayout);
    });
    return () => cancelAnimationFrame(id);
  }, [activeDropdown, measureSolutionsLayout]);

  const syncSolutionHighlight = useCallback(
    (index: number | null) => {
      if (index === null) {
        setSolutionHighlight((prev) => ({ top: prev.top, height: 0 }));
        return;
      }
      const el = solutionItemRefs.current[index];
      if (!el || !solutionsListRef.current) return;

      const uniform = solutionUniformHeight;
      if (uniform <= 0) {
        setSolutionHighlight({
          top: el.offsetTop,
          height: el.offsetHeight
        });
        return;
      }

      const rowH = el.offsetHeight;
      const top = el.offsetTop + (rowH - uniform) / 2;
      setSolutionHighlight({ top, height: uniform });
    },
    [solutionUniformHeight]
  );

  useEffect(() => {
    if (activeDropdown !== 'solutions') {
      setSolutionsDropdownHovered(false);
      setHoveredSolutionIndex(null);
      setSolutionHighlight({ top: 0, height: 0 });
      setSolutionUniformHeight(0);
      solutionListHeightMv.set(0);
    }
  }, [activeDropdown, solutionListHeightMv]);

  useEffect(() => {
    syncSolutionHighlight(hoveredSolutionIndex);
  }, [hoveredSolutionIndex, syncSolutionHighlight, activeDropdown, solutionUniformHeight]);

  useEffect(() => {
    const topCtl = animate(solutionsPillTop, solutionHighlight.top, SOLUTIONS_HIGHLIGHT_SPRING);
    const heightCtl = animate(solutionsPillHeight, solutionHighlight.height, SOLUTIONS_HIGHLIGHT_SPRING);
    return () => {
      topCtl.stop();
      heightCtl.stop();
    };
  }, [solutionHighlight.top, solutionHighlight.height, solutionsPillTop, solutionsPillHeight]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeDropdown !== 'locale') return;
    const close = (e: MouseEvent) => {
      const el = localeMenuRef.current;
      if (el && !el.contains(e.target as Node)) setActiveDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('mousedown', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [activeDropdown]);

  const isTopState = topStateEnabled && (forceTopState || !isScrolled);
  const heroTransparentLayout = navLayout === 'heroTransparent' && topStateEnabled;

  useEffect(() => {
    if (activeDropdown !== 'locale') return;
    if (!isTopState || !heroTransparentLayout) {
      setActiveDropdown(null);
    }
  }, [activeDropdown, isTopState, heroTransparentLayout]);

  const hideFixedUtility =
    (heroTransparentLayout && isTopState) ||
    (hideUtilityBarWhenHomeAtTop && isTopState && topStateEnabled && !heroTransparentLayout);

  const navItems = [
    { id: 'home' as const, name: t('nav.home'), href: '#' },
    { id: 'profile' as const, name: t('nav.profile'), href: PROFILE_HASH },
    { id: 'solutions' as const, name: t('nav.solutions'), href: '#' },
    { id: 'services' as const, name: t('nav.services'), href: SERVICES_HASH },
    { id: 'career' as const, name: t('nav.career'), href: CAREER_HASH },
    { id: 'contact' as const, name: t('nav.contactUs'), href: CONTACT_US_HASH }
  ];

  const solutionItems = [
    { name: t('nav.solutionCapture'), href: CAPTURE_HASH },
    { name: t('nav.solutionFocalAi'), href: FOCAL_AI_PAGE_HASH },
    { name: t('nav.solutionWorkflowManagement'), href: WORKFLOW_MANAGEMENT_HASH },
    { name: t('nav.solutionDocumentManagement'), href: DOCUMENT_MANAGEMENT_HASH },
    { name: t('nav.solutionWebContentManagement'), href: WEB_CONTENT_MANAGEMENT_HASH }
  ];

  const logoUrl = '/assets/fds-logo.png';
  const clampedDropdownOpacity = Math.min(0.95, Math.max(0.25, dropdownGlassOpacity));

  const enquiryDesktopHover =
    colorProfile === 'default'
      ? 'hover:bg-[#294877] hover:text-white hover:shadow-[0_12px_36px_rgba(41,72,119,0.45)]'
      : 'hover:bg-[#294877] hover:text-white hover:shadow-lg hover:shadow-[#294877]/30';

  const enquiryMobileHover =
    'hover:bg-[#294877] hover:text-white';

  const showSolutionsDropdownInFixed = !heroTransparentLayout || !isTopState;

  const pillSlideTransition = {
    duration: prefersReducedMotion ? 0 : 0.46,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
  };

  const renderSolutionsDropdown = (menuKey: string, anchorClassName: string) => (
    <AnimatePresence>
      {activeDropdown === 'solutions' && (
        <motion.div
          key={menuKey}
          className={anchorClassName}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onMouseEnter={() => setSolutionsDropdownHovered(true)}
          onMouseLeave={() => {
            setSolutionsDropdownHovered(false);
            setHoveredSolutionIndex(null);
            setSolutionHighlight({ top: 0, height: 0 });
          }}
        >
          <div
            className="relative overflow-hidden rounded-3xl border border-white/70 p-3 text-text shadow-[0_28px_90px_rgba(1,20,26,0.22)] ring-1 ring-white/80 backdrop-blur-2xl"
            style={{ backgroundColor: `rgba(255, 255, 255, ${clampedDropdownOpacity})` }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,${Math.min(0.95, clampedDropdownOpacity + 0.24)}) 0%, rgba(255,255,255,${clampedDropdownOpacity * 0.55}) 36%, rgba(255,255,255,${clampedDropdownOpacity * 0.24}) 100%)`
              }}
            />
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/90" />
            <div className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-white/55 blur-3xl" />
            <div
              ref={solutionsListRef}
              className="relative z-10 space-y-1.5"
              onMouseLeave={() => setHoveredSolutionIndex(null)}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0"
                initial={false}
                animate={{ opacity: solutionsDropdownHovered ? 1 : 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="absolute left-0 right-0 rounded-2xl bg-sky-400 shadow-[0_6px_22px_rgba(56,189,248,0.42)]"
                  style={{
                    top: solutionsPillTop,
                    height: solutionsPillHeight
                  }}
                />
              </motion.div>
              {solutionItems.map((solution, i) => (
                <a
                  key={solution.name}
                  ref={(el) => {
                    solutionItemRefs.current[i] = el;
                  }}
                  href={solution.href}
                  onMouseEnter={() => setHoveredSolutionIndex(i)}
                  onFocus={() => setHoveredSolutionIndex(i)}
                  onBlur={(e) => {
                    if (!solutionsListRef.current?.contains(e.relatedTarget as Node | null)) {
                      setHoveredSolutionIndex(null);
                    }
                  }}
                  onClick={() => setActiveDropdown(null)}
                  className="relative z-1 block w-full text-left rounded-2xl border border-transparent px-4 py-3.5 text-base font-semibold text-text/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(255,255,255,0.85)]"
                >
                  {solution.name}
                </a>
              ))}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-2"
                initial={false}
                animate={{ opacity: solutionsDropdownHovered ? 1 : 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div className="absolute inset-0" style={{ clipPath: solutionsClipPath }}>
                  <div className="space-y-1.5">
                    {solutionItems.map((solution) => (
                      <div
                        key={`${solution.name}-swipe`}
                        className="block w-full text-left rounded-2xl border border-transparent px-4 py-3.5 text-base font-semibold text-white"
                      >
                        {solution.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderDesktopNav = (opts: {
    linkTone: 'default' | 'light';
    desktopGapClass: string;
    mountSolutionsDropdown: boolean;
    enquiryVariant: 'pill' | 'heroGlass';
  }) => (
    <>
      <div className={`hidden lg:flex items-center ${opts.desktopGapClass}`}>
        {navItems.map((item) => (
          <div
            key={item.id}
            className="relative px-1"
            onMouseEnter={() => item.id === 'solutions' && setActiveDropdown('solutions')}
            onMouseLeave={() => item.id === 'solutions' && setActiveDropdown(null)}
            onFocus={() => item.id === 'solutions' && setActiveDropdown('solutions')}
            onBlur={(event) => {
              if (item.id === 'solutions' && !event.currentTarget.contains(event.relatedTarget)) {
                setActiveDropdown(null);
              }
            }}
          >
            <AnimatedNavLink
              href={item.href}
              name={item.name}
              hoverEffect={navHoverEffect}
              dropdownTrigger={item.id === 'solutions'}
              menuOpen={activeDropdown === 'solutions'}
              tone={opts.linkTone}
            />

            {item.id === 'solutions' &&
              opts.mountSolutionsDropdown &&
              renderSolutionsDropdown(
                `solutions-menu-${opts.linkTone}`,
                'absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-8'
              )}
          </div>
        ))}

        <div
          className={`flex items-center gap-3 ${opts.enquiryVariant === 'pill' ? 'ml-4 xl:ml-6' : 'ml-6'}`}
        >
          {opts.enquiryVariant === 'heroGlass' && heroTransparentLayout && isTopState && (
            <div ref={localeMenuRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={activeDropdown === 'locale'}
                aria-label={t('nav.languageAria')}
                onClick={() => setActiveDropdown((d) => (d === 'locale' ? null : 'locale'))}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-text/10 bg-white/70 text-text shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
              >
                <Languages size={20} strokeWidth={2} aria-hidden />
              </button>
              <AnimatePresence>
                {activeDropdown === 'locale' && (
                  <motion.div
                    key="locale-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full z-50 mt-2 w-52"
                    role="menu"
                  >
                    <div className="rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_28px_90px_rgba(1,20,26,0.22)] ring-1 ring-black/5 backdrop-blur-xl">
                      {(
                        [
                          ['en', 'utility.english'],
                          ['zh-Hant', 'utility.traditionalChinese'],
                          ['zh-Hans', 'utility.simplifiedChinese']
                        ] as const
                      ).map(([id, labelKey]) => (
                        <button
                          key={id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setLocale(id);
                            setActiveDropdown(null);
                          }}
                          className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 ${
                            locale === id ? 'bg-interactive/10 text-interactive' : 'text-text/80 hover:bg-text/5 hover:text-text'
                          }`}
                        >
                          {t(labelKey)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {!hideEnquiryButton &&
            (opts.enquiryVariant === 'pill' ? (
              <button
                type="button"
                className={`px-8 xl:px-10 py-3 rounded-full font-bold text-[11px] sm:text-[12px] uppercase tracking-widest bg-interactive text-white! shadow-md shadow-interactive/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1f44]/30 ${enquiryDesktopHover}`}
              >
                {t('nav.enquiry')}
              </button>
            ) : (
              <button
                type="button"
                className="px-10 py-3.5 rounded-full font-bold text-[12px] uppercase tracking-widest transition-all duration-300 bg-interactive text-white shadow-md shadow-interactive/25 border border-transparent hover:bg-[#294877] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
              >
                {t('nav.enquiry')}
              </button>
            ))}
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full transition-colors ${
            opts.linkTone === 'light'
              ? 'text-white hover:bg-white/10'
              : 'text-text hover:bg-interactive/10'
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </>
  );

  const utilityBar = (
    <div
      className={`hidden lg:block bg-[#0a1f44] text-white/90 transition-all duration-500 ease-out ${
        hideFixedUtility
          ? 'max-h-0 overflow-hidden opacity-0 py-0 pointer-events-none'
          : 'max-h-14 opacity-100 py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[12px] font-medium tracking-wide">
        <div className="flex gap-8">
          <span className="flex items-center gap-2 opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
            <Phone size={13} strokeWidth={2.5} />
            (852) 3100 7272
          </span>
          <span className="flex items-center gap-2 opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
            <Mail size={13} strokeWidth={2.5} />
            fdscall@fdssolutions.com.hk
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-4">
            <button type="button" onClick={() => setLocale('en')} className={langButtonClass('en')}>
              {t('utility.english')}
            </button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => setLocale('zh-Hant')} className={langButtonClass('zh-Hant')}>
              {t('utility.traditionalChinese')}
            </button>
            <span className="opacity-30">|</span>
            <button type="button" onClick={() => setLocale('zh-Hans')} className={langButtonClass('zh-Hans')}>
              {t('utility.simplifiedChinese')}
            </button>
          </div>
          <Search size={14} className="hover:text-white cursor-pointer active:scale-95 transition-transform" aria-label={t('nav.searchAria')} />
        </div>
      </div>
    </div>
  );

  const transparentHeroChrome =
    heroTransparentLayout && isTopState && heroNavPortalEl
      ? createPortal(
          <div className="pointer-events-auto w-full" style={{ paddingTop: topOffset }}>
            {/* Reference build: collapsed accent utility strip (hero reads through) */}
            <div className="hidden lg:block bg-accent/90 backdrop-blur-md text-white/90 transition-all duration-700 h-0 opacity-0 overflow-hidden pointer-events-none py-0" />
            <nav className="w-full transition-all duration-700 bg-transparent py-0">
              <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8 transition-[max-width] duration-700 ease-out">
                <div className="flex justify-between items-start">
                  <div className="shrink-0 flex items-center">
                    <a href="#" className="flex items-center group">
                      <img
                        src={logoUrl}
                        alt={t('nav.logoAlt')}
                        className="object-contain object-left transition-all duration-500 h-24 w-auto sm:h-28 md:h-32"
                      />
                    </a>
                  </div>
                  <div className="flex h-20 shrink-0 items-center justify-end">
                    {renderDesktopNav({
                      linkTone: 'default',
                      desktopGapClass: 'gap-2',
                      mountSolutionsDropdown: true,
                      enquiryVariant: 'heroGlass'
                    })}
                  </div>
                </div>
              </div>
            </nav>
          </div>,
          heroNavPortalEl
        )
      : null;

  const pillNav = (
    <nav className="w-full pt-2 pb-2 sm:pt-2.5 sm:pb-2.5 transition-[padding] duration-500 ease-out">
      <div className="mx-auto w-full max-w-[1640px] px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center rounded-full border border-white/15 bg-white/80 shadow-[0_12px_44px_-10px_rgba(10,31,68,0.22),inset_0_1px_0_0_rgba(255,255,255,0.85)] ring-1 ring-[#0a1f44]/6 backdrop-blur-2xl backdrop-saturate-150 transition-[padding,box-shadow,background-color,border-color] duration-500 px-5 py-2.5 sm:px-7 sm:py-3">
          <div className="shrink-0 flex items-center">
            <a href="#" className="flex items-center group">
              <img
                src={logoUrl}
                alt={t('nav.logoAlt')}
                className={`object-contain transition-all duration-500 ${
                  heroTransparentLayout ? 'h-12 w-auto sm:h-14 md:h-16' : 'h-10 sm:h-[42px]'
                }`}
              />
            </a>
          </div>
          {renderDesktopNav({
            linkTone: 'default',
            desktopGapClass: 'gap-1',
            mountSolutionsDropdown: showSolutionsDropdownInFixed,
            enquiryVariant: 'pill'
          })}
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {transparentHeroChrome}

      <motion.header
        className="fixed left-0 right-0 z-50"
        initial={false}
        animate={{
          top: topOffset,
          y: heroTransparentLayout ? (isTopState ? '-100%' : '0%') : '0%'
        }}
        transition={pillSlideTransition}
        style={{
          pointerEvents: heroTransparentLayout && isTopState ? 'none' : 'auto'
        }}
      >
        {utilityBar}
        {pillNav}
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-text/40 backdrop-blur-sm lg:hidden pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-0 left-0 z-[61] w-full bg-background shadow-2xl lg:hidden pt-20 pb-10 pointer-events-auto"
            >
              <div className="space-y-2 px-6">
                {navItems.map((item) => (
                  <div key={item.id} className="py-1">
                    {item.id === 'solutions' ? (
                      <button
                        type="button"
                        aria-haspopup="menu"
                        className="w-full py-3 text-left text-lg font-bold tracking-tight text-text uppercase"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        className="block w-full py-3 text-left text-lg font-bold tracking-tight text-text uppercase"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    )}
                  </div>
                ))}
                <div className="border-t border-text/10 mt-4 pt-4 space-y-1">
                  <p className="py-2 text-xs font-bold uppercase tracking-[0.2em] text-text/45">{t('nav.solutionsGroup')}</p>
                  {solutionItems.map((solution) => (
                    <a
                      key={solution.name}
                      href={solution.href}
                      className="block rounded-xl py-2.5 pl-1 text-base font-semibold text-text/80"
                      onClick={() => setIsOpen(false)}
                    >
                      {solution.name}
                    </a>
                  ))}
                </div>
                {!hideEnquiryButton && (
                  <div className="pt-6">
                    <button
                      type="button"
                      className={`w-full bg-interactive text-white! font-bold py-4 rounded-xl uppercase tracking-widest transition-colors duration-300 ${enquiryMobileHover}`}
                    >
                      {t('nav.quickEnquiry')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
