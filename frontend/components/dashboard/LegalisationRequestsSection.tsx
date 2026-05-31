import RequestsSection, { RequestsSectionProps } from './RequestsSection';

export default function LegalisationRequestsSection(props: RequestsSectionProps) {
  return (
    <RequestsSection
      {...props}
      title="Legalisation Requests"
      description="Manage signature legalisation and certified copy requests."
    />
  );
}
