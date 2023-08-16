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
        <h3 className="mt-6 text-xl font-bold uppercase">{title}</h3>
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
      <div className="flex flex-1 flex-col items-center justify-center">
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
        onSubmit={() => form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex gap-4">
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
    setScore((curr) => Math.max(curr, db));
    setState("done");
  }, []);

  return (
    <Card className="flex h-[95%] w-[90%] flex-col items-center justify-center rounded-xl drop-shadow-lg">
      {state === "permissions" && <p>Waiting for permissions...</p>}
      {state === "ready" && (
        <Countdown
          className="text-center font-mono text-8xl text-background"
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
  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly gap-6 p-10 text-center">
      <h3 className="font-mono text-5xl font-thin uppercase text-background">
        GREAT JOB!
      </h3>
      <GameScoreItem
        rank={1}
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
  rank: number;
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
    <Card className="grid grid-cols-[40px,3fr,3fr,1fr,90px] items-center gap-2 bg-[#e8e8e8] p-2">
      <div className="text-xl font-bold">#{rank}</div>
      <div className="text-center">{school}</div>
      <div className="text-center">{teacher}</div>
      <div className="text-center">{grade} Grade</div>
      <div className="text-end text-lg font-bold">{score.toFixed(1)} dB</div>
    </Card>
  );
};
