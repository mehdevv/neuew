"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConsentStore } from "@/store/cookie-concent";
import Link from "next/link";

export function CookieConsentDialog() {
  const { consentGiven, setConsent } = useConsentStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!consentGiven) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [consentGiven]);

  const handleAccept = () => {
    setConsent(true);
    setOpen(false);
  };

  const handleReject = () => {
    setConsent(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[60vh] flex-col">
        <DialogHeader>
          <DialogTitle>
            Le respect de votre vie privée est notre priorité
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="text-muted-foreground flex-1 space-y-4 overflow-y-auto pr-2 text-sm">
          <p>
            Nous utilisons des cookies pour vous fournir une meilleure
            expérience utilisateur. Cette politique de protection des données à
            caractère personnel vise à définir les principes et les directives
            adoptés par
            <strong> SPAS ALGERIA VIRTUAL TRAVEL </strong> en matière de
            traitement des données.
          </p>
          <p>
            SPAS ALGERIA VIRTUAL TRAVEL s&apos;engage, en tant que responsable
            du traitement, à protéger vos données personnelles conformément à la
            loi n° 18-07 du 10 juin 2017, modifiée et complétée par la loi n°
            10-25 du 24 juillet 2025.
          </p>
          <p>
            Vos données (identification, coordonnées, formulaires) seront
            utilisées pour améliorer votre expérience, personnaliser le contenu
            et conserver vos préférences. Elles ne seront jamais vendues ni
            échangées sans votre consentement et sans l&apos;autorisation de
            l&apos;ANPDP.
          </p>
          <p>
            Vous pouvez exercer vos droits en nous contactant à
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:contact-avt@algeriavirtualtravel.com"
              className="underline"
            >
              {" "}
              contact-avt@algeriavirtualtravel.com
            </a>
            .
          </p>
          <p>
            Avant de donner votre consentement, consultez nos{" "}
            <Link target="_blank" href="/legal" className="underline">
              Mentions Légales Conditions d&apos;Utilisation
            </Link>
            .
          </p>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={handleReject} className="underline">
            Accepter uniquement les essentiels
          </Button>
          <Button className="avt-primary-button" onClick={handleAccept}>
            Tout accepter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
