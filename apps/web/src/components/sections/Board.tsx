/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Board component
*/

'use client';

import { useState } from 'react';
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

export interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    render?: (item: T, value: any) => React.ReactNode;
    sortable?: boolean;
}

export interface Action<T> {
    label: string;
    icon: string;
    onClick: (item: T) => void;
    variant?: 'primary' | 'danger' | 'success' | 'warning';
    condition?: (item: T) => boolean;
}

interface BoardProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    onAdd?: () => void;
    addButtonLabel?: string;
    loading?: boolean;
    emptyMessage?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    idKey?: keyof T;
}

export default function Board<T extends Record<string, any>>({
    title,
    data,
    columns,
    actions,
    onAdd,
    addButtonLabel = 'Ajouter',
    loading = false,
    emptyMessage = 'Aucune donnée disponible',
    searchable = true,
    searchPlaceholder = 'Rechercher...',
    idKey = 'id' as keyof T,
}: BoardProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | string;
        direction: 'asc' | 'desc';
    } | null>(null);

    const getNestedValue = (obj: any, path: string): any => {
        return path.split('.').reduce((curr, key) => curr?.[key], obj);
    };

    const filteredData = searchable
        ? data.filter((item) => {
              const searchLower = searchTerm.toLowerCase();
              return columns.some((col) => {
                  const value = getNestedValue(item, col.key as string);
                  return value?.toString().toLowerCase().includes(searchLower);
              });
          })
        : data;

    const sortedData = sortConfig
        ? [...filteredData].sort((a, b) => {
              const aVal = getNestedValue(a, sortConfig.key as string);
              const bVal = getNestedValue(b, sortConfig.key as string);

              if (aVal == null) return 1;
              if (bVal == null) return -1;

              if (typeof aVal === 'string' && typeof bVal === 'string') {
                  return sortConfig.direction === 'asc'
                      ? aVal.localeCompare(bVal)
                      : bVal.localeCompare(aVal);
              }

              return sortConfig.direction === 'asc'
                  ? aVal > bVal ? 1 : -1
                  : aVal < bVal ? 1 : -1;
          })
        : filteredData;

    const handleSort = (key: keyof T | string) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return {
                    key,
                    direction: current.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
    };

    const getActionButtonClass = (variant?: string) => {
        switch (variant) {
            case 'danger':
                return 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300 hover:shadow-md';
            case 'success':
                return 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200 hover:border-green-300 hover:shadow-md';
            case 'warning':
                return 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 border border-orange-200 hover:border-orange-300 hover:shadow-md';
            default:
                return 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 hover:border-blue-300 hover:shadow-md';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6 py-4">
            {/* Header */}
            <div className="flex items-center justify-between ml-2">
                <div className={`${anton.className}`}>
                    <span className="text-blue-700 text-3xl">{title.toUpperCase()}</span>
                    <span className="text-orange-400 text-3xl">_</span>
                </div>

                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <i className="fi fi-br-plus text-lg leading-none flex items-center -ml-0.5"></i>
                        <span>{addButtonLabel}</span>
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {searchable && (
                <div className="relative">
                    <i className="fi fi-br-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    />
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ${
                                            col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                        style={{ width: col.width }}
                                        onClick={() => col.sortable !== false && handleSort(col.key)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{col.label}</span>
                                            {col.sortable !== false && sortConfig?.key === col.key && (
                                                <i
                                                    className={`fi ${
                                                        sortConfig.direction === 'asc'
                                                            ? 'fi-br-sort-up'
                                                            : 'fi-br-sort-down'
                                                    } text-blue-600`}
                                                ></i>
                                            )}
                                        </div>
                                    </th>
                                ))}
                                {actions && actions.length > 0 && (
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedData.length > 0 ? (
                                sortedData.map((item, rowIdx) => (
                                    <tr key={String(item[idKey]) || rowIdx} className="hover:bg-gray-50 transition-colors">
                                        {columns.map((col, colIdx) => {
                                            const value = getNestedValue(item, col.key as string);
                                            return (
                                                <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                                                    {col.render ? col.render(item, value) : value ?? '-'}
                                                </td>
                                            );
                                        })}
                                        {actions && actions.length > 0 && (
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    {actions
                                                        .filter((action) =>
                                                            action.condition ? action.condition(item) : true
                                                        )
                                                        .map((action, actionIdx) => (
                                                            <button
                                                                key={actionIdx}
                                                                onClick={() => action.onClick(item)}
                                                                className={`p-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 ${getActionButtonClass(
                                                                    action.variant
                                                                )}`}
                                                                title={action.label}
                                                            >
                                                                <i className={`${action.icon} text-base leading-none flex items-center justify-center`}></i>
                                                            </button>
                                                        ))}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + (actions ? 1 : 0)}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-sm text-gray-600">
                Affichage de {sortedData.length} élément{sortedData.length > 1 ? 's' : ''} sur {data.length}
            </div>
        </div>
    );
}
