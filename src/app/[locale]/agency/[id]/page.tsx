"use client";

import { notFound, useParams } from "next/navigation";
import { TravelAnnouncementCard } from "@/components/TravelAnnouncementCard";
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaMapPin,
  FaPhone,
  FaYoutube,
} from "react-icons/fa6";
import { useAgencyUser } from "@/hooks/useAgency";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";

export default function AgencyPage() {
  const params = useParams();
  if (!params.id) throw new Error("Agency id is required");
  const id = params.id.toString();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const {
    data,
    error: errorAgency,
    isLoading: isLoadingAgency,
  } = useAgencyUser(id);

  if (errorAgency) return notFound();
  if (isLoadingAgency) return <div>Loading...</div>;

  const { user: storeData, subcategories } = data!;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={`${baseUrl + "/" + storeData?.profile_img}`} />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-avt-green text-2xl font-bold">
            {storeData?.denomination}
          </h1>
          <p className="text-muted-foreground">{storeData?.domaine}</p>
        </div>
      </div>

      {/* Announcements */}
      <section className="flex flex-col  divide-y">
        {subcategories?.map((sub) => (
          <div key={`section-${sub.name}`} className="py-4">
            <h2 className="text-lg font-semibold text-zinc-800 pb-2">{sub.name}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sub.announcements.map((ann) => (
                <TravelAnnouncementCard key={ann.id} announcement={ann} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Info */}
      <Separator className="my-2" />

      <section>
        <h1 className="text-lg font-semibold text-zinc-800">
          Informations de contact
        </h1>
        <a
          href={`tel:${storeData.tlfn}`}
          className="hover:text-avt-green flex w-fit items-center gap-2 py-2 underline"
        >
          <FaPhone className="text-avt-green h-4 w-4" />
          {storeData.tlfn}
        </a>

        <a
          href={`mailto:${storeData.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avt-green flex w-fit items-center gap-2 py-2 underline"
        >
          <FaEnvelope className="text-avt-green h-4 w-4" />
          {storeData.email}
        </a>

        <a
          href={`https://www.google.com/maps/search/${storeData.adresse}+${storeData.commune}+${storeData.wilaya}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-avt-green flex w-fit items-center gap-2 py-2 underline"
        >
          <FaMapPin className="text-avt-green h-4 w-4" />
          {storeData.adresse}, {storeData.commune}, {storeData.wilaya}
        </a>
      </section>

      {/* Social Links */}
      <section>
        <h2 className="mb-2 text-lg font-semibold text-zinc-800">
          Réseaux sociaux
        </h2>
        <div className="flex gap-4">
          {storeData?.url_web && (
            <IconLink url={storeData.url_web} icon={<FaGlobe />} />
          )}
          {storeData?.url_insta && (
            <IconLink url={storeData.url_insta} icon={<FaInstagram />} />
          )}
          {storeData?.url_fb && (
            <IconLink url={storeData.url_fb} icon={<FaFacebook />} />
          )}
          {storeData?.url_ytb && (
            <IconLink url={storeData.url_ytb} icon={<FaYoutube />} />
          )}
        </div>
      </section>
    </div>
  );
}

function IconLink({ url, icon }: { url: string; icon: React.ReactNode }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-avt-green hover:bg-avt-green/10 rounded-full bg-zinc-100 p-2 transition"
    >
      {icon}
    </a>
  );
}
