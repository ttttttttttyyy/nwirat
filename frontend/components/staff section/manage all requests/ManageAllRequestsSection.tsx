import RequestsSection, { RequestsSectionProps } from '../RequestsSection';

export default function ManageAllRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Gérer toutes les demandes"
      description="Supervisez chaque demande citoyenne depuis un espace unique."
    />
  );
}
