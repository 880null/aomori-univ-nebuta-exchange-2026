"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useId,
  useMemo,
  useState,
} from "react";
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
          <h2 id={`${panelId}-title`}>絞り込み</h2>
          <button
            className="filter-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? "閉じる" : "条件を選ぶ"}
          </button>
        </div>

        {selectedTags.size > 0 && (
          <div className="selected-filter">
            <p className="selected-filter-label">選択中</p>
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
                      aria-label={`${option.value}の絞り込みを解除`}
                      onClick={() => toggleTag(key)}
                      key={key}
                    >
                      <span>{option.value}</span>
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
                すべて解除
              </button>
            </div>
          </div>
        )}

        <div className="filter-panel" id={panelId} hidden={!isOpen}>
          {optionsByAxis.map(({ axis, options }) => {
            const axisLabelId = `${panelId}-${axis.key}-label`;

            return (
              <section className="filter-axis" key={axis.key}>
                <h3 id={axisLabelId}>{axis.label}</h3>
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
                        <span>{option.value}</span>
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
          {selectedTags.size === 0
            ? `全${entries.length}件`
            : `${entries.length}件中 ${visibleChildren.length}件を表示`}
        </p>
      </section>

      <ul className="catalog-list">{visibleChildren}</ul>
    </>
  );
}
