import { useTranslation } from 'react-i18next';
import type { ArtifactStatus, ArtifactType, VersionState } from '../api/types';

const statusClasses: Record<string, string> = {
  DRAFT: 'badge-draft',
  PUBLISHED: 'badge-published',
  REVIEW: 'badge-review',
  APPROVED: 'badge-approved',
  RETIRED: 'badge-retired',
};

export function StatusBadge({ status }: { status: ArtifactStatus | VersionState }) {
  const { t } = useTranslation();
  return (
    <span className={statusClasses[status] ?? 'badge bg-gray-100 text-gray-600'}>
      {t(`status.${status}`, status)}
    </span>
  );
}

export function TypeBadge({ type }: { type: ArtifactType }) {
  const { t } = useTranslation();
  return <span className="badge-type">{t(`type.${type}`, type)}</span>;
}
