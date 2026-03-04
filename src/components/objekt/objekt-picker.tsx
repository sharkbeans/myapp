"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ObjektCard } from "./objekt-card";
import type { CosmoObjekt, CosmoObjektResponse } from "@/lib/cosmo/types";

interface ObjektPickerProps {
  selected: CosmoObjekt[];
  onSelect: (objekt: CosmoObjekt) => void;
  onDeselect: (objekt: CosmoObjekt) => void;
  maxSelections?: number;
}

export function ObjektPicker({
  selected,
  onSelect,
  onDeselect,
  maxSelections = 10,
}: ObjektPickerProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<CosmoObjektResponse>({
    queryKey: ["inventory", page],
    queryFn: async () => {
      const res = await fetch(`/api/cosmo/inventory?page=${page}&size=30`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return res.json();
    },
  });

  const filteredObjekts =
    data?.objekts.filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.member?.toLowerCase().includes(q) ||
        o.collectionId.toLowerCase().includes(q) ||
        o.season?.toLowerCase().includes(q) ||
        o.class?.toLowerCase().includes(q)
      );
    }) ?? [];

  const isSelected = (objekt: CosmoObjekt) =>
    selected.some((s) => s.tokenId === objekt.tokenId);

  function handleClick(objekt: CosmoObjekt) {
    if (isSelected(objekt)) {
      onDeselect(objekt);
    } else if (selected.length < maxSelections) {
      onSelect(objekt);
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Failed to load inventory. Make sure your Cosmo account is linked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter by member, collection, season..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading inventory...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {filteredObjekts.map((objekt) => (
              <ObjektCard
                key={objekt.tokenId}
                objekt={objekt}
                selected={isSelected(objekt)}
                onClick={() => handleClick(objekt)}
              />
            ))}
          </div>

          {filteredObjekts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No objekts found
            </p>
          )}

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data?.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {selected.length}/{maxSelections} selected
        </p>
      )}
    </div>
  );
}
