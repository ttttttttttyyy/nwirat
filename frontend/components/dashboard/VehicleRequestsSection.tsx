import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function VehicleRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Demandes de Véhicules"
      description="Gérez les demandes d'ambulance et de véhicule funéraire, les affectations et les dates de mission."
    />
  );
}
