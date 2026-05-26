import { EditJobPage } from "@/components/dashboard/edit-job-page";

export default function EditarVagaPage({ params }: { params: { id: string } }) {
  return <EditJobPage jobId={params.id} />;
}