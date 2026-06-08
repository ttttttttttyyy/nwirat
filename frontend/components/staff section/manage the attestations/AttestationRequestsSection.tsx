import RequestsSection, { RequestsSectionProps } from '../manage all requests/RequestsSection';

export default function AttestationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Demandes d'Attestations Administratives"
      description="Gérez les demandes d'attestation administrative et les documents de propriété soumis."
    />
  );
}
