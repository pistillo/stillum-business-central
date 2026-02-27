import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AlertCircle, Plus, Search, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { updateVersion } from '../api/registry';
import type { ArtifactVersion } from '../api/types';
import { useAuth } from '../auth/AuthContext';

type NpmDependencies = Record<string, string>;

interface DependenciesPanelProps {
  version: ArtifactVersion | null;
  tenantId: string;
  artifactId: string;
  versionId: string;
}

export function DependenciesPanel({
  version,
  tenantId,
  artifactId,
  versionId,
}: DependenciesPanelProps) {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();

  const dependencies: NpmDependencies = (() => {
    if (!version?.npmDependencies) return {};
    try {
      return JSON.parse(version.npmDependencies);
    } catch (error) {
      console.error('Error parsing npmDependencies:', error);
      return {};
    }
  })();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newPackageName, setNewPackageName] = useState('');
  const [newPackageVersion, setNewPackageVersion] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; version: string }>>([]);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch(
        `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`
      );
      if (!res.ok) {
        throw new Error(`Failed to search npm packages: ${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as {
        objects: Array<{ package: { name: string; version: string } }>;
      };
      return data.objects.map((obj) => ({
        name: obj.package.name,
        version: obj.package.version,
      }));
    },
    onSuccess: (results) => {
      setSearchResults(results);
    },
    onError: (error) => {
      console.error('Error searching npm packages:', error);
      setSearchResults([]);
    },
  });

  const updateDependenciesMutation = useMutation({
    mutationFn: async (newDeps: NpmDependencies) => {
      return updateVersion({
        token: getAccessToken(),
        tenantId,
        artifactId,
        versionId,
        npmDependencies: JSON.stringify(newDeps),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['version', tenantId, artifactId, versionId],
      });
      setShowAdd(false);
      setNewPackageName('');
      setNewPackageVersion('');
      setSearchResults([]);
    },
    onError: (error) => {
      console.error('Error updating dependencies:', error);
    },
  });

  const handleAddDependency = (packageName: string, version: string) => {
    if (dependencies[packageName]) return;
    const newDeps = { ...dependencies, [packageName]: version };
    updateDependenciesMutation.mutate(newDeps);
  };

  const handleRemoveDependency = (packageName: string) => {
    const newDeps = { ...dependencies };
    delete newDeps[packageName];
    updateDependenciesMutation.mutate(newDeps);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setNewPackageName(value);
    if (value.length >= 2) {
      searchMutation.mutate(value);
    } else {
      setSearchResults([]);
    }
  };

  const filteredDependencies = Object.entries(dependencies).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
          {t('editor.dependencies')}
        </h3>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          {Object.keys(dependencies).length} {t('editor.dependencies')}
        </span>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('editor.searchDependencies')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('editor.packageName')}
                value={newPackageName}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
              />
              <input
                type="text"
                placeholder={t('editor.version')}
                value={newPackageVersion}
                onChange={(e) => setNewPackageVersion(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => setShowAdd(false)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {searchResults.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => {
                    setNewPackageName(pkg.name);
                    setNewPackageVersion(pkg.version);
                    setSearchResults([]);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-slate-100">{pkg.name}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{pkg.version}</div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleAddDependency(newPackageName, newPackageVersion)}
            disabled={!newPackageName || !newPackageVersion || !!dependencies[newPackageName]}
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={14} />
            {t('editor.addDependency')}
          </button>
        </div>
      )}

      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full mb-4 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          {t('editor.addDependency')}
        </button>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredDependencies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <AlertCircle size={32} />
            <p className="mt-2 text-sm">{t('editor.noDependencies')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDependencies.map(([name, version]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 dark:text-slate-100 truncate">
                    {name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">{version}</div>
                </div>
                <button
                  onClick={() => handleRemoveDependency(name)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
