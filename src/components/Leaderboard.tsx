import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GameScoreItem } from "./Game";
import { api } from "@/utils/api";

export const Leaderboard = () => {
  const { data: scores, isLoading } = api.score.getHighScores.useQuery({
    limit: 10,
  });

  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-2 mt-2 text-xl font-bold uppercase">Leaderboard</h3>
      <p className="text-justify">
        Are you <span className="font-bold uppercase">loud enough</span> to get
        in the top ten high scores?
      </p>
      <Card className="mt-4 rounded-xl drop-shadow-lg sm:mx-2 sm:p-1 md:mx-4">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="mb-3 text-center font-mono text-2xl font-thin uppercase text-background sm:text-3xl md:text-4xl lg:text-5xl">
            HIGH SCORES
          </CardTitle>
          <Separator
            orientation="horizontal"
            className="h-[1px] bg-background sm:h-[2px] md:h-[3px]"
          />
        </CardHeader>
        <CardContent className="max-h-fit overflow-y-scroll p-4 pt-0 sm:p-6">
          <div className="flex flex-col gap-3">
            {isLoading || (!scores && <div>Loading...</div>)}
            {scores?.map((score, i) => (
              <GameScoreItem
                key={score.id}
                rank={i + 1}
                school={score.school}
                teacher={score.teacher}
                grade={score.grade}
                score={score.score}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
