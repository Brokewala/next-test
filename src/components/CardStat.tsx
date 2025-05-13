import React from "react";
import Text from "./ui/text";

interface CardStatType {
  icon: React.ReactNode;
  title: string;
  number: string;
}

const CardStat = ({ icon, title, number }: CardStatType) => {
  return (
    <div className="w-full h-auto flex flex-col gap-2 border rounded-lg p-4 bg-white">
      <div className="flex flex-row gap-4 items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-200">{icon}</div>
        <div>
            <Text format="h2">{title}</Text>
        </div>
      </div>
      <div className="w-full">
        <Text format="p" weight="800" classNameStyle="text-2xl text-center">
          {number}
        </Text>
      </div>
    </div>
  );
};

export default CardStat;
