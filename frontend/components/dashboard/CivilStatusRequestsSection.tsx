import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function CivilStatusRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Demandes d'État Civil"
      description="Gérez les demandes d'actes de naissance, de décès, d'attestation de fiançailles et de livret de famille."
    />
  );
}
