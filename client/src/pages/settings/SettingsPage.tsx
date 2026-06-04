import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/slices/themeSlice";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import toast from "react-hot-toast";
import type { FamilyMember } from "@/types";
import { useEffect, useState } from "react";
import api from "@/api-manager/apiInterceptor";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { mode } = useAppSelector((s) => s.theme);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone || "" },
  });
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [familyForm, setFamilyForm] = useState({ name: "", relation: "" });
  const [feedback, setFeedback] = useState({
    subject: "",
    message: "",
    rating: 5,
  });

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => setFamily(data.data.familyMembers || []));
  }, []);

  const onProfile = async (data: { name?: string; phone?: string }) => {
    await api.patch("/auth/profile", data);
    toast.success("Profile updated");
  };

  const addFamily = async () => {
    await api.post("/users/family", familyForm);
    toast.success("Family member added");
    const { data } = await api.get("/auth/me");
    setFamily(data.data.familyMembers || []);
    setFamilyForm({ name: "", relation: "" });
  };

  const submitFeedback = async () => {
    await api.post("/feedback", feedback);
    toast.success("Feedback submitted");
    setFeedback({ subject: "", message: "", rating: 5 });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>

      <Card title="Appearance">
        <Select
          label="Theme"
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          value={mode}
          onChange={(e) =>
            dispatch(setTheme(e.target.value as "light" | "dark"))
          }
        />
      </Card>

      <Card title="Profile">
        <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
          <Input label="Name" {...register("name")} />
          <Input label="Phone" {...register("phone")} />
          <Button type="submit">Save Profile</Button>
        </form>
      </Card>

      {user?.role === "resident" && (
        <>
          <Card title="Family Members">
            <div className="mb-4 space-y-2">
              {family.map((m) => (
                <div
                  key={m._id}
                  className="flex justify-between rounded bg-gray-50 p-2 dark:bg-gray-800"
                >
                  <span>
                    {m.name} ({m.relation})
                  </span>
                </div>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Name"
                value={familyForm.name}
                onChange={(e) =>
                  setFamilyForm({ ...familyForm, name: e.target.value })
                }
              />
              <Input
                placeholder="Relation"
                value={familyForm.relation}
                onChange={(e) =>
                  setFamilyForm({ ...familyForm, relation: e.target.value })
                }
              />
            </div>
            <Button className="mt-3" onClick={addFamily}>
              Add Member
            </Button>
          </Card>

          <Card title="Feedback & Suggestions">
            <div className="space-y-4">
              <Input
                label="Subject"
                value={feedback.subject}
                onChange={(e) =>
                  setFeedback({ ...feedback, subject: e.target.value })
                }
              />
              <Input
                label="Message"
                value={feedback.message}
                onChange={(e) =>
                  setFeedback({ ...feedback, message: e.target.value })
                }
              />
              <Input
                label="Rating (1-5)"
                type="number"
                min={1}
                max={5}
                value={feedback.rating}
                onChange={(e) =>
                  setFeedback({ ...feedback, rating: Number(e.target.value) })
                }
              />
              <Button onClick={submitFeedback}>Submit Feedback</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
