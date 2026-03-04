"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { CosmoObjekt } from "@/lib/cosmo/types";

interface ObjektCardProps {
  objekt: CosmoObjekt;
  selected?: boolean;
  onClick?: () => void;
}

export function ObjektCard({ objekt, selected, onClick }: ObjektCardProps) {
  return (
    <button
      type="button"
      className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
        selected
          ? "border-primary ring-2 ring-primary"
          : "border-border hover:border-primary/50"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <div className="aspect-photocard relative">
        <Image
          src={objekt.thumbnailImage || objekt.frontImage}
          alt={`${objekt.member} - ${objekt.collectionId}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 150px"
        />
      </div>
      <div className="p-2 space-y-1">
        <p className="text-xs font-medium truncate">{objekt.member}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {objekt.collectionId}
        </p>
        <div className="flex gap-1">
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            {objekt.season}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            {objekt.class}
          </Badge>
        </div>
      </div>
    </button>
  );
}
