import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AgencyUser } from "@/types/announcements";
import Link from "next/link";
import { FaEnvelope, FaMapPin, FaPhone } from "react-icons/fa6";

type Props = {
  storeuser: AgencyUser;
};

export function ContactCard({ storeuser }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border bg-white p-6 md:flex-row md:items-start">
      <Link href={`/agency/${storeuser.id}`}>
        <Avatar className="size-32 rounded-lg">
          <AvatarImage
            src={baseUrl + "/" + storeuser.profile_img}
            alt={storeuser.denomination}
          />
          <AvatarFallback className="text-zinc-500">
            {storeuser.denomination.charAt(0) +
              storeuser.denomination.charAt(1)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="space-y-3 text-sm">
        <Link
          href={`/agency/${storeuser.id}`}
          className="group group inline-block"
        >
          <div>
            <p className="text-avt-green font-semibold group-hover:underline">
              {storeuser.denomination}
            </p>
            <p className="text-muted-foreground text-sm group-hover:underline">
              {storeuser.domaine}
            </p>
          </div>
        </Link>

        <a
          href={`tel:${storeuser.tlfn}`}
          className="hover:text-avt-green flex items-center gap-2 underline"
        >
          <FaPhone className="text-avt-green h-4 w-4" />
          {storeuser.tlfn}
        </a>

        <a
          href={`mailto:${storeuser.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avt-green flex items-center gap-2 underline"
        >
          <FaEnvelope className="text-avt-green h-4 w-4" />
          {storeuser.email}
        </a>

        <a
          href={`https://www.google.com/maps/search/${storeuser.adresse}+${storeuser.commune}+${storeuser.wilaya}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avt-green flex items-center gap-2 underline"
        >
          <FaMapPin className="text-avt-green h-4 w-4" />
          {storeuser.adresse}, {storeuser.commune}, {storeuser.wilaya}
        </a>
        <Link href={`/agency/${storeuser.id}`}>
          <Badge className="bg-green-800 font-bold text-green-200">
            View Profile
          </Badge>
        </Link>
      </div>
    </div>
  );
}
