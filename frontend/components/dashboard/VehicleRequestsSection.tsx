import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function VehicleRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Vehicules Requests"
      description="Manage ambulance and funeral vehicle requests, assignments, and mission dates."
    />
  );
}
