import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, Controller } from "react-hook-form";
import { StoreFormValues } from "../page";

type Props = {
  control: Control<StoreFormValues>;
};

export function SocialLinks({ control }: Props) {
  return (
    <div className="grid gap-4 ">
      {/* Facebook */}
      <FormItem>
        <FormLabel>Facebook</FormLabel>
        <FormControl>
          <Controller
            name="url_fb"
            control={control}
            render={({ field }) => (
              <Input placeholder="https://facebook.com/..." {...field} />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      {/* YouTube */}
      <FormItem>
        <FormLabel>YouTube</FormLabel>
        <FormControl>
          <Controller
            name="url_ytb"
            control={control}
            render={({ field }) => (
              <Input placeholder="https://youtube.com/..." {...field} />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      {/* Instagram */}
      <FormItem>
        <FormLabel>Instagram</FormLabel>
        <FormControl>
          <Controller
            name="url_insta"
            control={control}
            render={({ field }) => (
              <Input placeholder="https://instagram.com/..." {...field} />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      {/* Website */}
      <FormItem>
        <FormLabel>Site Web</FormLabel>
        <FormControl>
          <Controller
            name="url_web"
            control={control}
            render={({ field }) => (
              <Input placeholder="https://example.com" {...field} />
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
