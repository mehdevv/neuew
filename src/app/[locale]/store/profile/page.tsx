"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaRotate } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useAgencyUser } from "@/hooks/useAgency";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";

export default function UserAgencyPage() {
  const { user } = useAuthStore();

  const {
    data: storeData,
    isLoading: isAgencyLoading,
    isError: isAgencyError,
  } = useAgencyUser(user!.storeuser_id.toString());

  if (isAgencyLoading) return <div>Loading...</div>;
  if (isAgencyError) return <div>Error... {isAgencyError}</div>;
  if (!storeData) return <div>Error... {isAgencyError}</div>;
  const agencyUser = storeData.user;

  return (
    <Card className="mx-auto flex flex-col rounded-lg border-2 border-zinc-400 bg-zinc-100 shadow-sm md:flex-row md:items-center md:justify-between">
      <CardContent className="flex-1 p-6">
        <h2 className="text-xl font-semibold text-black">
          {agencyUser.nom} {agencyUser.prenom}
        </h2>

        <div className="mt-4 space-y-3 text-sm text-black">
          <div>
            <p className="font-semibold">Adresse :</p>
            <p>{agencyUser.adresse}</p>
          </div>

          <div>
            <p className="font-semibold">Téléphone :</p>
            <p>{agencyUser.tlfn}</p>
          </div>

          <div>
            <p className="font-semibold">Email :</p>
            <p>{agencyUser.email}</p>
          </div>

          <div>
            <p className="font-semibold">Réseaux sociaux :</p>
            <div className="flex flex-col gap-1 text-blue-600 underline">
              {agencyUser.url_fb && (
                <a href={agencyUser.url_fb} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {agencyUser.url_insta && (
                <a href={agencyUser.url_insta} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {agencyUser.url_ytb && (
                <a href={agencyUser.url_ytb} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${agencyUser.profile_img}`}
          alt={`${agencyUser.nom} ${agencyUser.prenom}`}
          width={140}
          height={140}
          className="rounded-lg"
        />

        <div className="flex w-full flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full rounded-full border bg-white text-gray-600 hover:bg-gray-50"
          >
            <FaEdit className="mr-2 h-4 w-4" />
            Modifier mon compte
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full border-gray-400 text-gray-600 hover:border-gray-500"
          >
            <FaRotate className="mr-2 h-4 w-4" />
            Renouveler
          </Button>
        </div>
      </div>
    </Card>
  );
}
