import type { ArtifactStatus, ArtifactType, VersionState } from '../api/types';

const statusClasses: Record<string, string> = {
  DRAFT: 'badge-draft',
  PUBLISHED: 'badge-published',
  REVIEW: 'badge-review',
  APPROVED: 'badge-approved',
  RETIRED: 'badge-retired',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'Bozza',
  PUBLISHED: 'Pubblicato',
  REVIEW: 'In revisione',
  APPROVED: 'Approvato',
  RETIRED: 'Ritirato',
};

export function StatusBadge({ status }: { status: ArtifactStatus | VersionState }) {
  return (
    <span className={statusClasses[status] ?? 'badge bg-gray-100 text-gray-600'}>
      {statusLabels[status] ?? status}
    </span>
  );
}

const typeLabels: Record<ArtifactType, string> = {
  PROCESS: 'BPMN',
  RULE: 'DMN',
  FORM: 'Form',
  REQUEST: 'Request',
};

export function TypeBadge({ type }: { type: ArtifactType }) {
  return <span className="badge-type">{typeLabels[type] ?? type}</span>;
}
