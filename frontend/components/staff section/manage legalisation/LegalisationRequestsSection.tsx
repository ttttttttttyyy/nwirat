import RequestsSection, { RequestsSectionProps } from '../manage all requests/RequestsSection';

export default function LegalisationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Demandes de Légalisations"
      description="Gérez les demandes de légalisation de signature et de copie conforme."
    />
  );
}
