/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState, Fragment } from "react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSceneStore } from "@/store/use-scene-store";
import { SceneNode, buildTree, setVisibility } from "@/lib/scene-utils";

function Row({
  node,
  level,
  selectedId,
  onSelect,
}: {
  node: SceneNode;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(level < 1);
  const object = useSceneStore((s) => s.object);

  return (
    <Fragment>
      <div
        className={[
          "group flex items-center gap-1 rounded px-1 py-1 text-xs",
          selectedId === node.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/60",
        ].join(" ")}
        style={{ paddingLeft: 6 + level * 12 }}
        onClick={() => onSelect(node.id)}
      >
        <button
          className="mr-1 inline-flex h-4 w-4 items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          aria-label="toggle"
        >
          {node.children.length > 0 ? (
            <ChevronRight
              className={["h-3 w-3 transition-transform", open ? "rotate-90" : ""].join(" ")}
            />
          ) : (
            <span className="inline-block h-3 w-3" />
          )}
        </button>

        <span className="truncate">{node.name}</span>
        <span className="ml-1 text-[10px] text-muted-foreground">({node.type})</span>

        <button
          className="ml-auto opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setVisibility(object, node.id, !node.visible, false);
            onSelect(selectedId || node.id);
          }}
          aria-label="visibility"
        >
          {node.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
      </div>

      {open &&
        node.children.map((c) => (
          <Row key={c.id} node={c} level={level + 1} selectedId={selectedId} onSelect={onSelect} />
        ))}
    </Fragment>
  );
}

export function InspectorTree() {
  const object = useSceneStore((s) => s.object);
  const selectionId = useSceneStore((s) => s.selectionId);
  const setSelection = useSceneStore((s) => s.setSelection);

  const tree = useMemo(() => buildTree(object), [object, selectionId]);

  return (
    <ScrollArea className="h-[calc(100dvh-12rem)] pr-2">
      {tree.length === 0 ? (
        <div className="p-2 text-xs text-muted-foreground">
          Load a model to inspect its hierarchy.
        </div>
      ) : (
        tree.map((n) => (
          <Row
            key={n.id}
            node={n}
            level={0}
            selectedId={selectionId}
            onSelect={(id) => setSelection(id)}
          />
        ))
      )}
    </ScrollArea>
  );
}
