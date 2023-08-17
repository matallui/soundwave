import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SoundMeter } from "@/components/SoundMeter";
import { Countdown } from "@/components/Countdown";
import { api } from "@/utils/api";

type User = {
  school: string;
  teacher: string;
  grade: "1st" | "2nd" | "3rd" | "4th" | "5th";
};

export const Game = () => {
  const [user, setUser] = useState<User | undefined>();

  const title = user ? "Your turn!" : "How to play";

  return (
    <>
      <div className="lg:max-w-[90%]">
        <h3 className="mt-6 text-base font-bold uppercase md:text-lg lg:text-xl">
          {title}
        </h3>
        {!user && (
          <>
            <p className="mt-2 text-justify">
              Enter your School Name, Teacher Name and Grade (Ex: Susan Rogers
              Elementary, Mr. House, 2nd Grade) and click{" "}
              <span className="font-bold uppercase">go</span> to begin. When the
              game starts, you&apos;ll have five seconds to make the loudest
              noise you can.
            </p>
            <p className="mt-4 text-justify">
              Can you <span className="font-bold uppercase">get lound</span>{" "}
              enough to make it onto the leaderboard?
            </p>
          </>
        )}
      </div>
      <div className="mt-6 flex flex-col items-center justify-center">
        {user ? (
          <GameRun user={user} />
        ) : (
          <GameForm
            onSubmit={({ school, teacher, grade }) => {
              setUser({ school, teacher, grade });
            }}
          />
        )}
      </div>
    </>
  );
};

const formSchema = z.object({
  school: z.string().min(3, "must be at least 3 characters"),
  teacher: z.string().min(3, "must be at least 3 characters"),
  grade: z.enum(["1st", "2nd", "3rd", "4th", "5th"], {
    errorMap: () => ({ message: "grade required" }),
  }),
});

interface GameFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const GameForm: React.FC<GameFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: "",
      teacher: "",
    },
  });

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="School Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white">
                  {form.formState.errors.school?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <FormControl
                  onError={() => {
                    console.log("error teacher");
                    toast({
                      title: "Error",
                      description: "Teacher name must be at least 3 characters",
                    });
                  }}
                >
                  <Input
                    className="bg-white"
                    placeholder="Teacher Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white">
                  {form.formState.errors.teacher?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1st">1st Grade</SelectItem>
                    <SelectItem value="2nd">2nd Grade</SelectItem>
                    <SelectItem value="3rd">3rd Grade</SelectItem>
                    <SelectItem value="4th">4th Grade</SelectItem>
                    <SelectItem value="5th">5th Grade</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-white">
                  {form.formState.errors.grade?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-24 text-xl font-bold uppercase">
          Go
        </Button>
      </form>
    </Form>
  );
};

interface GameRunProps {
  user: User;
}

const GameRun: React.FC<GameRunProps> = ({ user }) => {
  const [state, setState] = useState<
    "permissions" | "ready" | "running" | "done"
  >("permissions");
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Game state:", state);
  }, [state]);

  const requestPermissions = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setState("ready");
      })
      .catch(() => {
        setState("permissions");
        toast({
          // variant: "destructive",
          title: "Uh oh!",
          description:
            "You need to allow your microphone so we can see how loud you are! Change your setting and refresh the page to try again.",
        });
      });
  }, [toast]);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const handleDone = useCallback((db: number) => {
    setScore(db);
    setState("done");
  }, []);

  return (
    <Card className="flex h-[95%] w-[90%] flex-col items-center justify-center rounded-xl drop-shadow-lg">
      {state === "permissions" && (
        <div className="m-16 text-center">
          <p>
            Click <span className="font-bold">allow</span> in your browser so we
            can hear how loud you are!
          </p>
        </div>
      )}
      {state === "ready" && (
        <Countdown
          className="py-32 text-center font-mono text-8xl text-background"
          value={3}
          onDone={() => setState("running")}
          zeroMessage="GO!"
        />
      )}
      {state === "running" && (
        <div className="h-full w-full">
          <SoundMeter duration={5000} onDone={handleDone} />
        </div>
      )}
      {state === "done" && (
        <GameScore
          user={user}
          score={score}
          onRetry={() => {
            setState("ready");
          }}
        />
      )}
    </Card>
  );
};

interface GameScoreProps {
  user: User;
  score: number;
  onRetry: () => void;
}

const GameScore: React.FC<GameScoreProps> = ({ user, score, onRetry }) => {
  const { school, teacher, grade } = user;
  const submitScore = api.score.addScore.useMutation();
  const utils = api.useContext();

  useEffect(() => {
    submitScore.mutate(
      {
        school,
        teacher,
        grade,
        score,
      },
      {
        onSuccess: () => {
          void utils.score.getHighScores.invalidate();
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school, teacher, grade, score]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly gap-6 px-10 py-16 text-center">
      <h3 className="font-mono text-5xl font-thin uppercase text-background">
        GREAT JOB!
      </h3>
      <GameScoreItem
        school={user.school}
        teacher={user.teacher}
        grade={user.grade}
        score={score}
      />
      <Button
        className="text-xl font-bold uppercase drop-shadow-lg"
        onClick={() => {
          onRetry();
        }}
      >
        Try again?
      </Button>
    </div>
  );
};

export interface GameScoreItemProps {
  rank?: number;
  school: string;
  teacher: string;
  grade: string;
  score: number;
}

export const GameScoreItem: React.FC<GameScoreItemProps> = ({
  rank,
  school,
  teacher,
  grade,
  score,
}) => {
  return (
    <Card className="grid grid-cols-[1fr,8fr,6fr,4fr,4fr] items-center gap-[2px] bg-[#e8e8e8] p-[2px] sm:gap-2 sm:p-1 md:p-2">
      <div className="text-sm font-bold sm:text-base md:text-lg lg:text-lg">
        #{rank ?? "#"}
      </div>
      <div className="text-center text-xs sm:text-base">{school}</div>
      <div className="text-center text-xs sm:text-base">{teacher}</div>
      <div className="text-center text-xs sm:text-base">{grade} Grade</div>
      <div className="text-center text-sm font-bold md:text-base lg:text-lg">
        {score.toFixed(1)} dB
      </div>
    </Card>
  );
};
