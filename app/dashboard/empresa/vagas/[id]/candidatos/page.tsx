import { JobCandidatesPage } from "@/components/dashboard/job-candidates-page";

export default function CandidatosVagaPage({ params }: { params: { id: string } }) {
  return <JobCandidatesPage jobId={params.id} />;
}