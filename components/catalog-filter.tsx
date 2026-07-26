"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useId,
  useMemo,
  useState,
} from "react";
import { UiText } from "@/components/ui-text";
import { useUiText } from "@/hooks/use-language";
import { tagAxes } from "@/lib/tag-axes";
import type { NebutaTags } from "@/types/nebuta";

type CatalogFilterEntry = Readonly<{
  rowNumber: number;
  tags: NebutaTags;
}>;

type CatalogFilterProps = Readonly<{
  entries: readonly CatalogFilterEntry[];
  children: ReactNode;
}>;

type TagOption = Readonly<{
  value: string;
  count: number;
}>;

function selectionKey(axisKey: keyof NebutaTags, value: string) {
  return `${axisKey}:${value}`;
}

export function CatalogFilter({ entries, children }: CatalogFilterProps) {
  const getUiText = useUiText();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    () => new Set(),
  );
  const panelId = useId();
  const childEntries = Children.toArray(children);

  const optionsByAxis = useMemo(() => {
    return tagAxes.map((axis) => {
      const counts = new Map<string, number>();

      for (const entry of entries) {
        for (const value of entry.tags[axis.key]) {
          counts.set(value, (counts.get(value) ?? 0) + 1);
        }
      }

      const options: TagOption[] = Array.from(
        counts,
        ([value, count]) => ({ value, count }),
      );
      options.sort((left, right) => right.count - left.count);

      return { axis, options };
    });
  }, [entries]);

  const visibleChildren =
    selectedTags.size === 0
      ? childEntries
      : childEntries.filter((_, index) => {
          const entry = entries[index];
          if (!entry) {
            return false;
          }

          return tagAxes.some((axis) =>
            entry.tags[axis.key].some((value) =>
              selectedTags.has(selectionKey(axis.key, value)),
            ),
          );
        });

  function toggleTag(key: string) {
    setSelectedTags((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <>
      <section className="catalog-filter" aria-labelledby={`${panelId}-title`}>
        <div className="filter-heading">
          <h2 id={`${panelId}-title`}>
            <UiText textKey="filterHeading" />
          </h2>
          <button
            className="filter-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? (
              <UiText textKey="filterClose" />
            ) : (
              <UiText textKey="filterOpen" />
            )}
          </button>
        </div>

        {selectedTags.size > 0 && (
          <div className="selected-filter">
            <p className="selected-filter-label">
              <UiText textKey="selectedLabel" />
            </p>
            <div className="filter-tags">
              {optionsByAxis.flatMap(({ axis, options }) =>
                options.map((option) => {
                  const key = selectionKey(axis.key, option.value);
                  if (!selectedTags.has(key)) {
                    return [];
                  }

                  return (
                    <button
                      className="filter-tag filter-tag-selected"
                      style={
                        {
                          "--tag-color": `var(${axis.colorVariable})`,
                        } as CSSProperties
                      }
                      type="button"
                      aria-label={getUiText("removeFilter", {
                        tag: option.value,
                      })}
                      onClick={() => toggleTag(key)}
                      key={key}
                    >
                      <span lang="ja">{option.value}</span>
                      <span className="filter-tag-count">{option.count}</span>
                    </button>
                  );
                }),
              )}
              <button
                className="filter-clear"
                type="button"
                onClick={() => setSelectedTags(new Set())}
              >
                <UiText textKey="clearAll" />
              </button>
            </div>
          </div>
        )}

        <div className="filter-panel" id={panelId} hidden={!isOpen}>
          {optionsByAxis.map(({ axis, options }) => {
            const axisLabelId = `${panelId}-${axis.key}-label`;

            return (
              <section className="filter-axis" key={axis.key}>
                <h3 id={axisLabelId}>
                  <UiText textKey={axis.labelKey} />
                </h3>
                <div
                  className="filter-tags"
                  role="group"
                  aria-labelledby={axisLabelId}
                >
                  {options.map((option) => {
                    const key = selectionKey(axis.key, option.value);
                    const isSelected = selectedTags.has(key);

                    return (
                      <button
                        className="filter-tag"
                        style={
                          {
                            "--tag-color": `var(${axis.colorVariable})`,
                          } as CSSProperties
                        }
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleTag(key)}
                        key={key}
                      >
                        <span lang="ja">{option.value}</span>
                        <span className="filter-tag-count">{option.count}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <p className="filter-result" aria-live="polite">
          {selectedTags.size === 0 ? (
            <UiText textKey="resultAll" values={{ n: entries.length }} />
          ) : (
            <UiText
              textKey="resultFiltered"
              values={{
                total: entries.length,
                n: visibleChildren.length,
              }}
            />
          )}
        </p>
      </section>

      <ul className="catalog-list">{visibleChildren}</ul>
    </>
  );
}
