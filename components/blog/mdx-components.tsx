import React from 'react';
import Link from 'next/link';

/* ---------- Heading helper ---------- */
function heading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', sizeClass: string) {
  const Component = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id =
      typeof children === 'string'
        ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : undefined;

    return (
      <Tag id={id} className={`font-display font-bold text-white ${sizeClass} mt-10 mb-4 scroll-mt-24 group`} {...props}>
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 text-blue-400/0 group-hover:text-blue-400/70 transition-colors duration-200"
            aria-label={`Link to ${typeof children === 'string' ? children : 'section'}`}
          >
            #
          </a>
        )}
      </Tag>
    );
  };
  Component.displayName = Tag.toUpperCase();
  return Component;
}

/* ---------- Code block wrapper ---------- */
function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <div className="relative my-6 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] overflow-hidden">
      <pre
        className="overflow-x-auto p-5 text-sm leading-relaxed font-mono text-gray-200"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

/* ---------- Inline code ---------- */
function InlineCode({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="px-1.5 py-0.5 rounded-md bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] text-cyan-300 text-[0.875em] font-mono"
      {...props}
    >
      {children}
    </code>
  );
}

/* ---------- Smart link ---------- */
function MdxLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http') || href?.startsWith('//');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-300/60 transition-colors duration-200"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href || '/'}
      className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-300/60 transition-colors duration-200"
      {...props}
    >
      {children}
    </Link>
  );
}

/* ---------- Blockquote ---------- */
function Blockquote({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="my-6 border-l-4 border-cyan-400/60 pl-5 py-1 text-gray-300 italic bg-cyan-400/[0.03] rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  );
}

/* ---------- Paragraph ---------- */
function Paragraph({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="text-gray-300 leading-relaxed mb-5" {...props}>
      {children}
    </p>
  );
}

/* ---------- List items ---------- */
function Ul({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="list-disc list-inside space-y-2 mb-5 text-gray-300 marker:text-blue-400/60" {...props}>
      {children}
    </ul>
  );
}

function Ol({ children, ...props }: React.OlHTMLAttributes<HTMLOListElement>) {
  return (
    <ol className="list-decimal list-inside space-y-2 mb-5 text-gray-300 marker:text-blue-400/60" {...props}>
      {children}
    </ol>
  );
}

function Li({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className="text-gray-300 leading-relaxed" {...props}>
      {children}
    </li>
  );
}

/* ---------- Horizontal rule ---------- */
function Hr(props: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      {...props}
    />
  );
}

/* ---------- Strong / em ---------- */
function Strong({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <strong className="text-white font-semibold" {...props}>
      {children}
    </strong>
  );
}

/* ---------- Image ---------- */
function Img({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ''}
        className="rounded-xl border border-white/[0.08] w-full"
        loading="lazy"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">{alt}</figcaption>
      )}
    </figure>
  );
}

/* ---------- Export map ---------- */
export const components = {
  h1: heading('h1', 'text-3xl sm:text-4xl'),
  h2: heading('h2', 'text-2xl sm:text-3xl'),
  h3: heading('h3', 'text-xl sm:text-2xl'),
  h4: heading('h4', 'text-lg sm:text-xl'),
  h5: heading('h5', 'text-base sm:text-lg'),
  h6: heading('h6', 'text-sm sm:text-base'),
  p: Paragraph,
  a: MdxLink,
  pre: Pre,
  code: InlineCode,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  strong: Strong,
  img: Img,
};
