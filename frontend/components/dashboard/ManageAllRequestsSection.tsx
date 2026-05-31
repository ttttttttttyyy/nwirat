import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function ManageAllRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Manage All Requests"
      description="Supervise every citizen request from one place."
    />
  );
}
