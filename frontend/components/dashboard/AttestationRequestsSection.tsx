import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function AttestationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Attestation Administrative Requests"
      description="Manage administrative attestation requests and uploaded property documents."
    />
  );
}
