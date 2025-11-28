// Tis component displays a carousel of history items below the output/upload section at '/'

import React from "react";
import { BlurFade } from "../ui/blur-fade";
import HistoryCardItem from "./HistoryImageCard";
import { Card } from "../ui/card";
import { historyiso } from "@/app/images";
import { IsoImage } from "@/components/ui";
import { api } from "@/api/client";
import { type components } from "@/api/schema";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

type UserImage = components["schemas"]["UserImages"];

const History: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: historyItems } =
    api.user.getUserImagesApiV1UserImagesGet.useQuery(undefined, {
      enabled: !!user,
    });

  if (!historyItems || historyItems.total_images === 0) {
    return null;
  }

  return (
    <Card className="w-full relative bg-card p-6 rounded-xl border">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <IsoImage src={historyiso} alt="History" className="w-5 h-5" />
          <span>History</span>
        </h3>

        <BlurFade className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {historyItems.images.map((item: UserImage) => (
            <HistoryCardItem key={item.id} item={item} />
          ))}
        </BlurFade>
      </div>
    </Card>
  );
};

export default History;
