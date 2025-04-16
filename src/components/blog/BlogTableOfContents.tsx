import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: TableOfContentsItem[];
}

export function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto scrollbar-hide">
      <h2 className="font-semibold mb-4">Table of Contents</h2>
      <div className="space-y-1">
        {headings.map((heading) => (
          <motion.button
            key={heading.id}
            whileHover={{ x: 4 }}
            onClick={() => scrollToSection(heading.id)}
            className={cn(
              'block w-full text-left text-sm transition-colors duration-200',
              'hover:text-foreground/80',
              heading.level === 2 ? 'pl-0' : 'pl-4',
              activeId === heading.id
                ? 'font-medium text-primary'
                : 'text-muted-foreground'
            )}
            style={{
              paddingLeft: `${(heading.level - 2) * 16}px`,
            }}
          >
            {heading.title}
            {activeId === heading.id && (
              <motion.div
                layoutId="activeHeading"
                className="absolute left-0 w-1 h-full bg-primary rounded-r"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <div className="text-sm text-muted-foreground">
          Estimated reading time:
          <span className="font-medium text-foreground ml-1">
            {Math.ceil(document.body.textContent?.length ?? 0 / 1500)} min
          </span>
        </div>
      </div>
    </nav>
  );
}