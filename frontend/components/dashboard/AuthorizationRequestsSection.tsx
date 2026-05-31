import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function AuthorizationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Raccordements Requests"
      description="Manage water and electricity authorization requests."
    />
  );
}
