import { Dialog, DialogHeader, DialogTrigger, DialogFooter, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StringToBoolean } from "class-variance-authority/types";
import { toast } from "sonner";




export default function InterestModal({ isOpen, onClose, ideaId, startupName }: { isOpen: boolean; onClose: () => void; ideaId: string; startupName: string; }) {

  const [message, setMessage] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interests/${ideaId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message || null,
          ideaId: ideaId
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        toast.info(data.message || "You have already expressed interest in this idea.");
        onClose();
        return;
      }

      if (!response.ok) throw new Error("Failed to submit interest");


      toast.success("Interest submitted successfully!");
      setMessage("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error submitting interest. Please try again.");
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Show Interest</DialogTitle>
            <DialogDescription>
              Show your interest in this idea. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`I am interested in ${startupName}. Please contact me for further discussion.`}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
