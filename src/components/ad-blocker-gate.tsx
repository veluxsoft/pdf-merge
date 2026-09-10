import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

type AdBlockerGateProps = {
  blocked: boolean;
};

export function AdBlockerGate({ blocked }: AdBlockerGateProps) {
  if (!blocked) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <ShieldAlert className="size-4" />
      <AlertTitle>Bloqueador de anuncios detectado</AlertTitle>
      <AlertDescription>
        Para generar el PDF unido, desactiva el bloqueador de anuncios en este sitio
        (Brave Shields, uBlock, AdBlock, etc.) y recarga la página.
      </AlertDescription>
    </Alert>
  );
}
