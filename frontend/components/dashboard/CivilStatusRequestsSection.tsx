import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function CivilStatusRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Etat Civil Requests"
      description="Manage death, birth, engagement, and family book requests."
    />
  );
}
