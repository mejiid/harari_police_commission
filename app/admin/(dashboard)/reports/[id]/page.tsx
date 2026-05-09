import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ReportForm from "@/components/admin/ReportForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditReportPage({ params }: Props) {
  const { id } = await params;
  const report = await db.report.findUnique({ where: { id }, include: { translations: true } });
  if (!report) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary mb-8">Edit Report</h1>
      <ReportForm report={report} />
    </div>
  );
}
