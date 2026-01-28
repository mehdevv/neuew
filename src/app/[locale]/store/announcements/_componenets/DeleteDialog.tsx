import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAnnouncement } from "@/lib/service/announcements";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";

type Props = {
  id: number | string;
  title: string;
};

export function DeleteDialog({ id, title }: Props) {
  const handleDelete = async () => {
    await deleteAnnouncement(id);
    toast.success("Announcement deleted successfully");
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full bg-red-500">
            <FaTrash />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Do you want to delete this announcement?</DialogTitle>
            <DialogDescription>Title: {title}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleDelete}>
                <FaTrash />
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
