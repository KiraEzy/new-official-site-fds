import { motion } from 'motion/react';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';

type NewsArticlePageProps = {
  slug: string;
};

type ArticleContent = {
  title?: string;
  category?: string;
  date?: string;
  lead?: string;
  body?: string[];
};

export default function NewsArticlePage({ slug }: NewsArticlePageProps) {
  const { ns } = useI18n();
  const page = ns('newsArticles') as Record<string, unknown>;
  const articles = (page.articles ?? {}) as Record<string, ArticleContent>;
  const article = articles[slug];
  const backLink = String(page.backLink ?? 'Back to Latest News');
  const notFoundTitle = String(page.notFoundTitle ?? 'Article not found');
  const notFoundBody = String(page.notFoundBody ?? 'This news article could not be found.');

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} · FDS Solutions Limited`;
    }
  }, [article?.title]);

  if (!article) {
    return (
      <main className="mt-25 bg-[#f6fbff] text-text antialiased">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <a
            href="#"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-interactive"
          >
            <ArrowLeft size={16} aria-hidden />
            {backLink}
          </a>
          <h1 className="text-3xl font-bold tracking-tight text-text">{notFoundTitle}</h1>
          <p className="mt-4 text-lg text-text/65">{notFoundBody}</p>
        </section>
      </main>
    );
  }

  const body = Array.isArray(article.body) ? article.body : [];

  return (
    <main className="mt-25 bg-[#f6fbff] text-text antialiased">
      <article className="relative overflow-hidden pb-20 pt-14 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,184,245,0.1),transparent_42%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-interactive"
          >
            <ArrowLeft size={16} aria-hidden />
            {backLink}
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            {article.category ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {article.category}
              </span>
            ) : null}
            {article.date ? (
              <span className="flex items-center gap-2 text-sm font-medium text-text/50">
                <Clock3 size={14} aria-hidden />
                {article.date}
              </span>
            ) : null}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-text"
          >
            {article.title}
          </motion.h1>

          {article.lead ? (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.1 }}
              className="mt-8 text-xl font-medium leading-relaxed text-text/72 md:text-2xl"
            >
              {article.lead}
            </motion.p>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.15 }}
            className="mt-10 space-y-6 border-t border-text/8 pt-10"
          >
            {body.map((paragraph, idx) => (
              <p key={idx} className="text-lg leading-relaxed text-text/78">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </article>
    </main>
  );
}
