import { sortEntriesByQuality } from './quality';

export type AssetCollectionDataKey = '装备' | '技能' | '背包';
export type AssetCollectionFilterKey = '位置' | '类型';

export type AssetCollectionItem = { 品质?: string } & Record<string, any>;
export type AssetCollectionSource = Record<string, AssetCollectionItem>;

/** 统一读取资产数据源，避免页面重复处理联合类型 */
export const getAssetCollectionSource = (
  owner: Record<string, any>,
  data_key: AssetCollectionDataKey,
): AssetCollectionSource => {
  return (owner[data_key] ?? {}) as AssetCollectionSource;
};

/** 提取筛选字段主分类：仅保留斜杠前第一段 */
const normalizeAssetFilterValue = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return _.trim(String(value).split('/')[0] ?? '');
};

const resolveAssetFilterValue = (value: unknown, normalize_by_prefix = false): string => {
  if (normalize_by_prefix) {
    return normalizeAssetFilterValue(value);
  }

  return typeof value === 'string' ? _.trim(value) : '';
};

/** 获取资产筛选项，默认包含“全部” */
export const getAssetFilterOptions = (
  source: AssetCollectionSource,
  filter_key: AssetCollectionFilterKey,
  all_filter_label: string,
  normalize_by_prefix = false,
): string[] => {
  const values = new Set<string>();

  _.forEach(source, item => {
    const value = resolveAssetFilterValue(_.get(item, filter_key), normalize_by_prefix);
    if (value) {
      values.add(value);
    }
  });

  return [all_filter_label, ...Array.from(values).sort()];
};

/**
 * 先按品质排序，再按动态子分类过滤
 * 保持与 [`ItemsTab`](src/status/pages/items/ItemsTab.tsx) 一致的配置驱动筛选思路
 */
export const getFilteredAssetEntries = (
  source: AssetCollectionSource,
  filter_key: AssetCollectionFilterKey,
  active_filter: string,
  all_filter_label: string,
  normalize_by_prefix = false,
): [string, AssetCollectionItem][] => {
  const allEntries = sortEntriesByQuality(source);

  if (active_filter === all_filter_label) {
    return allEntries;
  }

  return allEntries.filter(
    ([, item]) => resolveAssetFilterValue(_.get(item, filter_key), normalize_by_prefix) === active_filter,
  );
};
