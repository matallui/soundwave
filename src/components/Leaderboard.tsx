import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GameScoreItem } from "./Game";

const leaders = [
  {
    rank: 1,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 2,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 3,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 4,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 5,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 6,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 7,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 8,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 9,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
  {
    rank: 10,
    school: "School Name Goes Here",
    teacher: "Teacher Name Here",
    grade: "1st",
    score: 12.5,
  },
];

export const Leaderboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-2 mt-2 text-xl font-bold uppercase">Leaderboard</h3>
      <p className="text-justify">
        Are you <span className="font-bold uppercase">loud enough</span> to get
        in the top ten high scores?
      </p>
      <Card className="mx-4 mb-2 mt-4 flex-1 rounded-xl p-1 drop-shadow-lg">
        <CardHeader>
          <CardTitle className="mb-3 text-center font-mono text-5xl font-thin uppercase text-background">
            HIGH SCORES
          </CardTitle>
          <Separator
            orientation="horizontal"
            className="h-[3px] bg-background"
          />
        </CardHeader>
        <CardContent className="max-h-fit overflow-y-scroll">
          <div className="flex flex-col gap-3">
            {leaders.map((leader) => (
              <GameScoreItem key={leader.rank} {...leader} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
