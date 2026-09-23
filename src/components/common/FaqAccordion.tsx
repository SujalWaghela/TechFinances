import { useId, useState, type KeyboardEvent } from "react";
import type { FaqItem } from "../../data/faqContent";

interface FaqAccordionProps {
  title: string;
  items: FaqItem[];
}

function FaqAccordion({ title, items }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set());

  function toggle(index: number) {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(index);
    }
  }

  return (
    <section className="faq-accordion" aria-label={title}>
      <div className="faq-accordion-header">
        <span className="faq-accordion-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M9.6 9.2a2.4 2.4 0 1 1 3.5 2.1c-.7.4-1.1.9-1.1 1.7V14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
          </svg>
        </span>
        <div className="faq-accordion-header-text">
          <h2>{title}</h2>
          <p>Common questions about how this calculator works</p>
        </div>
      </div>

      <div className="faq-accordion-list">
        {items.map((item, index) => {
          const isOpen = openIndexes.has(index);
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;

          return (
            <div
              key={item.question}
              className={`faq-item ${isOpen ? "is-open" : ""}`}
            >
              <button
                type="button"
                id={buttonId}
                className="faq-item-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="faq-item-question">{item.question}</span>
                <span className="faq-item-chevron" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-item-panel"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqAccordion;
