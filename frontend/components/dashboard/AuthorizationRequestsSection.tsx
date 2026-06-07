import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function AuthorizationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Demandes de Raccordements"
      description="Gérez les demandes d'autorisation pour l'eau potable et l'électricité."
    />
  );
}
