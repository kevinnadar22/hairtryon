import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Image as ImageIcon, ScissorsIcon } from "lucide-react";
import SideView from "./SideView";
import FrontView from "./FrontView";
import { Card } from "../ui/card";

const OutputSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("front");

  return (
    <Card className="w-full space-y-6 p-6 relative overflow-hidden">
      {/* <TextureOverlay texture="dots" opacity={0.3} /> */}

      <div className="relative z-10">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v)}
          className="w-full max-w-xl mx-auto"
        >
          <div className="flex justify-center">
            <TabsList className="mb-4 max-w-lg w-full">
              <TabsTrigger value="front" className="transition-all">
                <ImageIcon className="size-4" />
                <span>Front</span>
              </TabsTrigger>
              <TabsTrigger value="side" className="transition-all">
                <ScissorsIcon className="size-4" />
                <span>Side Views</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="front" className="space-y-6">
            <FrontView />
          </TabsContent>

          <TabsContent value="side" className="space-y-5">
            <SideView />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default OutputSection;
