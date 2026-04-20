'use client'

import { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Sparkles, ShieldCheck, Cpu, Layers, Image as ImageIcon, Upload, Download, Paintbrush, ShoppingBag, User, Share2, Presentation, Palette, CreditCard } from 'lucide-react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import FAQSection from '@/components/seo/FAQSection'
import styles from './page.module.css'

export default function HomePage() {
  const { track } = useAnalytics()
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const tf = useTranslations('faq')

  useEffect(() => {
    track('page_view', { page: '/' })
  }, [track])

  const stats = useMemo(() => [
    { icon: ShieldCheck, label: t('statPrivacy') },
    { icon: Cpu,         label: t('statLocal') },
    { icon: Layers,      label: t('statEngines') },
    { icon: ImageIcon,   label: t('statExport') },
  ], [t])

  const steps = useMemo(() => [
    {
      icon: Upload,
      title: t('stepUploadTitle'),
      desc: t('stepUploadDesc'),
    },
    {
      icon: Cpu,
      title: t('stepProcessTitle'),
      desc: t('stepProcessDesc'),
    },
    {
      icon: Download,
      title: t('stepDownloadTitle'),
      desc: t('stepDownloadDesc'),
    },
  ], [t])

  const useCases = useMemo(() => [
    { icon: ShoppingBag, title: t('ucEcommerce'), desc: t('ucEcommerceDesc') },
    { icon: User, title: t('ucProfile'), desc: t('ucProfileDesc') },
    { icon: Share2, title: t('ucSocial'), desc: t('ucSocialDesc') },
    { icon: Presentation, title: t('ucPresentation'), desc: t('ucPresentationDesc') },
    { icon: Palette, title: t('ucDesign'), desc: t('ucDesignDesc') },
    { icon: CreditCard, title: t('ucIdPhoto'), desc: t('ucIdPhotoDesc') },
  ], [t])

  return (
    <div className={styles.home}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className={styles.sHero}>
        {/* Ambient bg */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.hbNoise} />
          <div className={`${styles.hbGlow} ${styles.hbGlow1}`} />
          <div className={`${styles.hbGlow} ${styles.hbGlow2}`} />
          <div className={`${styles.hbGlow} ${styles.hbGlow3}`} />
          {/* Floating checker squares */}
          <div className={`${styles.hbSq} ${styles.hbSq1}`} />
          <div className={`${styles.hbSq} ${styles.hbSq2}`} />
          <div className={`${styles.hbSq} ${styles.hbSq3}`} />
        </div>

        <div className={styles.heroInner}>
          {/* ── Copy ── */}
          <div className={styles.heroCopy}>
            <div className={`${styles.hBadge} animate-fade-up`}>
              <span className={styles.hBadgeDot} aria-hidden="true" />
              {t('badge')}
            </div>

            <h1 className={`${styles.hTitle} animate-fade-up delay-100`}>
              <span className={styles.htStroke}>{t('titleRemove')}</span>
              <span className={styles.htFill}>{t('titleBackgrounds')}</span>
              <span className={styles.htAccent}>{t('titleInstantly')}</span>
            </h1>

            <p className={`${styles.hLead} animate-fade-up delay-200`}>
              {t('lead').split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br className={styles.brDesktop} />}</span>
              ))}
            </p>

            <div className={`${styles.hActions} animate-fade-up delay-300`}>
              <Link href="/auto" className={styles.hctaPrimary}>
                <Sparkles size={16} />
                {t('ctaStart')}
              </Link>
              <Link href="/manual" className={styles.hctaGhost}>
                {t('ctaManual')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className={`${styles.hTrust} animate-fade-up delay-400`}>
              {stats.map((s) => (
                <div key={s.label} className={styles.hTrustItem}>
                  <s.icon size={11} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Demo visual ── */}
          <div className={`${styles.heroDemo} animate-fade-up delay-200`} aria-hidden="true">
            <div className={styles.demoCard}>
              <div className={styles.dcChecker} />
              <div className={styles.dcBgCover} />
              <div className={styles.dcBar} />
              <div className={styles.dcSubject}>
                <div className={styles.dcsHead} />
                <div className={styles.dcsNeck} />
                <div className={styles.dcsShoulder} />
              </div>
              <div className={`${styles.dcLabel} ${styles.dcLabelBefore}`}>{t('demoOriginal')}</div>
              <div className={`${styles.dcLabel} ${styles.dcLabelAfter}`}>{t('demoRemoved')}</div>
              <div className={styles.dcChrome}>
                <span className={`${styles.dcDot} ${styles.dcDotR}`} />
                <span className={`${styles.dcDot} ${styles.dcDotY}`} />
                <span className={`${styles.dcDot} ${styles.dcDotG}`} />
              </div>
            </div>
            <p className={styles.demoSub}>{t('demoSub')}</p>
          </div>
        </div>
      </section>

      {/* ══ MODES ══════════════════════════════════════════ */}
      <section className={styles.sModes}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t('modesTitle')}</h2>
          <p className={styles.secSub}>{t('modesSub')}</p>
        </div>

        <div className={styles.modesGrid}>
          <Link href="/auto" className={`${styles.mc} ${styles.mcAuto}`}>
            <span className={styles.mcNum} aria-hidden="true">01</span>
            <div className={`${styles.mcIcon} ${styles.mcIconIndigo}`}>
              <Sparkles size={24} />
            </div>
            <div className={styles.mcTags}>
              <span className={`${styles.mct} ${styles.mctIndigo}`}>{t('autoTagAI')}</span>
              <span className={`${styles.mct} ${styles.mctGreen}`}>{t('autoTagOneClick')}</span>
            </div>
            <h3 className={styles.mcTitle}>{t('autoTitle')}</h3>
            <p className={styles.mcDesc}>{t('autoDesc')}</p>
            <div className={styles.mcLink}>
              {t('cardCta')}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={`${styles.mcGlow} ${styles.mcGlowIndigo}`} aria-hidden="true" />
          </Link>

          <Link href="/manual" className={`${styles.mc} ${styles.mcManual}`}>
            <span className={styles.mcNum} aria-hidden="true">02</span>
            <div className={`${styles.mcIcon} ${styles.mcIconOrange}`}>
              <Paintbrush size={24} />
            </div>
            <div className={styles.mcTags}>
              <span className={`${styles.mct} ${styles.mctOrange}`}>{t('manualTagPrecise')}</span>
              <span className={`${styles.mct} ${styles.mctGray}`}>{t('manualTagColorPick')}</span>
            </div>
            <h3 className={styles.mcTitle}>{t('manualTitle')}</h3>
            <p className={styles.mcDesc}>{t('manualDesc')}</p>
            <div className={`${styles.mcLink} ${styles.mcLinkOrange}`}>
              {t('cardCta')}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2.5 6.5h8M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={`${styles.mcGlow} ${styles.mcGlowOrange}`} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ══ STEPS ══════════════════════════════════════════ */}
      <section className={styles.sSteps}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t('stepsTitle')}</h2>
          <p className={styles.secSub}>{t('stepsSub')}</p>
        </div>

        <div className={styles.stepsRow}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepN}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.stepRing}>
                <step.icon size={20} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div className={styles.stepLine} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY BG-ZERO ════════════════════════════════════ */}
      <section className={styles.sWhy}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t('whyTitle')}</h2>
          <p className={styles.secSub}>{t('whySub')}</p>
        </div>

        <div className={styles.whyTableWrap}>
          <table className={styles.whyTable}>
            <thead>
              <tr>
                <th></th>
                <th className={styles.whyThHighlight}>{t('whyBgZero')}</th>
                <th>{t('whyRemoveBg')}</th>
                <th>{t('whyCanva')}</th>
                <th>{t('whyPhotoshop')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.whyLabel}>{t('whyPrivacy')}</td>
                <td className={styles.whyGood}>{t('whyLocalDevice')}</td>
                <td>{t('whyCloudUpload')}</td>
                <td>{t('whyCloudUpload')}</td>
                <td>{t('whyLocalDevice')}</td>
              </tr>
              <tr>
                <td className={styles.whyLabel}>{t('whyPrice')}</td>
                <td className={styles.whyGood}>{t('whyFree')}</td>
                <td>{t('whyFreemium')}</td>
                <td>{t('whyFreemium')}</td>
                <td>{t('whySubscription')}</td>
              </tr>
              <tr>
                <td className={styles.whyLabel}>{t('whyWatermark')}</td>
                <td className={styles.whyGood}>{t('whyNone')}</td>
                <td>{t('whyOnFree')}</td>
                <td>{t('whyNone')}</td>
                <td>{t('whyNone')}</td>
              </tr>
              <tr>
                <td className={styles.whyLabel}>{t('whyBatchLimit')}</td>
                <td className={styles.whyGood}>{t('whyUnlimited')}</td>
                <td>{t('whyLimited')}</td>
                <td>{t('whyLimited')}</td>
                <td>{t('whyUnlimited')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ USE CASES ══════════════════════════════════════ */}
      <section className={styles.sUseCases}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t('useCasesTitle')}</h2>
          <p className={styles.secSub}>{t('useCasesSub')}</p>
        </div>

        <div className={styles.ucGrid}>
          {useCases.map((uc) => (
            <div key={uc.title} className={styles.ucCard}>
              <div className={styles.ucIcon}><uc.icon size={18} /></div>
              <h3 className={styles.ucTitle}>{uc.title}</h3>
              <p className={styles.ucDesc}>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FORMATS & ENGINES ══════════════════════════════ */}
      <section className={styles.sFormats}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t('formatsTitle')}</h2>
          <p className={styles.secSub}>{t('formatsSub')}</p>
        </div>

        <div className={styles.fmGrid}>
          <div className={styles.fmCard}>
            <h3 className={styles.fmCardTitle}>{t('formatsInput')}</h3>
            <ul className={styles.fmList}>
              <li>{t('formatsJpg')}</li>
              <li>{t('formatsPng')}</li>
              <li>{t('formatsWebp')}</li>
              <li>{t('formatsBmp')}</li>
            </ul>
            <p className={styles.fmNote}>{t('formatsMaxSize')}</p>
          </div>
          <div className={styles.fmCard}>
            <h3 className={styles.fmCardTitle}>{t('formatsOutput')}</h3>
            <ul className={styles.fmList}>
              <li>{t('formatsOutputPng')}</li>
            </ul>
          </div>
          <div className={styles.fmCard}>
            <h3 className={styles.fmCardTitle}>{t('formatsEngines')}</h3>
            <ul className={styles.fmEngineList}>
              <li><strong>{t('engineImglyName')}</strong><span>{t('engineImglyInfo')}</span></li>
              <li><strong>{t('engineTransformersName')}</strong><span>{t('engineTransformersInfo')}</span></li>
              <li><strong>{t('engineRembgName')}</strong><span>{t('engineRembgInfo')}</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════ */}
      <section className={styles.sFaq}>
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{tf('sectionTitle')}</h2>
          <p className={styles.secSub}>{tf('sectionSub')}</p>
        </div>
        <div className={styles.faqWrap}>
          <FAQSection />
        </div>
      </section>

    </div>
  )
}
